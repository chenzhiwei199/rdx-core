import React from 'react'
import EventEmitter from 'eventemitter3'
import { PreDefinedTaskQueue, ISnapShotTrigger, ICallbackInfo, IEventType } from '../schedule'
import { normalizeSingle2Arr, NodeStatus, NotifyPoint, arr2Map, isDepsMatch } from '../graph'
import { BaseMap, BaseObject, Base } from '../RdxContext/core'
import { Log } from '../utils/log'
import {
  IStateInfo,
  TaskEventTriggerType,
  DataPersistType,
  IRdxSnapShotTrigger,
  ProcessGraphContent,
} from '../types/dataPersistType'
import { ComputeErrorType, CustomError, getDepsChangeDetail, isDepsChange, uniqBy } from '../RdxValues/RdxCompute/utils'
import { v1 as uuid } from 'uuid'
import {
  Status,
  IRdxDeps,
  TaskStatus,
  IRdxTask,
  TNextValue,
  TNextValueCallback,
  StateUpdateType,
  TargetType,
  ActionType,
} from '../types/base'
import { ICollectDeps, IReactionContext } from '../types/task'
import { batchUpdate, isPromise } from '../utils'
import { DEFAULT_VALUE } from '../hooks/base'
import { AdvancedGraph } from '../newGraph/graph'
import { isAcyclic } from '../newGraph/alg'

function normalizeNotifyKeys(cacheExecuteTaskKeys: NotifyPoint[][]) {
  const newCacheExecuteTaskKeys = [] as NotifyPoint[]
  cacheExecuteTaskKeys.forEach(point => {
    point.forEach(p => {
      newCacheExecuteTaskKeys.push(p)
    })
  })
  return newCacheExecuteTaskKeys
}
export class RdxStore {
  id: string
  _graph = new AdvancedGraph({})
  private uiQueue: Set<string> = new Set()
  private willNotifyQueue: Set<NotifyPoint> = new Set()
  private callbackQueue: Array<() => void> = []
  private uiDirtySets: Set<string> = new Set() // 当节点数据被修改了，标记为脏节点，脏节点将更新ui
  // 脏节点的作用 1. 用来检测节点是否能复用 2.用来获取依赖
  private dataDirtySets: Set<string> = new Set() // 当节点数据被修改了，依赖节点的set中将添加脏节点
  cacheExecuteTaskKeys: Set<NotifyPoint[]> = new Set()
  // cacheWillCheckDepskeys: Set<NotifyPoint[]> = new Set()
  private cancelMap: BaseMap<() => void>
  private virtualTaskState: Base<{ [key: string]: any }> = new BaseObject({}) as any
  private inBatch = 0
  private tasks: BaseMap<IRdxTask<any>>
  private taskState: Base<any>
  private taskStatus: BaseObject<TaskStatus>

