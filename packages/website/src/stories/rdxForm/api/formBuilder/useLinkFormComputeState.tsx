import React from 'react';
import { IFormComponentProps, formBuilder } from '@alife/rdx-form';

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
  useReferencedFormComputeState: useLinkFormComputeState,
} = AreaForms;

function CityController() {
  const [status, setStatus] = useLinkFormComputeState('city');
  console.log('status: ', status);
  return (
    <div>
      <strong>控制状态</strong>
      <Select
        value={status.content.visible ? '1' : '0'}
        componentProps={{
          dataSource: [
            {
              label: '显示',
              value: '1',
            },
            {
              label: '隐藏',
              value: '0',
            },
          ],
        }}
        onChange={(visible) => {
          setStatus((status) => ({ ...status, visible: visible === '1' }));
        }}
      />
      <strong>控制城市的值</strong>
      <Input
        value={status.content.value}
        onChange={(value) => {
          setStatus((status) => ({ ...status, value }));
        }}
      />
    </div>
  );
}
// 使用AreaForms构造你的业务输入表单
export const App = () => {
  return (
    <RdxFormRoot enabledStatePreview={true}>
      <FormItem
        name='province'
        title='省份'
        type='string'
        componentType={'input'}
      ></FormItem>
      <FormItem
        name='city'
        title='城市'
        type='string'
        componentType={'input'}
      ></FormItem>
      <hr />
      <div>控制城市表单项的状态</div>
      <CityController />
    </RdxFormRoot>
  );
};
