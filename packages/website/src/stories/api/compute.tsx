import React from 'react';
import { atom, useRdxState, compute, RdxContext } from '@alife/rdx';
const unit = atom({
  id: 'unit',
  defaultValue: 10,
});
const amount = atom({
  id: 'amount',
  defaultValue: 20,
});
const total = compute<number>({
  id: 'total',
  get: ({ get }) => {
    const total = get(unit) * get(amount);
    return total;
  },
  set: ({ get, set }, newValue) => {
    set(amount, newValue / get(unit));
  },
});

export const Root = () => {
  return (
    <RdxContext>
      <Unit />
      <Amount />
      <Total />
    </RdxContext>
  );
};
const Unit = () => {
  const [state, setState] = useRdxState(unit);
  return (
    <span>
      单价：
      <input
        type='number'
        value={state}
        onChange={(event) => {
          setState(Number(event.target.value));
        }}
      ></input>
    </span>
  );
};
const Amount = () => {
  const [state, setState] = useRdxState(amount);
  return (
    <span>
      数量：
      <input
        type='number'
        value={state}
        onChange={(event) => {
          setState(Number(event.target.value));
        }}
      ></input>
    </span>
  );
};
const Total = () => {
  const [state, setState] = useRdxState(total);
  return (
    <span>
      总价：
      <input
        type='number'
        value={state}
        onChange={(event) => {
          setState(Number(event.target.value));
        }}
      ></input>
    </span>
  );
};
