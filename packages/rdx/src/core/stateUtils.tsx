import React, { useMemo, useRef } from 'react'
import { ActionType, IRdxTask, Status, TargetType } from '../types/base'
import {
  isRdxInstance,
  RdxState,
  RdxStateAndReference,
  RdxValue,
  RdxValueReadOnly,
  RdxValueReference,
} from '../types/rdxBaseTypes'
import { compute } from '../RdxValues/RdxCompute/compute'
import { isPromise } from '../utils/base'
import { DEFAULT_VALUE } from '../hooks/base'
import { atom } from '../RdxValues/rdxAtom'
import { RdxStore } from './RdxStore'
import { createReactionInfo, getAtomFamilyPrefix, singleInstanceFactory } from '../RdxValues'
import { TaskEventTriggerType } from '../types/dataPersistType'
import { checkValueIsSync } from '../RdxValues/core'
export function waitForNone() {}

export type UnwrapRdxValue<T> = T extends RdxValue<infer R> ? R : never

function concurrentRequests(getRecoilValue, deps) {
  const results = Array(deps.length).fill(undefined)
  const exceptions = Array(deps.length).fill(undefined)
  for (const [i, dep] of deps.entries()) {
    try {
      results[i] = getRecoilValue(dep)
    } catch (e) {
      // exceptions can either be Promises of pending results or real errors
      exceptions[i] = e
    }
  }
  return [results, exceptions]
}

function unwrapDependencies(dependencies) {
  return Array.isArray(dependencies)
    ? dependencies
    : Object.getOwnPropertyNames(dependencies).map(key => dependencies[key])
}

function wrapResults(dependencies: any, results) {
  return Array.isArray(dependencies)
    ? results
    : // Object.getOwnPropertyNames() has consistent key ordering with ES6
      Object.getOwnPropertyNames(dependencies).reduce((out, key, idx) => ({ ...out, [key]: results[idx] }), {})
}

export type TMixedRdxStateAndReference =
  | RdxStateAndReference<any>
  | RdxStateAndReference<any>[]
  | { [key: string]: RdxStateAndReference<any> }
export type TMixedRdxValue = RdxValue<any> | RdxValue<any>[] | { [key: string]: RdxValue<any> }
export function isRdxValueCanSetter(value: RdxValue<any>) {
  return value instanceof RdxState || value instanceof RdxValueReference
}

export function isRdxValueReference<T extends RdxValue<any>>(value: T) {
  return value instanceof RdxState || value instanceof RdxValueReference
}
export function isError(exp) {
  return exp != null && !isPromise(exp)
}
function getIdsAndTag<T extends TMixedRdxValue>(dependencies: T) {
  let id = [] as string[]
  let tag
  if (isRdxInstance(dependencies)) {
    id = [(dependencies as RdxState<any>).getId()]
    tag = 'single'
  } else if (Array.isArray(dependencies)) {
    tag = 'array'
    id = (dependencies as any).map(item => item.getId())
  } else {
    tag = 'map'
    id = Object.keys(dependencies).map(item => dependencies[item].getId())
  }
  return {
    id,
    tag,
  }
}
export function waitForAll<T extends TMixedRdxValue>(
  dependencies: T,
): T extends RdxValue<infer P>
  ? RdxValueReadOnly<P>
  : RdxValueReadOnly<
      {
        [P in keyof T]: UnwrapRdxValue<T[P]>
      }
    > {
  const { id, tag } = getIdsAndTag(dependencies)
  const newId = `waitForAll/${tag}-${JSON.stringify(id)}`
  let preResults = []
  let cacheResults;
  return getInstance(newId, () => compute({
    id: newId,
    get: ({ get }) => {
      if (isRdxInstance(dependencies)) {
        return get(dependencies as RdxState<any>)
      } else {
        let newStates = unwrapDependencies(dependencies)
        const [results, exceptions] = concurrentRequests(get, newStates)
        if (exceptions.every(exp => exp === null || exp === undefined)) {
          
          if(results.every((item, index) => item === preResults[index])) {
            return cacheResults
          } else {
            const currentResult = wrapResults(dependencies, results)
            // 缓存
            cacheResults = currentResult 
            preResults = results
            return currentResult
          }
          
          return 
        }
        const error = exceptions.find(isError)
        if (error != null) {
          throw error
        }
      }
    },
  }) as any) 
}

export function toPromise<GState extends RdxValue<any>>(state: GState) {}

