import React, { useRef } from 'react';
import { formBuilder, FormLayout, LayoutType } from '@alife/rdx-form';
import { hippoComponents } from '@alife/hippo-form-library';
import styled from 'styled-components';
import { Button } from '@alife/hippo'
// 通过注册组件，创建formBuilder

export default {
  title: 'hippo表单测试',
  parameters: {
    info: { inline: true },
  },
};

const formFn = formBuilder({
  components: hippoComponents,
});
const { FormItem, RdxFormRoot } = formFn<{ [key: string]: any }>();

const flagDataSource = [
  { label: '是', value: '1' },
  { label: '否', value: '0' },
];
export function 组件列表() {
  return (
    <RdxFormRoot enabledStatePreview={true}>
      <FormLayout layoutType={LayoutType.Classic}>
        <FormItem
          title={'input'}
          name={'input'}
          type='string'
          componentType={'input'}
        ></FormItem>
        <FormItem
          title={'numberInput'}
          name={'numberInput'}
          type='number'
          componentType={'numberInput'}
        ></FormItem>
        <FormItem
          title={'switch'}
          name={'switch'}
          type='boolean'
          componentType={'switch'}
        ></FormItem>

        <FormItem
          title='select'
          componentType={'select'}
          name='select'
          type='string'
          componentProps={{ dataSource: flagDataSource }}
        ></FormItem>
        <FormItem
          title='date'
          componentType={'date'}
          name='date'
          type='string'
        ></FormItem>
        <FormItem
          title='month'
          componentType={'month'}
          name='month'
          type='string'
        ></FormItem>
        <FormItem
          title='year'
          componentType={'year'}
          name='year'
          type='string'
        ></FormItem>
        <FormItem
          title='time'
          componentType={'time'}
          name='time'
          type='string'
        ></FormItem>
        <FormItem
          title='rangePicker'
          componentType={'rangePicker'}
          name='rangePickerStart|rangePickerEnd'
          type='array'
        ></FormItem>
        <FormItem
          title='rating'
          componentType={'rating'}
          name='rating'
          type='number'
        ></FormItem>
        <FormItem
          title='radio'
          componentType={'radio'}
          name='radio'
          type='string'
          componentProps={{ dataSource: flagDataSource }}
        ></FormItem>
        <FormItem
          title='upload'
          componentType={'upload'}
          componentProps={{
            action: '//file.hemaos.com/upload/next.json',
            children: <Button type='primary'>Upload File</Button>,
          }}
          name='upload'
          type='string'
        ></FormItem>
        <FormItem
          title='transfer'
          componentType={'transfer'}
          name='transfer'
          type='array'
          componentProps={{ dataSource: flagDataSource }}
        ></FormItem>
        <FormItem
          title='treeSelect'
          componentType={'treeSelect'}
          name='treeSelect'
          type='array'
          componentProps={{ dataSource: flagDataSource }}
        ></FormItem>
        <FormItem
          title='tagFilter'
          componentType={'tagFilter'}
          name='tagFilter'
          type='array'
          componentProps={{ dataSource: flagDataSource }}
        ></FormItem>
        <FormItem
          title='cascaderSelect'
          componentType={'cascaderSelect'}
          name='cascaderSelect'
          type='array'
          componentProps={{ dataSource: flagDataSource }}
        ></FormItem>
        <FormItem
          title='rangeInput'
          componentType={'rangeInput'}
          name='rangeInputStart|rangeInputEnd'
          type='array'
        ></FormItem>
        <FormItem
          title='checkbox'
          componentType={'checkbox'}
          name='checkbox'
          type='boolean'
          componentProps={{ children: '复选框' }}
        ></FormItem>
        <FormItem
          title='checkboxGroup'
          componentType={'checkboxGroup'}
          name='checkboxGroup'
          type='array'
          componentProps={{
            dataSource: [
              {
                value: 'apple',
                label: '苹果',
              },
              {
                value: 'pear',
                label: '梨',
              },
              {
                value: 'orange',
                label: '橙子',
              },
            ],
          }}
        ></FormItem>
        <FormItem
          title={'array'}
          name={'array'}
          type='array'
          componentType={'array'}
        >
          <FormItem type='object'>
            <FormItem title='输入框' name='test' type='string'></FormItem>
          </FormItem>
        </FormItem>
        <FormItem
          title={'arrayTable'}
          name={'arrayTable'}
          type='array'
          componentType={'arrayTable'}
        >
          <FormItem type='object'>
            <FormItem title='输入框' name='test' type='string'></FormItem>
          </FormItem>
        </FormItem>
        <FormItem
          title={'arrayTable'}
          name={'arrayTable'}
          type='array'
          componentType={'arrayTable'}
        >
          <FormItem type='object'>
            <FormItem title='输入框' name='test' type='string'></FormItem>
          </FormItem>
        </FormItem>
        <FormItem
          title={'嵌套表格'}
          name={'nestArray'}
          type='array'
          componentType={'array'}
        >
          <FormItem
            title={'arrayTable'}
            name={'arrayTable'}
            type='array'
            componentType={'arrayTable'}
          >
            <FormItem type='object'>
              <FormItem title='输入框' name='test' type='string'></FormItem>
            </FormItem>
          </FormItem>
        </FormItem>
      </FormLayout>
    </RdxFormRoot>
  );
}
