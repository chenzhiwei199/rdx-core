import React from 'react';
import { compute, formBuilder } from '@alife/rdx-form';
import { hippoComponents } from '@alife/hippo-form-library';
import '@alife/hippo/dist/hippo.css';
import JsonView from 'react-inspector';
import { getDimension, Operator } from '@alife/mock-core';

// 通过注册组件，创建formBuilder
const formFn = formBuilder({
  components: hippoComponents,
});
// 通过模型定义，创建带模型含义的表单
const AreaForms = formFn<{
  area: string;
  documentDate: string;
  customerType: string;
}>();
const {
  FormItem,
  RdxFormRoot,
  getReferencedFormValueAtom,
  getReferencedFormCompute,
} = AreaForms;

const documentDateData = compute({
  id: 'documentDateData',
  get: async ({ get }) => {
    return (await getDimension({ dimensions: '单据日期' })).data;
  },
});
const areaData = compute({
  id: 'areaData',
  get: async ({ get }) => {
    return (
      await getDimension({
        dimensions: '地区名称',
        filters: [
          {
            member: '单据日期',
            operator: Operator.equals,
            values: get(getReferencedFormCompute('documentDate')).value,
          },
        ],
      })
    ).data;
  },
});

const customerTypeData = compute({
  id: 'customerTypeData',
  get: async ({ get }) => {
    const documentDate = get(getReferencedFormCompute('documentDate')).value;
    const area = get(getReferencedFormCompute('area')).value;
    return (
      await getDimension({
        dimensions: '客户分类',
        filters: [
          {
            member: '单据日期',
            operator: Operator.equals,
            values: documentDate,
          },
          {
            member: '地区名称',
            operator: Operator.equals,
            values: area,
          },
        ],
      })
    ).data;
  },
});
export const 筛选框组 = () => {
  return (
    <RdxFormRoot
      enabledStatePreview={true}
      JsonView={JsonView}
      autoValidate={true}
    >
      <FormItem
        type='boolean'
        title='单据日期'
        name='documentDate'
        get={async ({ get, mixedValueAndStatus, preComputeValue }) => {
          const res = await get(documentDateData);
          return {
            value:
              !preComputeValue ||
              preComputeValue.componentProps.dataSource !== res
                ? res[0].value
                : mixedValueAndStatus.value,
            componentProps: {
              ...mixedValueAndStatus.componentProps,
              dataSource: res,
            },
          };
        }}
        componentType='select'
      />
      <FormItem
        type='string'
        title='区域'
        name='area'
        get={async ({ get, mixedValueAndStatus, preComputeValue }) => {
          const res = await get(areaData);
          return {
            value:
              !preComputeValue ||
              preComputeValue.componentProps.dataSource !== res
                ? res[0].value
                : mixedValueAndStatus.value,
            componentProps: {
              ...mixedValueAndStatus.componentProps,
              dataSource: res,
            },
          };
        }}
        componentType='select'
      ></FormItem>
      <FormItem
        type='string'
        get={async ({ get, mixedValueAndStatus, preComputeValue }) => {
          console.log('customerType preComputeValue: ', preComputeValue);
          const res = await get(customerTypeData);
          return {
            value:
              !preComputeValue ||
              preComputeValue.componentProps.dataSource !== res
                ? res[0].value
                : mixedValueAndStatus.value,
            componentProps: {
              ...mixedValueAndStatus.componentProps,
              dataSource: res,
            },
          };
        }}
        title='客户类型'
        name='customerType'
        componentType='select'
      ></FormItem>
    </RdxFormRoot>
  );
};