export function takeLast<GState extends RdxValue<any>>(
  state: GState,
  nums: number = 1,
): RdxValueReadOnly<InferRdxModel<GState>[]> {
  const id = `previous/${state.getId()}`

  return new RdxState<any>({
    id: id,
    virtual: true,
    load: (context: RdxStore) => {
      let values = []
      return createReactionInfo(context, {
        id,
        get: ({ get }) => {
          get(state)
          // 兼容默认值情况，初始化的时候如果不是异步的数据，是不会走reaction的
          return [get(state)]
        },
        reaction: (v, { next, skip, error }) => {
          if (values.length === nums) {
            values.pop()
          }

          next([v[0], ...values])
        },
      })
    },
  }) as any
}
type InferRdxModel<GState> = GState extends RdxValue<infer P> ? P : any
export function distinctUntilChanged<GState extends RdxValue<any>>(
  state: GState,
  comparator: (preValue: InferRdxModel<GState>, nextValue: InferRdxModel<GState>) => boolean,
): RdxValueReadOnly<InferRdxModel<GState>> {
  const id = `distinctUntilChanged/${state.getId()}`
  return getInstance(
    id,
    () =>
      new RdxState<any>({
        id: id,
        virtual: true,
        load: (context: RdxStore) => {
          let preValue
          return createReactionInfo(context, {
            id,
            get: ({ get }) => {
              return get(state)
            },
            reaction: (v, { next, skip, error }) => {
              if (comparator(preValue, v)) {
                skip(v)
              } else {
                preValue = v
                next(v)
              }
            },
          })
        },
      }) as any,
  )
}

export function waitForAny() {}

export function noWait() {}

export function isLoading(status: Status) {
  return status === Status.Running || status === Status.Waiting
}
export function getIdsFromDependencies(props: TMixedRdxStateAndReference) {
  let ids = [] as string[]
  if (props instanceof RdxState || props instanceof RdxValueReference) {
    ids = [props.getId()]
  } else if (Array.isArray(props)) {
    ids = props.map(item => item.getId())
  } else {
    ids = Object.keys(props).map(key => props[key].getId())
  }
  return ids
}
const { getInstance } = singleInstanceFactory()
export function waitForRegExp(reg: RegExp) {
  const id = 'waitForRegExp-' + reg
  return getInstance(
    id,
    () =>
      new RdxState<any>({
        id: id,
        virtual: true,
        load: (context: RdxStore) => {
          return {
            ...createReactionInfo(context, {
              dynamicDetectDeps: false,
              id,
              get: () => {
                return Array.from(context.getTasks().keys())
                  .filter(item => reg.test(item))
                  .reduce((root, item) => {
                    root[item] = context.getTaskStateById(item)
                    return root
                  }, {})
              },
            }),
            deps: [reg] as any,
          }
        },
      }),
  )
}

export function waitForFamilyChange(atomFn: (params: any) => RdxState<any>) {
  const blockId = `${(atomFn as any).__familyId}`
  const id = 'waitForFamilyChange/' + blockId
  // getAtomFamilyPrefix()
  const rule = new RegExp(`^${blockId}`)
  return getInstance(
    id,
    () =>
      new RdxState<any>({
        id: id,
        virtual: true,
        load: (context: RdxStore) => {
          return {
            ...createReactionInfo(context, {
              dynamicDetectDeps: false,
              id,
              get: () => {
                return Array.from(context.getTasks().keys())
                  .filter(item => rule.test(item))
                  .reduce((root, item) => {
                    root[JSON.parse(item.replace(new RegExp(`^${blockId}`), ''))] = context.getTaskStateById(item)
                    return root
                  }, {})
              },
            }),
            deps: [rule] as any,
          }
        },
      }),
  )
}

export function waitForSetter<T extends TMixedRdxValue>(
  dependencies: T,
  options: {
    // 首次是否触发
    triggerFirst?: boolean
    // 当重置的时候，是否调用set方法
    callSetWhenReset?: boolean
  } = {},
): T extends RdxValue<infer P>
  ? RdxState<P>
  : RdxState<
      {
        [P in keyof T]: UnwrapRdxValue<T[P]>
      }
    > {
  const { triggerFirst = true, callSetWhenReset = true } = options
  const { id, tag } = getIdsAndTag(dependencies)
  const waitStatesCompute = waitForAll(dependencies)
  // 第一次需要展示loading
  // 第二次不应该展示loading

  const controlId = `waitForSetter_Control/${tag}-${id}`
  const setterId = `waitForSetter/${tag}-${id}`

  const scopeAtom = getInstance(controlId, () =>
    atom({
      id: controlId,
      virtual: true,
      defaultValue: null,
    }),
  )
  // * 这里主要是对于依赖的控制, 初始化之后，清空依赖。
  // * reset后，设置全量依赖
  return getInstance(
    setterId,
    () => new RdxState({
      id: setterId,
      virtual: true,
      load: context => {
        return {
          virtual: true,
          ...createReactionInfo(context, {
            id: setterId,
            get: ({ get }) => {
              if (get(scopeAtom) === null && triggerFirst) {
                return get(waitStatesCompute)
              } else {
                return get(scopeAtom)
              }
            },
            reaction: (v, { next, skip, error }) => {
              // 获取完数据更新依赖
              context.updateDeps(setterId, [scopeAtom.getId()])
              next(v)
            },
          }),
          next: (id, newValue) => {
            if (newValue === DEFAULT_VALUE) {
              // 重置是否要直接发起请求，如果需要触发，则将依赖重置为全部依赖
              if (callSetWhenReset) {
                context.updateDeps(setterId, [scopeAtom.getId(), ...getIdsFromDependencies(dependencies as any)])
              }
              context.batchReset(getIdsFromDependencies(dependencies as any))
            } else {
              context.batchNext(scopeAtom.getId(), context.getTaskStateById(waitStatesCompute.getId()))
            }
          },
        }
      },
    }) as any,
  )
}
