import React from 'react';
import {
  atom,
  compute,
  RdxContext,
  useRdxReset,
  useRdxValue,
} from '@alife/rdx';
export default {
  title: '测试重置',
  parameters: {
    info: { inline: true },
  },
};
const atom1 = atom({
  id: 'test',
  defaultValue: 'atom',
});
// 静态compute
const computeJoin = compute({
  id: 'computeTest2',
  get: async ({ get }) => {
    await pause(300);
    return 'computeJoin';
  },
});
// 关联atom
const computeJoin2 = compute({
  id: 'computeJoin2',
  get: async ({ get }) => {
    const v = get(atom1);
    await pause(100);
    return [v, 'computeJoin2'].join('-');
  },
  set: ({ set }, newValue) => {
    set(atom1, newValue);
  },
});
// 关联compute
const computeJoin3 = compute({
  id: 'computeJoin3',
  get: async ({ get }) => {
    const v = get(computeJoin2);
    await pause(100);
    return [v, 'computeJoin3'].join('-');
  },
  set: ({ set }, newValue) => {
    set(computeJoin2, newValue);
  },
});
const pause = (delay: number) =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve(1);
    }, delay)
  );
const ComputeTest = () => {
  const atomValue = useRdxValue(atom1);
  const computeJoinValue = useRdxValue(computeJoin);
  const computeJoin2Value = useRdxValue(computeJoin2);
  const computeJoin3Value = useRdxValue(computeJoin3);
  const resetComputeJoin3 = useRdxReset(computeJoin3);
  return (
    <div onClick={() => resetComputeJoin3()}>
      <span>{atomValue}</span>
      <span>{computeJoinValue}</span>
      <span>{computeJoin2Value}</span>
      <span>{computeJoin3Value}</span>
    </div>
  );
};
export const test = () => {
  return (<div>111</div>)
}
export const 测试重置 = () => {
  return (
    <RdxContext initializeState={{ 'test': 'init' }}>
      <ComputeTest></ComputeTest>
    </RdxContext>
    
  );
};
