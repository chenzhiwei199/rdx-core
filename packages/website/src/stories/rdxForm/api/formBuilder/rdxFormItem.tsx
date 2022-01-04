import React, { useRef } from 'react';
import { IFormComponentProps, formBuilder } from '@alife/rdx-form';
import JsonView from 'react-inspector';

const CheckBox = (props: IFormComponentProps<any>) => {
  const { value, onChange, preview } = props;
  return (
    <input
      type='checkbox'
      value={value}
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
    numberInput: NumberInput,
    input: Input,
    select: Select,
    checkbox: CheckBox,
  },
});
// 通过模型定义，创建带模型含义的表单
const AreaForms = formFn<{
  unit: number;
  amount: number;
  total: number;
  show: boolean;
  province: string;
  city: string;
}>();
const { FormItem, RdxFormRoot, createFormStore } = AreaForms;

// 使用AreaForms构造你的业务输入表单
export const 表单基础信息 = () => {
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
        desc={'输入省份信息的表单'}
        tips={'输入省份信息的表单'}
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
export const alias配置_不同视图共享状态 = () => {
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
        name='province'
        title='省份'
        preview={true}
        alias={'preview'}
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

export const 默认值 = () => {
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
        defaultValue={'浙江省'}
        require
        componentType={'input'}
      ></FormItem>
    </RdxFormRoot>
  );
};

export const 规则校验 = () => {
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
        desc={'输入测试会报错'}
        rules={[
          async ({ value }) => {
            if (value.value === '测试') {
              return '不能输入 ”测试“ ';
            }
          },
        ]}
        componentType={'input'}
      ></FormItem>
    </RdxFormRoot>
  );
};

export const 显示隐藏控制 = () => {
  return (
    <RdxFormRoot
      enabledStatePreview={true}
      JsonView={JsonView}
      autoValidate={true}
    >
      <FormItem
        type='boolean'
        title='控制省份显示隐藏'
        name='show'
        componentType='checkbox'
      ></FormItem>
      <FormItem
        name='province'
        title='省份'
        type='string'
        get={({ get }) => {
          console.log(`get('show').value: `, get('show').value);
          return {
            visible: !!get('show').value,
          };
        }}
        require
        componentType={'input'}
      ></FormItem>
    </RdxFormRoot>
  );
};

export const 设置其他字段 = () => {
  return (
    <RdxFormRoot
      enabledStatePreview={true}
      JsonView={JsonView}
      autoValidate={true}
    >
      <FormItem
        type='number'
        title='单位'
        defaultValue={100}
        name='unit'
        set={({ set, get }, newValue) => {
          set('unit', { value: newValue.value });
          set('total', { value: get('amount').value * newValue.value });
        }}
        componentType='numberInput'
      ></FormItem>
      <FormItem
        type='number'
        title='数量'
        defaultValue={20}
        name='amount'
        componentType='numberInput'
        set={({ set, get }, newValue) => {
          set('amount', { value: newValue.value });
          set('total', { value: get('unit').value * newValue.value });
        }}
      ></FormItem>
      <FormItem
        type='number'
        title='总价'
        name='total'
        get={({ get }) => {
          return {
            value: get('unit').value * get('amount').value,
          };
        }}
        set={({ set, get }, newValue) => {
          set('amount', { value: newValue.value / get('unit').value });
        }}
        componentType='numberInput'
      ></FormItem>
    </RdxFormRoot>
  );
};