  private _taskScheduler: PreDefinedTaskQueue<any>
  // 订阅通知组件更新
  private eventEmitter: EventEmitter
  private subject?: EventEmitter<DataPersistType, ProcessGraphContent>
  private _parentMounted?: boolean = false
  private _batchUiChange: any
  private _batchExecute: any
  private options: { debuggerLog?: boolean }
  private logger: Log
  private regexps = new Set<string>()
  setBatcherOfChangeCallback(callback) {
    this._batchExecute = callback
  }
  batchChange() {
    this._batchExecute && this._batchExecute()
  }
  onPropsChange: (v: { [key: string]: any }, vObj: any) => void = () => {}
  onPropsLoading: () => void = () => {}
  constructor(config: ShareContext<any>, options: { debuggerLog?: boolean; preLoading?: boolean } = {}) {
    this.id = uuid()
    this.eventEmitter = new EventEmitter()
    this.options = options
    const { preLoading = true, debuggerLog = false } = options
    this.subject = new EventEmitter<DataPersistType, ProcessGraphContent>()
    this.logger = new Log(debuggerLog)
    this._taskScheduler = new PreDefinedTaskQueue<any>([], this._graph, {
      logger: this.logger,
      canReuse: id => {
        return !this.dataDirtySets.has(id)
      },
    })
    const ee = this._taskScheduler.getEE()

    ee.on(IEventType.onBeforeCall, this.preExecuting)
    ee.on(IEventType.onCall, this.onExecuting)
    ee.on(IEventType.onSuccess, this.onSuccess)
    ee.on(IEventType.onError, this.onError)
    ee.on(IEventType.onStart, (content: ISnapShotTrigger) => {
      const { currentRunningPoints } = content
      // 通知冲突的点
      if (preLoading) {
        currentRunningPoints.forEach(id => {
          const status = this.getTaskStatusById(id)
          if (!status || (status.value !== Status.Waiting && status.value !== Status.Running)) {
            this.updateState(id, ActionType.Update, TargetType.TaskStatus, {
              value: NodeStatus.Waiting,
              errorMsg: undefined,
            })
          }
        })
      }
    })
    this.tasks = config.tasks
    this.taskState = config.taskState
    this.virtualTaskState = config.virtualTaskState
    this.taskStatus = config.taskStatus
    this.cancelMap = config.cancelMap
    this.tasks.onItemUpdate((type, key, preValue, nextValue) => {
      // 控制节点逻辑
      if (type === 'remove') {
        this._graph.removeNode(key)
        this.regexps.delete(key)
      } else if (type === 'update') {
        // 检查deps是否变更
        if (isDepsChange(preValue.deps, nextValue.deps)) {
          const { addSets, removeSets } = getDepsChangeDetail(preValue.deps, nextValue.deps)
          addSets.forEach(addkey => {
            this._graph.setEdge(addkey, key)
          })
          removeSets.forEach(removekey => {
            this._graph.removeEdge(removekey, key)
          })
        }
        if (nextValue.deps.some(dep => dep instanceof RegExp)) {
          this.regexps.add(key)
        } else {
          this.regexps.delete(key)
        }
      } else if (type === 'add') {
        if (nextValue.deps.some(dep => dep instanceof RegExp)) {
          this.regexps.add(key)
          // 批量生成依赖节点
          const regexpDeps = nextValue.deps?.filter(dep => dep instanceof RegExp) || []

          regexpDeps.forEach(dep => {
            Array.from(this.getTasks().keys())
              .filter(depKey => isDepsMatch(depKey, dep))
              .forEach(depId => {
                this._graph.setEdge(depId, key)
              })
          })
        }
        // 新增的时候，看一下正则里面，如果有匹配的，就要给他加上边 从当前 -> 正则
        this.regexps.forEach(regexpKey => {
          const regexpDeps = this.tasks.get(regexpKey)?.deps?.filter(dep => dep instanceof RegExp) || []
          if (regexpDeps.some(item => isDepsMatch(key, item))) {
            this._graph.setEdge(key, regexpKey)
          }
        })
        this._graph.setNode(key)
        nextValue.deps.forEach(dep => {
          this._graph.setEdge(dep, key)
        })
        // 检查动态的节点
      }
    })
    this.tasks.onAfterItemUpdate(key => {
      // console.log("this._graph.nodes__" + key, this._graph.nodes(), this.getTasks().keys(), this._graph.nodes().length === this.getTasks().size, this._graph.nodes().length, this.getTasks().size)
      // console.log("this._graph.edges__" + key, this._graph.edges())
      // this._graph.outEdges()
      // console.log('this._graph: ', this._graph);
    })
  }

  get taskScheduler() {
    return this._taskScheduler
  }
  get batchUiChange() {
    return this._batchUiChange
  }
  set batchUiChange(callback) {
    this._batchUiChange = callback
  }
  get parentMounted() {
    return this._parentMounted
  }
  set parentMounted(value) {
    this._parentMounted = value
  }
  setChangeCallback(callback) {
    this.onPropsChange = callback
  }
  setLoadingCallback(callback) {
    this.onPropsLoading = callback
  }
  getSubject() {
    return this.subject
  }
  getUiQueue() {
    return this.uiQueue
  }
  getNotifyQueue() {
    return this.willNotifyQueue
  }

  getCallbackQueue() {
    return this.callbackQueue
  }

  clearCallbackQueue() {
    this.callbackQueue = []
  }
  getEventEmitter() {
    return this.eventEmitter
  }
  getDeps(id: string) {
    return this.getTaskById(id).deps || []
  }
  updateDeps(id: string, deps: IRdxDeps[]) {
    const preDeps = this.hasTask(id) && this.getTaskById(id).deps
    if (this.hasTask(id) && isDepsChange(preDeps, deps)) {
      this.updateState(id, ActionType.Update, TargetType.TasksMap, {
        ...this.getTaskById(id),
        deps,
      })
    }
  }
  // setDeps(id: string, deps: IRdxDeps[], updateCache: boolean = true) {
  //   // 检测到依赖更新了，需要重新执行
  //   const preDeps = this.hasTask(id) && this.getTaskById(id).deps
  //   if (this.hasTask(id) && isDepsChange(preDeps, deps)) {
  //     this.updateDeps(id, deps)
  //   }
  // }

