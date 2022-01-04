import React, { useCallback, useMemo } from 'react';
import {
  compute,
  RdxContext,
  isLoading,
  useRdxValueLoader,
  waitForTrigger,
  Status,
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
      <LoadData />
      <LoadData2 />
      <QueryResult />
      <Preview />
    </RdxContext>
  );
};
const waitForTriggerOne = waitForTrigger([asyncCompute, asyncCompute2], false);
const LoadData = () => {
  const value = useRdxValueLoader(asyncCompute);
  return <div>{isLoading(value.status) ? '加载中...' : value.content}</div>;
};

const LoadData2 = () => {
  const value = useRdxValueLoader(asyncCompute2);
  return <div>{isLoading(value.status) ? '加载中...' : value.content}</div>;
};
const Preview = () => {
  const value = useRdxValueLoader(waitForTriggerOne.compute);
  const { loading: isLoading } = waitForTriggerOne.triggerOperates();
  // 如何判断筛选项处于加载中，且之前设置过值了
  return (
    <div>
      <strong>展示数据：</strong>
      {isLoading() && value.status !== Status.IDeal
        ? '加载中'
        : JSON.stringify(value.content)}
    </div>
  );
};
const QueryResult = () => {
  const { submit, reset } = waitForTriggerOne.triggerOperates();
  return (
    <div style={{}}>
      <button
        onClick={() => {
          submit();
        }}
      >
        查询
      </button>
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
