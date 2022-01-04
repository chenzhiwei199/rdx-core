import React, { useRef } from 'react';
import { IFormComponentProps, formBuilder } from '@alife/rdx-form';
import JsonView from 'react-inspector';
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
};
// 通过注册组件，创建formBuilder
const formFn = formBuilder({
  components: {
    input: Input,
    select: Select,
  },
});
// 通过模型定义，创建带模型含义的表单
const AreaForms = formFn<{ province: string; city: string }>();
const { FormItem, RdxFormRoot, createFormStore } = AreaForms;

// 使用AreaForms构造你的业务输入表单
export const 初始化表单数据 = () => {
  // 初始化表单数据
  const ref = useRef(createFormStore({ province: '浙江省', city: '杭州市' }));
  return (
    <RdxFormRoot
      enabledStatePreview={true}
      store={ref.current}
      JsonView={JsonView}
    >
      <FormItem
        name='province'
        title='省份'
        type='string'
        require
        componentType={'input'}
      ></FormItem>
      <FormItem
        name='city'
        title='城市'
        require
        type='string'
        componentType={'input'}
      ></FormItem>
    </RdxFormRoot>
  );
};

export const 自动校验 = () => {
  return (
    <RdxFormRoot
      enabledStatePreview={true}
      JsonView={JsonView}
      autoValidate={true}
    >
      <FormItem
        name='province'
        title='省份'
        type='string'
        require
        componentType={'input'}
      ></FormItem>
      <FormItem
        name='city'
        title='城市'
        rules={[
          async ({ get }) => {
            const province = get('province');
            if (!province.value) {
              return '省份必须先输入';
            }
          },
        ]}
        type='string'
        componentType={'input'}
      ></FormItem>
    </RdxFormRoot>
  );
};
