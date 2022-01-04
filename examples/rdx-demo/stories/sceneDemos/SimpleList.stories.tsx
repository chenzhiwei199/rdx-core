import React from 'react';
import { getData, AggregateType, Operator } from '@alife/mock-core';
import {
  atom,
  compute,
  RdxContext,
  useRdxState,
  useRdxStateLoader,
} from '@alife/rdx';
import { Input, Table } from '@alife/hippo';
import '@alife/hippo/dist/hippo.css';

export default {
  title: '场景专题/搜索列表例子',
  parameters: {
    info: { inline: true },
  },
};

const SearchAtom = atom({
  id: 'search',
  defaultValue: '北京',
});
const dimensions = ['地区名称', '单据日期', '客户分类'];
const InputSearchList = () => {
  const [value, setValue] = useRdxState(SearchAtom);
  return (
    <div style={{ paddingBottom: 12 }}>
      <strong>地区名称： </strong>
      <Input
        value={value}
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
          operator: Operator.contains,
          values: get(SearchAtom),
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

export const 简单搜索列表 = () => {
  return (
    <RdxContext>
      <InputSearchList></InputSearchList>
      <TableView />
    </RdxContext>
  );
};
