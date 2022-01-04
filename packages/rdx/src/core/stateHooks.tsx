import React, { useRef, useEffect, useState, useContext, useCallback, useLayoutEffect } from 'react'
import { RdxStateContext, RdxStore } from './RdxStore'
import { RdxState, RdxValue, RdxValueReadOnly, RdxValueReference } from '../types/rdxBaseTypes'
import { getId, createBaseContext, createMutators } from '../utils/taskUtils'
import { useForceUpdate } from './hookUtils'
import { getIdsFromDependencies, isLoading, TMixedRdxStateAndReference } from './stateUtils'
import { compute } from '../RdxValues/RdxCompute/compute'

import { TaskStatus, Status, StateUpdateType, TNext, LoaderValue } from '../types/base'
import { batchUpdate } from '../utils/base'
import { InteractiveContext } from '../types/task'
import { useMemo } from 'react'
import { usePrevious } from '../hooks/base'

export interface IStatusHelper {
  // 任意一个关联的RdxNode处于Status.Running 或者Status.Waiting的时候,返回true，反之返回false
  isAnyPending: () => boolean
  // 获取当前的state是不是出于等待状态。
  isPending: (state: RdxValue<any>) => boolean
  // 任意一个关联的RdxNode处于Status.Error 的时候,返回true，反之返回false
  isAnyError: () => boolean
  // 任意一个关联的RdxNode处于Status.Running 或者Status.Waiting的时候,返回Status.Running,
  // 任意一个关联的RdxNode处于Status.Error 的时候,返回Status.Error
  // 所有关联的RdxNode加载完成的时候，返回Status.IDeal
  getStatus: () => Status
  refresh: () => void
  // 当任意一个关联的RdxNode处于Status.Error状态的时候，getErrors会返回所有的错误信息，否则返回null
  getErrors: () => { id: string; msg: string }[] | null
  _mount: (id) => void
}

export function getStatusKey(id: string, stateUpdateType: StateUpdateType) {
  return id + '----' + stateUpdateType
}
export function useRdxStateContext() {
  return useContext(RdxStateContext)
}

export function createInteractiveContext<GModel>(id: string, currentContext: RdxStore) {
  const data: InteractiveContext<GModel> = {
    ...createBaseContext(id, currentContext),
    ...createMutators(id, currentContext),
  }
  return data
}
export function createInteractiveStateUpdate<GModel>(
  id: string,
  context: RdxStore,
): [LoaderValue<GModel>, TNext<GModel>] {
  const data = createInteractiveContext<GModel>(id, context)
  return [
    {
      content: data.value,
      status: data.status,
      errorMsg: data.errorMsg,
    },
    data.next,
  ]
}

export function useRefrence<T extends any>(v: T) {}
const defaultShouldUpdate = () => true
export function useRdxRenderById(options: {
  id: string
  type: StateUpdateType
  context: RdxStore
  shouldUpdate?: (state) => boolean
}) {
  const { id, type, context, shouldUpdate = defaultShouldUpdate } = options
  function getValue() {
    return type === StateUpdateType.ReactionStatus ? context.getTaskStatusById(id) : context.getTaskStateById(id)
  }
  const [state, setState] = useState<TaskStatus>(getValue())
  const preId = usePrevious(id)
  const forceUpdate = useForceUpdate()
  // 是否绑定
  const isMount = useRef(false)
  // 是否需要更新数据
  // 处理当任务为promise 微任务的时候，useEffect 执行可能比promise.then更加慢，那么就获取不到更新数据的信息。
  // 1. 组件先渲染，用的旧数据，
  // 2. 调度任务处理完了， 发出通知
  // 3. 再绑定事件 这个糟糕的情况
  // const updateWhenStateUpdate = useRef(false);
  // const isAfterQuickPromise = useRef(false);
  const eventKey = getStatusKey(id, type)
  const listenerRef = useRef<any>()

  // render => quick promise => effect => promise
  useMemo(() => {
    // ! off的函数传undefine会把eventname相关的订阅都干掉的
    listenerRef.current && context.getEventEmitter().off(eventKey, listenerRef.current)
    const listener = () => {
      const value = getValue()

      // 如果已经mount，那就直接更新
      if ((shouldUpdate ? shouldUpdate(value) : true) && isMount.current === true) {
        // ! 当value是个组件的时候，直接setState会变成 setState(v => v)的形式，导致组件直接执行了。
        setState(typeof value === 'function' ? () => value : value)
        // 当用户使用useRdxValue和computeFamily的时候，由于computeFamily会生成一个新的atom，但是原来的数据状态还保留了，
        // 这个时候，当状态设置的和之前一样，就不会触发rerender
        //    if (
        //   id.includes(`waitForAll/map-["chartViewByChart-`) &&
        //   id.includes(`22`) &&
        //   !id.includes(`1122`) &&
        //   !id.includes('2222') &&
        //   !id.includes(`8cc68422-d4c8-11eb-bcde-c5c041866a96`)
        // ) {
        //   console.log(
        //     'hahah',
        //     id,
        //     state,
        //     value,
        //     state === value
        //   )
        // }
        if (preId && preId !== id) {
          forceUpdate()
        }
      }
    }

    context.getEventEmitter().on(eventKey, listener)
    listenerRef.current = listener
  }, [id, shouldUpdate, context])

  // context变化了，要重新绑定
  useEffect(() => {
    isMount.current = true
    // 当mount之前收到数据跟新的消息，那么mount之后要更新数据。
    return () => {
      context.getEventEmitter().off(eventKey, listenerRef.current)
      isMount.current = false
    }
  }, [id, context, shouldUpdate])

  useEffect(() => {
    // context.batchChange
    context.batchChange()
  }, [state, id])
  return
}

