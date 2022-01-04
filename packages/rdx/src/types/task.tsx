import { RdxStore } from '../core/RdxStore';
import { NotifyPoint } from '../graph';
import { DeliverOptions, Status, TNext } from './base';

export interface IInteractiveStatus {
  /**
   * 当模块的状态为Status.Running 或者 Status.Waiting的时候，loading为true
   */
  loading: boolean;
  /**
   * 当前模块的状态
   */
  status: Status;
  /**
   * 当前模块的错误信息
   */
  errorMsg?: string;
}

export interface IBaseContext<GModel> extends IInteractiveStatus {
  /**
   * 模块唯一id
   */
  id: string;
  /**
   * 当前模块的数据
   */
  value: GModel;
}

export interface IReactionContext<GModel>  {
  /**
   * 当事件冲突时触发时候的回调
   *
   * @memberof ReactionContext
   */
  callbackMapWhenConflict: (callback: () => void) => void;
  /**
   * 更新数据的方法
   */
  // updateState: (v: GModel) => void;
  /**
   * 停止任务，并且不执行下游，并且任务不会重复利用
   */
  // close: () => void;
  /**
   * 下一步
   */
  next: (v: any) => void
  error: (v: any) => void
  skip: () => void
}

/**
 *  返回的数据信息
 */
export type InteractiveContext<GModel> = IBaseContext<GModel> &
  IMutators<GModel>;
export type ASYNC_TASK<GModel> = (
  taskInfo: IReactionContext<GModel>
) => Promise<GModel>;
export type SYNC_TASK<GModel> = (taskInfo: IReactionContext<GModel>) => void;
export type MixedTask<GModel> = SYNC_TASK<GModel>;

export interface IRdxReactionProps<GModel> {
  getValue?: () => any
  setValue?: (payload: any) => void
  removeValue?: () => void
  removeCacheValue: () => any
  getCacheValue: () => any
  /**
   * 依赖数据更新时的，重新进行依赖检测，依赖改变后，产出的新依赖可能会不同。
   * 如果依赖的值不可信任，即将要改变，那么应该抛弃
   * @memberof IRdxReactionProps
   */
  fireWhenDepsUpdate?: (depsId: string[]) => void;
  /**
   * 响应式函数
   *
   * @memberof IBase
   */
  reaction?: MixedTask<GModel>;
  /**
   * 数据改变的处理函数
   *
   * @memberof IRdxReactionProps
   */
  next?: (
    id: string,
    value: GModel,
    mutators?: ICollectDeps
  ) => void;
}

export interface IMutators<GModel> {
  /**
   * 更新当前模块的数据，并调用当前模块以及下游模块的响应函数
   */
  refresh: (value?: GModel) => void;
  /**
   * 更新当前模块的数据，并调用下游模块的响应函数
   */
  next: TNext<GModel>;
  /**
   * 更新当前模块的数据，并调用下游模块的响应函数
   */
  nextById: (id: string, value: GModel, options?: DeliverOptions) => void;
}

export interface ICollectDeps {
  collect: ICollectFunction;
}

export type ICollectFunction = (key: string) => void;
