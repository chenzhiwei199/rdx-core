import React from 'react';
import { IState, IFormComponentProps, formBuilder } from '@alife/rdx-form';

const forms = formBuilder({
  components: {
    // 自定义一个组件
    input: (props: IFormComponentProps<any>) => {
      const { value, state, onChange, preview, disabled } = props;
      if (state === IState.Loading) {
        return <span>{'loading'}</span>;
      }

      if (preview) {
        return <span>{value}</span>;
      }
      return (
        <input
          style={{
            pointerEvents: disabled ? 'none' : 'unset',
            border: state === IState.Error ? '1px solid red' : '1px solid grey',
          }}
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
          }}
        ></input>
      );
    },
  },
});
const { RdxFormRoot, FormItem } = forms<{
  city: string;
}>();

export function 简单示例() {
  return (
    <RdxFormRoot enabledStatePreview={true}>
      <FormItem type='string' componentType={'input'} name='city'></FormItem>
    </RdxFormRoot>
  );
}
