import { RdxStore } from '../core/RdxStore';
import {
  RdxState,
  RdxValueReadOnly,
  RdxValueReference,
} from '../types/rdxBaseTypes';
import { DataModel } from './types';
import { isPromise } from '../utils';

/**
 *
 * 判断当前的value是否是同步的值
 * @export
 * @template GModel
 * @param {RdxStore} context
 * @param {DataModel<GModel>} value
 * @returns
 */
export function checkValueIsSync<GModel>(
  context: RdxStore,
  value: DataModel<GModel>
) {
  // nullTag的情况认为数据没有加载好
  if(isNullTag(value)) {
    return false
  }
  // promise数据
  if (isPromise(value)) {
    return false;
  } else if (
    value instanceof RdxState ||
    value instanceof RdxValueReadOnly ||
    value instanceof RdxValueReference
  ) {
    // 保证节点的加载
    if (!context.hasTask(value.getId())) {
      value.load(context);
    }
    // 通过判断依赖节点的加载状态来确定是否是同步的
    if (context.isTaskReady(value.getId())) {
      return true;
    } else {
      return false;
    }
  } else {
    // 静态数据
    return true;
  }
}

export class NullTag {}

export function isNullTag(value) {
  return value instanceof NullTag;
}

export function getSyncValue<GModel>(
  context: RdxStore,
  value: DataModel<GModel>
) {
  if (value instanceof RdxState) {
    return context.getTaskStateById(value.getId());
  } else {
    return value;
  }
}