  /**
   *
   * 单个任务执行前的hook
   * @memberof BaseFieldContext
   */
  preExecuting = (config: { currentKey: string }) => {
    const { currentKey: key } = config
    // LOADING 的多种模式，1.仅在当前任务触发前开启 2. 批量任务开始时，全部置为为loading状态
    if (key) {
      this.updateState(key, ActionType.Update, TargetType.TaskStatus, {
        value: NodeStatus.Running,
        errorMsg: undefined,
      })
    }
  }
  onSuccess = (callback: ICallbackInfo) => {}

  /**
   * 任务流执行失败的回调
   *
   * @memberof BaseFieldContext
   */
  onError = (info: { currentKey: string; errorMsg: string }) => {}

  notifyModule(id: string, type: StateUpdateType = StateUpdateType.State) {
    this.eventEmitter.emit(id + '----' + type)
  }

  getPendingPointsMap(keys: NotifyPoint | NotifyPoint[]) {
    const { pendingPoints } = this.taskScheduler.getWillExecuteInfo(keys)
    const pendingPointsMap = arr2Map(pendingPoints, v => v)
    return pendingPointsMap
  }
  // 这里也要改成批量的, 不然是有问题的
  fireWhenDepsUpdateBase(key: NotifyPoint | NotifyPoint[]) {
    // 触发检测依赖的情况
    // 1. 依赖都执行完成的时候 必须条件
    // 2. 当前节点变成脏节点的时候
    // 依赖更新
    // 1. 依赖更新的时候
    // 通知下游节点更新
    const keys = normalizeSingle2Arr(key)
    const fireIds = this.getWillDeliverTask(key)
    // 将要触发的节点

    return fireIds.map(task => {
      if (this.getTaskById(task)) {
        const { fireWhenDepsUpdate } = this.getTaskById(task)
        fireWhenDepsUpdate && fireWhenDepsUpdate(keys.map(item => item.key))
      }
      return {
        key: task,
      }
    })
  }

