import { RdxStore } from '../core/RdxStore';
import { DefaultValue } from '../hooks/base';
import { RdxState, ValueOrUpdater } from '../types/rdxBaseTypes';
import { Base } from './core';

export type MapObject<T> = { [key: string]: T | null };

export interface RdxContextProps {
  // context的名称，通过定义改名称，可以方便的借助rdxDevTool进行调试
  name?: string;
  children?: React.ReactNode;
  withStore?: (store: RdxStore) => void;
  initializeStateNew?: (options: {
    set: <T extends any>(instance: RdxState<T>, value: ValueOrUpdater<T>) => void;
    reset: <T extends any>(instance: RdxState<T>) => void;
  }) => void
  /**
   * @deprecated 已过期，等待表单迁移后将要干掉
   *
   * @type {MapObject<any>}
   * @memberof RdxContextProps
   */
  initializeState?: MapObject<any>;
  onChange?: (state: MapObject<any>) => void;
  onLoading?: () => void;
  // 开启预加载
  preLoading?: boolean;
  createStore?: (data: any) => Base<any>;
  debuggerLog?: boolean;
}
