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
  visible: string;
  city: string;
}>();

export function 联动逻辑() {
  return (
    <RdxFormRoot enabledStatePreview={true}>
      <FormItem
        defaultValue={'show'}
        type='string'
        title={'显示开关'}
        componentType={'select'}
        name='visible'
        get={async () => {
          return {
            componentProps: {
              dataSource: [
                { label: '显示', value: 'show' },
                { label: '隐藏', value: 'hidden' },
              ],
            },
          };
        }}
      ></FormItem>
      <FormItem
        type='string'
        title={'根据显示开关进行联动'}
        get={({ get }) => {
          return {
            visible: get('visible').value === 'show',
          };
        }}
        componentType={'input'}
        name='city'
      ></FormItem>
    </RdxFormRoot>
  );
}
