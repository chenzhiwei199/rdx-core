import React, { useMemo, useRef } from 'react';
import {
  getData,
  AggregateType,
  Operator,
  getDimension,
  Filters,
  DimNames,
} from '@alife/mock-core';
import {
  compute,
  DefaultValue,
  waitForSetter,
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
  useRdxReset,
  computeFamily,
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
  title: 'SearchTest',
  parameters: {
    info: { inline: true },
  },
};
const areaAtom = atom({
  id: 'areaAtom',
  defaultValue: '',
});

const documentDateAtom = atom({
  id: 'documentDateAtom',
  defaultValue: '',
  effects: [({ setSelf, onDependenciesSet}) => {
    onDependenciesSet(() => {
      setSelf('')
    }, [areaAtom])
  }]
});

const customerClassificationAtom = atom({
  id: 'customerClassificationAtom',
  defaultValue: '',
  effects: [({ setSelf, onDependenciesSet}) => {
    onDependenciesSet(() => {
      setSelf('')
    }, [areaAtom, documentDateAtom])
  }]
});
const dataComputeFamily = computeFamily({
  id: 'dataCompute',
  get: (params: { dimensions: DimNames; filters?: Filters }) => async () => {
    const data = await getDimension(params);
    return data.data;
  },
});
const areaCompute = compute({
  id: 'areaCompute',
  get: async ({ get}) => {
    const value = get(areaAtom)
    const data = get(dataComputeFamily({
      dimensions: '地区名称',
    }))
    return {
      dataSource: data,
      value: value || data[0].value,
    };
  },
  set: ({ set}, newValue) => {
    set(areaAtom, newValue)
  }
});
const documentDateDataSourceCompute = compute({
  id: 'documentDateDataSourceCompute',
  get: ({ get }) => {
    const data = get(dataComputeFamily({
      dimensions: '单据日期',
      filters: [
        {
          member: '地区名称',
          operator: Operator.equals,
          values: get(areaCompute).value,
        },
      ],
    }))
    return data
  }
})
// 当依赖项变更了，需要重置当前的数据
const documentDateCompute = compute({
  id: 'documentDateCompute',
  get: async ({ get }) => {
    const v = get(documentDateAtom)
    // 根据依赖项判断
    const data = get(documentDateDataSourceCompute)
    return {
      dataSource: data,
      value: v || data[0].value,
    };
  },
  set: ({ set}, newValue) => {
    set(documentDateAtom, newValue)
  }
});
const customerClassificationCompute = compute({
  id: 'customerClassificationCompute',
  get: async ({ get }) => {
    const data = get(dataComputeFamily({
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
    }))

    return {
      dataSource: data,
      value: get(customerClassificationAtom) || data[0].value,
    };
  },
  set: ({ set, get }, newValue) => {
    set(customerClassificationAtom, newValue)
  },
});
const dimensions = ['地区名称', '单据日期', '客户分类'];
const computes = [
  areaCompute,
  documentDateCompute,
  customerClassificationCompute,
];
const waitCompute = waitForSetter(computes);
const FilterFooter = () => {
  const [value, submit] = useRdxStateLoader(waitCompute);
  const reset = useRdxReset(waitCompute);
  return (
    <div>
      <Button
        disabled={isLoading(value.status)}
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
// const Tips = () => {
//   const preValue = useRdxValue(mutators.compute);
//   const { getDependenciesState } = mutators.triggerOperates();
//   const isDifferent =
//     JSON.stringify(preValue) !== JSON.stringify(getDependenciesState());
//   return isDifferent ? (
//     <div
//       style={{
//         boxShadow: '0 0 8px 0 rgba(153, 163, 179, 0.28)',
//         padding: 12,
//         marginBottom: 12,
//         borderRadius: 4,
//         background: 'lightyellow',
//         opacity: 0.8,
//         color: 'rgb(134,134,130)',
//       }}
//     >
//       表格数据并不是用最新的筛选条件查询的哦！
//     </div>
//   ) : (
//     <></>
//   );
// };
const TableView = () => {
  const value = useRdxValueLoader(TableCompute);
  return (
    <div>
      <Table
        dataSource={value.status === Status.Error ? [] : value.content || []}
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
      {/* <Tips /> */}
      <TableView />
    </RdxContext>
  );
};
