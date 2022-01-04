import {
  AggregateType,
  getData,
  Operator,
  Order,
  dimensions,
  measures,
} from '@alife/mock-core';
import {
  atom,
  atomFamily,
  compute,
  computeFamily,
  DefaultValue,
  distinctUntilChanged,
} from '@alife/rdx';

import React from 'react';
import { DomainName, DomainType, Field } from './type';

// 数据的维度指标池子
export const fieldPools = atom({
  id: 'fieldPools',
  defaultValue: {
    dimensions: dimensions.map((item) => ({ label: item, code: item })),
    measures: measures.map((item) => ({ label: item, code: item })),
  },
});

export const runtimeFieldAtoms = atomFamily({
  id: 'field',
  defaultValue: [
    {
      label: '单据日期',
      code: '单据日期',
      domainType: DomainType.Dimension,
      domainName: DomainName.X,
    },
    {
      label: '利润',
      code: '利润',
      domainType: DomainType.Measure,
      domainName: DomainName.Y,
    },
    {
      label: '地区名称',
      code: '地区名称',
      domainType: DomainType.Dimension,
      domainName: DomainName.DrillDown,
    },
    {
      label: '客户分类',
      code: '客户分类',
      domainType: DomainType.Dimension,
      domainName: DomainName.DrillDown,
    },
    {
      label: '业务员名称',
      code: '业务员名称',
      domainType: DomainType.Dimension,
      domainName: DomainName.DrillDown,
    },
    {
      label: '存货名称',
      code: '存货名称',
      domainType: DomainType.Dimension,
      domainName: DomainName.DrillDown,
    },
  ] as Field[],
});

export const activeBlock = atom({
  id: 'activeBlock',
  defaultValue: null as string
})
export const isBlockActive = computeFamily({
    id: 'isBlockActive',
    get: (chartId: string) => ({ get}) => {
      return get(activeBlock) === chartId
    }
})

export const activeSelectFields = compute({
  id: 'activeSelectFields',
  get: ({ get }) => {
    const active = get(activeBlock)
    if(active) {
      return get(runtimeFieldAtoms(active))
    }else {
      return null
    }
  },
});
export const selectMeasures = computeFamily({
  id: 'runtimeMeasures',
  get: (chartId: string) => ({ get }) => {
    return get(runtimeFieldAtoms(chartId)).filter(
      (item) => item.domainType === DomainType.Measure
    );
  },
});

export const selectDimensions = computeFamily({
  id: 'runtimeDimensions',
  get: (chartId: string) => ({ get }) => {
    return get(runtimeFieldAtoms(chartId)).filter(
      (item) =>
        item.domainType === DomainType.Dimension &&
        item.domainName !== DomainName.DrillDown
    );
  },
});
export const selectDrillDimensions = computeFamily({
  id: 'selectDrillDimensions',
  get: (chartId: string) => ({ get }) => {
    return get(runtimeFieldAtoms(chartId)).filter(
      (item) => item.domainName === DomainName.DrillDown
    );
  },
});

// 根据domainName获取维度数据
export const selectDimensionByDomainName = computeFamily({
  id: 'selectDimensionByDomainName',
  get: (params: { domainName: DomainName; chartId: string }) => ({ get }) => {
    const { chartId, domainName } = params;
    // 下钻优先级高于维度
    const drill = get(runtimeDrillOperatorStates(chartId));
    return [
      ...drill.map((item) => ({
        code: item.drillField,
        domainName: item.domainName,
        label: item.drillField,
        domainType: DomainType.Dimension,
      })),
      ...get(selectDimensions(chartId)),
    ].find((item) => item.domainName === domainName);
  },
});
interface IActiveState {
  selectd: string[];
  // 当前选择的维度是哪里的
  domainName: DomainName;
}
/**
 * 当前组件的激活状态
 */
export const runtimeActiveStates = atomFamily({
  id: 'runtimeActiveState',
  defaultValue:() => ( {
    selectd: [],
    // 当前选择的维度是哪里的
    domainName: DomainName.X,
  } as IActiveState),
});

export const runtimeActiveStateProxy = computeFamily({
  id: 'runtimeActiveStateProxy',
  get: (params: IChartInfo) => ({ get}) => {
    return get(runtimeActiveStates(params.chartId))
  },
  set: (params: IChartInfo) => ({ get, set}, newValue: IActiveState | DefaultValue) => {
    // 清空非当前节点的激活状态
    const { chartId, parentId} = params
    const blocks = get(blockAtoms(parentId))
    blocks.forEach((id) => {
      const activeInfo = get(runtimeActiveStates(id))
      if(id !== chartId) {
        if(activeInfo.selectd.length  > 0 ) {
          set(runtimeActiveStates(id), state => ({...state, selectd: []}) )
        }
      } else {
        set(runtimeActiveStates(id), state => ({ ...state, ...newValue}))
      }
    })
    // runtimeActiveStates
  }
})
interface IChartInfo {
  chartId: string;
  parentId: string
}
export const blockAtoms = atomFamily({
  id: 'blockAtoms',
  defaultValue: () => [],
})
export const selectNotCurrentActiveStates = computeFamily({
  id: 'selectNotCurrentActiveStates',
  get: (params: IChartInfo) => ({ get}) => {
    const { chartId,  parentId } = params
    const blocks = get(blockAtoms(parentId))
    // 获取当前作用域下面的节点
    return blocks.reduce((arr, key) => {
      // 选择非当前节点的active状态
      if(key !== chartId ) {
        const currentActiveState = get(runtimeActiveStates(key))
        const activeDimension = get(selectDimensionByDomainName({
          domainName: currentActiveState.domainName,
          chartId
        }))
        if(currentActiveState.selectd.length > 0) {
          arr.push(            {
            code: activeDimension.code,
            value: currentActiveState.selectd,
            op: 'include'
          })
        }
       
      }
      return arr
      
      
    }, [] as Partial<IFilterOperator>[])
  }
  
})

