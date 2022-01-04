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
  useRdxValue,
  atom,
  useRdxState,
  useRdxRefresh,
} from '@alife/rdx';
import {
  Checkbox,
  Button,
  Select,
  Table,
  Loading,
  Icon,
  Balloon,
} from '@alife/hippo';

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
  const { submit, reset, loading: isLoading } = mutators.triggerOperates();
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
    const values = get(mutators.compute);
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
const Tips = () => {
  const preValue = useRdxValue(mutators.compute);
  const { getDependenciesState } = mutators.triggerOperates();
  const isDifferent =
    JSON.stringify(preValue) !== JSON.stringify(getDependenciesState());
  return isDifferent ? (
    <div
      style={{
        boxShadow: '0 0 8px 0 rgba(153, 163, 179, 0.28)',
        padding: 12,
        marginBottom: 12,
        borderRadius: 4,
        background: 'lightyellow',
        opacity: 0.8,
        color: 'rgb(134,134,130)',
      }}
    >
      表格数据并不是用最新的筛选条件查询的哦！
    </div>
  ) : (
    <></>
  );
};
const TableView = () => {
  const value = useRdxValueLoader(TableCompute);
  const { loading } = mutators.triggerOperates();
  return (
    <div>
      <Table
        dataSource={value.status === Status.Error ? [] : value.content || []}
        loadingComponent={(props) => {
          return (
            <Loading
              {...props}
              tip={loading() ? '筛选项加载中' : '数据加载中'}
            />
          );
        }}
        loading={isLoading(value.status)}
      >
        {dimensions.map((item) => (
          <Table.Column key={item} title={item} dataIndex={item}></Table.Column>
        ))}
        <Table.Column title='税费' dataIndex='税费'></Table.Column>
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
export const 简单搜索列表_查询控制 = () => {
  return (
    <RdxContext>
      <Menus />
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {dimensions.map((item, index) => {
          return (
            <FilterItem key={index} title={item} compute={computes[index]} />
          );
        })}
        <FilterFooter />
      </div>
      <Tips />
      <TableView />
    </RdxContext>
  );
};