  /**
   * 单个任务执行后的hook
   *
   * @memberof BaseFieldContext
   */
  onExecuting = (callbackInfo: ICallbackInfo) => {
    // 1. 清理脏节点
    // 2. 标记脏节点
    const { currentKey: key, isEnd, next, skip, stop, runningId } = callbackInfo
    if (isEnd) {
      this.emitBase(DataPersistType.TaskExecutingEnd)
      this.cancelMap.removeAll()
      this.onPropsChange(this.taskState.getAll(), this.taskState)
      this.getCallbackQueue().forEach(item => {
        item()
      })
      this.clearCallbackQueue()
      // 状态更新后清空
      this.dataDirtySets.clear()
      this.uiDirtySets.clear()
      this.logger.infoAndend('%c 当前运行任务流都执行完毕啦', 'color: red;', this.tasks)
    } else {
      this.logger.startSecondary(key, `任务${key}开始执行`, callbackInfo.runningId)
      // 已经执行，把数据标记的数据脏节点去掉
      this.removeDataDirtyKey(key)

      const success = (value: any) => {
        next(() => {
          //  ! 遗留问题： 同步任务应该先执行， 再通知ui更新
          // 1. 更新下游节点的依赖 和 脏标记
          this._notifyDownStreamPoints(
            {
              key,
              downStreamOnly: true,
            },
            'task',
          )

          // 1. 先更新数据和状态，依赖检测才有意义
          batchUpdate(() => {
            this.updateState(key, ActionType.Update, TargetType.TaskState, value, true)
            this.updateState(
              key,
              ActionType.Update,
              TargetType.TaskStatus,
              {
                value: NodeStatus.IDeal,
              },
              true,
            )
          })
          
          this.removeUiDirtyKey(key)
         
          // 同步状态
          //  syncStatus('success');

          // 2. 节点标记执行完成后，触发其他依赖项的更新
          // const pendingPoints = this.getPendingPointsMap([]);
          // pendingPoints.delete(key);
          // 依赖检测
          this.logger.endSecondary(key, `任务${key}执行完毕，执行下游节点`)

          
        
        })
        this.cancelMap.remove(key)
      }
      // 闭包保存原来的依赖
      
      const preDeps = this._taskScheduler.scheduledCore.inDegreeDeps.get(key)
      const fail = error => {
        // 当前任务执行的时候，还有依赖没有准备好，由于是动态依赖探测，所以不一定可以在最合适的时机获取数据，
        // 这里检测的异常是依赖没准备完成导致的，则hold on当前任务，等待被依赖更新重试
        if (error instanceof CustomError && error.errorType === ComputeErrorType.DepsNotReady) {
          this.logger.endSecondary(key, `依赖节点尚未执行完成 跳过 ${key}`, this.getTaskById(key), error)
          stop('依赖变化了')
          // this.executeTask(true)
          // 重新触发节点执行
          // 怎么判断依赖更新了，怎么获取之前的依赖呢
          if (isDepsChange(this.getTaskById(key)?.deps, preDeps)) {
            this.transaction(() =>
              this.batchDepsChange([{ key, downStreamOnly: false }], TaskEventTriggerType.DepsUpdate),
            )
          } else if (this.getTaskById(key).deps.some(item => item instanceof RegExp)) {
            // 如果依赖中有正则，那依赖可能是更新的，但是感知不到
            this.transaction(() =>
              this.batchDepsChange([{ key, downStreamOnly: false }], TaskEventTriggerType.DepsUpdate),
            )
            // this.executeTask()
          } else {
            this.logger.error(
              '依赖没变化---走到这里证明有bug',
              runningId,
              key,
              error,
              this.getTaskById(key)?.deps,
              this._graph.inEdges(key),
            )
          }

        } else if (error instanceof CustomError && error.errorType === ComputeErrorType.DepsIsRefrence) {
          this.logger.info('引用节点未初始化', key, error, this.getTaskById(key)?.deps, this._graph.inEdges(key))
          this.getTaskById(key)?.fireWhenDepsUpdate([])
          this.markDirtyNodes([{ key: key, downStreamOnly: false}])
          stop('引用节点未初始化')
        } else {
          this.logger.endSecondary(`任务执行 失败 ${key}`, error)
          this.logger.error(`任务执行 失败 ${key}`, error)
          // 移除状态标记
          const errorMsg = error ? error.message : '运行错误'
          // console.error('error: ', error);
          // 更新自己的状态
          this.updateState(key, ActionType.Update, TargetType.TaskStatus, {
            value: NodeStatus.Error,
            errorMsg: errorMsg,
          })
          this.removeUiDirtyKey(key)
          skip('运行错误', key => {
            this.updateState(key, ActionType.Update, TargetType.TaskStatus, {
              value: NodeStatus.Error,
              errorMsg: errorMsg,
            })
            this.removeUiDirtyKey(key)
          })
          // 相关的下游节点
          // const notFinishRelationPoints = this.taskScheduler.getRealtionNotFinishPoints(key)
          // let keys = [key, ...notFinishRelationPoints]

          // // 更新下游状态
          // keys.forEach(k => {
          //   this.updateState(k, ActionType.Update, TargetType.TaskStatus, {
          //     value: NodeStatus.Error,
          //     errorMsg: errorMsg,
          //   })
          //   this.removeUiDirtyKey(key)
          // })
        }
      }
      // 执行reaction的时候，需要调用cancel callback
      const cancel = this.cancelMap.get(key)
      if (cancel) {
        cancel()
        this.cancelMap.remove(key)
      }
      const currentTask = this.getTaskById(key)
      if (currentTask) {
        let reactionContext: IReactionContext<any> = {
          next: success,
          error: fail,
          skip: () => {
            this.updateState(
              key,
              ActionType.Update,
              TargetType.TaskStatus,
              {
                value: NodeStatus.IDeal,
              },
              true,
            )
            // 相关的没有结束的点，
            skip('跳过依赖', key => {
              this.logger.startSecondary(key, `任务${key} 节点跳过执行 开始`)
              this.updateState(key, ActionType.Update, TargetType.TaskStatus, {
                value: NodeStatus.IDeal,
              })
              this.removeDataDirtyKey(key)
              this.removeUiDirtyKey(key)
              this.logger.endSecondary(key, `中间节点 任务${key} 节点跳过执行`)
            })
            this.logger.endSecondary(key, `任务${key} 节点跳过执行 结束`)
          },
          callbackMapWhenConflict: this.createConflictCallback(key),
        }
        currentTask.reaction(reactionContext)
      } else {
        skip('结点暂未初始化', key => {
          // this.updateState(key, ActionType.Update, TargetType.TaskStatus, {
          //   value: NodeStatus.IDeal,
          // })
          this.removeUiDirtyKey(key)
        })
      }

      // const p =
      // if (p instanceof Promise) {
      //   p.then(success).catch(fail);
      // } else {
      //   try {
      //     success(p);
      //   } catch (error) {
      //     fail(error);
      //   }
      // }
    }
  }