export interface IDrillOperator {
  uid: string;
  // 下钻到的视图
  domainName: DomainName;
  operationTime: number;
  // 下钻的目标字段
  drillField: string;
  // 过滤的字段
  code: string;
  // 过滤字段的label
  label: string;
  value: string[];
}
/**
 * 下钻的高级操作，仅对当前图表生效
 */
export const runtimeDrillOperatorStates = atomFamily({
  id: 'drillOperate',
  defaultValue: () => ([] as IDrillOperator[]),
});
interface IFilterOperator {
  uid: string;
  operationTime: number;
  code: string;
  op?: 'include' | 'exclude';
  value: string[];
}
/**
 * 聚焦和排除的高级操作，仅对当前图表生效
 */
export const runtimeFilterOperatorStates = atom({
  id: 'filterOperate',
  defaultValue: [] as IFilterOperator[],
});


/**
 * 图表运行时排序的状态
 */
export const runtimeOrderStates = atomFamily({
  id: 'orderOperate',
  defaultValue: () => [] as Order[],
});

/**
 * 请求数据的compute
 */
export const fetchChartData = computeFamily({
  id: 'fetchChartData',
  get: (params: IChartInfo) => async ({ get }) => {
    console.log('fetchChartData: ');
    const { chartId, parentId } = params
    // rdx有bug，需要再通知下游更新的时候检测一下
    // 固定维度
    const fields = get(runtimeFieldAtoms(chartId));
    const fitlerFromActive = get(distinctUntilChanged(selectNotCurrentActiveStates(params), (preValue, nextValue) => {
      return JSON.stringify(preValue) === JSON.stringify(nextValue)
    }) )

    const drills = get(runtimeDrillOperatorStates(chartId));
    const filters = get(runtimeFilterOperatorStates);
    const orders = get(runtimeOrderStates(chartId));
    // 同一个视觉通道只能用一个维度
    const dimensions = get(selectDimensions(chartId));
    const allDimensions = [
      ...drills.map((item) => ({ ...item, code: item.drillField })),
      ...dimensions,
    ];
    const domainNames = allDimensions.reduce((set, dim) => {
      if (!set.has(dim.domainName)) {
        set.add(dim.domainName);
      }
      return set;
    }, new Set<DomainName>());

    const requestParams = {
      
      dimensions: Array.from(domainNames).map(
        (domainName) =>
          allDimensions.find((item) => item.domainName === domainName).code
      ),
      measures: fields
        .filter((item) => item.domainType === DomainType.Measure)
        .map((item) => ({
          key: item.code,
          aggregateType: AggregateType.Sum,
        })),
      orders,
      filters: [
        ...drills.map((item) => ({
          member: item.code,
          operator: Operator.contains,
          values: item.value,
        })),
        ...[...filters, ...fitlerFromActive].map((item) => ({
          member: item.code,
          operator:
            item.op === 'include' ? Operator.contains : Operator.notContains,
          values: item.value,
        })),
      ],
    };
    const data = (await getData(requestParams)).data;
    console.log('requestParams: ', requestParams, data);
    return data;
  },
});

export function createBlockContext(): IBlockContext {
  return {
    runtimeActiveStates,
    runtimeFilterOperatorStates,
  };
}
interface IBlockContext {
  runtimeActiveStates: typeof runtimeActiveStates;
  runtimeFilterOperatorStates: typeof runtimeFilterOperatorStates;
  
}

export const BlockContext = React.createContext<IBlockContext>(null);

export function useBlockContext() {
  return React.useContext(BlockContext)
}
export function useChartContext() {
  return React.useContext(ChartContext)
}
export function createChartContext(params: IChartInfo): IChartContext {
  const { chartId } = params
  return {
    chartId: chartId,
    runtimeFieldAtoms: runtimeFieldAtoms(chartId),
    runtimeOrderStates: runtimeOrderStates(chartId),
    selectMeasures: selectMeasures(chartId),
    selectDimensions: selectDimensions(chartId),
    runtimeDrillOperatorStates: runtimeDrillOperatorStates(chartId),
    selectDrillDimensions: selectDrillDimensions(chartId),
    selectDimensionByDomainName: (domainName: DomainName) => selectDimensionByDomainName({ chartId, domainName}),
    fetchChartData: fetchChartData(params),
    runtimeActiveStates: runtimeActiveStates(chartId),
    runtimeActiveStateProxy: runtimeActiveStateProxy(params),
    runtimeFilterOperatorStates
  };
}
interface IChartContext {
  chartId: string
  runtimeFieldAtoms: ReturnType<typeof runtimeFieldAtoms>;
  selectMeasures: ReturnType<typeof selectMeasures>;
  selectDimensions: ReturnType<typeof selectDimensions>;
  selectDrillDimensions: ReturnType<typeof selectDrillDimensions>;
  runtimeDrillOperatorStates: ReturnType<typeof runtimeDrillOperatorStates>;
  runtimeOrderStates: ReturnType<typeof runtimeOrderStates>;
  selectDimensionByDomainName: (domainName: DomainName) => ReturnType<typeof selectDimensionByDomainName>;
  fetchChartData: ReturnType<typeof fetchChartData>;
  runtimeActiveStateProxy: ReturnType<typeof runtimeActiveStateProxy>;
  runtimeActiveStates: ReturnType<typeof runtimeActiveStates> 
  runtimeFilterOperatorStates: typeof runtimeFilterOperatorStates
}
export const ChartContext = React.createContext<IChartContext>(null);
