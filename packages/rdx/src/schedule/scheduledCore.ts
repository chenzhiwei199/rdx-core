import { Log } from '../utils/log'
import { END, graphAdapter } from './utils'
import { v1 as uuid } from 'uuid'
import { AdvancedGraph } from '../newGraph'
import { dfs } from '../newGraph/alg/dfs'
import { NodeStatus, NotifyPoint } from '../graph/types'
import { union } from '../graph/utils'
import { findCycles, isAcyclic } from '../newGraph/alg'
import { Graph } from '../graph'
export interface Data {
  id: string
  deps?: (string | RegExp)[]
}

/**
 * 任务执行单元
 * id:当前任务唯一标识
 */
export type Callback = (id: string, options: CallbackOptions) => void

/**
 * next: 通过该方法通知下游任务执行
 * isStop: 通过该方法判断任务是否终止
 * close: 通过该方法，关闭任务执行，并且不执行下游任务
 */
export interface CallbackOptions {
  runningId: number;
  isStop: () => boolean
  stop: (msg: string) => void
  //  callback 将会在任务执行完成后调用
  next: (callback?: () => void) => void
  skip: (msg: string, callback?: (key: string) => void) => void
}
/**
 * 任务执行管理器
 * 1. 支持任务Pause
 * 2. 支持任务Continue
 *
 * @export
 * @class ScheduledCore
 */
export default class ScheduledCore {
  runningSnapshotId: number = 0
  dataSource: string[] = []
  inDegree: Map<string, number> = new Map()
  inDegreeDeps: Map<string, string[]> = new Map()
  // deliverMap: Map<string, string[]> = new Map()
  taskQueue: Map<string, ScheduledTask> = new Map()
  reExecutes: Set<string> = new Set()
  canReuse: (id: string) => boolean
  logger: Log
  cancelFlag = false
  advancedGraph: AdvancedGraph
  constructor(advancedGraph: AdvancedGraph, options: { logger?: Log; canReuse?: (id: string) => boolean }) {
    this.advancedGraph = advancedGraph
    this.canReuse = options?.canReuse
    this.logger = options?.logger || new Log(false)
  }

