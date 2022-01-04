import React, { useState } from 'react';
import {
  RdxContext,
  rdxComputeFamily,
  useRdxState,
  compute,
  useRdxValue,
} from '@alife/rdx';

const computeFamily = rdxComputeFamily({
  id: 'dynamic',
  get: (param: number) => () => {
    return param;
  },
});
const CounterView = (props: { id: number }) => {
  const [computeFamilyDynamic] = useRdxState(computeFamily(props.id));
  const staticV = useRdxValue(
    compute({
      id: 'static',
      get: () => {
        return props.id;
      },
    })
  );

  return (
    <div>
      <div>computeFamilyDynamic： {computeFamilyDynamic}</div>
      <div>staticV： {staticV}</div>
    </div>
  );
};

export const ComputeFamily用法2 = () => {
  const [state, setState] = useState(1);
  return (
    <RdxContext>
      <CounterView id={state} />
      <div onClick={() => setState(state + 1)}>id++</div>
    </RdxContext>
  );
};

export default {
  title: 'Usage',
  parameters: {
    info: { inline: true },
  },
};
