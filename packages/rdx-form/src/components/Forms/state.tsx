import {
  rdxState,
  RdxStore,
  waitForAll,
  TNextValue,
  compute,
  getStatusKey,
  StateUpdateType,
  TMixedRdxValue,
  RdxStateAndReference,
  UnwrapRdxValue,
} from '@alife/rdx'
import { createValidator } from '../../hooks/formHooks'
import { TStringPathResolver, TModelResult, IComponents, TFormStatus, IViewModel, TResult, TGetByStringPath } from './types'
import { enocdeIdByStateType, EFormStateType, computeState2FormState } from './utils'
import { v1 as uuid } from 'uuid'
// - subscribeValue 订阅数据改变 (id | ids ) => { //callback}
// - subscribeStatus 订阅状态改变 (id | ids ) => { //callback}
// - emit 提交数据变更 (id | ids) => { //callback}
// - reset 重置数据状态为默认状态
// - getValues 获取最新的数据状态

export function createFormStore<GSource, GComponents extends IComponents>(initState: any) {
  return new FormStore<GSource, GComponents>(initState)
}

// GComponentType extends keyof GComponents,  GComponents extends IComponents
export class FormStore<GSource extends Record<string, any>, GCompoonentPropss extends IComponents> {
  context: RdxStore
  subscribeMap: Map<
    string,
    Map<
      Function,
      {
        computeId: string
        emCallback: () => void
      }
    >
  > = new Map()
  globalSubscribeSet: Set<Function> = new Set()
  _initState: any
  constructor(initState = {}) {
    this._initState = initState
  }
  setValue<T extends any>(value: RdxStateAndReference<T>, newValue: T): void {
    return this.context.batchNext(value.getId(), newValue)
  }
  getComputeState(): GSource {
    return computeState2FormState((this.context.getTaskState() as any).store, this.context.getVirtualTaskState())
  }
  getState(): GSource {
    return this.context.getAllTaskState()
  }
  _initContext(context) {
    this.context = context
  }
  subscribeAll(callback: (v: GSource) => void) {
    this.globalSubscribeSet.add(callback)
    this.context.getEventEmitter().addListener(StateUpdateType.GlobalState, () => {
      if (this.globalSubscribeSet.has(callback)) {
        callback && callback(this.getComputeState() as any)
      }
    })
  }
  unsubscribeAll(callback: (v: GSource) => void) {
    this.globalSubscribeSet.delete(callback)
  }
  // 订阅
  subscribe<T extends TMixedRdxValue>(states: T, callback: (value: UnwrapRdxValue<T>) => void) {
    const waitCompute = waitForAll(states)
    const computeId = `subscribe/${uuid()}`
    const emCallback = () => {
      callback && callback(this.context.getTaskStateById(computeId))
    }
    if (!this.subscribeMap.has(waitCompute.getId())) {
      const m = new Map()
      m.set(callback, {
        computeId,
        emCallback: emCallback,
      })
      this.subscribeMap.set(waitCompute.getId(), m)
    } else {
      this.subscribeMap.get(waitCompute.getId()).set(callback, {
        computeId,
        emCallback: emCallback,
      })
    }

    const subscribeCompute = compute({
      id: computeId,
      get: ({ get }) => {
        return get(waitCompute)
      },
    })
    subscribeCompute.load(this.context)
    this.context.getEventEmitter().addListener(getStatusKey(computeId, StateUpdateType.State), emCallback)
  }

  // 取消订阅
  unsubscribe<T extends TMixedRdxValue>(states: T, callback: Function) {
    const waitCompute = waitForAll(states)
    if (this.subscribeMap.has(waitCompute.getId())) {
      if (callback) {
        const { computeId, emCallback } = this.subscribeMap.get(waitCompute.getId()).get(callback) || {}
        this.context.getEventEmitter().removeListener(getStatusKey(computeId, StateUpdateType.State), emCallback)
        this.context.removeTask(computeId)
      } else {
        Array.from(this.subscribeMap.get(waitCompute.getId()).values()).forEach(item => {
          this.context
            .getEventEmitter()
            .removeListener(getStatusKey(item.computeId, StateUpdateType.State), item.emCallback)
          this.context.removeTask(item.computeId)
        })
      }
    }
  }

  // 重置为默认值
  reset<GPath extends TStringPathResolver<GSource>>(id: GPath) {}

  // 设置数据
  setFormValue<GPath extends TStringPathResolver<GSource>>(id: GPath, newValue: TNextValue<TResult<GSource, GPath>>) {
    // 批量更新的逻辑
    this.context.batchNext(id as string, newValue)
  }

  // 设置数据
  setFormStatus<GComponentType extends keyof GCompoonentPropss>(
    id: TStringPathResolver<GSource>,
    newValue: TNextValue<TFormStatus<GCompoonentPropss[GComponentType]>>,
  ) {
    const newId = id as string
    // 批量更新的逻辑
    this.context.batchNext(enocdeIdByStateType(newId, EFormStateType.Status), newValue)
  }

  // 设置数据
  setFormCompute<GPath extends TStringPathResolver<GSource>, GComponentType extends keyof GCompoonentPropss>(
    id: TStringPathResolver<GSource>,
    newValue: TNextValue<IViewModel<TModelResult<GSource, GPath>, GCompoonentPropss[GComponentType]>>,
  ) {
    const newId = id as string
    // 批量更新的逻辑
    this.context.batchNext(enocdeIdByStateType(newId, EFormStateType.Compute), newValue)
  }

  // 校验
  async validate(id?: TStringPathResolver<GSource> | TStringPathResolver<GSource>[]) {
    return await createValidator<GSource>(this.context)(id)
  }
}
