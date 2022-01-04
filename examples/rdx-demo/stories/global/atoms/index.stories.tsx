import React from 'react';
import {
  atom,
  compute,
  RdxContext,
  useRdxState,
  useRdxValue,
} from '@alife/rdx';
import { Button, Input, NumberPicker } from '@alife/hippo';
const Counter = atom({
  id: 'test',
  defaultValue: 0,
});

const CounterView = () => {
  const [count, setCount] = useRdxState(Counter);
  return (
    <div>
      <Button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        +
      </Button>
      <span>
        {/* // @ts-ignore */}
        <NumberPicker
          value={count}
          onChange={(v) => setCount(v)}
        ></NumberPicker>
      </span>
      <Button
        onClick={() => {
          setCount(count - 1);
        }}
      >
        -
      </Button>
    </div>
  );
};

const DoubleCounterView = () => {
  const count = useRdxValue(Counter);

  return (
    <div
      style={{
        lineHeight: '40px',
        background: 'white',
        border: '1px solid grey',
      }}
    >
      双倍数据： {count * 2}
    </div>
  );
};

const OtherView = () => {
  return (
    <div
      style={{
        lineHeight: '40px',
        background: 'white',
        border: '1px solid grey',
      }}
    >
      {' '}
      不更新
    </div>
  );
};
export const Atom基础用法 = () => {
  return (
    <RdxContext>
      <CounterView />
      <DoubleCounterView />
      <OtherView />
    </RdxContext>
  );
};

export default {
  title: 'Usage',
  parameters: {
    info: { inline: true },
  },
};
