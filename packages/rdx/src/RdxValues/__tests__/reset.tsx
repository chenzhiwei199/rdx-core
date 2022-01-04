import React from 'react';
import { useRdxReset, useRdxValue } from '../../core/stateHooks';
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
  test('重置测试', async () => {
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
      set: ({set}, newValue) => {
        set(atom1, newValue);
      },
    });
    // 关联compute
    const computeJoin3 = compute({
      id: 'computeJoin3',
      get: async ({ get }) => {
        const v = get(computeJoin2);
        await pause(100);
        return [v, 'computeJoin3'].join('-') ;
      },
      set: ({ set }, newValue) => {
        set(computeJoin2, newValue);
      },
    });
    let resetComputeJoin3 ;
    const ComputeTest = () => {
      const atomValue = useRdxValue(atom1);
      const computeJoinValue = useRdxValue(computeJoin);
      const computeJoin2Value = useRdxValue(computeJoin2);
      const computeJoin3Value = useRdxValue(computeJoin3);
      resetComputeJoin3 = useRdxReset(computeJoin3)
      return (
        <div>
          <span>{atomValue}</span>
          <span>{computeJoinValue}</span>
          <span>{computeJoin2Value}</span>
          <span>{computeJoin3Value}</span>
        </div>
      );
    };
  
    const { getByText } = await render(
      <RdxContext initializeState={{ test: 'init' }}>
        <ComputeTest></ComputeTest>
      </RdxContext>
    );
    await waitFor(() =>  {
      expect(getByText(new RegExp(/^init$/))).toBeTruthy()
      expect(getByText(/^computeJoin$/)).toBeTruthy()
      expect(getByText(/^init-computeJoin2$/)).toBeTruthy()
      expect(getByText(/^init-computeJoin2-computeJoin3$/)).toBeTruthy()
    }, { timeout: 300 });
    setTimeout(() => {
      resetComputeJoin3()  
    }, 400);
    await waitFor(() =>  {
      expect(getByText(new RegExp(/^default$/))).toBeTruthy()
      expect(getByText(/^computeJoin$/)).toBeTruthy()
      expect(getByText(/^default-computeJoin2$/)).toBeTruthy(),
      expect(getByText(/^default-computeJoin2-computeJoin3$/)).toBeTruthy()
    }, { timeout: 1000 });
  })
})