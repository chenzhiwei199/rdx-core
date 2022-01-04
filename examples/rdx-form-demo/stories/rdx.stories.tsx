import React from 'react';
import { atom, atomFamily, compute, computeFamily, RdxContext, rdxState, useRdxState } from '@alife/rdx';
export default {
  title: 'Atom',
  parameters: {
    info: { inline: true },
  },
};

const promiseAtom = atom({
  id: 'promiseAtom',
  defaultValue: new Promise<number>((resolve) => {
    resolve(1);
  }),
});
const PromiseAtomComp = () => {
  const [value, setValue] = useRdxState(promiseAtom);
  return <button onClick={() => setValue((v) => v + 1)}>{value}</button>;
};
export const PromiseAtom例子 = () => {
  return (
    <RdxContext>
      <PromiseAtomComp />
    </RdxContext>
  );
};

const delayCompute = compute({
  id: 'delayCompute',
  get: () => {
    return new Promise<number>((resolve) => {
      setTimeout(() => {
        resolve(1);
      }, 0);
    });
  },
});
const relyComputeAtom = atom({
  id: 'promiseAtom',
  defaultValue: delayCompute,
});

const RelyComputeAtomComp = () => {
  const [value, setValue] = useRdxState(relyComputeAtom);
  return <button onClick={() => setValue((v) => v + 1)}>{value}</button>;
};

export const RelyComputeAtom例子 = () => {
  return (
    <RdxContext>
      <RelyComputeAtomComp />
    </RdxContext>
  );
};
const defaultValue = {
  a: 1,
  b: 2
}
const fetchAsyncValue = computeFamily({
  id: 'fetchAsyncValue',
  get: (params: { id: string, defaultValue: string}) =>  ({ get }) => {
    const { id, defaultValue} = params
    // 如果父节点有数据，则到父节点中取
    const paths = id.split('.')
    const parentPaths = paths[paths.length - 1]
    // 默认值 > 父组件初始化的数据 > 当前组件
    return defaultValue[id] || get(rdxState({ id: parentPaths})) || defaultValue
  },
});
const atomFn = atomFamily({
  id: 'test',
  defaultValue: (id: string) => {
    return fetchAsyncValue({ id, defaultValue: ''})
  }
})