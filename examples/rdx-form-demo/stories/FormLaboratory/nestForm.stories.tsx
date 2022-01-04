import React from 'react';
import {
  RdxContext,
  useRdxValue,
  createFormFatory,
  FormLayout,
  LayoutType,
} from '@alife/rdx-form';
import { hippoComponents } from '@alife/hippo-form-library';
import JsonView from 'react-inspector';
import { Button, Dialog } from '@alife/hippo';
export default {
  title: '表单实验/嵌套表单',
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

const { FormItem, formDataCompute, valueComputeByRegexp } = createFormFatory({
  components: hippoComponents,
})({ formId: 'test', dataCompute: DefaultData});
const DataPreview = () => {
  const value = useRdxValue(formDataCompute);
  console.log('DataPreview: ', value);
  return <JsonView data={value}></JsonView>;
};

const TotalValue = () => {
  const values = useRdxValue(valueComputeByRegexp('arrayObject'));
  const sum = values.reduce((sum, current) => {
    return sum + current.amount * current.unit;
  }, 0);
  return (
    <div>
      <h2>总价： {sum}</h2>
    </div>
  );
};
function ButtonGroup(props: { onOk:(v: any) => void, onCancel: () => void}) {
  const value = useRdxValue(formDataCompute);
  return <div>
    <Button onClick={props?.onCancel}>取消</Button>
    <Button type='primary' onClick={() => { props?.onOk(value)}}>确认</Button>
  </div>
}
export const 嵌套表单 = () => {
  return (
    <RdxContext>
      <FormLayout layoutType={LayoutType.Classic}>
        <FormItem
          title='获取同组其他的值'
          name='arrayObject'
          type='array'
          get={({ mixedValueAndStatus }) => {
            return {
              ...mixedValueAndStatus,
              renderAddition: () => {
                return (
                  <div
                    onClick={() => {
                      Dialog.show({
                        content: '测试',
                      });
                    }}
                  >
                    添加一项
                  </div>
                );
              },
            };
          }}
          componentProps={{
            renderAddition: ({ mutators}) => {
              return (
                <div
                  onClick={() => {
                    let dialog = Dialog.show({
                      needWrapper:true,
                      footer: <div></div>,
                      content: (
                        <RdxContext>
                          <FormItem
                            name='amount'
                            title='数量22'
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
                          <ButtonGroup onCancel={() => dialog.hide()} onOk={(value) => {
                            mutators.push(value)
                            dialog.hide()
                          }} />
                        </RdxContext>
                      ),
                    });
                  }}
                >
                  添加一项22
                </div>
              );
            },
          }}
          componentType={'array'}
        >
          <FormItem type='object'>
            <FormItem
              name='amount'
              title='数量22'
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
          </FormItem>
        </FormItem>
      </FormLayout>
      <TotalValue />
      <DataPreview />
    </RdxContext>
  );
};
