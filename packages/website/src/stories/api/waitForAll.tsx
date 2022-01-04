import React from 'react';
import { atom, useRdxState, RdxContext, useRdxValue, RdxState, waitForAll } from '@alife/rdx';

const amountAtom = atom({
  id: 'amount',
  defaultValue: 1,
});
const unitAtom = atom({
  id: 'unit',
  defaultValue: 1,
});

export const Root = () => {
  return (
    <RdxContext>
      <View atom={amountAtom} title='数量'/>
      <View atom={unitAtom} title='单价' />
      <ArrayPreview />
      <MapPreview />
    </RdxContext>
  );
};
const ArrayPreview = () => {
  const [amount, unit] = useRdxValue(waitForAll([amountAtom, unitAtom]));
  return (
    <div>
      <strong>数组形式参数:</strong>
      {amount * unit}
    </div>
  );
};
const MapPreview = () => {
  const { amount, unit } = useRdxValue(waitForAll({ amount: amountAtom, unit: unitAtom}));
  return (
    <div>
      <strong>Map形式参数:</strong>
      {amount * unit}
    </div>
  );
};
const View = (props: { title: string, atom: RdxState<number> }) => {
  const {title, atom}= props
  const [state, setState] = useRdxState(atom);
  return (
    <div style={{ display: 'flex', width: 200 }}>
      <strong>title </strong>
      {/* 通过传递新的值来更新数据 */}
      <button
        onClick={() => {
          setState(state + 1);
        }}
      >
        +
      </button>
      <span>{state}</span>
      {/* 通过传递updated function 来更新数据 */}
      <button
        onClick={() => {
          setState((state) => {
            return state - 1;
          });
        }}
      >
        -
      </button>
    </div>
  );
};
