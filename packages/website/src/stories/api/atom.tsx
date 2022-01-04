import React from 'react';
import { atom, useRdxState, RdxContext } from '@alife/rdx';

const Atom = atom({
  id: 'atom',
  defaultValue: 1,
});

export const Root = () => {
  return (
    <RdxContext>
      <Counter />
    </RdxContext>
  );
};
const Counter = () => {
  const [state, setState] = useRdxState(Atom);
  return (
    <div
      style={{ display: 'flex', width: 100, justifyContent: 'space-around' }}
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
    </div>
  );
};