  removeUiDirtyKey(key) {
    this.uiDirtySets.delete(key)
  }

  removeDataDirtyKey(key) {
    this.dataDirtySets.delete(key)
  }
  /**
   * 重复点检查,在新增节点的时候check
   * @param id
   */
  duplicateCheck(id: string) {
    const isDuplicate = this.getStandardTasks().some(item => item.key === id)
    if (isDuplicate) {
      this.logger.error(`id为${id}的节点被重复声明了`)
    }
    return isDuplicate
  }

  createTaskForSchedule() {
    return this.getStandardTasks().map(item => {
      return {
        ...item,
        deps: item.deps.map(item => ({ id: item })),
      }
    })
  }
  /**
   * 获取当前的任务列表
   */
  getStandardTasks(): {
    key: string
    deps: IRdxDeps[]
    scope?: string
  }[] {
    const tasks = Array.from(this.getTasks().values())
    return (tasks as IRdxTask<any>[]).map(task => {
      // 判断是否是初始化应该在事件初始化的时候，如果放在回调中，那么判断就滞后了，用了回调时的taskMap判断了
      return {
        key: task.id,
        deps: task.deps,
      }
    })
  }

  createConflictCallback(key: string) {
    return (callback: () => void) => {
      const cancel = this.cancelMap.get(key)
      if (cancel) {
        cancel()
        this.cancelMap.remove(key)
      }
      this.updateState(key, ActionType.Update, TargetType.CancelMap, callback)
    }
  }

  markWaiting(id: string) {
    this.setTaskStatus(id, { value: Status.Waiting })
  }
  markIDeal(id: string) {
    this.setTaskStatus(id, { value: Status.IDeal })
  }

  isTaskReady(id: string) {
    return (
      this.getTaskStatusById(id) && this.getTaskStatusById(id).value === Status.IDeal && !this.dataDirtySets.has(id)
    )
  }

  isTaskError(id: string) {
    return this.getTaskStatusById(id) && this.getTaskStatusById(id).value === Status.Error
  }
  hasTask(id: string) {
    return this.tasks.getAll().has(id) 
  }
  getTaskById(id: string): IRdxTask<any> {
    return this.tasks.get(id)
  }
  getTasks() {
    return this.tasks.getAll()
  }
  getAllTaskState() {
    return this.taskState.getAll()
  }
  getTaskState() {
    return this.taskState
  }
  setTaskStateById(id: string, payload?: any) {
    this.updateState(id, ActionType.Update, TargetType.TaskState, payload, false)
  }
  getTaskStateById(id: string, scope?: string) {
    if (this.getTaskById(id) && this.getTaskById(id).getValue) {
      return this.getTaskById(id).getValue()
    }
    if (this.getTaskById(id) && this.getTaskById(id).virtual) {
      return this.getVirtualTaskStateById(id)
    }
    return this.taskState.get(id, scope)
  }
  getVirtualTaskStateById(id: string) {
    return this.virtualTaskState.get(id)
  }
  getVirtualTaskState() {
    return this.virtualTaskState.getAll()
  }
  removeVirtualTaskStateById(id) {
    return this.virtualTaskState.remove(id)
  }
  setVirtualTaskStateById(id, value) {
    return this.virtualTaskState.update(id, value)
  }
  getTaskStatusById(id: string) {
    return this.taskStatus.get(id)
  }
  setTaskStatusById(id: string, payload) {
    return this.updateState(id, ActionType.Update, TargetType.TaskStatus, payload)
  }

  setTaskState(id: string, payload: any) {
    return this.updateState(id, ActionType.Update, TargetType.TaskState, payload)
  }
  removeTaskState(id: string) {
    return this.updateState(id, ActionType.Remove, TargetType.TaskState)
  }

  setTaskStatus(id: string, payload: TaskStatus) {
    return this.updateState(id, ActionType.Update, TargetType.TaskStatus, payload)
  }