// export function createRdxHooks(provider = DefaultContext) {

//   // =======================================基础hooks=========================================================
//   return {
//     // useRdxAtom,
//     // useRdxAtomLoader,
//     // useRdxCompute,
//     // useRdxComputeLoader,
//     useRdxSetterLazy,
//     useRdxStateLoaderByContext,
//     useStatusUpdateById,
//     pendingCompute,
//     useStatusUpdateByRegExp,
//     useRdxContext,
//     useRdxNodeBinding,
//     useRdxGlboalState,
//     useGlobalVirtualStateUpdate,
//     useRdxGlobalContext,
//     useRdxStateBindingCallback,
//     createInteractiveStateUpdate,
//     useRdxState,
//     useRdxValue,
//     useRdxStateLoader,
//     useRdxValueLoader,
//     createInteractiveContext,
//     // useRdxValueByDependencies,
//     useRdxSetter,
//     useRdxReset,
//     useRdxLoading,
//     useRdxStatus,
//     useRdxRefresh,
//   }
// }

// const defaultHooks = createRdxHooks(DefaultContext)
// export const useRdxAtom = defaultHooks.useRdxAtom;
// export const useRdxAtomLoader = defaultHooks.useRdxAtomLoader;
// export const useRdxCompute = defaultHooks.useRdxCompute;
// export const useRdxComputeLoader = defaultHooks.useRdxComputeLoader;
// export const useRdxGlboalState = defaultHooks.useRdxGlboalState
// export const useStatusUpdateById = defaultHooks.useStatusUpdateById
// export const useRdxStateLoaderByContext = defaultHooks.useRdxStateLoaderByContext
// export const useGlobalVirtualStateUpdate = defaultHooks.useGlobalVirtualStateUpdate
// export const useRdxState = defaultHooks.useRdxState
// export const useRdxValue = defaultHooks.useRdxValue
// export const useRdxStateLoader = defaultHooks.useRdxStateLoader
// export const useRdxValueLoader = defaultHooks.useRdxValueLoader
// // export const useRdxValueByDependencies = defaultHooks.useRdxValueByDependencies;
// export const useRdxSetter = defaultHooks.useRdxSetter
// export const useRdxNodeBinding = defaultHooks.useRdxNodeBinding
// export const useRdxStatus = defaultHooks.useRdxStatus
// export const useRdxReset = defaultHooks.useRdxReset
// export const useRdxRefresh = defaultHooks.useRdxRefresh
// export const useRdxContext = defaultHooks.useRdxContext
// export const useStatusUpdateByRegExp = defaultHooks.useStatusUpdateByRegExp
// export const pendingCompute = defaultHooks.pendingCompute
// export const useRdxStateBindingCallback = defaultHooks.useRdxStateBindingCallback
// export const useRdxSetterLazy = defaultHooks.useRdxSetterLazy

export const useRdxContext = () => {
  return useRdxStateContext()
}
export function useRdxLoading() {
  const context = useRdxContext()
  useGlobalStateUpdate()
  useTriggerTaskScheduleUpdate()
  return () => context.taskScheduler.isRunning()
}

