import React from 'react';
import {
  atom,
  useRdxSetter,
  RdxContext,
  useRdxState,
  compute,
  isLoading,
  isDefaultValue,
  useRdxReset,
} from '@alife/rdx';

const Atom = atom({
  id: 'atom',
  defaultValue: 1,
});

const Compute = compute({
  id: 'compute',
  get: ({ get }) => {
    return get(Atom) * 10;
  },
  set: ({ set }, newValue) => {
    if (isDefaultValue(newValue)) {
      set(Atom, 100);
    } else {
      set(Atom, newValue);
    }
  },
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
  const [computeState, setComputeState] = useRdxState(Compute);
  const reset = useRdxReset(Atom);
  const resetCompute = useRdxReset(Compute);
  return (
    <span style={{ display: 'inline-flex', justifyContent: 'space-around' }}>
      <div>
        Atom:{' '}
        <input
          value={state}
          onChange={(event: any) => setState(event.target.value)}
        />
        Compute:{' '}
        <input
          value={computeState}
          onChange={(event: any) => setComputeState(event.target.value)}
        />
      </div>
      <button
        onClick={() => {
          reset();
        }}
      >
        重置Atom
      </button>
      <button
        onClick={() => {
          resetCompute();
        }}
      >
        重置Compute
      </button>
    </span>
  );
};
