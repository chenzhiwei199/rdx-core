import React from 'react';
import { formBuilder, IFormComponentProps } from '@alife/rdx-form';

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
    select: (
      props: IFormComponentProps<{
        dataSource: { label: string; value: string }[];
      }>
    ) => {
      const { value, onChange, componentProps } = props;
      const { dataSource = [] } = componentProps;
      return (
        <select
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
          }}
        >
          {dataSource.map((item) => (
            <option value={item.value}>{item.label}</option>
          ))}
        </select>
      );
    },
  },
});

const { RdxFormRoot, FormItem } = forms<{
  password: string;
  confirm: string;
}>();

export function 联动逻辑() {
  return (
    <RdxFormRoot enabledStatePreview={true}>
      <FormItem
        title='密码'
        type='string'
        componentType={'input'}
        name='password'
        require
      ></FormItem>
      <FormItem
        title='确认密码'
        type='string'
        componentType={'input'}
        name='confirm'
        rules={[
          ({ value, get }) => {
            return value.value !== get('password').value
              ? '两次密码输入不一致'
              : '';
          },
        ]}
        require
      ></FormItem>
    </RdxFormRoot>
  );
}
