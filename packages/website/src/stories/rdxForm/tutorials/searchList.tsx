import React, { useRef } from 'react';
import {
  isLoading,
  formBuilder,
  Status,
  useRdxReset,
  useRdxSetter,
  useRdxValue,
  useRdxValueLoader,
  waitForAll,
  waitForSetter,
  compute,
} from '@alife/rdx-form';
import { hippoComponents } from '@alife/hippo-form-library';
import { Table, Loading, Button } from '@alife/hippo';
import JsonView from 'react-inspector';
import {
  AggregateType,
  getData,
  getDimension,
  Operator,
} from '@alife/mock-core';
import styled from 'styled-components';

export default {
  title: '查询列表（带查询按钮）222',
  parameters: {
    info: { inline: true },
  },
};

const SearchListWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
`;
// 通过注册组件，创建formBuilder
const formFn = formBuilder({
  components: hippoComponents,
});

const dimensions: ['地区名称', '单据日期', '客户分类'] = [
  '地区名称',
  '单据日期',
  '客户分类',
];
// 通过模型定义，创建带模型含义的表单
const AreaForms = formFn<{
  地区名称: string;
  单据日期: string;
  客户分类: string;
}>();
const {
  FormItem,
  RdxFormRoot,
  createFormStore,
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
            values: get(getReferencedFormCompute('单据日期')).value,
          },
        ],
      })
    ).data;
  },
});

const customerTypeData = compute({
  id: 'customerTypeData',
  get: async ({ get }) => {
    const documentDate = get(getReferencedFormCompute('单据日期')).value;
    const area = get(getReferencedFormCompute('地区名称')).value;
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
const waitCompute = waitForSetter(
  dimensions.map((dim) => getReferencedFormCompute(dim))
);
const tableDataCompute = compute({
  id: 'tableData',
  get: async ({ get }) => {
    const values = get(waitCompute);
    const fetchData = await getData({
      dimensions: dimensions,
      measures: [{ key: '税费', aggregateType: AggregateType.Sum }],
      filters: dimensions.map((item, index) => {
        return {
          member: item,
          operator: Operator.equals,
          values: values[index].value,
        };
      }),
    });
    return fetchData.data;
  },
});

const SubmitButtonGroup = () => {
  const buttonValue = useRdxValue(waitCompute);
  const searchValue = useRdxValueLoader(
    waitForAll(dimensions.map((dim) => getReferencedFormCompute(dim)))
  );
  const set = useRdxSetter(waitCompute);
  const reset = useRdxReset(waitCompute);
  const isDifferent = buttonValue !== searchValue.content;
  return (
    <div>
      <Button
        loading={isLoading(searchValue.status)}
        type='primary'
        onClick={() => {
          set();
        }}
      >
        查询
      </Button>
      <Button
        onClick={() => {
          reset();
        }}
      >
        重置
      </Button>
      {isDifferent && <div>筛选项和数据不一致</div>}
    </div>
  );
};
const TableView = () => {
  const value = useRdxValueLoader(tableDataCompute);
  return (
    <Table
      dataSource={value.status === Status.Error ? [] : value.content || []}
      // @ts-ignore
      loadingComponent={(props) => {
        return (
          <Loading
            {...props}
            tip={
              value.status === Status.Waiting ? '筛选项加载中' : '数据加载中'
            }
          />
        );
      }}
      loading={isLoading(value.status)}
    >
      {dimensions.map((item) => (
        <Table.Column key={item} title={item} dataIndex={item}></Table.Column>
      ))}
      <Table.Column key={'税费'} title='税费' dataIndex='税费'></Table.Column>
    </Table>
  );
};
export const 筛选框组 = () => {
  const store = useRef(createFormStore({}));
  return (
    <RdxFormRoot
      enabledStatePreview={true}
      JsonView={JsonView}
      store={store.current}
      autoValidate={true}
    >
      <SearchListWrapper>
        <FormItem
          type='boolean'
          title='单据日期'
          name='单据日期'
          get={async ({ get, mixedValueAndStatus, preComputeValue }) => {
            const res = await get(documentDateData);
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
          name='地区名称'
          get={async ({ get, mixedValueAndStatus, preComputeValue }) => {
            const res = await get(areaData);
            // * 1. 当没有数据的时候 2. 当数据源变化的时候 重新设置值 ---- 默认选中第一项
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
          name='客户分类'
          componentType='select'
        ></FormItem>
      </SearchListWrapper>
      <SubmitButtonGroup></SubmitButtonGroup>
      <TableView></TableView>
    </RdxFormRoot>
  );
};