export function useGlobalStateUpdate() {
  const context = useRdxContext()
  const [state, setState] = useState<any>({})
  useEffect(() => {
    const listener = () => {
      setState(context.getAllTaskState())
    }
    context.getEventEmitter().on(StateUpdateType.GlobalState, listener)
    return () => {
      context.getEventEmitter().removeListener(StateUpdateType.GlobalState, listener)
    }
  }, [])
  return state
}
export function useGlobalVirtualStateUpdate() {
  const context = useRdxContext()
  const [state, setState] = useState<any>({})
  useEffect(() => {
    const listener = () => {
      setState(context.getVirtualTaskState())
    }
    context.getEventEmitter().on(StateUpdateType.GlobalState, listener)
    return () => {
      context.getEventEmitter().removeListener(StateUpdateType.GlobalState, listener)
    }
  }, [])
  return state
}

export function useTriggerTaskScheduleUpdate() {
  const context = useRdxContext()
  const forceUpdate = useForceUpdate()
  useEffect(() => {
    const listener = () => {
      forceUpdate()
    }
    context.getEventEmitter().on(StateUpdateType.TriggerTaskSchedule, listener)
    return () => {
      context.getEventEmitter().removeListener(StateUpdateType.TriggerTaskSchedule, listener)
    }
  }, [])
}

export function useStatusUpdateByRegExp(template: RegExp) {
  const context = useRdxContext()
  const forceUpdate = useForceUpdate()
  const bindKeys = context.getValidTaskKeys().filter(key => {
    return key.match(template)
  })
  useEffect(() => {
    const listener = () => {
      forceUpdate()
    }
    bindKeys.forEach(key => {
      const eventKey = getStatusKey(key, StateUpdateType.State)
      context.getEventEmitter().addListener(eventKey, listener)
    })

    return () => {
      bindKeys.forEach(key => {
        const eventKey = getStatusKey(key, StateUpdateType.ReactionStatus)
        context.getEventEmitter().removeListener(eventKey, listener)
      })
    }
  }, [bindKeys])
}

export function useStatusUpdateById(id: string) {
  const context = useRdxContext()
  useRdxRenderById({
    id,
    type: StateUpdateType.ReactionStatus,
    context,
  })
}

export function useRdxStateBindingCallback<GModel>() {
  const context = useRdxContext()
  if (!context.getTaskStateById) {
    throw new Error('使用rdx的组件必须为rdxContext子孙组件')
  }
  return (props: RdxState<GModel>) => {
    if (!context.hasTask(props.getId())) {
      props.load(context)
    }
  }
}
export function useLoadTask<GModel>(props: RdxState<GModel> | RdxValueReadOnly<GModel>) {
  // 1. 初始化的时候根据atom 默认值类型判断是否是异步任务，判断是否要重跑任务
  // 2. 根据get是否是异步任务，判断是否需要重跑任务
  const context = useRdxContext()
  if (!context.getTaskStateById) {
    throw new Error('使用rdx的组件必须为rdxContext子孙组件')
  }
  // id不变，只注册一次，注册节点
  // id不变，有可能是卸载，也有可能是新载入，如何判断是卸载还是新载入
  if (!context.hasTask(props.getId())) {
    props.load(context)
  }
}

/**
 * 绑定rdxNode到context中, 并绑定状态了状态
 * @param state
 * @param subscribe 是否订阅
 */
export function useRdxNodeBinding<GModel>(
  state: RdxValue<GModel>,
  subscribe: boolean = true,
  context: RdxStore,
  shouldUpdate?: (state: GModel) => boolean,
): InteractiveContext<GModel> {
  if (!state) {
    throw new Error('引用的rdx状态节点不可用')
  }
  const currentContext = context
  const [errorMsg, setErrorMsg] = useState('')
  const [_, forceRender] = useState(0)
  let loadSuccess = currentContext && currentContext.hasTask(state.getId())

  if (subscribe) {
    useRdxRenderById({
      id: state.getId(),
      type: StateUpdateType.State,
      shouldUpdate,
      context: currentContext,
    })
  }
  // ! 这里为什么 useRdxRenderById 不能放到useLoadTask后面，一放就报hooks length不对的错误
  if (state instanceof RdxState || state instanceof RdxValueReadOnly) {
    useLoadTask(state)
  } else if (state instanceof RdxValueReference) {
    // throw new Error(`引用节点不能加载`)
  } else if (!currentContext.hasTask(state)) {
    throw new Error(`未找到id为${state}的节点`)
  }

  

  useEffect(() => {
    // 初始化渲染树结束还没有找到，就认为是有问题
    if (!loadSuccess && state instanceof RdxValueReference) {
      if (!currentContext) {
        setErrorMsg('rdx-form的context加载失败')
      } else if (!currentContext.hasTask(state.getId())) {
        setErrorMsg(state.getId() + '尚未加载！！！')
      } else {
        batchUpdate(() => forceRender(state => state + 1))
      }
    }
  }, [])
  if (!loadSuccess && state instanceof RdxValueReference) {
    const result: InteractiveContext<GModel> = {
      id: state.getId(),
      value: null,
      status: Status.Waiting,
      loading: true,
      errorMsg: errorMsg,
      next: () => {
        throw new Error(state.getId() + '未初始化')
      },
      nextById: () => {
        throw new Error(state.getId() + '未初始化')
      },
      refresh: () => {
        throw new Error(state.getId() + '未初始化')
      },
    }
    return result
  } else {
    return createInteractiveContext<GModel>(state.getId(), currentContext)
  }
}

