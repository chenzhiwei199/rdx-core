import React, { useMemo, useRef } from 'react';
import {
  getData,
  AggregateType,
  Operator,
  getDimension,
} from '@alife/mock-core';
import {
  atom,
  compute,
  pendingCompute,
  RdxContext,
  RdxState,
  Status,
  useRdxReset,
  useRdxSetter,
  useRdxState,
  useRdxStateLoader,
  waitForAll,
} from '@alife/rdx';
import { Button, Input, Select, Table } from '@alife/hippo';
import '@alife/hippo/dist/hippo.css';

export default {
  title: '场景专题',
  parameters: {
    info: { inline: true },
  },
};

const areaCompute = compute({
  id: 'areaCompute',
  get: async () => {
    const data = await getDimension({
      dimensions: '地区名称',
    });
    return {
      dataSource: data.data,
      value: data.data[0].value,
    };
  },
});
const documentDateCompute = compute({
  id: 'documentDateCompute',
  get: async ({ get }) => {
    const data = await getDimension({
      dimensions: '单据日期',
      filters: [
        {
          member: '地区名称',
          operator: Operator.equals,
          values: get(areaCompute).value,
        },
      ],
    });
    return {
      dataSource: data.data,
      value: data.data[0].value,
    };
  },
});
const customerClassificationCompute = compute({
  id: 'customerClassificationCompute',
  get: async ({ get }) => {
    const data = await getDimension({
      dimensions: '客户分类',
      filters: [
        {
          member: '地区名称',
          operator: Operator.equals,
          values: get(areaCompute).value,
        },
        {
          member: '单据日期',
          operator: Operator.equals,
          values: get(documentDateCompute).value,
        },
      ],
    });
    return {
      dataSource: data.data,
      value: data.data[0].value,
    };
  },
});
const dimensions = ['地区名称', '单据日期', '客户分类'];
const computes = [
  areaCompute,
  documentDateCompute,
  customerClassificationCompute,
];

const FilterItem = (props: {
  title: string;
  compute: RdxState<{
    dataSource: {
      label: any;
      value: any;
    }[];
    value: any;
  }>;
}) => {
  const { title, compute } = props;
  const [status, value, setValue, context] = useRdxStateLoader(compute);
  if (status === Status.Error) {
    return <div>数据获取出错拉</div>;
  }
  return (
    <div style={{ paddingBottom: 12, paddingRight: 12 }}>
      <strong>{title}： </strong>
      <Select
        state={context.loading ? 'loading' : null}
        dataSource={context.loading ? [] : value.dataSource}
        value={context.loading ? '' : value.value}
        onChange={(v) => {
          setValue(v);
        }}
      />
    </div>
  );
};
const TableCompute = compute({
  id: 'tableData',
  get: async ({ get }) => {
    const fetchData = await getData({
      dimensions: dimensions,
      measures: [{ key: '税费', aggregateType: AggregateType.Sum }],
      filters: [
        {
          member: '地区名称',
          operator: Operator.equals,
          values: get(areaCompute).value,
        },
        {
          member: '单据日期',
          operator: Operator.equals,
          values: get(documentDateCompute).value,
        },
        {
          member: '客户分类',
          operator: Operator.equals,
          values: get(customerClassificationCompute).value,
        },
      ],
    });
    return fetchData.data;
  },
});
const TableView = () => {
  const [status, value, setValue, context] = useRdxStateLoader(TableCompute);
  return (
    <Table dataSource={value} loading={context.loading}>
      {dimensions.map((item) => (
        <Table.Column title={item} dataIndex={item}></Table.Column>
      ))}
      <Table.Column title='税费' dataIndex='税费'></Table.Column>
    </Table>
  );
};

export const 多级联动搜索列表 = () => {
  return (
    <RdxContext>
      <div style={{ display: 'flex' }}>
        {dimensions.map((item, index) => {
          return <FilterItem title={item} compute={computes[index]} />;
        })}
      </div>
      <TableView />
    </RdxContext>
  );
};
