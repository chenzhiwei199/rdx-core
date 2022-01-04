import React from 'react';
import { IFormComponentProps, formBuilder, useRdxState } from '@alife/rdx-form';
import { Checkbox } from '@alife/hippo'
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
const AreaForms = formFn<{ province: string; city: number }>();
const {
  FormItem,
  RdxFormRoot,
  getReferencedFormCompute
} = AreaForms;

function CityEditor() {
  const [value, setValue] = useRdxState(getReferencedFormCompute('city'));
  return <div>
    <strong>
      修改城市的值
    </strong>
    <Input value={value.value} onChange={(v) => {
      setValue({...value, value: v})
    }} />;
    <br/>
    <strong>
      修改城市的状态
    </strong>
    {['disabled', 'visible'].map((item) => (
        <Checkbox
          checked={value[item]}
          onChange={(checked) => {
            setValue({ ...value, [item]: checked });
          }}
        >
          {item}
        </Checkbox>
    ))}
  </div>
}
// 使用AreaForms构造你的业务输入表单
export const App = () => {
  return (
    <RdxFormRoot enabledStatePreview={true}>
      <FormItem
        name='province'
        title='省份'
        type='string'
        preview={true}
        componentType={'input'}
      ></FormItem>
      <FormItem
        name='city'
        title='城市'
        type='string'
        preview={true}
        componentType={'input'}
      ></FormItem>
      <hr />
      <div>城市编辑器(渲染顺序在城市之后)</div>
      <CityEditor />
    </RdxFormRoot>
  );
};