  // 包含自己
  getWillDeliverTask(id: NotifyPoint | NotifyPoint[]) {
    const ids = normalizeSingle2Arr(id)
    return uniqBy(
      ids.reduce((arr, item) => {
        const delivers = this._graph.outEdges(item.key)?.map(item => item.w)
        let set = delivers ? delivers.slice(0) : []
        if (item.downStreamOnly === false && !item.valid) {
          set.push(item.key)
        }
        return arr.concat(set)
      }, [] as string[]),
      item => item,
    )
    // let deliverMap
    // if (callBy === 'task') {
    //   deliverMap = this.taskScheduler.scheduledCore.deliverMap
    //   return ids.reduce((arr, item) => {
    //     const delivers = deliverMap.get(item.key)
    //     let set = delivers ? delivers.slice(0) : []
    //     if (item.downStreamOnly === false) {
    //       set.push(item.key)
    //     }
    //     return arr.concat(set)
    //   }, [] as string[])
    // } else {
    //   return ids.reduce((arr, item) => {
    //     const delivers = this._graph.outEdges(item.key).map(item => item.w)
    //     let set = delivers ? delivers.slice(0) : []
    //     if (item.downStreamOnly === false) {
    //       set.push(item.key)
    //     }
    //     return arr.concat(set)
    //   }, [] as string[])
    // }
    // if (callBy === 'task') {

    // } else {

    //   return ids.reduce((arr, item) => {
    //     const delivers = deliverMap.get(item.key)
    //     let set = delivers ? delivers.slice(0) : []
    //     if (item.includesSelf) {
    //       set.push(item.key)
    //     }
    //     return arr.concat(set)
    //   }, [] as string[])
    // }
  }
  /**
   * 通过当前触发的点，来标记脏节点
   * @param id
   * @param includesSelf  是否包含自己
   */
  markDirtyNodes(id: NotifyPoint | NotifyPoint[]) {
    // 依赖当前节点的项 + includesSelf 判断当前节点
    // 获取下游节点
    // 调度中可以使用，否则无法使用
    const affectIds = this.getWillDeliverTask(id)

    // const affectNodes = Array.from(this.getTasks().values()).filter(
    //   item =>
    //     // 触发节点中是否包含
    //     item.deps.some(dep => ids.some(item => item.key === dep)) ||
    //     // 下游节点
    //     ids.some(idItem => idItem.key === item.id && idItem.includesSelf === true),
    // )

    affectIds.forEach(item => {
      this.uiDirtySets.add(item)
      this.dataDirtySets.add(item)
    })
  }
  /**
   * 更新当前节点数据,需要做如下几件事：
   * 1. 标记脏节点
   * 2. 更新ui
   * 3. 进行相关的依赖检测
   * 4. 通知下游节点执行
   *
   * @param {string} id
   * @param {*} value
   * @param {DeliverOptions} [options={ refresh: false }]
   * @memberof RdxStore
   */
  private _notifyDownStreamPoints(collectDirtys: NotifyPoint | NotifyPoint[], callBy: 'task' | 'manual' = 'manual') {
    let newCollectDiretys = normalizeSingle2Arr(collectDirtys)
    // 清理下游路径相同的节点
    this.markDirtyNodes(newCollectDiretys)
    // 通知依赖进行更新执行
    this.fireWhenDepsUpdateBase(newCollectDiretys)
    // 所有的改变元素，都要触发下游任务
  }

  refreshById(id: string) {
    // 清理缓存数据
    // this.getTaskById(id).removeCacheValue()
    // 执行任务

    this.transaction(() => this.batchDepsChange([{ key: id, downStreamOnly: false }], TaskEventTriggerType.Refresh))
  }

  batchReset = (ids: string[]) => {
    this.transaction(() => {
      let collectDirtys = [] as (string | NotifyPoint)[]

      for (let id of ids) {
        this.innerNext(id, DEFAULT_VALUE, {
          collect: id => {
            collectDirtys.push(id)
          },
        })
      }
      this.batchDepsChange(collectDirtys, TaskEventTriggerType.Reset)
    })
  }

  resetById = (id: string) => {
    this.batchNext(id, DEFAULT_VALUE)
  }

  /**
   * 用户和页面的最新的交互行为
   *
   * @param {string} id
   * @param {*} value
   * @param {DeliverOptions} [options={ refresh: false }]
   * @memberof RdxStore
   */
  batchNext(id: string, value: TNextValue<any>) {
    this.transaction(() => {
      // !当上下文不在React的环境中，那么这是同步执行的，会导致设置下游节点为脏数据变吗，那么如果依赖同步执行进行atom添加的方式，将存在layout没准备好却没标记脏的的情况，
      let collectDirtys = [] as (string | NotifyPoint)[]

      this.innerNext(id, value, {
        collect: key => {
          collectDirtys.push(key)
        },
      })

      // 数据变更项

      this.batchDepsChange(collectDirtys, TaskEventTriggerType.Set)
    })

    // 这里不能直接触发依赖
    // this.notifyDownStreamPoints(
    //   ,
    //   ('Compute_next' + id) as any
    // );
  }
  /**
   * 用户和页面的最新的交互行为
   *
   * @param {string} id
   * @param {*} value
   * @param {DeliverOptions} [options={ refresh: false }]
   * @memberof RdxStore
   */
  innerNext(id: string, value: TNextValue<any>, mutators: ICollectDeps) {
    // 这里这个生命周期有问题，调度是在next执行过程中触发的
    this.getSubject().emit(DataPersistType.UserAction)
    const next = this.getTaskById(id).next
    let newValue
    if (typeof value === 'function') {
      newValue = (value as TNextValueCallback<any>)(this.getTaskStateById(id))
    } else {
      newValue = value
    }
    if (next) {
      next(id, newValue, mutators)
    } else {
      //  更新状态
      this.updateState(id, ActionType.Update, TargetType.TaskState, newValue)
    }
  }

