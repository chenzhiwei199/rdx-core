import React from 'react'
import { useRdxValue } from '../../core/stateHooks'
import { RdxContext } from '../../RdxContext'
import { atom } from '../rdxAtom'
import { compute } from '../RdxCompute'
import { render, waitFor } from '@testing-library/react'
const pause = (delay: number) =>
  new Promise(resolve =>
    setTimeout(() => {
      resolve(1)
    }, delay),
  )

const atom1 = atom({
  id: 'test',
  defaultValue: 'default',
})
const atom2 = atom({
  id: 'test2',
  defaultValue: 'default',
})
const computeJoin = compute({
  id: 'computeTest',
  get: async ({ get }) => {
    await pause(300)
    return get(atom1) + '|' + get(atom2)
  },
})
const AtomTest = () => {
  const atomValue = useRdxValue(atom1)
  return <div>{atomValue}</div>
}
const AtomTest2 = () => {
  const atomValue = useRdxValue(atom2)
  return <div>{atomValue}</div>
}
const ComputeTest = () => {
  const atomValue = useRdxValue(computeJoin)
  return <div>{atomValue}</div>
}
describe('compute测试', () => {
  test('compute基础能力测试', async () => {
    const result = await render(
      <RdxContext initializeState={{ test: 'init' }}>
        <AtomTest></AtomTest>
        <AtomTest2></AtomTest2>
        <ComputeTest></ComputeTest>
      </RdxContext>,
    )
    await waitFor(
      () => {
        return expect(result.getByText('init|default')).toBeTruthy()
      },
      { timeout: 1000 },
    )
  })
  test('compute只应该调用一次', async () => {
    const fn = jest.fn()
    const atom1 = atom({
      id: 'compute只应该调用一次 ',
      defaultValue: 'default',
    })
    const atom2 = atom({
      id: 'compute只应该调用一次atom2',
      defaultValue: 'default',
    })
    const computeJoin = compute({
      id: 'compute只应该调用一次 computeJoin',
      get: async ({ get }) => {
        await pause(300)
        return get(atom1) + '|' + get(atom2)
      },
    })
    const computeJoin2 = compute({
      id: 'compute只应该调用一次 computeJoin2',
      get: async ({ get }) => {
        await pause(300)
        fn()
        return get(atom1) + '|' + get(atom2) + get(computeJoin)
      },
    })
    const AtomTest = () => {
      const atomValue = useRdxValue(atom1)
      return <div>{atomValue}</div>
    }
    const AtomTest2 = () => {
      const atomValue = useRdxValue(atom2)
      return <div>{atomValue}</div>
    }
    const ComputeTest = () => {
      const atomValue = useRdxValue(computeJoin2)
      return <div>{atomValue}</div>
    }

    await render(
      <RdxContext initializeState={{ test: 'init' }}>
        <AtomTest></AtomTest>
        <AtomTest2></AtomTest2>
        <ComputeTest></ComputeTest>
      </RdxContext>,
    )
    await waitFor(() => expect(fn).toHaveBeenCalledTimes(3), { timeout: 1000 })
  })
})
