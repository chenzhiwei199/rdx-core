import { RdxStore } from '../../core/RdxStore'
import { getId } from '../../utils/taskUtils'
import { RdxNodeType, RdxState, RdxValueReadOnly, RdxValueReference } from '../../types/rdxBaseTypes'
import { isPromise } from '../../utils/base'
import { ActionType, IRdxTask, TargetType } from '../../types/base'
import { ICacheValue, IRdxDeps, Status } from '../../types/base'
import { DataPersistType, TaskEventTriggerType } from '../../types/dataPersistType'
import { IRdxComputeGet } from './types'
import { checkValueIsSync, isNullTag, NullTag } from '../core'

export class CustomError extends Error {
  id: string;
  depsId: string;
  errorType: ComputeErrorType;
  constructor( errorType, msg) {
    super(msg)
    this.errorType= errorType;
  }
}
export enum ComputeErrorType {
  DepsNotReady = 'DepsNotReady',
  DepsIsRefrence = 'DepsIsRefrence',
  DepsNotRdxInstance = 'DepsNotRdxInstance',
  DepsError = 'DepsError',
}
/**
 * 检查依赖是否改变
 * @param preDeps
 * @param nextDeps
 */
export function isDepsChange(preDeps: IRdxDeps[] = [], nextDeps: IRdxDeps[] = []) {
  const preSet = new Set(preDeps.map(item => getId(item)))
  const nextSet = new Set(nextDeps.map(item => getId(item)))
  if (preSet.size !== nextSet.size) {
    return true
  }
  return Array.from(nextSet).some(key => !preSet.has(key))
}

export function getDepsChangeDetail(preDeps: IRdxDeps[] = [], nextDeps: IRdxDeps[] = []) {
  const preSet = new Set(preDeps.map(item => getId(item)))
  const nextSet = new Set(nextDeps.map(item => getId(item)))
  const addSets = new Set<IRdxDeps>()
  const removeSets = new Set<IRdxDeps>()
  Array.from(nextSet).forEach((key) => {
    if(!preSet.has(key)) {
      addSets.add(key)
    } 
  })
  Array.from(preSet).forEach((key) => {
    if(!nextSet.has(key)) {
      removeSets.add(key)
    } 
  })
  return {
    addSets: Array.from(addSets),
    removeSets: Array.from(removeSets)
  }
}

export function uniqBy<T>(arr: T[], getValue: (pre: T) => any) {
  let newArr = [] as T[]
  const set = new Set()
  arr.forEach(arrItem => {
    const v = getValue(arrItem)
    if (!set.has(v)) {
      set.add(v)
      newArr.push(arrItem)
    }
  })
  return newArr
}

