import React from 'react';
import { compute, formBuilder, IFormComponentProps } from '@alife/rdx-form';
import axios from 'axios';

const forms = formBuilder({
  components: {
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
  city: string;
}>();
const fetchDataCompute = compute({
  id: 'fetchData',
  get: async () => {
    return (
      await axios.get(`https://rap2api.alibaba-inc.com/app/mock/4200/city`)
    ).data.data.data;
  },
});
export function 简单示例() {
  return (
    <RdxFormRoot enabledStatePreview={true}>
      <FormItem
        type='string'
        componentType={'select'}
        name='city'
        get={async ({ get }) => {
          return {
            componentProps: {
              dataSource: get(fetchDataCompute) as any,
            },
          };
        }}
      ></FormItem>
    </RdxFormRoot>
  );
}
