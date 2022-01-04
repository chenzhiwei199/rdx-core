import { RdxStore } from '../../core/RdxStore';
import { DefaultValue } from '../../hooks/base';
import {
  IRdxBaseState,
  RdxGet,
  RdxHas,
  RdxReset,
  RdxSet,
} from '../../types/rdxBaseTypes';
import { DataModel } from '../types';

/**
 * @export
 * @interface IRdxComputeOperate
 * @template IModel
 */
export interface IRdxComputeReadOnly<GModel> {
  get: IRdxComputeGet<GModel>;
}
export interface IRdxComputeWriteOperate<GModel> {
  get: IRdxComputeGet<GModel>;
  set?: IRdxComputeSet<GModel>;
}

/**
 * @export
 * @interface IRdxComputeOperate
 * @template IModel
 */
export interface IRdxComputeOperateWithValue<GModel> {
  get: (config: IRdxComputeGetParamsWithValue<GModel>) => DataModel<GModel>;
  set?: IRdxComputeSet<GModel>;
}
// export type IRdxComputeNodeWithValue<GModel> = IRdxBaseState &
//   IRdxComputeOperateWithValue<GModel>;
export type IRdxComputeReadOnlyState<GModel> = IRdxBaseState &
  IRdxComputeReadOnly<GModel>;
export type IRdxComputeWriteState<GModel> = IRdxBaseState &
  IRdxComputeWriteOperate<GModel>;
export interface IRdxComputeGetParams {
  id: string;
  /**
   * 当事件冲突时触发时候的回调
   *
   * @memberof ReactionContext
   */
  callbackMapWhenConflict: (callback: () => void) => void;
  get: RdxGet;
  has: RdxHas;
}
export interface IRdxComputeSetParams {
  id: string;
  get: RdxGet;
  set: RdxSet;
  has: RdxHas;
  reset: RdxReset;
}

export interface IRdxComputeGetParamsWithValue<GModel>
  extends IRdxComputeGetParams {
  id: string;
  /**
   * 当事件冲突时触发时候的回调
   *
   * @memberof ReactionContext
   */
  callbackMapWhenConflict: (callback: () => void) => void;
  value: GModel;
  get: RdxGet;
}

export type IRdxComputeGet<GModel> = (
  config: IRdxComputeGetParams,
  context: RdxStore
) => DataModel<GModel>;

export type IRdxComputeSet<GModel> = (
  config: IRdxComputeSetParams,
  newValue: GModel | DefaultValue,
  context: RdxStore
) => void;
