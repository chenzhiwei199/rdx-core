


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
  RdxContext,
  RdxState,
  Status,
  useRdxStateLoader,
  isLoading,
  useRdxValueLoader,
  atom,
  useRdxState,
  useRdxRefresh,
  waitForAll,
} from '@alife/rdx';
import {
  Checkbox,
  Select,
  Table,
  Loading,
  Icon,
  Balloon,
} from '@alife/hippo';
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
    // 1. 放在请求之后有问题，依赖没有更新
    if (config.get(menuState).showError) {
      throw new Error('测试数据异常拉');
    }
    // 2. 错误信息怎么获取
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
    console.log('customerClassificationCompute: ');
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
    console.log('customerClassificationCompute: ', data);
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

const waitForAllCompute = waitForAll(computes);
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
  const [value, setValue] = useRdxStateLoader(compute);
  const refresh = useRdxRefresh(compute);
  return (
    <div
      style={{
        paddingBottom: 12,
        paddingRight: 12,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <strong>{title}： </strong>
      <Select
        state={isLoading(value.status) ? 'loading' : null}
        dataSource={
          isLoading(value.status) || value.status === Status.Error
            ? []
            : value.content.dataSource
        }
        value={
          isLoading(value.status) || value.status === Status.Error
            ? ''
            : value.content.value
        }
        onChange={(v) => {
          setValue(v);
        }}
      />
      {value.status === Status.Error && (
        <>
          <Balloon
            trigger={<Icon type='error' style={{ color: 'red' }}></Icon>}
          >
            {value.errorMsg}
          </Balloon>
          <Icon
            style={{ color: '#23a3ff' }}
            type='refresh'
            onClick={() => {
              refresh();
            }}
          />
        </>
      )}
    </div>
  );
};
const TableCompute = compute({
  id: 'tableData',
  get: async ({ get }) => {
    let values = null;
    values = get(waitForAllCompute)
    console.log('values: ', values);
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
  const value = useRdxValueLoader(TableCompute);
  return (
    <div>
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
          <Table.Column  key={item} title={item} dataIndex={item}></Table.Column>
        ))}
        <Table.Column key={'税费'} title='税费' dataIndex='税费'></Table.Column>
      </Table>
    </div>
  );
};
const menuState = atom({ id: 'menuState', defaultValue: { showError: false } });
const Menus = () => {
  const [state, setState] = useRdxState(menuState);
  return (
    <div>
      <Checkbox
        checked={state.showError}
        onChange={(checked) => {
          setState({ ...state, showError: checked });
        }}
      >
        切换数据异常情况
      </Checkbox>
    </div>
  );
};
export const 简单搜索列表 = () => {
  return (
    <RdxContext>
      <Menus />
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {dimensions.map((item, index) => {
          return <FilterItem title={item} compute={computes[index]} />;
        })}
      </div>
      <TableView />
    </RdxContext>
  );
};
