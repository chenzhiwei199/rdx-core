import React from 'react';
import {
  compute,
  RdxContext,
  useRdxStateLoader,
  Status,
  atom,
  useRdxValue,
  useRdxValueLoader,
  useRdxReset,
  useRdxRefresh,
  isLoading,
} from '@alife/rdx';
const pause = (t: number) => new Promise((resolve) => setTimeout(resolve, t));
const state = atom({
  id: 'atom',
  defaultValue: 10,
});
const asyncCompute = compute({
  id: 'asyncCompute',
  get: async ({ get }) => {
    await pause(2000);
    return get(state);
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
  const state = useRdxValueLoader(asyncCompute);
  const reset = useRdxRefresh(asyncCompute);
  return (
    <div style={{}}>
      <div>{isLoading(state.status) ? '加载中...' : state.content}</div>
      <button
        onClick={() => {
          reset();
        }}
      >
        重置
      </button>
    </div>
  );
};
