import React from 'react';
import { useRdxReset, useRdxValue, useRdxValueLoader } from '../../core/stateHooks';
import { RdxContext } from '../../RdxContext';
import { atom } from '../rdxAtom';
import { compute } from '../RdxCompute';
import {  render, waitFor } from '@testing-library/react';
const pause = (delay: number) =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve(1);
    }, delay)
  );
  const atom1 = atom({
    id: 'test',
    defaultValue: 'default',
  });
describe('compute测试', () => {
  test('更新次数测试', async () => {
    // 关联atom
    const relyAtomCompute = compute({
      id: '更新次数测试',
      get: async ({ get }) => {
        const v = get(atom1);
        await pause(1000);
        return [v, 'computeJoin2'].join('-');
      },
      set: ({set}, newValue) => {
        set(atom1, newValue);
      },
    });
    // 关联atom
    const computeQuickPromise = compute({
      id: 'computeQuickPromise',
      get: async ({ get }) => {
        return 'test'
      }
    });
  
    const AtomTestfn = jest.fn()
    const AsyncComputeValueFn = jest.fn()
    const MixedAtomAndComputeLoaderFn = jest.fn()
    const computeQuickPromiseFn= jest.fn()
    const AtomTest = () => {
      useRdxValue(atom1);
      // const content = useRdxValueLoader(atom1);
      AtomTestfn()
      return (
        <div>
          atomtest
        </div>
      );
    }
    const ComputeTest = () => {
      const computeJoin2Value = useRdxValue(relyAtomCompute);
      AsyncComputeValueFn()
      return (
        <div>
          <span>ComputeTest</span>
        </div>
      );
    };
    const MixedAtomAndComputeTEst = () => {
      useRdxValue(atom1);
      const computeJoin2Value = useRdxValueLoader(relyAtomCompute);
      MixedAtomAndComputeLoaderFn()
      return (
        <div>
          <span>ComputeTest</span>
        </div>
      );
    };
    const ComputeQuickPromiseFnTest = () => {
      const computeJoin2Value = useRdxValueLoader(computeQuickPromise);
      computeQuickPromiseFn()
      return (
        <div>
          <span>ComputeTest</span>
        </div>
      );
    };
  
    await render(
      <RdxContext initializeState={{ test: 'init' }}>
        <AtomTest />
        <ComputeTest></ComputeTest>
        <MixedAtomAndComputeTEst></MixedAtomAndComputeTEst>
        <ComputeQuickPromiseFnTest></ComputeQuickPromiseFnTest>
      </RdxContext>
    );
    await waitFor(() =>  {
      // 这里有问题，应该是1
      expect(AtomTestfn).toHaveBeenCalledTimes(1)
      expect(AsyncComputeValueFn).toHaveBeenCalledTimes(2)
      expect(computeQuickPromiseFn).toHaveBeenCalledTimes(3)
      expect(MixedAtomAndComputeLoaderFn).toHaveBeenCalledTimes(3)
      
    }, { timeout: 2000 });
    
  })
})