export function useRdxGlobalContext() {
  const context = useRdxContext()
  useGlobalStateUpdate()
  return {
    taskState: context.getAllTaskState(),
    virtualTaskState: context.getVirtualTaskState(),
  }
}
export function useRdxGlboalState() {
  return useGlobalStateUpdate()
}
// =======================================基础hooks=========================================================

export function useRdxStatus(): IStatusHelper {
  const forceUpdate = useForceUpdate()
  const context = useRdxStateContext()
  const bindsRef = useRef<Map<string, () => void>>(new Map())
  useEffect(() => {
    return () => {
      Array.from(bindsRef.current.keys()).forEach(id => {
        const eventKey = getStatusKey(id, StateUpdateType.State)
        context.getEventEmitter().removeListener(eventKey, bindsRef.current.get(id))
      })
    }
  }, [])
  // 加载中  异常  finish
  const getStatus = useCallback(() => {
    const ids = Array.from(bindsRef.current.keys())
    const isError = ids.some(key => context.getTaskStatusById(key).value === Status.Error)
    const isLoading = ids.some(
      key =>
        context.getTaskStatusById(key).value === Status.Waiting ||
        context.getTaskStatusById(key).value === Status.Running,
    )
    const errors = ids.map(key => ({
      id: key,
      msg: context.getTaskStatusById(key).errorMsg,
    }))
    return {
      status: isError ? Status.Error : isLoading ? Status.Running : Status.IDeal,
      errors,
    }
  }, [])
  const isAnyError = () => {
    return getStatus().status === Status.Error
  }
  return {
    isAnyPending: () => {
      return getStatus().status === Status.Running
    },
    isAnyError,
    isPending: state => {
      return (
        context.getTaskStatusById(state.getId()).value === Status.Running ||
        context.getTaskStatusById(state.getId()).value === Status.Waiting
      )
    },
    refresh: () => {
      const ids = Array.from(bindsRef.current.keys())
      ids.forEach(id => {
        context.refreshById(id)
      })
    },
    _mount: id => {
      const eventKey = getStatusKey(id, StateUpdateType.ReactionStatus)
      if (!bindsRef.current.has(eventKey)) {
        const listener = () => {
          forceUpdate()
        }
        context.getEventEmitter().on(eventKey, listener)
        bindsRef.current.set(id, listener)
      }
    },
    getStatus: () => getStatus().status,
    getErrors: () => (isAnyError() ? getStatus().errors : null),
  }
}
export function useRdxState<GModel>(
  props: RdxState<GModel> | RdxValueReference<GModel>,
  options: {
    mutators?: IStatusHelper
    shouldUpdate?: (state: GModel) => boolean
  } = {},
): [GModel, TNext<GModel>, InteractiveContext<GModel>] {
  const { mutators, shouldUpdate } = options
  const context = useRdxNodeBinding<GModel>(props, true, useRdxContext(), shouldUpdate)
  mutators && mutators._mount(props.getId())
  return [context.value, context.next, context]
}

export function useRdxSetter<GModel>(props: RdxState<GModel> | RdxValueReference<GModel>) {
  const context = useRdxNodeBinding<GModel>(props, false, useRdxContext())
  return context.next
}

export function useRdxSetterLazy<GModel>() {
  const context = useRdxContext()
  return (props: RdxState<GModel> | RdxValueReference<GModel>, newValue: GModel) => {
    props.load(context)
    context.batchNext(props.getId(), newValue)
  }
}

export function useRdxReset(props: TMixedRdxStateAndReference) {
  const context = useRdxContext()
  return () => {
    context.batchReset(getIdsFromDependencies(props))
  }
}

