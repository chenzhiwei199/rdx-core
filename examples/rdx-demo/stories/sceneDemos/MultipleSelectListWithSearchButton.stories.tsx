import React, { useMemo, useRef } from 'react';
import {
  getData,
  AggregateType,
  Operator,
  getDimension,
} from '@alife/mock-core';
import {
  compute,
  DefaultValue,
  waitForTrigger,
  RdxContext,
  RdxState,
  Status,
  useRdxStateLoader,
  isLoading,
  useRdxValueLoader,
} from '@alife/rdx';
import { Button, Select, Table } from '@alife/hippo';
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
    // 如何判断是刷新了，还是使用新的值
    return {
      dataSource: data.data,
      value: data.data[0].value,
    };
  },
  set: ({ set, get }, newValue) => {
    if (newValue instanceof DefaultValue) {
    } else {
      set(areaCompute, { ...get(areaCompute), value: newValue });
    }
  },
});

const documentDateCompute = compute({
  id: 'documentDateCompute',
  get: async (config) => {
    const data = await getDimension({
      dimensions: '单据日期',
      filters: [
        {
          member: '地区名称',
          operator: Operator.equals,
          values: config.get(areaCompute).value,
        },
      ],
    });
    return {
      dataSource: data.data,
      value: data.data[0].value,
    };
  },
  set: ({ set, get }, newValue) => {
    if (newValue instanceof DefaultValue) {
    } else {
      set(documentDateCompute, {
        ...(get(documentDateCompute) as any),
        value: newValue,
      });
    }
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
          values: (get(documentDateCompute) as any).value,
        },
      ],
    });
    return {
      dataSource: data.data,
      value: data.data[0].value,
    };
  },
  set: ({ set, get }, newValue) => {
    if (newValue instanceof DefaultValue) {
    } else {
      set(customerClassificationCompute, {
        ...(get(customerClassificationCompute) as any),
        value: newValue,
      });
    }
  },
});
const dimensions = ['地区名称', '单据日期', '客户分类'];
const computes = [
  areaCompute,
  documentDateCompute,
  customerClassificationCompute,
];

const mutators = waitForTrigger(computes);
const FilterFooter = () => {
  const { submit, reset, isLoading } = mutators.pending();

  return (
    <div>
      <Button
        disabled={isLoading()}
        onClick={() => {
          submit();
        }}
        type='primary'
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
    </div>
  );
};
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
  const [status, value, setValue] = useRdxStateLoader(compute);
  console.log('value: ', value, status);
  if (status === Status.Error) {
    return <div>数据获取出错拉</div>;
  }
  return (
    <div style={{ paddingBottom: 12, paddingRight: 12 }}>
      <strong>{title}： </strong>
      <Select
        state={isLoading(status) ? 'loading' : null}
        dataSource={isLoading(status) ? [] : value.dataSource}
        value={isLoading(status) ? '' : value.value}
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
    const values = get(mutators.pendingCompute);
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
const TableView = () => {
  const [status, value] = useRdxValueLoader(TableCompute);
  return (
    <Table dataSource={value} loading={isLoading(status)}>
      {dimensions.map((item) => (
        <Table.Column title={item} dataIndex={item}></Table.Column>
      ))}
      <Table.Column title='税费' dataIndex='税费'></Table.Column>
    </Table>
  );
};

export const 多级联动搜索列表2 = () => {
  return (
    <RdxContext>
      <div style={{ display: 'flex' }}>
        {dimensions.map((item, index) => {
          return <FilterItem title={item} compute={computes[index]} />;
        })}
      </div>
      <FilterFooter />
      <TableView />
    </RdxContext>
  );
};
