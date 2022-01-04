import React from 'react';
import {
  useRdxSetter,
  RdxContext,
  useRdxState,
  compute,
  useRdxStateLoader,
  useRdxValueLoader,
  useRdxRefresh,
  isLoading,
} from '@alife/rdx';

const pause = (t: number) => new Promise((resolve) => setTimeout(resolve, t));
const AsyncCompute = compute({
  id: 'atom',
  get: async () => {
    await pause(1000);
    return 1;
  },
});

export const Root = () => {
  return (
    <RdxContext>
      <AsyncComponent />
    </RdxContext>
  );
};

const AsyncComponent = () => {
  const state = useRdxValueLoader(AsyncCompute);
  const refresh = useRdxRefresh(AsyncCompute);
  return (
    <span
      style={{
        display: 'inline-flex',
        justifyContent: 'space-around',
      }}
    >
      <span>{isLoading(state.status) ? '加载中...' : state.content}</span>
      <button
        onClick={() => {
          refresh();
        }}
      >
        刷新
      </button>
    </span>
  );
};
