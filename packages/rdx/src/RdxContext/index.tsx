import * as React from 'react'
import { RdxStateContext, initValue, RdxStore } from '../core/RdxStore'
import { RdxContextProps } from './interface'
import { BaseObject } from './core'
import { StateUpdateType, TaskEventTriggerType } from '../types'
import ScheduleBatcher from './ScheduleBatcher'
import { DEFAULT_VALUE } from '../hooks/base'
import { v1 as uuid } from 'uuid'
// import { DataPersistenceHook } from '../DataPersist'
export * from './core'
export * from './interface'
export const RdxContextRuntimeInfo = React.createContext<{ contextId: string }>(null)
const Rdx = (props: RdxContextProps) => {
  const {
    initializeState = {},
    initializeStateNew = () => {},
    onChange = () => {},
    onLoading = () => {},
    name,
    preLoading,
    withStore,
    createStore,
    debuggerLog,
  } = props
  // 如果initializeState为undefined, 则需要替换状态， 否则不需要
  // 创建store
  function createTaskState(value: any) {
    return createStore ? createStore(initializeState) : new BaseObject(initializeState)
  }

  const unmount = React.useRef(false)
  // context下保留不变的store
  const store = React.useRef(
    new RdxStore(
      {
        ...initValue(),
        name,
        virtualTaskState: new BaseObject({}),
        taskState: createTaskState(initializeState),
      },
      {
        preLoading,
        debuggerLog,
      },
    ),
  )
  React.useMemo(() => {
    withStore && withStore(store.current)
    let collectDirtys = []
    initializeStateNew({
      set: (atom, newValue) => {
        if (!store.current.hasTask(atom.getId())) {
          atom.load(store.current)
        }
        store.current.innerNext(atom.getId(), newValue, {
          collect: id => {
            collectDirtys.push(id)
          },
        })
      },
      reset: atom => {
        if (!store.current.hasTask(atom.getId())) {
          atom.load(store.current)
        }
        store.current.innerNext(atom.getId(), DEFAULT_VALUE, {
          collect: id => {
            collectDirtys.push(id)
          },
        })
      },
    })
    // set的时候的加载顺序，是宿主先注册，执行get，然后加载依赖项，执行get，所以需要触发依赖变更，通知下游重新计算
    collectDirtys.length > 0 && store.current.batchDepsChange(collectDirtys, TaskEventTriggerType.Set)
  }, [])
  // 绑定批量更新方法
  store.current.setChangeCallback(v => {
    // 卸载之后就不触发
    if (!unmount.current) {
      store.current.getEventEmitter().emit(StateUpdateType.GlobalState)
      onChange(v)
    }
  })
  store.current.setLoadingCallback(() => {
    onLoading()
  })

  // withRef && (withRef.current = store.current);
  let copyState = store.current.getAllTaskState()
  React.useEffect(() => {
    store.current.parentMounted = true

    // 执行初始化任务
    // store.current.batchExecuteTask(
    //   Array.from(store.current.getNotifyQueue()),
    //   TaskEventTriggerType.BatchReactionOnMount
    // );
    // store.current.getNotifyQueue().clear();

    // 初始化状态和后续状态不一样，则触发onChange
    if (copyState !== store.current.getAllTaskState() && !store.current.taskScheduler.isRunning()) {
      onChange(store.current.getAllTaskState())
    }
    return () => {
      unmount.current = true
    }
  }, [])
  return (
    <RdxStateContext.Provider value={store.current}>
      <RdxContextRuntimeInfo.Provider value={{ contextId: React.useMemo(() => uuid(), [])}}>
        <DevTool shareContext={RdxStateContext} />
        {props.children}
        <ScheduleBatcher storeRef={store.current} />
      </RdxContextRuntimeInfo.Provider>
    </RdxStateContext.Provider>
  )
}

const DevTool = (props: { shareContext?: React.Context<RdxStore> }) => {
  // DataPersistenceHook(props.shareContext)
  return <></>
}
export const RdxContext = Rdx