export function useRdxRefresh<GModel>(props: RdxValue<GModel>) {
  const context = useRdxNodeBinding<GModel>(props as any, false, useRdxContext())
  return () => context.refresh()
}
export function useRdxStateLoader<GModel>(
  node: RdxState<GModel> | RdxValueReference<GModel>,
): [LoaderValue<GModel>, TNext<GModel>] {
  useStatusUpdateById(node.getId())
  const context = useRdxNodeBinding<GModel>(node, true, useRdxContext())
  return [
    {
      status: context.status,
      content: context.value,
      errorMsg: context.errorMsg,
    },
    context.next,
  ]
}
export function useRdxStateLoaderByContext<GModel>(
  node: RdxState<GModel>,
  context: RdxStore,
): [LoaderValue<GModel>, TNext<GModel>] {
  const innerContext = useRdxNodeBinding<GModel>(node, true, context, undefined)
  useStatusUpdateById(node.getId())
  return [
    {
      status: innerContext.status,
      content: innerContext.value,
      errorMsg: innerContext.errorMsg,
    },
    innerContext.next,
  ]
}

type CallbackInterface = {
  // snapshot: Snapshot,
  // gotoSnapshot: Snapshot => void,
  set: <T extends any>(state: RdxState<T>, newValue: ((T) => T) | T) => void
  reset: <T extends any>(state: RdxState<T>) => void
}

// export function useRdxCallback<Args extends ReadonlyArray<unknown>, Return extends any>(
//   callback: (callbackInstance: CallbackInterface) => (...args: Args) => Return,
//   deps?: any[]
//   ):  (...args: Args) => Return{
//     const storeRef = useStoreRef();
//     const gotoSnapshot = useGotoRecoilSnapshot();

//     return useCallback(
//       (...args): Return => {
//         function set<T>(
//           recoilState: RecoilState<T>,
//           newValueOrUpdater: (T => T) | T,
//         ) {
//           setRecoilValue(storeRef.current, recoilState, newValueOrUpdater);
//         }

//         function reset<T>(recoilState: RecoilState<T>) {
//           setRecoilValue(storeRef.current, recoilState, DEFAULT_VALUE);
//         }

//         // Use currentTree for the snapshot to show the currently committed state
//         const snapshot = cloneSnapshot(storeRef.current);
//         let ret = SENTINEL;
//         batchUpdates(() => {
//           const errMsg =
//             'useRecoilCallback expects a function that returns a function: ' +
//             'it accepts a function of the type (RecoilInterface) => T = R ' +
//             'and returns a callback function T => R, where RecoilInterface is an ' +
//             'object {snapshot, set, ...} and T and R are the argument and return ' +
//             'types of the callback you want to create.  Please see the docs ' +
//             'at recoiljs.org for details.';
//           if (typeof fn !== 'function') {
//             throw new Error(errMsg);
//           }
//           // flowlint-next-line unclear-type:off
//           const cb = (fn: any)({set, reset, snapshot, gotoSnapshot});
//           if (typeof cb !== 'function') {
//             throw new Error(errMsg);
//           }
//           ret = cb(...args);
//         });
//         invariant(
//           !(ret instanceof Sentinel),
//           'batchUpdates should return immediately',
//         );
//         return (ret: Return);
//       },
//       deps != null ? [...deps, storeRef] : undefined, // eslint-disable-line fb-www/react-hooks-deps
//     );
// }
export function useRdxValue<GModel>(
  node: RdxValue<GModel>,
  options: {
    shouldUpdate?: (state: GModel) => boolean
    mutators?: IStatusHelper
  } = {},
): GModel {
  const { mutators, shouldUpdate } = options
  let context = useRdxNodeBinding<GModel>(node as any, true, useRdxContext(), shouldUpdate)
  mutators && mutators._mount(getId(node as any))
  return context.value
}

export function useRdxValueLoader<GModel>(node: RdxValue<GModel>): LoaderValue<GModel> {
  const context = useRdxNodeBinding<GModel>(node as any, true, useRdxContext())
  useStatusUpdateById(node.getId())
  return {
    status: context.status,
    content: context.value as any,
    errorMsg: context.errorMsg,
  }
}

/**
 *
 * 构造出一个Compute，默认为loading状态，通过setValue通知节点加载完成，通过setLoading可以将节点设置
 * 为loading状态
 * @export
 * @param {{ id: string }} config
 * @returns
 */
function pendingCompute(config: { id: string }) {
  const { id } = config
  // 第二次之后的更新，还需要触发brider进行更新
  const customResolve = React.useRef(null)
  const computeInstance = compute({
    id: id,
    get: async () => {
      const promise = new Promise(resolve => {
        customResolve.current = resolve
      })
      return await promise
    },
  })
  const state = useRdxValueLoader(computeInstance)
  const refresh = useRdxRefresh(computeInstance)
  return {
    setValue: value => {
      if (isLoading(state.status)) {
        customResolve.current(value)
      } else {
        refresh()
        customResolve.current(value)
      }
    },
    setLoading: () => {
      refresh()
    },
  }
}
