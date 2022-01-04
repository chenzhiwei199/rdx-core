import { IRdxBaseState, RdxState, RdxValue, RdxStateAndReference, isRdxInstance } from '../types/rdxBaseTypes'
import { RdxStore } from '../core/RdxStore'
import { DataPersistType, TaskEventTriggerType } from '../types/dataPersistType'
import { ActionType, TargetType } from '../types/base'
import { normalizeValue } from '../utils/base'
import { DefaultValue, DEFAULT_VALUE, isDefaultValue } from '../hooks/base'
import { IRdxTask } from '../types/base'
import { ICollectDeps } from '../types/task'
import { UnwrapRdxValue } from '../core/stateUtils'
import { createReactionInfo, initStateAndStatus } from './RdxCompute'
import { getId } from '../utils'

export function atom<GModel>(config: IRdxAtomState<GModel>): RdxState<GModel> {
  const { id, virtual = false, defaultValue, effects } = config
  const atom = new RdxState<GModel>({
    ...config,
    virtual,
    load: (context: RdxStore) => {
      context.emit(DataPersistType.TaskLoad, `${DataPersistType.TaskLoad}-${id}`)
      const firstRef = { isFirst: true };
      let pendingSetSelf: {
        effect: IAtomEffect<GModel>
        value: GModel | DefaultValue
      } = null
      let onSetCallbacks = [] as {
        callback: AtomOnSetCallback<GModel>
        effect: any
      }[]
      let onDepsSetCallbacks = new Map<
        string,
        {
          callback: AtomOnDenpendenciesSet<any>
          deps: RdxStateAndReference<any>[]
        }[]
      >()
      let depsRdxStates = new Map<string, RdxStateAndReference<any>>()
      let collectDeps = [] as RdxStateAndReference<any>[]
      let mount = false

      const next = (id, value, depsCollects: ICollectDeps = { collect: () => {} }) => {
        const oldValue = context.getTaskStateById(id)
        if (isDefaultValue(value)) {
          // let value
          // if (isRdxInstance(defaultValue)) {
          //   value = context.getTaskStateById((defaultValue as unknown as RdxValue<any>).getId())
          // } else {
          //   value = defaultValue as Promise<any>
          // }
          // 要能设置默认值
          context.updateState(id, ActionType.Remove, TargetType.TaskState)
          context.getTaskById(id).removeCacheValue();
          // ? ?
          // context.getTaskById(id).removeCacheValue();
          initStateAndStatus(context, context.getTaskById(id), TaskEventTriggerType.Reset)
        } else {
          //  更新状态
          const newValue = normalizeValue(context.getTaskStateById(id), value)
          context.updateState(id, ActionType.Update, TargetType.TaskState, newValue)
          depsCollects.collect(id)
        }
        onSetCallbacks.forEach(({ callback, effect }) => {
          const isOldAsDefault = pendingSetSelf?.value instanceof DefaultValue
          const isNewAsDefault = value instanceof DefaultValue
          if (
            (pendingSetSelf?.value !== value || effect !== pendingSetSelf.effect) &&
            !(isOldAsDefault && isNewAsDefault)
          ) {
            callback(value, oldValue)
          }
          if (effect === pendingSetSelf?.effect) {
            pendingSetSelf = null
          }
        })
      }

      const setSelf = effect => v => {
        if (mount) {
          context.batchNext(id, oldValue => {
            const pendingValue = normalizeValue(oldValue, v)
            pendingSetSelf = {
              effect,
              value: pendingValue,
            }
            return pendingValue
          })
        } else {
          next(id, v)
        }
      }
      effects?.forEach(effect =>
        effect({
          node: atom,
          setSelf: setSelf(effect),
          resetSelf: () => {
            setSelf(effect)(DEFAULT_VALUE)
          },
          onSet: callback => {
            onSetCallbacks.push({ callback, effect })
          },
          onDependenciesSet: (callback, deps = [] as any) => {
            deps.forEach(dep => {
              depsRdxStates.set(dep.getId(), dep)
              if (onDepsSetCallbacks.has(dep.getId())) {
                onDepsSetCallbacks.get(dep.getId()).push({ callback, deps })
              } else {
                onDepsSetCallbacks.set(dep.getId(), [{ callback, deps }])
              }
            })
            collectDeps = [...collectDeps, ...deps]
          },
        }),
      )
      let cache = {
        depsValue: [],
      }

      const taskInfos: IRdxTask<GModel> = {
        next: next,
        virtual,
        ...createReactionInfo(context, {
          id,
          get: ({ id, get }) => {
            const depsKeys = Array.from(onDepsSetCallbacks.keys())
            const depsValue = depsKeys.map(key => get(depsRdxStates.get(key)))
            const diffDeps = depsKeys.filter((key, index) => depsValue[index] !== cache.depsValue[index])
            diffDeps.forEach(dep => {
              onDepsSetCallbacks.get(dep)?.forEach(({ callback, deps }) => {
                const indexs = deps.map(item => depsKeys.findIndex(depsKey => depsKey === item.getId()))
                callback(
                  indexs.map(index => depsValue[index]),
                  indexs.map(index => cache.depsValue[index]),
                )
              })
            })
            // 更新缓存 firstRef用来避免重复设置默认值 ，
            // context.getTaskStateById(id) === undefined  用来避免覆盖掉原始的数据
            // 任务不存的时候  或者 重置的时候
            if (firstRef.isFirst && context.getTaskStateById(id) === undefined) {
              let value;
              if (isRdxInstance(defaultValue)) {
                value = get(defaultValue as RdxValue<any>)
              } else {
                value = defaultValue as Promise<any>
              }
              firstRef.isFirst = true
              return value
            } else {
              return context.getTaskStateById(id)
            }
          },
          reaction: (value, { next }) => {
            if (isRdxInstance(defaultValue)) {
              // 排除依赖，默认值的依赖，只在第一次生效
              context.updateDeps(
                id,
                context.getDeps(id).filter(item => getId(item) !== getId(defaultValue as any)),
              )
            }
            next(value)
          },
        }),
      }
      mount = true

      return taskInfos
    },
  })
  return atom
}

type inferValue<T> = T extends RdxValue<infer P>
  ? P
  : {
      [P in keyof T]: UnwrapRdxValue<T[P]> | DefaultValue
    }
type AtomOnSetCallback<T> = (newValue: T | DefaultValue, oldValue: T | DefaultValue) => void
type AtomOnDenpendenciesSet<T> = (value: inferValue<T>, preValue: inferValue<T>) => void
// 处理状态同步
export type IAtomEffect<T> = (effect: {
  // A reference to the atom itself
  node: RdxState<T>
  // trigger: 'get' | 'set' | 'depsSet'; // The action which triggered initialization of the atom
  // Callbacks to set or reset the value of the atom.
  // This can be called from the atom effect function directly to initialize the
  // initial value of the atom, or asynchronously called later to change it.
  setSelf: (v: T | DefaultValue | Promise<T | DefaultValue> | ((v: T | DefaultValue) => T | DefaultValue)) => void
  resetSelf: () => void
  // Subscribe to changes in the atom value.
  // The callback is not called due to changes from this effect's own setSelf().
  onSet: (callback: AtomOnSetCallback<T>) => void
  onDependenciesSet: <T extends RdxStateAndReference<any>[]>(
    callback: AtomOnDenpendenciesSet<T>,
    dependencies: T,
  ) => void
}) => void | (() => void)
export interface IRdxAtomState<GModel> extends IRdxBaseState {
  virtual?: boolean
  defaultValue: GModel | Promise<GModel> | RdxValue<GModel>
  effects?: IAtomEffect<GModel>[]
}