  /**
   * 添加数据对象时，通过检查节点的状态，判断是否要将节点加入
   * @param id
   * @param taskInfo
   * @param notifyTask
   */
  addOrUpdateTask(id: string, taskInfo: IRdxTask<any>) {
    this.updateState(id, ActionType.Update, TargetType.TasksMap, taskInfo)
  }

  removeState(id) {}

  removeTask(id: string) {
    this.updateState(id, ActionType.Remove, TargetType.TaskState, null, false)
    this.updateState(id, ActionType.Remove, TargetType.TaskStatus, null, false)
    this.removeUiDirtyKey(id)
    this.removeDataDirtyKey(id)
    this.cancelMap.remove(id)
    this.updateState(id, ActionType.Remove, TargetType.TasksMap, null, false)
  }

  updateState(
    key: string,
    actionType: ActionType,
    targetType: TargetType,
    paylaod?: TaskStatus | any | IRdxTask<any> | (() => void),
    notify: boolean = true,
  ) {
    this.subject.emit(DataPersistType.StateChange, {
      actionType: actionType,
      targetType,
      value: paylaod,
      key: key,
    } as IStateInfo)
    const update = () => {
      if (actionType === ActionType.Remove) {
        this[targetType][actionType](key) as any
      } else if (actionType === ActionType.Update) {
        this[targetType][actionType](key, paylaod) as any
      } else if (actionType === ActionType.Merge) {
        this[targetType][actionType]() as any
      }
    }
    if (targetType === TargetType.TaskState) {
      if (this.getTaskById(key)) {
        if (this.getTaskById(key).setValue && actionType === ActionType.Update) {
          this.getTaskById(key).setValue(paylaod)
        } else if (this.getTaskById(key).removeValue && actionType === ActionType.Remove) {
          this.getTaskById(key).removeValue()
        } else if (this.getTaskById(key).virtual) {
          if (actionType === ActionType.Update) {
            this.setVirtualTaskStateById(key, paylaod)
          } else if (actionType === ActionType.Remove) {
            this.removeVirtualTaskStateById(key)
          }
        } else {
          update()
        }
      } else {
        update()
      }
      notify && this.notifyModule(key)
    } else {
      const status = this.getTaskStatusById(key)
      update()
      if (targetType === TargetType.TaskStatus && ActionType.Update === actionType) {
        // 避免重复更新
        ;(!status || status.value !== paylaod.value) && notify && this.notifyModule(key, StateUpdateType.ReactionStatus)
      }
    }
  }

  watch(ids: string[]) {
    // 监听组件新增
  }
  watchOnce(ids: string | string[]) {
    const isArray = Array.isArray(ids)
    const newIds = normalizeSingle2Arr(ids)
    const promise = new Promise<any[]>(resolve => {
      const randomId = uuid()
      this.addOrUpdateTask(randomId, {
        removeCacheValue: () => {},
        getCacheValue: () => {},
        id: randomId,
        deps: newIds,
        reaction: ({ next }) => {
          resolve(
            newIds.map(id => {
              return this.getTaskStateById(id)
            }),
          )
          next(null)
          this.removeTask(randomId)
        },
      })
    })
    if (isArray) {
      return promise
    } else {
      return promise.then(res => res[0])
    }
  }
  getAllPointFired(taskKeys: NotifyPoint | NotifyPoint[]) {
    // 环检测
    return this._graph.getAllNodesByCurrentNodes(normalizeSingle2Arr(taskKeys))
  }

  getProcessInfo(taskKeys: NotifyPoint | NotifyPoint[] = []) {
    return {
      ...this.taskScheduler.getExecutingStates(taskKeys),
      tasks: Array.from(this.getTasks().values()),
    } as IRdxSnapShotTrigger
  }

