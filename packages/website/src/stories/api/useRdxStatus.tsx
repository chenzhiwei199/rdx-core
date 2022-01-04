import React from 'react';
import {
  compute,
  useRdxState,
  RdxContext,
  useRdxStatus,
  useRdxValue,
} from '@alife/rdx';
const pause = (t: number) => new Promise((resolve) => setTimeout(resolve, t));
const asyncCompute = compute({
  id: 'asyncCompute',
  get: async () => {
    await pause(2000);
    return '延迟2s的数据';
  },
});

const asyncCompute2 = compute({
  id: 'asyncCompute22222',
  get: async () => {
    await pause(4000);
    return '延迟4s的数据';
  },
});

const errorCompute = compute({
  id: 'errorCompute',
  get: async () => {
    await pause(3000);
    throw new Error('错误状态的例子');
  },
});

export const Root = () => {
  return (
    <RdxContext>
      <Counter />
    </RdxContext>
  );
};
const Counter = () => {
  const mutator = useRdxStatus();
  const mutator2 = useRdxStatus();
  const state1 = useRdxValue(asyncCompute, mutator);
  const state2 = useRdxValue(asyncCompute2, mutator);
  const state3 = useRdxValue(errorCompute, mutator2);
  return (
    <div style={{}}>
      <div>
        <strong>Error state</strong>
        {mutator2.isAnyError()
          ? mutator2.getErrors().map((item) => item.msg)
          : mutator2.isAnyPending()
          ? '加载中。。。'
          : state3}
      </div>
      <div>
        <strong>Parial state</strong>
        <div>
          加载数据1:{mutator.isPending(asyncCompute) ? '加载中' : state1}
        </div>
        <div>
          加载数据2:{mutator.isPending(asyncCompute2) ? '加载中' : state2}
        </div>
      </div>
      <div>
        <strong>isAnyPending</strong>
        {mutator.isAnyPending() ? (
          '加载中...'
        ) : (
          <div>
            <div>加载数据1:{state1}</div>
            <div>加载数据2:{state2}</div>
          </div>
        )}
      </div>
      <button
        onClick={() => {
          mutator.refresh();
          mutator2.refresh();
        }}
      >
        刷新
      </button>
    </div>
  );
};
