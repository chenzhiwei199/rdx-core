import React, { useRef } from 'react';
import { IFormComponentProps, formBuilder } from '@alife/rdx-form';
import JsonView from 'react-inspector';

// 通过注册组件，创建formBuilder
const formFn = formBuilder({
  components: {},
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

export const 显示隐藏控制 = () => {
  return (
    <RdxFormRoot
      enabledStatePreview={true}
      JsonView={JsonView}
      autoValidate={true}
    >
      <FormItem type='string' title='城市' name='city'>
        {(props: IFormComponentProps<any>) => {
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
        }}
      </FormItem>
    </RdxFormRoot>
  );
};
