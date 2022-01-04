import { RdxStore } from '../core/RdxStore'
import { initStateAndStatus } from '../RdxValues/RdxCompute/utils'
import { IRdxTask } from './base'

export enum RdxNodeType {
  Atom = 'atom',
  Compute = 'compute',
  Mixed = 'mixed',
  ComputeFamily = 'computeFamily',
  Reaction = 'reaction',
}

export interface IRdxBaseState {
  id: string
  type?: RdxNodeType
  virtual?: boolean
  load?: (context: RdxStore) => IRdxTask<any>
  init?: (context: RdxStore, reactionInfo?: IRdxTask<any>, fromKey?: string) => void
}

export class RdxBase {
  id: string
  type?: RdxNodeType
  virtual?: boolean
  _load?: (context: RdxStore) => IRdxTask<any>
  _init?: (context: RdxStore, reactionInfo?: IRdxTask<any>, fromKey?: string) => void
  constructor(config: IRdxBaseState) {
    this.id = config.id
    this.type = config.type
    this._load = config.load
    this._init = config.init
  }

  load(context: RdxStore, fromKey?: string) {
    if (this._load) {
      const taskInfos = this._load(context)
      context.addOrUpdateTask(this.getId(), taskInfos)
      if (this._init) {
        this._init(context, taskInfos, fromKey)
      } else {
        initStateAndStatus(context, taskInfos)
      }

      // return true
    } else {
      throw new Error('不能加载只读节点' + this.getId())
    }
  }

  getType() {
    return this.type
  }
  getId() {
    return this.id
  }
  setId(id: string) {
    this.id = id
  }
}
export interface IRdxNodeLifeCycle {
  load(context: RdxStore): void
}

export class RdxValueReference<GModel> extends RdxBase {
  _tag: 'RdxValueReference'

  constructor(config: IRdxBaseState) {
    super(config)
  }
}

export class RdxValueReadOnly<GModel> extends RdxBase {
  _tag: 'RdxValueReadOnly'
  constructor(config: IRdxBaseState) {
    super(config)
  }
}
export type RdxStateAndReference<GModel> = RdxState<GModel> | RdxValueReference<GModel>
export type RdxValue<GModel> = RdxState<GModel> | RdxValueReadOnly<GModel> | RdxValueReference<GModel>

export function isRdxInstance<G extends any>(state: G) {
  if (state instanceof RdxState || state instanceof RdxValueReference || state instanceof RdxValueReadOnly) {
    return state
  }
}
export function rdxState<GModel>(config: { id: string }) {
  const instance = new RdxValueReference<GModel>(config)
  return instance
}

let atoms = new Map<string, any>()
/**
 * 基础节点
 */
export class RdxState<GModel> extends RdxBase {
  // 和RdxValueReadOnly进行区分
  _tag: 'RdxState'
  constructor(config: IRdxBaseState) {
    super(config)
    if (atoms.has(config.id)) {
      // console.error(`${config.id}节点重复声明了！！！`)
    }
    atoms.set(config.id, this)
  }
}

export type TPath<GModel> = RdxValue<GModel>
export type ValueOrUpdater<GModel> = ((preValue: GModel) => GModel) | GModel

export type RdxGet = <GModel>(node: TPath<GModel>) => GModel
export type RdxHas = <GModel>(node: TPath<GModel>) => boolean

export type RdxSet = <GModel>(node: TPath<GModel>, value: ValueOrUpdater<GModel>) => void
export type RdxReset = <GModel>(node: RdxState<GModel>) => void

export type get = <ISource, IPath>(node: IPath) => ISource[]

export function refrence(id) {
  return new RdxState({ id })
}