  forkInDegree() {
    return new Map(this.inDegree)
  }
  cancel() {
    this.cancelFlag = true
  }
  getDeliver(key: string) {
    return this.advancedGraph.outEdges(key).map(item => item.w)
  }
  syncSkip(key: string, callback: Callback, skipCalback: (key) => void) {
    // 入度为 0
    // 入度大于0
    // 任务队列中，应该已经被移除了
    const dfs = (currentKey: string) => {
      this.getDeliver(currentKey)?.forEach(deliverKey => {
        this.inDegree.set(deliverKey, this.inDegree.get(deliverKey) - 1)
        // 不可以重用，且入度为0，就执行，确保脏节点可以执行
        // 在taskQueue中的节点也属于为执行完成的节点，要重新执行

        if (this.inDegree.get(deliverKey) > 0) {
          // 还有依赖没执行完的节点， 啥也不做
        } else if (deliverKey === END && this.inDegree.get(deliverKey) === 0) {
          // 结束节点,且入度为0
          this.execute(deliverKey, callback)
        } else if (
          this.inDegree.get(deliverKey) === 0 &&
          !this.canReuse(deliverKey)
          // (this.taskQueue.has(deliverKey) )
        ) {
          // 可以重复使用的节点，继续执行
          // 入度为0，且任务存在，且节点不可以复用
          this.execute(deliverKey, callback, 'syncSkip')
        } else {
          skipCalback(deliverKey)
          dfs(deliverKey)
          // 可以跳过的节点要通知给外部
        }
      })
    }
    dfs(key)
  }
  getNextPoint(key: string) {
    return this.getDeliver(key)
  }
  getWillFinishPoint(key: string) {
    const forkInDegree = this.forkInDegree()
    const dfs = (currentKey: string) => {
      if (currentKey !== key) {
        forkInDegree.set(currentKey, forkInDegree.get(currentKey) - 1)
      }
      this.getDeliver(currentKey)?.forEach(deliverKey => {
        dfs(deliverKey)
      })
    }
    let relation = []
    const relationDfs = (currentKey: string) => {
      if (key !== currentKey) {
        relation.push(currentKey)
      }

      this.getDeliver(currentKey)?.forEach(deliverKey => {
        relationDfs(deliverKey)
      })
    }
    dfs(key)
    relationDfs(key)
    return relation.filter(item => forkInDegree.get(item) === 0)
  }
  getNotFinishPoints() {
    // 入度不为0，且
    return Array.from(this.inDegree.keys()).filter(key => {
      return !this.isFinish(key) && key !== END
    })
  }
  getInDegree(key: string) {
    return this.inDegree.get(key)
  }
  isFinish(key: string) {
    // 入度为0，且任务不存在,
    // !入度为0这个条件不严谨，因为可能一次都没有执行，入度只能作为执行条件
    return this.inDegree.get(key) === 0 && !this.taskQueue.has(key)
  }
  isRunning(key: string) {
    // 运行任务存在
    return this.inDegree.get(key) === 0 && this.taskQueue.get(key)
  }
  isWaiting(key: string) {
    return this.inDegree.get(key) > 0
  }
  getStatus(key: string) {
    if (this.isFinish(key)) {
      return NodeStatus.IDeal
    } else if (this.isWaiting(key)) {
      return NodeStatus.Waiting
    } else if (this.isRunning(key)) {
      return NodeStatus.Running
    }
  }
  getRunningPoint() {
    return Array.from(this.inDegree.keys()).filter(key => {
      return this.isRunning(key) && key !== END
    })
  }
  isScheduleRunning() {
    return (
      Array.from(this.inDegree.keys()).reduce((sum, key) => {
        return sum + this.inDegree.get(key)
      }, 0) > 0
    )
  }
  runtimeCheck() {
    const dataSourceSet = new Set(this.dataSource)
    const runtimeGraph = new AdvancedGraph({})
    this.dataSource.forEach(id => {
      // 如果入度不在这些节点里面，则排除
      runtimeGraph.setNode(id)
      this.advancedGraph.inEdges(id).filter(item => dataSourceSet.has(item.v)).forEach(({ v, w}) => {
        runtimeGraph.setEdge(v, w)
      })
    })
    const checkIsAcyclic = isAcyclic(runtimeGraph)
    if(checkIsAcyclic === false) {
      throw new Error('形成环' + JSON.stringify(findCycles(runtimeGraph)))
    }
    return isAcyclic(runtimeGraph)
  }
  /**
   * 更新数据
   */
  update(dataSource: string[] = []) {
    this.reExecutes.clear()
    this.logger.taskExecuteInfo(
      '旧的运行时节点和依赖关系' + this.runningSnapshotId,
      JSON.parse(JSON.stringify(this.dataSource)),
      new Map(this.taskQueue),
      new Map(this.inDegree),
    )

    this.dataSource = dataSource
    // 更新入度表
    const { inDegreeDepsMap,inDegreeMap } =  this.createInDegree()
    this.inDegree = inDegreeMap
    this.inDegreeDeps = inDegreeDepsMap

   
    this.runtimeCheck() 
      
    
    this.logger.taskExecuteInfo(
      '将要运行时节点和依赖关系',
      JSON.parse(JSON.stringify(this.dataSource)),
      new Map(this.taskQueue),
      new Map(this.inDegree),
    )

    // 只要数据节点不脏都可以重用
    const canReusePoints = this.dataSource
      .filter(item => {
        // 非暂停状态，可能会因为依赖有问题而被打断
        // ! 数据不脏，且入度为0，才可以复用
        return this.canReuse && this.canReuse(item) && (!this.inDegree.get(item) || this.inDegree.get(item) === 0)
      })
      .map(item => item)
    // .filter((id) => {
    //   // 被打断的不能重用
    //   return this.taskQueue.has(id) ? !this.taskQueue.get(id).isStop() : true;
    // });
    // 关闭不可复用的任务
    for (let key of Array.from(this.taskQueue.keys())) {
      if (!canReusePoints.includes(key)) {
        // ! 被终止的任务，且上游都执行完了，那这个时候需要重新加入执行队列
        this.logger.warn(key, '节点任务由于更新被终止')
        if (!this.inDegree.has(key)) {
          // 重新加入执行队列
          this.inDegree.set(key, 0)
        }
        this.closeTask(key, '新任务执行')
      }
    }

    this.logger.taskExecuteInfo(
      '新的运行时节点和依赖关系',
      JSON.parse(JSON.stringify(this.dataSource)),
      new Map(this.taskQueue),
      new Map(this.inDegree),
    )
  }

  /**
   * 关闭某个任务
   *
   * @param {string} key
   * @memberof ScheduledCore
   */
  closeTask(key: string, msg: string) {
    if (this.taskQueue.has(key)) {
      const task = this.taskQueue.get(key)
      task.pause(msg)
      task.stopBind(msg)
    }

    this.taskQueue.delete(key)
  }
  /**
   * 创建入度表
   */
  createInDegree() {
    const inDegreeMap = new Map<string, number>()
    const inDegreeDepsMap = new Map<string, string[]>()
    const dataSourceSet = new Set(this.dataSource)
    this.dataSource.forEach(id => {
      // 如果入度不在这些节点里面，则排除
      inDegreeMap.set(id, this.advancedGraph.inEdges(id)?.filter(item => dataSourceSet.has(item.v)).length || 0) 
      inDegreeDepsMap.set(id, this.advancedGraph.inEdges(id) || []) 
    })
    return {
      inDegreeMap,
       inDegreeDepsMap
    }
  }

