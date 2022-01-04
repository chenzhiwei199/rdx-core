import React, { useMemo, useRef } from 'react';
import {
  getData,
  AggregateType,
  Operator,
  getDimension,
  Filters,
  DimNames,
} from '@alife/mock-core';
import {
  selector,
  RecoilRoot,
  atom,
  useRecoilState,
} from 'recoil';
import {
  Checkbox,
  Button,
  Select,
  Table,
  Loading,
  Icon,
  Balloon,
} from '@alife/hippo';

export default {
  title: 'effectTestRecoil.stories',
  parameters: {
    info: { inline: true },
  },
};
const areaAtom = atom({
  key: 'areaAtom',
  default: 0,
  effects_UNSTABLE: [
    ({ onSet }) => {
      onSet((newValue, preValue) => {
        console.log('日志记录', `${preValue} => ${newValue}`);
      });
    },
  ],
});

const areaAtomSelfCount = atom({
  key: 'areaAtomSelfCount',
  default: 0,
  effects_UNSTABLE: [
    ({ onSet, setSelf }) => {
      onSet((newValue, preValue) => {
        console.log('newValue: ', newValue);
        // setSelf(newValue + 1)
      });
    },
  ],
});

const areaCompute = selector({
  key: 'areaCompute',
  get: ({ get }) => {
    return get(areaAtom);
  },
  set: ({ set }, newValue) => {
    set(areaAtom, newValue);
  },
});
const Test = () => {
  const [state, setState] = useRecoilState(areaAtom);
  return (
    <button
      onClick={() => {
        setState(state + 1);
      }}
    >
      atom 的onSet监听 {state}
    </button>
  );
};
const Test2 = () => {
  const [computeState, setComputeState] = useRecoilState(areaCompute);
  return (
    <button
      onClick={() => {
        setComputeState(computeState => computeState + 1);
      }}
    >
      compute 的onSet监听 {computeState}
    </button>
  );
};
const Test3 = () => {
  const [computeState, setComputeState] = useRecoilState(areaAtomSelfCount);
  return (
    <button
      onClick={() => {
        setComputeState(computeState + 1);
      }}
    >
      自增atom 的onSet监听 {computeState}
    </button>
  );
};

export const 简单搜索列表_查询控制 = () => {
  return (
    <RecoilRoot>
      <Test />
      <Test2 />
      <Test3 />
    </RecoilRoot>
  );
};
