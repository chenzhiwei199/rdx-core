import React from 'react';
import {
  RdxContext,
  useRdxValue,
  createFormFactory,
  FormLayout,
  LayoutType,
} from '@alife/rdx-form';
import { hippoComponents } from '@alife/hippo-form-library';
import JsonView from 'react-inspector';
export default {
  title: '表单实验/数组',
  parameters: {
    info: { inline: true },
  },
};

const DefaultData: {
  array: number[];
  arrayObject: {
    unit: number;
    amount: number;
    currentTotal?: number;
    allTotal?: number;
  }[];
  step?: { start: number; end: number }[];
  arrayLength?: number;
} = {
  array: [1],
  arrayObject: [{ unit: 7, amount: 20 }],
};

const {
  FormItem,
  formDataCompute,
  valueAndStatusShallowCompute,
} = createFormFactory({
  components: hippoComponents,
})({ formId: 'test', dataCompute:  DefaultData});
const DataPreview = () => {
  const value = useRdxValue(formDataCompute);
  console.log('DataPreview: ', value);
  return <JsonView data={value}></JsonView>;
};

export const 字符串数组测试 = () => {
  return (
    <RdxContext>
      <FormLayout layoutType={LayoutType.Classic}>
        <FormItem
          title='字符串数组'
          name='array'
          type='array'
          componentType={'array'}
        >
          <FormItem type='string' componentType={'string'}></FormItem>
        </FormItem>
      </FormLayout>
      <DataPreview />
    </RdxContext>
  );
};
export const 数组对象测试 = () => {
  return (
    <RdxContext>
      <FormLayout layoutType={LayoutType.Classic}>
        <FormItem
          title='获取同组其他的值'
          name='arrayObject'
          type='array'
          componentType={'array'}
        >
          <FormItem type='object'>
            <FormItem
              name='amount'
              title='数量'
              defaultValue={10}
              type='number'
              componentType={'number'}
            ></FormItem>
            <FormItem
              name='unit'
              title='单价'
              defaultValue={10}
              type='number'
              componentType={'number'}
            ></FormItem>
            <FormItem
              name='currentTotal'
              title='总价'
              type='number'
              get={({ id, get }) => {
                // 获取路径
                const index = Number(id.match(new RegExp(`\\d`))[0]);
                const unit = get(
                  valueAndStatusShallowCompute(['arrayObject', index, 'unit'])
                ).value;
                const amount = get(
                  valueAndStatusShallowCompute(['arrayObject', index, 'amount'])
                ).value;
                return {
                  value: unit * amount,
                };
              }}
              componentType={'number'}
            ></FormItem>
            <FormItem
              name='arrayLength'
              title='数组长度'
              type='number'
              get={({ get }) => {
                return {
                  preview: true,
                  value: get(valueAndStatusShallowCompute('arrayObject')).value
                    .length,
                };
              }}
              componentType={'number'}
            ></FormItem>
            <FormItem
              name='allTotal'
              title='总计'
              type='number'
              get={({ id, get }) => {
                let sum = 0;
                const arrayLength = get(
                  valueAndStatusShallowCompute('arrayObject')
                ).value.length;
                for (let index = 0; index < arrayLength; index++) {
                  sum += get(
                    valueAndStatusShallowCompute([
                      'arrayObject',
                      index,
                      'currentTotal',
                    ])
                  ).value;
                }
                return {
                  preview: true,
                  value: sum,
                };
              }}
              componentType={'number'}
            ></FormItem>
          </FormItem>
        </FormItem>
      </FormLayout>
      <DataPreview />
    </RdxContext>
  );
};

export const 分级输入 = () => {
  return (
    <RdxContext>
      <FormLayout layoutType={LayoutType.Classic}>
        <FormItem
          title='数组获取其他行的数据'
          name='step'
          type='array'
          componentType={'array'}
          defaultValue={[{ start: 10, end: 20 }]}
        >
          <FormItem type='object' >
            <FormItem
              name='start'
              type='number'
              // 根据上一组的值设置
              get={({ id, get, mixedValueAndStatus }) => {
                const index = Number(id.match(new RegExp(`\\d`))[0]);
                let value = mixedValueAndStatus.value;
                if (index > 0) {
                  value = get(
                    valueAndStatusShallowCompute(['step', index - 1, 'end'])
                  ).value;
                }
                return {
                  ...mixedValueAndStatus,
                  value,
                };
              }}
              set={({ id, set }, newValue) => {
                const index = Number(id.match(new RegExp(`\\d`))[0]);
                if (index > 0) {
                  set(valueAndStatusShallowCompute(['step', index - 1, 'end']), { value: newValue.value})
                } else {
                  set(valueAndStatusShallowCompute(id as any), { value: newValue.value})
                }
              }}
              componentType={'number'}
              title='开始'
            ></FormItem>
            <FormItem
              name='end'
              type='number'
              componentType={'number'}
              title='结束'
            ></FormItem>
          </FormItem>
        </FormItem>
      </FormLayout>
      <DataPreview />
    </RdxContext>
  );
};


