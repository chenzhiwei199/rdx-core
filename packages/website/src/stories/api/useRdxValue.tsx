import React from 'react';
import { atom, useRdxState, RdxContext, useRdxValue } from '@alife/rdx';

const Atom = atom({
  id: 'atom',
  defaultValue: 1,
});

export const Root = () => {
  return (
    <RdxContext>
      <Counter />
      <Preview />
    </RdxContext>
  );
};
const Preview = () => {
  const state = useRdxValue(Atom);
  return (
    <div>
      <strong>Preview:</strong>
      {state}
    </div>
  );
};
const Counter = () => {
  const [state, setState] = useRdxState(Atom);
  return (
    <div style={{ display: 'flex', width: 200 }}>
      <strong>Operate: </strong>
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
