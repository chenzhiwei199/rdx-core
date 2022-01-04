import React from 'react';
import { formBuilder } from '@alife/rdx-form';

const forms = formBuilder({
  components: {
    input: (props) => {
      const { value, onChange } = props;
      return (
        <input
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
