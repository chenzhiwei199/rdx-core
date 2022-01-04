import { RdxStore } from '../core/RdxStore';
import { DeliverOptions, IRdxDeps, IRdxTask, Status } from '../types/base';
import {
  RdxState,
  RdxValue,
  RdxValueReadOnly,
  RdxValueReference,
} from '../types/rdxBaseTypes';
import { IBaseContext } from '../types/task';

export function getId(dep: IRdxDeps) {
  if (
    dep instanceof RdxState || dep instanceof RdxValueReference || dep instanceof RdxValueReadOnly
  ) {
    return (dep as RdxValue<any>).getId();
  } else {
    return dep;
  }
}

export function getDepIds(deps: IRdxDeps[] = []) {
  return deps.map(getId);
}
export function createBaseContext<GModel>(
  id: string,
  context: RdxStore,
  defaultTaskMap?: IRdxTask<GModel>
): IBaseContext<GModel> {
  let taskInfo = context.getTaskById(id);
  taskInfo = taskInfo ? taskInfo : defaultTaskMap;
  return {
    id,
    value: context.getTaskStateById(id),
    status:
      context.getTaskStatusById(id) && context.getTaskStatusById(id).value
        ? context.getTaskStatusById(id).value
        : null,
    loading: isLoading(context, context.getTaskStatusById(id)?.value) ,
    errorMsg: (context.getTaskStatusById(id) || {}).errorMsg,
  };
}
export function createMutators(id: string, context: RdxStore) {
  return {
    next: (selfValue: any) => {
      context.batchNext(id, selfValue);
    },
    nextById: (id, selfValue) => {
      context.batchNext(id, selfValue);
    },
    // ? 这里应该加上scope， 刷新只刷新作用域下面的
    refresh: () => {
      context.refreshById(id);
    },
    loading: isLoading(context, id),
  };
}

const isLoading = (context: RdxStore, id: string) => {
  return (
    context.getTaskStatusById(id)?.value === Status.Waiting ||
    context.getTaskStatusById(id)?.value === Status.Running
  );
};
