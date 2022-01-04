import { getChlidFieldInfo, getEmptyValue } from '../../utils/functions';
import { RdxValue, useRdxContext } from '../../hooks/rdxStateFormHooks';
import { useFormId } from '../../utils/base';
import { BaseType } from '../Forms/types';
import {
  enocdeIdByStateType,
  EFormStateType,
  decodeIdByStateType,
  getValidateKeys,
} from '../Forms';
export interface IArrayMutators {
  // 新增一个
  push: (newValue: any) => void;
  // 最前面新增一个
  unshift: (newValue: any) => void;
  // 移除最前面一个
  shift: () => void;
  // 移除最后一个
  pop: () => void;
  // 插入一个
  insert: (index: number, newValue: any) => void;
  // 下移
  moveDown: (index: number) => void;
  // 上移
  moveUp: (index: number) => void;
  // 移除一个
  remove: (index: number) => void;
  // 移除全部
  clear: () => void;
  // 交换位置
  move: (preIndex: number, nextIndex: number) => void;
  // 获取空数据
  getEmptyValue: () => any;
}
export function createArrayMutators(onChange: any, children): IArrayMutators {
  // 1. 删除数据
  // 2. 通知下游依赖节点更新
  const id = useFormId();
  const context = useRdxContext();
  const getValue = () => {
    return context.getTaskStateById(id) || ({} as any) || [];
  };
  const fieldDefine = getChlidFieldInfo(children);

  function getRule(index) {
    const isObject = fieldDefine.type === BaseType.Object;
    // 字符串数组 a.1
    // 对象数组   a.1 a.1.b
    const rule =
      isObject || fieldDefine.type === BaseType.Array
        ? new RegExp(`(^${id}.${index}\.(.+))|(^${id}.${index}$)`)
        : new RegExp(`^${id}.${index}$`);
    return rule;
  }
  function getValidKeys(index) {
    const rule = getRule(index);
    const vaildKeys = Array.from(context.getTasks().keys()).filter((key) =>
      rule.test(key)
    );
    return vaildKeys;
  }
  function batchMoveForward(formIndex: number) {
    for (
      let tempIndex = formIndex;
      tempIndex < getValue().length - 1;
      tempIndex++
    ) {
      move(tempIndex, tempIndex + 1);
    }
  }
  function batchMoveBackward(formIndex: number) {
    for (
      let tempIndex = getValue().length ;
      tempIndex > formIndex;
      tempIndex--
    ) {
      console.log('tempIndex: ', tempIndex - 1, tempIndex, );
      move(tempIndex - 1, tempIndex);
    }
  }
  function removeTaskStateByKeys(index) {
    // 从小到大清理，所以后倒序
    getValidKeys(index)
      .reverse()
      .forEach((key) => {
        context.removeTask(key);
        context.removeTask(enocdeIdByStateType(key, EFormStateType.Error));
        context.removeTask(
          enocdeIdByStateType(key, EFormStateType.ValueIntercepter)
        );
        context.removeTask(enocdeIdByStateType(key, EFormStateType.Status));
        context.removeTask(enocdeIdByStateType(key, EFormStateType.EditState));
        context.removeTask(enocdeIdByStateType(key, EFormStateType.Compute));
      });
    context.removeTask(`${id}.${index}`);
  }
  function getTaskStateByIndex(index) {
    return getValidKeys(index)
      .reverse()
      .reduce(
        (root, key) => {
          const keys = [
            key,
            enocdeIdByStateType(key, EFormStateType.Status),
            enocdeIdByStateType(key, EFormStateType.EditState),
            // enocdeIdByStateType(key, EFormStateType.Error),
            // enocdeIdByStateType(key, EFormStateType.ValueIntercepter),
            // enocdeIdByStateType(key, EFormStateType.Compute),
          ];
          keys.forEach((currentKey) => {
        
            root.tasks[currentKey] = context.getTaskById(
              currentKey
            );
            root.rdxStates[currentKey] = root.tasks[currentKey] = context.getTaskById(
              currentKey
            ).node;
            root.states[currentKey] = context.getTaskStateById(currentKey);
            root.status[currentKey] = context.getTaskStatusById(currentKey);
            root.cacheValues[currentKey] = context.getTaskById(
              currentKey
            ).getCacheValue();
          });
          return root;
        },
        {
          cacheValues: {} as Record<string, any>,
          status: {} as Record<string, any>,
          rdxStates: {} as Record<string, any>,
          tasks: {} as Record<string, any>,
          states: {} as Record<string, any>,
        }
      );
  }

  function replaceIdByIndex(key, newIndex) {
    const { type, id: decodeId, alias } = decodeIdByStateType(key);
    const ids = id.split('.');
    const decodeIds = decodeId.split('.');
    const newId = [...ids, newIndex, ...decodeIds.slice(ids.length + 1)].join(
      '.'
    );
    return enocdeIdByStateType(newId, type as any, alias);
  }
  function applyTaskAndStatus(
    state: {
      rdxStates: Record<string, RdxValue<any>>;
      states: Record<string, any>;
      status: Record<string, any>;
      cacheValues: Record<string, any>;
      tasks: Record<string, any>;
    },
    newIndex: string
  ) {
    Object.keys(state.rdxStates).forEach((key) => {
      const newKey = replaceIdByIndex(key, newIndex);
      // 1.=======更新cache
      // context.setCacheComputeValueById(newKey, state.cacheValues[key]);
      // 2.=======更新task
      // 获取缓存的compute
      // const compute = state.rdxStates[key];
      // 更新id
      // compute.setId(newKey);
      // context.addOrUpdateRdxState(compute);
      // 3.=======更新state
      console.log('state.tasks[key]: ', state.tasks[key]);
      if(state.tasks[key].virtual) {
        context.setVirtualTaskStateById(newKey, state.states[key]);
      } else {
        context.setTaskStateById(newKey, state.states[key]);
      }
      // 4.=======更新status
      context.setTaskStatusById(newKey, state.status[key]);
      
      
    });

  }
  function notifyDownStreams(startIndex, endIndex) {
    let keys = [] as string[];
    for (let index = startIndex; index < endIndex; index++) {
      keys = keys.concat(getValidKeys(index));
    }
    context.batchDepsChangeAtOnce(
      keys.map((item) => ({ key: item, downStreamOnly: true })), 'array-update'
    );
  }
  const move = (preIndex, nextIndex) => {
    // cache状态
    const preState = getTaskStateByIndex(preIndex);
    const nextState = getTaskStateByIndex(nextIndex);
    // 移除旧状态
    removeTaskStateByKeys(preIndex);
    removeTaskStateByKeys(nextIndex);
    // 切换为新状态
    applyTaskAndStatus(preState, nextIndex);
    applyTaskAndStatus(nextState, preIndex);
  };
  const remove = (index) => {
    // 1. 更新数据
    // 2. 通知下游
    batchMoveForward(index);
    removeTaskStateByKeys(getValue().length - 1);
    // -1 是因为删了一个
    // notifyDownStreams(index, getValue().length - 1);
    onChange(getValue().slice(0, getValue().length - 1));
    // 1. 考虑removeTaskStateByKeys的时机，否则会新增，或者修改set的代码
    // 2. compute、error、valueIntercept等compute被移除了，没法生成了
    // 3. cache dirty等状态要切换
    // 4. useLoadTask不能一直加载，否则当组件卸载的时候又加载了
    // 5. 超过两个的时候，删除有问题
  };
  const clear = () => {
    for(let index = 0; index < getValue().length ; index++) {
      removeTaskStateByKeys(index);
    }
    onChange([]);
  };
  const moveUp = (index) => {
    if (index - 1 < 0) {
      return;
    }
    move(index - 1, index);
    onChange([...getValue()])
  };
  const moveDown = (index) => {
    if (index + 1 > getValue().length) {
      return;
    }
    move(index, index + 1);
    onChange([...getValue()])
  };
  // 后面插入一个
  const push = (newValue: any) => {
    // getEmptyValue(fieldDefine)
    onChange([...getValue(), newValue]);
  };
  // 前面插入一个
  const unshift = (newValue: any) => {
    batchMoveBackward(0);
    // 交换位置后第一个是无效的
    onChange([newValue, ...getValue().slice(1)]);
  };

  // 前面移除一个
  const shift = () => {
    batchMoveForward(0);
    onChange(getValue().slice(0,getValue().length - 1));
  };
  // 后面移除一个
  const pop = () => {
    removeTaskStateByKeys(getValue().length - 1);
    onChange(getValue().slice(0, getValue().length - 1));
  };

  const insert = (index: number, newValue: any) => {
    batchMoveBackward(index);
    onChange([
      ...getValue().slice(0, index),
      newValue,
      ...getValue().slice(index+1),
    ]);
  };

  return {
    getEmptyValue: () => {
      return getEmptyValue((children as React.ReactElement).props);
    },
    insert,
    unshift,
    shift,
    push,
    remove,
    pop,
    moveDown,
    moveUp,
    clear: clear,
    move: (preIndex, nextIndex) => {
      move(preIndex, nextIndex)
      notifyDownStreams(preIndex, nextIndex + 1);
    },
  };
}
