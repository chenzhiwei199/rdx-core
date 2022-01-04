import React from 'react';
import { IFormComponentProps, formBuilder } from '@alife/rdx-form';
import { hippoComponents } from '@alife/hippo-form-library';
import JsonView from 'react-inspector';
import { getDimension, Operator } from '@alife/mock-core';
import { atom, compute, RdxContext, useRdxValue } from '@alife/rdx';
export default {
  title: '表单联动2222xxxxx',
  parameters: {
    info: { inline: true },
  },
};

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
  getReferencedFormCompute,
  getReferencedFormValueAtom,
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
    const d = (
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
    return d;
  },
});

const customerTypeData = compute({
  id: 'customerTypeData',
  get: async ({ get }) => {
    const documentDate = get(getReferencedFormCompute('documentDate')).value;
    const area = get(getReferencedFormCompute('area')).value;
    const d =  (
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
    console.log("customerTypeData", d)
    return d
  },
});

function clearWhenDepsChangeEffect(deps: any) {
  return ({ setSelf, onDependenciesSet }) => {
    onDependenciesSet(() => {
      setSelf('');
    }, deps);
  };
}
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
        get={async ({ get, mixedValueAndStatus }) => {
          const res = get(documentDateData);
          return {
            value: mixedValueAndStatus.value || res[0].value,
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
        valueEffects={[
          clearWhenDepsChangeEffect([getReferencedFormValueAtom('documentDate')]),
        ]}
        get={async ({ get, mixedValueAndStatus }) => {
          const res = get(areaData);
          return {
            value: mixedValueAndStatus.value || res[0].value,
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
        valueEffects={[
          clearWhenDepsChangeEffect([getReferencedFormValueAtom('area')]),
        ]}
        get={async ({ get, mixedValueAndStatus }) => {
          const res = await get(customerTypeData);
          return {
            value: mixedValueAndStatus.value || res[0].value,
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

const atom1 = atom({
  id: 'test',
  defaultValue: 'default',
});
const atom2 = atom({
  id: 'test2',
  defaultValue: 'default',
});
const computeJoin = compute({
  id: 'computeTest2',
  get: async ({ get }) => {
    return get(atom1) + '|' + get(atom2);
  },
});
const computeJoin2 = compute({
  id: 'computeTest',
  get: async ({ get }) => {
    console.log('fire');
    return get(atom1) + '|' + get(atom2) + get(computeJoin);
  },
});
const AtomTest = () => {
  const atomValue = useRdxValue(atom1);
  return <div>{atomValue}</div>;
};
const AtomTest2 = () => {
  const atomValue = useRdxValue(atom2);
  return <div>{atomValue}</div>;
};
const ComputeTest = () => {
  const atomValue = useRdxValue(computeJoin2);
  return <div>{atomValue}</div>;
};
export const 简单测试 = () => {
  return (
    <RdxContext
      onChange={() => {
        console.log('hahaha');
      }}
      initializeState={{ test: 'init' }}
    >
      <AtomTest></AtomTest>
      <AtomTest2></AtomTest2>
      <ComputeTest></ComputeTest>
    </RdxContext>
  );
};

const pause = (delay: number) =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve(1);
    }, delay)
  );