  emit(
    type: DataPersistType,
    taskEventTriggerType: TaskEventTriggerType | string,
    taskKeys: NotifyPoint | NotifyPoint[] = [],
  ) {
    if (this.options.debuggerLog) {
      // this.getSubject().emit(type, {
      //   type: taskEventTriggerType,
      //   process: this.getProcessInfo(taskKeys),
      // })
    }
  }

  emitBase(type: DataPersistType) {
    if (this.options.debuggerLog) {
      // this.getSubject().emit(type, this.getProcessInfo())
    }
  }

  getValidTaskKeys() {
    return Array.from(this.getTasks().keys())
  }

  executeTask() {
    // 依赖变更检测
    // const cacheWillCheckDepskeys = normalizeNotifyKeys(Array.from(this.cacheWillCheckDepskeys))
    // 清空
    // this.cacheWillCheckDepskeys.clear()
    const cacheExecuteTaskKeys = normalizeNotifyKeys(Array.from(this.cacheExecuteTaskKeys))

    // 获取完数据，要立刻清理，而不是放到后面去清理，否则会把过程中产生的需要执行的节点清楚的
    this.cacheExecuteTaskKeys.clear()
    // this._notifyDownStreamPoints(cacheExecuteTaskKeys)
    const allFirePoint = this.getAllPointFired(cacheExecuteTaskKeys)
    // 不能复用的节点才需要调用cancel
    if (allFirePoint.length > 0) {
      this.logger.end()
      this.logger.startPrimary('触发调度依赖', cacheExecuteTaskKeys, this.tasks)
      // this._taskScheduler.updateTasks(this.createTaskForSchedule())
      this.emit(DataPersistType.Trigger, 'executeTask', cacheExecuteTaskKeys)
      this.getEventEmitter().emit(StateUpdateType.TriggerTaskSchedule)
      if (!this.taskScheduler.isRunning()) {
        this.onPropsLoading()
      }
      this.taskScheduler.notifyDownstream(cacheExecuteTaskKeys)
    } else {
      // 没有触发下游节点变更，但是有节点变更，比如全是atom节点的时候
      // 没有节点运行，且context已经绑定
      if (!this.taskScheduler.isRunning()) {
        this.logger.infoAndend('无任务执行， 结束')
        this.onPropsChange(this.taskState.getAll(), this.taskState)
        // 需要替换成异步的onChange,否则会触发warning https://reactjs.org/blog/2020/02/26/react-v16.13.0.html
        // setTimeout(() => {
        // }, 0);
      }
    }
  }

  transaction(fn: () => void) {
    this.inBatch++
    try {
      fn()
    } finally {
      if (--this.inBatch === 0) {
        this.executeTask()
      }
    }
  }
  batchDepsChangeAtOnce(taskKeys: (string | NotifyPoint)[], taskEventType: TaskEventTriggerType | string) {
    this.transaction(() => this.batchDepsChange(taskKeys, taskEventType))
  }
  /**
   * 用户操作之后，标记后续节点要重新执行
   * @param taskKeys
   */
  batchDepsChange(taskKeys: (string | NotifyPoint)[], taskEventType: TaskEventTriggerType | string) {
    const baseKey = taskKeys.filter(item => typeof item === 'string') as string[]
    const notifyKey = taskKeys.filter(item => typeof item !== 'string') as NotifyPoint[]
    const allPoints = [...uniqBy(baseKey, v => v).map(item => ({ key: item, downStreamOnly: true })), ...notifyKey]
    // const currentTaskKeys = normalizeSingle2Arr(taskKeys);
    this.logger.taskAdd('任务原因' + taskEventType, taskKeys)
    this._notifyDownStreamPoints(allPoints)
    this.cacheExecuteTaskKeys.add(allPoints)
    // batchUpdate(() => this.executeTask())
    // this.batchChange()
  }
}

export interface ShareContext<GModel> {
  /**
   * 任务信息
   */
  name?: string
  tasks: BaseMap<IRdxTask<GModel>>
  taskState: Base<GModel>
  virtualTaskState: Base<GModel>
  taskStatus: BaseObject<TaskStatus>
  cancelMap: BaseMap<() => void>
  subject?: EventEmitter<DataPersistType, ProcessGraphContent>
  parentMounted?: boolean
}

export const initValue = () => ({
  tasks: new BaseMap(new Map()),
  taskState: new BaseObject({}) as any,
  virtualTaskState: new BaseObject({}) as any,
  taskStatus: new BaseObject({}) as any,
  cancelMap: new BaseMap(new Map()),
  parentMounted: false,
})

export const RdxStateContext = React.createContext<RdxStore>(null)
