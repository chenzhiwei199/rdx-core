import {  render, waitFor } from '@testing-library/react';
import { RdxContext } from '../../RdxContext';
import React from 'react';
import { useRdxReset, useRdxValue, useRdxValueLoader } from '../../core/stateHooks';
import { atom } from '../rdxAtom';
import { compute } from '../RdxCompute';

const atom1 = atom({
  id: 'test',
  defaultValue: 'default',
});
const atom2 = atom({
  id: 'test2',
  defaultValue: 'default',
});
const computeJoin = compute({
  id: 'computeTest',
  get: async ({ get }) => {
    await pause(300);
    return get(atom1) + '|' + get(atom2);
  },
});
const AtomTest = () => {
  const atomValue = useRdxValue(atom1);
  return <div>{atomValue}</div>;
};
const AtomTest2 = () => {
  const atomValue = useRdxValue(atom2);
  return <div>{atomValue}</div>;
};
const ComputeTest = () => {
  const atomValue = useRdxValue(computeJoin);
  return <div>{atomValue}</div>;
};
test('initializeState 当Rdx外部初始化了数据，不应该被默认值设置覆盖', async () => {
  const AtomTest = () => {
    const atomValue = useRdxValue(atom1);
    return <div>{atomValue}</div>;
  };
  const result = await render(
    <RdxContext initializeState={{ test: 'init' }}>
      <AtomTest></AtomTest>
    </RdxContext>
  );
  expect(result.getByText('init')).toBeTruthy();
});

test('initializeStateNew 当Rdx外部初始化了数据，不应该被默认值设置覆盖', async () => {
  const AtomTest = () => {
    const atomValue = useRdxValue(atom1);
    return <div>{atomValue}</div>;
  };
  const result = await render(
    <RdxContext initializeStateNew={({ set}) => {
      set(atom1, 'init')
    }}>
      <AtomTest></AtomTest>
    </RdxContext>
  );
  expect(result.getByText('init')).toBeTruthy();
});

test('edge case prmoise compare effect', async () => {
  const compute2 = compute({
    id: 'compute2',
    get: async () => {
      return 'compute2'
    }
  });
  const AtomTest = () => {
    const atomValue = useRdxValue(atom1);
    return <div>{atomValue}</div>;
  };
  const ComputeTest = () => {
    const atomValue = useRdxValue(compute2);
    return <div>{atomValue}</div>;
  };
  const result = await render(
    <RdxContext initializeState={{ test: 'init' }}>
      <AtomTest></AtomTest>
      <ComputeTest></ComputeTest>
    </RdxContext>
  );
  expect(result.getByText('init')).toBeTruthy();
  await waitFor(() => expect(result.getByText('compute2')).toBeTruthy(), { timeout: 100})
  
});


const pause = (delay: number) =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve(1);
    }, delay)
  );


test('测试RdxContextOnChange能力', async () => {
  const fn = jest.fn();
  await render(
    <RdxContext onChange={fn} initializeState={{ test: 'init' }}>
      <AtomTest></AtomTest>
      <AtomTest2></AtomTest2>
      <ComputeTest></ComputeTest>
    </RdxContext>
  );
  await waitFor(() => expect(fn).toHaveBeenCalledTimes(1), { timeout: 1000 });
});




;
