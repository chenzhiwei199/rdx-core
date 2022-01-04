import {
  IRdxBaseState,
  RdxState,
  RdxValue,
  RdxStateAndReference,
} from '../types/rdxBaseTypes';
import { RdxStore } from '../core/RdxStore';
import {
  DataPersistType,
} from '../types/dataPersistType';
import { ActionType,  TargetType } from '../types/base';
import {  normalizeValue } from '../utils/base';
import { DefaultValue, isDefaultValue } from '../hooks/base';
import {  IRdxTask } from '../types/base';
import { ICollectDeps } from '../types/task';
import { UnwrapRdxValue } from '../core/stateUtils';
import { createReactionInfo, initStateAndStatus } from './RdxCompute';



// 期望的用法
// 原子状态 & 衍生状态
// 设置数据的方式，维护一个store
// 所有的衍生状态，会关联结构化状态

export function struct<GModel>(config: IRdxAtomState<GModel>): RdxState<GModel> {
  const { id, virtual = false, defaultValue } = config
  const atom = new RdxState<GModel>({
    ...config,
    virtual,
    load: (context: RdxStore) => {
      context.emit(
        DataPersistType.TaskLoad,
        `${DataPersistType.TaskLoad}-${id}`
      );
      const next = (
        id,
        value,
        depsCollects: ICollectDeps = { collect: () => {} }
      ) => {
        if (isDefaultValue(value)) {
          initStateAndStatus(context, context.getTaskById(id))
        } else {
          //  更新状态
          const newValue = normalizeValue(context.getTaskStateById(id), value);
          context.updateState(
            id,
            ActionType.Update,
            TargetType.TaskState,
            newValue
          );
          depsCollects.collect(id);
        }
      };
  
      let first = true
      
      const taskInfos: IRdxTask<GModel> = {
        next: next,
        virtual,
        ...createReactionInfo(context, {
          id,
          get: ({ id, get }) => {
            // 更新缓存
            if(first) {
              return (defaultValue as Promise<any>)
            } else {
              return context.getTaskStateById(id)
            }
          },
          reaction: (value, { next} ) => {
            next(value)
          }
        })
      };
  
      return taskInfos
    }
  });
  return atom;
}

type inferValue<T> = T extends RdxValue<infer P>
  ? P
  : {
      [P in keyof T]: UnwrapRdxValue<T[P]> | DefaultValue;
    };
type AtomOnSetCallback<T> = (
  newValue: T | DefaultValue,
  oldValue: T | DefaultValue
) => void;
type AtomOnDenpendenciesSet<T> = (value: inferValue<T>, preValue: inferValue<T>) => void;
// 处理状态同步
export type IAtomEffect<T> = (effect: {
  // A reference to the atom itself
  node: RdxState<T>;
  // trigger: 'get' | 'set' | 'depsSet'; // The action which triggered initialization of the atom
  // Callbacks to set or reset the value of the atom.
  // This can be called from the atom effect function directly to initialize the
  // initial value of the atom, or asynchronously called later to change it.
  setSelf: (
    v:
      | T
      | DefaultValue
      | Promise<T | DefaultValue>
      | ((v: T | DefaultValue) => T | DefaultValue)
  ) => void;
  resetSelf: () => void;
  // Subscribe to changes in the atom value.
  // The callback is not called due to changes from this effect's own setSelf().
  onSet: (callback: AtomOnSetCallback<T>) => void;
  onDependenciesSet: <T extends RdxStateAndReference<any>[]>(
    callback: AtomOnDenpendenciesSet<T>,
    dependencies: T
  ) => void;
}) => void | (() => void);
export interface IRdxAtomState<GModel> extends IRdxBaseState {
  virtual?: boolean;
  defaultValue: GModel | Promise<GModel> | RdxState<GModel>;
  effects?: IAtomEffect<GModel>[];
}

