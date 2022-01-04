import React, { useRef } from 'react';
import { IFormComponentProps, formBuilder } from '@alife/rdx-form';
import JsonView from 'react-inspector';

const CheckBox = (props: IFormComponentProps<any>) => {
  const { value, onChange, preview } = props;
  return (
    <input
      type='checkbox'
      checked={value}
      onChange={(event) => {
        onChange(event.target.checked);
      }}
    ></input>
  );
};

const NumberInput = (props: IFormComponentProps<any>) => {
  const { value, onChange } = props;
  return (
    <input
      value={value}
      type='number'
      onChange={(event) => {
        onChange(event.target.value);
      }}
    ></input>
  );
};
const Input = (props: IFormComponentProps<any>) => {
  const { value, onChange, preview } = props;
  if (preview) {
    return value || '暂无数据';
  }
  return (
    <input
      value={value}
      onChange={(event) => {
        onChange(event.target.value);
      }}
    ></input>
  );
};
const Select = (
  props: IFormComponentProps<{
    dataSource: { label: string; value: any }[];
  }>
) => {
  const { value, onChange, componentProps } = props;
  const { dataSource = [] } = componentProps;
  return (
    <select
      value={value}
      onChange={(event) => {
        onChange(event.target.value === 'true');
      }}
    >
      {dataSource.map((item) => (
        <option value={item.value}>{item.label}</option>
      ))}
    </select>
  );
};
const RangePicker = (props: IFormComponentProps<any>) => {
  const { value = [], onChange } = props;
  return (
    <span>
      <input
        type='date'
        value={value[0]}
        onChange={(event) => {
          onChange([event.target.value, value[1]]);
        }}
      ></input>
      <input
        type='date'
        value={value[1]}
        onChange={(event) => {
          onChange([value[0], event.target.value]);
        }}
      ></input>
    </span>
  );
};
// 通过注册组件，创建formBuilder
const formFn = formBuilder({
  components: {
    numberInput: NumberInput,
    input: Input,
    string: Input,
    select: Select,
    checkbox: CheckBox,
    range: RangePicker,
  },
});
// 通过模型定义，创建带模型含义的表单
const AreaForms = formFn<{
  unit: number;
  amount: number;
  total: number;
  show: boolean;
  province: string;
  start: string;
  end: string;
  city: string;
}>();
const { FormItem, RdxFormRoot, createFormStore } = AreaForms;

export const 显示隐藏控制 = () => {
  return (
    <RdxFormRoot
      enabledStatePreview={true}
      JsonView={JsonView}
      autoValidate={true}
    >
      <FormItem
        type='array'
        title='时间区间选择器'
        name='start|end'
        componentType='range'
      ></FormItem>
    </RdxFormRoot>
  );
};