export function createReactionInfo(
  context: RdxStore,
  options: {
    id: string
    dynamicDetectDeps?: boolean
    get: IRdxComputeGet<any>
    reaction?: (v: any, callback: { next; skip; error }) => void
  },
): IRdxTask<any> {
  const {
    id,
    get,
    reaction = (v, callback) => {
      callback.next(v)
    },
    dynamicDetectDeps = true,
  } = options
  let cacheValue = {
    value: undefined,
    vaild: true,
  }
  
  // reaction 通过get函数来收集依赖
  function detect(throwError: boolean = true) {
    let value
    let deps: string[] = []
    let error = null
    try {
      const myGet = atom => {
        const depsAtomId = atom.getId()
        deps.push(atom.getId())

        if (!context.hasTask(depsAtomId)) {
          if (atom instanceof RdxState || atom instanceof RdxValueReadOnly) {
            atom.load(context, id)
          } else if (atom instanceof RdxValueReference) {
            throw new CustomError(ComputeErrorType.DepsIsRefrence, `${id}节点依赖的${depsAtomId}的节点是引用节点`)
          } else {
            throw new CustomError(ComputeErrorType.DepsNotRdxInstance, `${id}节点依赖的${depsAtomId}的节点是不是rdx实例`)
          }
        }
        if (context.isTaskReady(depsAtomId)) {
          return context.getTaskStateById(depsAtomId)
        } else if (context.isTaskError(depsAtomId)) {
          throw new CustomError(ComputeErrorType.DepsError, `${id}节点依赖的${depsAtomId}节点，是报错状态。\r\n` + context.getTaskStatusById(depsAtomId)?.errorMsg, )
        } else {
          throw new CustomError(ComputeErrorType.DepsNotReady, `${id}节点依赖的${depsAtomId}的节点还未准备好`)
        }
      }

      value = get(
        {
          id: id,
          callbackMapWhenConflict: context.createConflictCallback(id),
          has: (atom) => {
            return context.hasTask(atom.getId())
          },
          get: myGet,
        },
        context,
      )
    } catch (err) {
      error = err
    } finally {
      // DataModel<GModel> = GModel | Promise<GModel> | RdxState<GModel>;
      // 返回值可能为上述的几种类型，
      // RdxNode这种情况目前还没有考虑到
      // 1. GModel的异常处理，GModel异常处理可以直接反馈出来
      // 2. Promise<GModel> 的异常处理只有在调用then的时候才会表现出来
      // 区分依赖检测的方式，await形式则以finally中为准，FIX: 异步场景下依赖一直在变化
      if (isPromise(value)) {
        (value as any)
          .then(() => {
            dynamicDetectDeps && context.updateDeps(id, deps)
          })
          .catch(error => {
            dynamicDetectDeps && context.updateDeps(id, deps)
          })
        // 要及时更新
        cacheValue.value = value
      } else {
        dynamicDetectDeps && context.updateDeps(id, deps)
        if (error) {
          cacheValue.value = new NullTag()
        } else {
          cacheValue.value = value
        }
      }
    }

    if (error) {
      cacheValue.vaild = false
    }
    if (throwError && error) {
      throw error
    } else {
      return {
        deps,
        error,
      }
    }
  }
  function getCacheValue() {
    return cacheValue.value
  }
  const { deps, error } = detect(false)
  if (error && ![ComputeErrorType.DepsNotReady, ComputeErrorType.DepsError].includes((error as CustomError).errorType) ) {
    throw error
  }
  return {
    getCacheValue,
    removeCacheValue: () => {
      detect()
    },
    id,
    deps: deps,
    fireWhenDepsUpdate: id => {
      cacheValue.vaild = false
      // // 动态依赖监测,获取每次依赖完成的时机，在这个时机需要去更新依赖内容
      // mutators.deleteCache();
      // // 依赖更新需要重新计算数据
      // mutators.checkAndUpdateDeps();
    },
    reaction: context => {
      const { next, error: errorFn, skip } = context
      let value: any
      const execute = value => reaction(value, { next, skip, error: errorFn })
      try {
        if (isNullTag(cacheValue.value) || !cacheValue.vaild) {
          detect()
        }
        // 通过cache中的数据获取结果
        value = getCacheValue()
        cacheValue.vaild = true
        if (value instanceof Promise) {
          value.then(execute).catch(errorFn)
        } else {
          execute(value)
        }
      } catch (error) {
        errorFn(error)
      }
    },
  }
}

export function initStateAndStatus(context: RdxStore, reactionInfo?: IRdxTask<any>, taskEventType: TaskEventTriggerType = TaskEventTriggerType.TriggerByTaskInit) {
  const { getCacheValue, id } = reactionInfo
  const isSync = checkValueIsSync(context, getCacheValue())
  if (isSync) {
    // 设置初始化的值，所有依赖项都可以直接获取到，可以直接计算出结果值
    context.updateState(id, ActionType.Update, TargetType.TaskState, getCacheValue(), false)
    context.markIDeal(id)
    // 1. 初始化的时候 2.compute通过load来加载的时候
    // 下游依赖的话，一定会先加载这个compute，所以初始化的时候不需要通知下游
    // 数据改变
    context.batchDepsChange(
      [{
        key: id,
        downStreamOnly: true,
        valid: true
      }],
      taskEventType,
      // fromKey,
    )
  } else {
    context.markWaiting(id)
    context.batchDepsChange(
      [{
        key: id,
        downStreamOnly: false,
        valid: true
      }],
      taskEventType,
    )
  }
}
