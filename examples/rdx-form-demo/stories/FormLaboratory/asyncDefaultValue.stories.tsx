import React from 'react';
import {
  RdxContext,
  useRdxValue,
  createFormFatory,
  FormLayout,
  LayoutType,
  compute,
} from '@alife/rdx-form';
import { hippoComponents } from '@alife/hippo-form-library';
import JsonView from 'react-inspector';
export default {
  title: '表单实验/使用异步数据初始化表单',
  parameters: {
    info: { inline: true },
  },
};

const DefaultData: {
  object: { usename: string; password: string; passwordCheck?: string };
} = {
  object: { usename: 'leo', password: '123456' },
};

const pause = (t: number) => new Promise((resolve) => setTimeout(resolve, t));
const asyncCompute = compute({
  id: 'asyncCompute',
  get: async () => {
    await pause(2000);
    return DefaultData;
  },
});

const {
  FormItem,
  formDataCompute,
  valueAndStatusShallowCompute,
} = createFormFatory({
  components: hippoComponents,
})({ formId: 'test', dataCompute : asyncCompute});
const DataPreview = () => {
  const value = useRdxValue(formDataCompute);
  return <JsonView expandLevel={3} data={value}></JsonView>;
};
export const 字符串数组测试 = () => {
  return (
    <RdxContext>
      <FormLayout layoutType={LayoutType.Classic}>
        <FormItem title='对象' name='object' type='object'>
          <FormItem
            title={'用户名'}
            name='usename'
            type='string'
            componentType={'string'}
          ></FormItem>
          <FormItem
            title={'密码'}
            name='password'
            type='string'
            componentType={'string'}
          ></FormItem>
          <FormItem
            title={'密码确认'}
            name='passwordCheck'
            // 密码修改的时候，清空密码确认
            valueEffects={[
              ({ onDependenciesSet, setSelf }) => {
                onDependenciesSet(() => {
                  setSelf('');
                }, [valueAndStatusShallowCompute('object.password')]);
              },
            ]}
            rules={[
              ({ value, get }) => {
                const password = get(
                  valueAndStatusShallowCompute('object.password')
                ).value;
                if (value.value !== password) {
                  return '密码不一致';
                }
              },
            ]}
            type='string'
            componentType={'string'}
          ></FormItem>
        </FormItem>
      </FormLayout>
      <DataPreview />
    </RdxContext>
  );
};