  canExecute(id) {
    // 入度为0
    // 不是结束的
    return this.inDegree.get(id) === 0
  }
  getStartPoints() {
    const inDegreeZero = [] as string[]
    Array.from(this.inDegree.keys()).forEach(key => {
      if (this.canExecute(key)) {
        inDegreeZero.push(key)
      }
    })
    return inDegreeZero
  }
  fork(executeTasks: NotifyPoint[]) {
    // 1 运行的图
    const allTriggerPointsByRuntimeGraph = this.getNotFinishPoints()
    // 2 触发的新图
    const allTriggerPoints = this.advancedGraph.getAllNodesByCurrentNodes(executeTasks)
    // 有运行状态的的节点
    // 3 图点的合并
    const afterUnionGraph = union([...allTriggerPointsByRuntimeGraph, ...allTriggerPoints], a => a)
    // // 4 返回图
    // // 构建任务处理器
    // const endPoint = {
    //   id: END,
    //   deps: afterUnionGraph,
    // }

    // const runningPointsWithEndPoint = [
    //   endPoint,
    //   ...afterUnionGraph
    // ]

    this.cancel()
    const newScheduleTask = new ScheduledCore(this.advancedGraph, { logger: this.logger, canReuse: this.canReuse })
    newScheduleTask.runningSnapshotId = this.runningSnapshotId + 1
    newScheduleTask.taskQueue = new Map(this.taskQueue)
    newScheduleTask.update(afterUnionGraph)
    return newScheduleTask
  }
  start(callback: Callback) {
    const startPoints = this.getStartPoints()
    // 将开始节点置为1
    startPoints.forEach(key => {
      this.inDegree.set(key, 1)
    })
    startPoints.forEach(key => {
      // 任务启动执行
      this.inDegree.set(key, 0)
      this.batchExecute([key], callback)
    })
  }
  batchExecute(ids: string[], callback: Callback) {
    ids.forEach(item => {
      this.execute(item, callback)
    })
  }
  next(id, callback: Callback) {
    if (this.reExecutes.has(id)) {
      this.logger.error(id, '节点重复执行啦')
    } else {
      this.reExecutes.add(id)
    }

    // 执行完成， 入度减1
    const deliverIds = this.getDeliver(id) || []
    if (deliverIds.length === 0) {
      if(this.getStartPoints().length  === this.dataSource.length ) {
        callback(END, { runningId: this.runningSnapshotId, next : () => {}, skip: () => {}, stop: () => {}, isStop: () => false})
      }
      
    } else {
      deliverIds.forEach(deliverId => {
        const currentInDegree = this.inDegree.get(deliverId)
        this.inDegree.set(deliverId, currentInDegree - 1)
        this.logger.infoSecondary(
          id,
          `当前节点${id}, 将要执行节点${deliverId} `,
          '关系图',
          // new Map(this.inDegree),
          `是否可以执行： ${this.canExecute(deliverId)}`,
        )
        if (this.canExecute(deliverId)) {
          this.batchExecute([deliverId], callback)
        }
      })
      // !错误写法, 这里先进行入度减一，再批量执行任务，中间如果某个任务造成任务流重新执行，则会导致任务直接被忽略了，因为入度已经减过了
      // ! 这里应该执行一个，再减一下
      // 找到下游节点，且入度为0的点，通知执行
      // const willExcuteIds = deliverIds.filter((item) => this.canExecute(item));
      // logger.info(`当前节点${id}, 将要执行节点${willExcuteIds} `, '关系图', this.inDegree)
      // this.batchExecute(willExcuteIds, callback);
    }
  }
  /**
   * 执行调用链路
   */
  execute(id: string, callback: Callback, from: string = 'execute') {
    // let task: ScheduledTask;
    // if(this.taskQueue.has(id)) {
    //   task = this.taskQueue.get(id)
    // } else {
    //   task = new ScheduledTask()
    // }
    // task
    // 依赖检测，查看依赖是否都执行完了

    // 1. 如果可以重用，那就不需要再执行一次
    // 2. 如果已经重用了，那不应该再重用，否则将会触发多次
    if (this.cancelFlag) {
      return
    }
    const hasTask = this.taskQueue.has(id)
    let task: ScheduledTask
    if (hasTask && !this.taskQueue.get(id).isStopBind) {
      const preTask = this.taskQueue.get(id)
      preTask.pause('重新触发，但是任务可以复用' + id)
      // 1. 阻止之前的请求重复调用
      preTask.only(() => {
        if (!this.cancelFlag) {
          this.taskQueue.delete(id)
          this.logger.infoSecondary(id, id + '节点重复使用')
          if (preTask.bridge.completeSignal) {
            // 任务执行完成，关闭任务
            preTask.executeCallback()
            this.next(id, callback)
          } else if (preTask.bridge.skipSignal) {
            this.syncSkip(id, callback, preTask.bridge.skipCallback)
          }
        }
      })
    } else {
      task = new ScheduledTask()
      // 任务设置到队列中
      this.taskQueue.set(id, task)
      callback(id, {
        runningId: this.runningSnapshotId,
        skip: (msg: string, skipCalback: (key: string) => void) => {
          task.bridge.skip(skipCalback)
          if (!task.isStop() && !this.cancelFlag) {
            this.closeTask(id, msg)

            this.syncSkip(id, callback, skipCalback)
          }
        },
        stop: msg => {
          task.stopBind(msg)
        },
        // 暂停
        isStop: () => task.isStop(),
        next: executeEndCallback => {
          // 更新callback
          task.addCallback(executeEndCallback)
          task.bridge.complete()
          if (!task.isStop() && !this.cancelFlag) {
            // 任务执行完成，关闭任务
            this.taskQueue.delete(id)
            task.executeCallback()
            this.logger.infoSecondary(id, 'scheduleCore监听到节点执行完成')
            this.next(id, callback)
          } else {
            this.logger.infoSecondary(
              id,
              `运行片段： ${this.runningSnapshotId}`,
              `任务${id}执行被终止了, 终止原因${task.getStopMsg()} | cancelFlag = ${this.cancelFlag}`,
            )
          }
        },
      })
    }

    // 执行任务, 已经是fork的，那就保持不变
    // 这里研究一下怎么搞，如何保证任务不重复执行
    // 还有任务调度和依赖视图
    // 1. 确保执行过的任务不重复执行
    // 2. 执行过的任务不会重复触发下游执行
    // 3. 合适的时机去更新节点状态，避免节点重复执行，虽然可以利用fork能力
    // 4. 如何有效的进行日志调试
    // if (canReuse && !task.bindCallback) {
    //   task.bindCallback = true
    //   if (task.bridge.finishSignal) {
    //     this.next(id, callback);
    //   } else {
    //     task.bridge.promise.then(() => {
    //       this.next(id, callback);
    //     });
    //   }
    // } else {

    // }
  }
}
export class ExecutingBridge {
  completeSignal: boolean = false
  skipSignal: boolean = false
  skipCallback: (key: string) => void
  promise: Promise<any>
  resolvePersist: (v: any) => void
  constructor() {
    this.promise = new Promise((reslove, reject) => {
      this.resolvePersist = reslove as any
    })
  }
  skip(skipCallback: (key: string) => void) {
    this.skipSignal = true
    this.skipCallback = skipCallback
    this.resolvePersist(1 as any)
  }
  complete() {
    this.completeSignal = true
    this.resolvePersist(1 as any)
  }
}
// 任务执行
export class ScheduledTask {
  // 状态嫁接
  bridge: ExecutingBridge = new ExecutingBridge()
  // 任务被暂停，但是可以任务的执行可以复用
  pauseSignal: boolean = false
  pauseMsg: string
  stopMsg: string
  // 如果任务被关闭，那么promise的执行也要同时关闭
  isStopBind: boolean = false
  // 是否绑定，如果promise已经绑定了callback，那么就不重复绑定
  // isBind: boolean
  callback?: () => void
  addCallback(callback: () => void) {
    this.callback = callback
  }
  executeCallback() {
    return (this.callback || (() => {}))()
  }
  only(callback) {
    // 控制不重复执行 --- 阻止之前的节点callback调用成功
    // 1. promise 保证只有当前这次执行成功
    // 2. 同步，保证当前这次要执行
    if (this.bridge.completeSignal) {
      callback()
    } else {
      this.bridge.promise.finally(() => {
        if (!this.isStopBind) {
          callback()
        }
      })
    }
  }
  stopBind(stopMsg: string) {
    this.isStopBind = true
    this.stopMsg = stopMsg;
  }
  isStop() {
    return this.pauseSignal
  }
  getStopMsg() {
    return this.pauseMsg
  }
  pause(msg: string) {
    this.pauseSignal = true
    this.pauseMsg = msg
  }
}

// 1.  任务成功执行
// 2.  任务恢复执行
// 3.
