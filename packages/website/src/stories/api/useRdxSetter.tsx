import React from 'react';
import { atom, useRdxSetter, RdxContext, useRdxState } from '@alife/rdx';

const Atom = atom({
  id: 'atom',
  defaultValue: 1,
});

export const Root = () => {
  return (
    <RdxContext>
      <Counter />
      <Set100 />
    </RdxContext>
  );
};
const Set100 = () => {
  const setState = useRdxSetter(Atom);
  return (
    <button
      onClick={() => {
        setState(100);
      }}
    >
      设置为100
    </button>
  );
};
const Counter = () => {
  const [state, setState] = useRdxState(Atom);
  return (
    <span
      style={{
        display: 'inline-flex',
        width: 100,
        justifyContent: 'space-around',
      }}
    >
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
    </span>
  );
};
