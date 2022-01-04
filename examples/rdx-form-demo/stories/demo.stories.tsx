import React from 'react';
import {
  AggregateType,
  getData,
  getDimension,
  Operator,
} from '@alife/mock-core';
import { Button, Select, Table } from '@alife/hippo';
import { useEffect, useState } from 'react';
import {
  atom,
  batchUpdate,
  RdxContext,
  useRdxState,
} from '../../../packages/rdx/src';
export default {
  title: 'demo',
  parameters: {
    info: { inline: true },
  },
};

// export const 数据请求示例 = (props: { params }) => {
//   const { params } = props;
//   const [dataSource, setDataSource] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   useEffect(() => {
//     // cancel上次的请求，避免数据竞态的问题
//     // Cancel ....
//     setLoading(true);
//     getData({
//       dimensions: ['地区名称'],
//       measures: [{ key: '税费', aggregateType: AggregateType.Sum }],
//     })
//       .then((res) => {
//         if (res.success) {
//           setDataSource(res.data);
//         } else {
//           setError('请求失败');
//         }
//       })
//       .catch((error) => {
//         setError('请求异常');
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, [params]);
//   if (error) {
//     return <div>{error}</div>;
//   }
//   return (
//     <Table
//       loading={loading}
//       dataSource={dataSource}
//       columns={[
//         {
//           dataIndex: '地区名称',
//           title: '地区名称',
//         },
//         {
//           dataIndex: '税费',
//           title: '税费',
//         },
//       ]}
//     ></Table>
//   );
// };
const a = atom({
  id: '1',
  defaultValue: 1,
});
const B = () => {
  const [state, setState] = useRdxState(a);
  console.log('renderer');
  return (
    <Button
      onClick={() => {
        setState((state) => state + 1);
        setState((state) => state + 1);
        setState((state) => state + 1);
      }}
    >
      22 ---- {state}
    </Button>
  );
};
export function testDoubleClick() {
  return (
    <RdxContext>
      <B />
    </RdxContext>
  );
}

export function test() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {[1, 2, 3, 4].map((item, index) => (
        <div style={{ width: '50%' }}>{item}</div>
      ))}
    </div>
  );
}
export function test2() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, 50%)',
      }}
    >
      {[1, 2, 3, 4].map((item, index) => (
        <div>{item}</div>
      ))}
    </div>
  );
}

interface IFetchInfo {
  key: string;
  request: (depsValue?: string[]) => Promise<any>;
  deps: string[];
}
interface IOptions {
  fetchInfo: IFetchInfo[];
}
enum Status {
  Ideal = 1,
  Loading = 2,
  Error = 3,
}
function fetchDataByDeps(options: IOptions) {
  const { fetchInfo } = options;
  const statusMap = new Map<string, Status>();
  const valueMap = new Map<string, { dataSource: any[]; value: string }>();
  let forceUpdateMap = new Map();
  function fetchData() {
    const findFetch = fetchInfo.find(
      (item) =>
        (item.deps || []).every((dep) => statusMap.get(dep) === Status.Ideal) &&
        statusMap.get(item.key) !== Status.Ideal
    );
    if (findFetch) {
      findFetch
        .request((findFetch.deps || []).map((dep) => valueMap.get(dep).value))
        .then((res) => {
          // 更新值的状态
          valueMap.set(findFetch.key, {
            dataSource: res,
            value: res[0].value,
          });
          // 更新状态
          statusMap.set(findFetch.key, Status.Ideal);
          // 强制更新组件状态
          forceUpdateMap.get(findFetch.key)();
          // 继续执行下游
          fetchData();
        })
        .catch((error) => {
          console.log('error: ', error);
          statusMap.set(findFetch.key, Status.Error);
        });
    }
  }
  return {
    useFetchState: (key: string) => {
      const [state, setState] = React.useState(1);
      const forceUpdate = () => setState((v) => v + 1);
      forceUpdateMap.set(key, forceUpdate);
      return [
        { ...valueMap.get(key), status: statusMap.get(key) },
        (value) => {
          valueMap.set(key, { ...valueMap.get(key), value: value });
          forceUpdate();
          fetchInfo
            .slice(fetchInfo.findIndex((item) => item.key === key) + 1)
            .forEach((item) => {
              statusMap.set(item.key, Status.Loading);
              forceUpdateMap.get(item.key) &&
                forceUpdateMap.get(item.key)((state) => ({
                  ...state,
                  ...valueMap.get(item.key),
                  status: statusMap.get(item.key),
                }));
            });
          fetchData();
        },
      ] as [
        { value: string; dataSource: any[]; status: Status },
        (value: string) => void
      ];
    },
    start: () => {
      fetchInfo.forEach((item) => {
        statusMap.set(item.key, Status.Loading);
        forceUpdateMap.get(item.key) && forceUpdateMap.get(item.key)();
      });
      fetchData();
    },
  };
}
const { start, useFetchState } = fetchDataByDeps({
  fetchInfo: [
    {
      key: '单据日期',
      deps: [],
      request: async () => {
        console.log('单据日期 ++++++ 请求了');
        const res = await getDimension({
          dimensions: '单据日期',
        });
        return res.data;
      },
    },
    {
      key: '地区名称',
      deps: ['单据日期'],
      request: async (depsValue) => {
        console.log('地区名称 ++++++ 请求了');
        const res = await getDimension({
          dimensions: '地区名称',
          filters: [
            {
              member: '单据日期',
              operator: Operator.equals,
              values: depsValue[0],
            },
          ],
        });
        return res.data;
      },
    },
    {
      key: '客户分类',
      deps: ['单据日期', '地区名称'],
      request: async (depsValue) => {
        console.log('客户分类 ++++++ 请求了');
        const res = await getDimension({
          dimensions: '客户分类',
          filters: [
            {
              member: '单据日期',
              operator: Operator.equals,
              values: depsValue[0],
            },
            {
              member: '地区名称',
              operator: Operator.equals,
              values: depsValue[1],
            },
          ],
        });
        return res.data;
      },
    },
  ],
});
const DateComp = () => {
  const [state, setState] = useFetchState('单据日期');
  if (state.status === Status.Loading) {
    return <span>loading...</span>;
  }
  console.log('单据日期 ---- 渲染了');
  return (
    <Select
      value={state.value}
      dataSource={state.dataSource}
      onChange={(v) => setState(v)}
    />
  );
};
const AreaComp = () => {
  const [state, setState] = useFetchState('地区名称');
  if (state.status === Status.Loading) {
    return <span>loading...</span>;
  }
  console.log('地区名称 ---- 渲染了');
  return (
    <Select
      value={state.value}
      dataSource={state.dataSource}
      onChange={(v) => setState(v)}
    />
  );
};

const CustomerComp = () => {
  const [state, setState] = useFetchState('客户分类');
  if (state.status === Status.Loading) {
    return <span>loading...</span>;
  }
  console.log('客户分类 ---- 渲染了');
  return (
    <Select
      value={state.value}
      dataSource={state.dataSource}
      onChange={(v) => setState(v)}
    />
  );
};
export function Demo1() {
  useEffect(() => {
    start();
  });
  return (
    <div>
      <DateComp />
      <AreaComp />
      <CustomerComp />
    </div>
  );
}
