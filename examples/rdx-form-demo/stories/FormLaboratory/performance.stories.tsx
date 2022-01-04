import React from 'react';
import {
  RdxContext,
  useRdxValue,
  createFormFatory,
  FormLayout,
  LayoutType,
  IState,
  IFormComponentProps,
} from '@alife/rdx-form';
import { hippoComponents } from '@alife/hippo-form-library';
import JsonView from 'react-inspector';

export default {
  title: '表单实验/数组性能测试',
  parameters: {
    info: { inline: true },
  },
};

let size = 100;
const data = new Array(size).fill(1).map(item => ({}))
console.log('data: ', data);

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
  arrayObject: data as any,
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
  const { value, state, onChange, preview, disabled } = props;
  if (state === IState.Loading) {
    return <span>{'loading'}</span>;
  }
  if (preview) {
    return <span>{value}</span>;
  }
  return (
    <input
      style={{
        pointerEvents: disabled ? 'none' : 'unset',
        border: state === IState.Error ? '1px solid red' : '1px solid grey',
      }}
      value={value}
      onChange={(event) => {
        onChange(event.target.value);
      }}
    ></input>
  );
};

const {
  FormItem,
  formDataCompute,
  valueAndStatusShallowCompute,
} = createFormFatory({
  components: {
    ...hippoComponents,
    input: Input,
    string: Input,
    number: NumberInput
  },
})({ formId: '性能测试', dataCompute:  DefaultData});
const DataPreview = () => {
  const value = useRdxValue(formDataCompute);
  console.log('DataPreview: ', value);
  return <JsonView data={value}></JsonView>;
};



export const 数组性能测试 = () => {
  return (
    <RdxContext>
      <FormLayout layoutType={LayoutType.Classic}>
        <FormItem
          title='获取同组其他的值'
          name='arrayObject'
          type='array'
          defaultValue={data}
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
                const index = Number(id.match(new RegExp(`\\d+`))[0]);
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
            {/* <FormItem
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
            ></FormItem> */}
            {/* <FormItem
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
            ></FormItem> */}
          </FormItem>
        </FormItem>
      </FormLayout>
      <DataPreview />
    </RdxContext>
  );
};