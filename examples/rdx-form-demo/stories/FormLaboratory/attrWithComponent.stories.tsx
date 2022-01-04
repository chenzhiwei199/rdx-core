import React from 'react';
import {
  compute,
  RdxContext,
  useRdxValue,
  createFormFatory,
} from '@alife/rdx-form';
import { hippoComponents } from '@alife/hippo-form-library'
import JsonView from 'react-inspector';
export default {
  title: '表单实验/属性和组件的关系',
  parameters: {
    info: { inline: true },
  },
};

const DefaultData = {
  base: 1,
  startTime: '',
  endTime: '',
  alias: '别名测试'
};

const {
  FormItem,
  formDataCompute,
} = createFormFatory({
  components: hippoComponents,
})({ formId: 'test', dataCompute: DefaultData});
const DataPreview = () => {
  const value = useRdxValue(formDataCompute);
  console.log('DataPreview: ', value);
  return <JsonView data={value}></JsonView>;
};
export const 组件和属性 = () => {
  return (
    <RdxContext>
      <FormItem type='string' componentType={'input'} name='base' title='组件_属性1对1'></FormItem>
      <FormItem type='string' componentType={'rangePicker'} name={'startTime|endTime'} title='组件_属性1对N'></FormItem>
      <FormItem type='string' componentType={'input'} name={'alias'} title='组件_属性N对1'></FormItem>
      <FormItem desc={`我的数据和上面的表单是同步的，但是我样式和交互形式不一样`} type='string' componentType={'textArea'} alias={'其他展示'} name={'alias'} title='组件_属性N对1 alias'></FormItem>
      <DataPreview />
    </RdxContext>
  );
};
