import { NodeStatus } from '../graph/types';
import { RdxNodeType, RdxState, RdxValue } from './rdxBaseTypes';
import { IRdxReactionProps } from './task';

export type Status = NodeStatus;
export const Status = { ...NodeStatus };

export interface TaskStatus {
  value: NodeStatus;
  errorMsg?: string;
}

export interface DeliverOptions {
  refresh?: boolean;
}

export type IRdxDeps = string  | RegExp;

/**
 * cache的数据结构
 */
export interface ICacheValue<GModel> {
  value: GModel | Promise<GModel> | RdxState<GModel>;
  initDeps: IRdxDeps[];
}

export interface IRdxTask<GModel> extends IRdxReactionProps<GModel> {
  node?: RdxState<any>
  // 状态是否记录
  virtual?: boolean;
  /**
   * 模块的唯一id
   *
   * @type {string}
   * @memberof IBase
   */
  id: string;
  /**
   * 模块依赖的id列表
   *
   * @type {string[]}
   * @memberof IBase
   */
  deps?: IRdxDeps[];
  /**
   * 默认的Model
   *
   * @type {GModel}
   * @memberof IBase
   */
  defaultValue?: GModel;
}

/**
 * 状态订阅标志
 */
export enum StateUpdateType {
  ReactionStatus = 'ReactionStatus',
  GlobalState = 'GlobalState',
  State = 'State',
  TriggerTaskSchedule = 'TriggerTaskSchedule',
}

/**
 * hooks返回数据结构
 */
export interface LoaderValue<GModel> {
  status: NodeStatus;
  content?: GModel;
  errorMsg?: string;
}

export type TNextValueCallback<GModel> = (oldValue: GModel) => GModel;
export type TNextValue<GModel> = GModel | TNextValueCallback<GModel>;
export type TNext<GModel> = (
  value?: TNextValue<GModel>,
  options?: DeliverOptions
) => void;

export type TRdxUseStateReturn<GModel> = [LoaderValue<GModel>, TNext<GModel>];
export enum ActionType {
  Update = 'update',
  Remove = 'remove',
  Merge = 'merge',
}

export enum TargetType {
  TasksMap = 'tasks',
  TaskState = 'taskState',
  Trigger = 'trigger',
  CustomAction = 'customAction',
  TaskStatus = 'taskStatus',
  CancelMap = 'cancelMap',
}
