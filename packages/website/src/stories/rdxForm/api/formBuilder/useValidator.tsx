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
  useValidator,
} = AreaForms;

function Validator() {
  const validator = useValidator();
  return (
    <div>
      <button
        onClick={() =>
          validator('city').then((message) => {
            if (message.isError) {
              alert('校验失败:' + JSON.stringify(message.errorMsg));
            } else {
              alert('校验通过');
            }
          })
        }
      >
        校验城市属性
      </button>
      <button
        onClick={() =>
          validator(['city', 'province']).then((message) => {
            if (message.isError) {
              alert('校验失败:' + JSON.stringify(message.errorMsg));
            } else {
              alert('校验通过');
            }
          })
        }
      >
        校验城市&省份属性
      </button>
      <button
        onClick={() =>
          validator(null).then((message) => {
            if (message.isError) {
              alert('校验失败:' + JSON.stringify(message.errorMsg));
            } else {
              alert('校验通过');
            }
          })
        }
      >
        校验全部属性
      </button>
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

      <Validator />
    </RdxFormRoot>
  );
};
