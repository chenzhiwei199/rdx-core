import React, { useCallback, useMemo } from 'react';
import {
  compute,
  useRdxState,
  RdxContext,
  useRdxStatus,
  waitForAll,
  isLoading,
  useRdxValueLoader,
  useRdxReset,
  useRdxRefresh,
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

export const Root = () => {
  return (
    <RdxContext>
      <Counter />
    </RdxContext>
  );
};
const Counter = () => {
  const waitCompute = useMemo(
    () => waitForAll([asyncCompute, asyncCompute2]),
    []
  );
  const state = useRdxValueLoader(waitCompute);
  const reset = useRdxReset(waitCompute);
  return (
    <div style={{}}>
      {isLoading(state.status) ? (
        <div>loading...</div>
      ) : (
        <div>
          state1:state.value[0]
          <br />
          state2:state.value[1]
        </div>
      )}
      <button
        onClick={() => {
          reset();
        }}
      >
        刷新
      </button>
    </div>
  );
};
