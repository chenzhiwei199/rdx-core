import React from 'react';
import {
  compute,
  RdxContext,
  useRdxStateLoader,
  atom,
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
  set: ({ set }, newValue) => {
    set(state, newValue);
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
  const [state, setState] = useRdxStateLoader(asyncCompute);
  return (
    <div style={{}}>
      <div>{isLoading(state.status) ? '加载中...' : state.content}</div>
      <button
        onClick={() => {
          setState(state.content + 10);
        }}
      >
        +10
      </button>
    </div>
  );
};
