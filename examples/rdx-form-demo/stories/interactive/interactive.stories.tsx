import React, { useMemo, useState } from 'react';
import { HippoBaseChart, hippoTheme, LineBarChart } from '@alife/hippo-vis';
import styled from 'styled-components';
import {
  atom,
  batchUpdate,
  compute,
  computeFamily,
  isLoading,
  RdxContext,
  useRdxReset,
  useRdxSetter,
  useRdxState,
  useRdxValue,
  useRdxValueLoader,
} from '@alife/rdx';
import { OrderType, dimensions, measures, mockData } from '@alife/mock-core';
import {
  Loading,
  Radio,
  MenuButton,
  Button,
  Table2,
  Icon,
  Select,
} from '@alife/hippo';
import { v1 as uuid } from 'uuid';
import { produce } from 'immer';
import { AnalysisOperatorType, DomainName, Field } from './type';
import {
  fieldPools,
  ChartContext,
  createChartContext,
  BlockContext,
  createBlockContext,
  useChartContext,
  blockAtoms,
  activeBlock,
  activeSelectFields,
  isBlockActive,
} from './atoms';
export default {
  title: '交互式图表/示例',
  parameters: {
    info: { inline: true },
  },
};

import { RecoilRoot, selector, useSetRecoilState } from 'recoil';
const a = selector({
  key: 'test',
  get: () => {
    return 1;
  },
  set: ({}, newV) => {
    console.log('newV: ', newV);
  },
});
const B = () => {
  const set = useSetRecoilState(a);
  return (
    <div
      onClick={() => {
        set((a) => a + 1);
      }}
    >
      点击我
    </div>
  );
};

const Tag = styled.span`
  padding: 6px;
  margin-right: 6px;
  border: 1px solid lightgrey;
`;
const Box = styled.div`
  padding: 12px;
  border: 1px dashed lightgrey;
`;

const HighLightTag = styled(Tag)`
  background: #23a3ff44;
  border: 1px solid #23a3ff;
`;
function FilterAndDrillValue() {
  const [filters, setFilters] = useRdxState(
    useChartContext().runtimeFilterOperatorStates
  );
  const [drills, setDrills] = useRdxState(
    useChartContext().runtimeDrillOperatorStates
  );
  const allOperators = [
    ...filters.map((item) => ({
      ...item,
      operateType: AnalysisOperatorType.Filter,
    })),
    ...drills.map((item) => ({
      ...item,
      operateType: AnalysisOperatorType.Drill,
    })),
  ].sort((pre, next) => {
    return pre.operationTime > next.operationTime ? 1 : -1;
  });
  return (
    <>
      {allOperators.length > 0 && (
        <div
          style={{
            boxShadow: 'rgba(0, 0, 0, 0.1) 1px 1px 4px 0px',
            padding: 12,
          }}
        >
          {allOperators.map((operator, index) => (
            <div
              style={{ display: 'flex', alignItems: 'center' }}
              onClick={() => {
                // 批量删除
                const opreators = allOperators.slice(index + 1);
                setDrills((drills) => {
                  return drills.filter((drill) =>
                    opreators.some((item) => item.uid === drill.uid)
                  );
                });
                setFilters((filters) => {
                  return filters.filter((filter) =>
                    opreators.some((item) => item.uid === filter.uid)
                  );
                });
              }}
            >
              {<HighLightTag>{operator.operateType}</HighLightTag>}
              {operator.code}-{operator.op}:{operator.value.join(',')}
              {operator.drillField} {operator.domainName}
              <Icon
                onClick={(e) => {
                  if (operator.operateType === AnalysisOperatorType.Drill) {
                    setDrills((drills) => {
                      return produce(drills, (drills) => {
                        drills.splice(
                          drills.findIndex((item) => item.uid === operator.uid),
                          1
                        );
                      });
                    });
                  } else {
                    setFilters((filters) => {
                      return produce(filters, (filters) => {
                        filters.splice(
                          filters.findIndex(
                            (item) => item.uid === operator.uid
                          ),
                          1
                        );
                      });
                    });
                  }
                  e.stopPropagation();
                }}
                style={{ cursor: 'pointer', color: '#23a3ff' }}
                type='close'
              ></Icon>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
const DomainNames = [
  { label: 'x轴', value: DomainName.X },
  { label: '颜色', value: DomainName.Color },
];
function AdvancedAnalysisControl() {
  const chartContext = useChartContext();
  const [activeInfo, setActiveInfo] = useRdxState(
    chartContext.runtimeActiveStateProxy
  );
  const setFilter = useRdxSetter(chartContext.runtimeFilterOperatorStates);
  const setDrill = useRdxSetter(chartContext.runtimeDrillOperatorStates);
  const [drillDomainName, setDrillDomainName] = useState(DomainName.X);
  const dimension = useRdxValue(
    chartContext.selectDimensionByDomainName(activeInfo.domainName)
  );
  return (
    <span
      style={{ display: activeInfo.selectd.length === 0 ? 'none' : 'unset' }}
    >
      <div>
        <strong style={{ paddingRight: 12 }}>切片切块方式</strong>
        <Button
          onClick={() => {
            setFilter((state) => [
              ...state,
              {
                uid: uuid(),
                operationTime: new Date().getTime(),
                code: dimension.code,
                op: 'include',
                value: activeInfo.selectd,
              },
            ]);
            setActiveInfo({
              ...activeInfo,
              selectd: [],
            });
          }}
        >
          聚焦
        </Button>
        <Button
          onClick={() => {
            setFilter((state) => [
              ...state,
              {
                uid: uuid(),
                operationTime: new Date().getTime(),
                code: dimension.code,
                op: 'exclude',
                value: activeInfo.selectd,
              },
            ]);
            setActiveInfo({
              ...activeInfo,
              selectd: [],
            });
          }}
        >
          排除
        </Button>
      </div>
      <div>
        <strong>下钻方式</strong>
        通过
        <Radio.Group
          value={drillDomainName}
          onChange={(v) => {
            setDrillDomainName(v as any);
          }}
          dataSource={DomainNames}
        />
        下钻:
        <MenuButton
          label='维度'
          onItemClick={(value) => {
            // 1. 定义数据
            // 2. 定义数据和映射的视觉通道
            batchUpdate(() => {
              // 1. 映射的轴`
              // 2. 确定的维度
              setDrill((state) => [
                ...state,
                {
                  label: value,
                  uid: uuid(),
                  domainName: drillDomainName,
                  operationTime: new Date().getTime(),
                  drillField: value,
                  code: dimension.code,
                  value: activeInfo.selectd,
                },
              ]);
              setActiveInfo({
                ...activeInfo,
                selectd: [],
              });
            });
          }}
        >
          {useRdxValue(chartContext.selectDrillDimensions).map((item) => (
            <MenuButton.Item key={item.code}>{item.label}</MenuButton.Item>
          ))}
        </MenuButton>
      </div>
    </span>
  );
}
function OrderControl() {
  const chartCotnext = useChartContext();
  const [orders, setOrders] = useRdxState(chartCotnext.runtimeOrderStates);
  const measure = useRdxValue(chartCotnext.selectMeasures);
  const [selectMeasure = measure[0]?.code, setSelectMeasure] = useState('');
  const currentOrderIndex = orders.findIndex(
    (item) => item.code === selectMeasure
  );
  return (
    <div>
      <strong>指标</strong>
      <Select
        value={selectMeasure}
        onChange={(v) => {
          setSelectMeasure(v);
        }}
        dataSource={measure.map((item) => ({
          label: item.label,
          value: item.code,
        }))}
      />
      <strong>排序方式</strong>
      <Radio.Group
        disabled={!selectMeasure}
        value={orders[currentOrderIndex]?.type}
        onChange={(v) => {
          if (currentOrderIndex === -1) {
            setOrders(
              orders.concat([{ code: selectMeasure, type: v as OrderType }])
            );
          } else {
            setOrders(
              produce(orders, (orders) => {
                orders[currentOrderIndex].type = v as OrderType;
              })
            );
          }
        }}
        dataSource={[
          { label: '升序', value: OrderType.Asc },
          { label: '降序', value: OrderType.Desc },
        ]}
      ></Radio.Group>
    </div>
  );
}

function toMap(data = [], key: string) {
  let m = new Map();
  data.forEach((item) => {
    m.set(item[key], item);
  });
  return m;
}
function generateSeriesCommon(options: {
  dataSource: any[];
  name: string;
  xDimensionCode: string;
  colorDimensionCode: string;
  active: string[];
  activeDomainName: DomainName;
  valueCode: string;
  xCategory: string[];
}) {
  const {
    dataSource,
    activeDomainName,
    name,
    colorDimensionCode,
    xDimensionCode,
    active,
    valueCode,
    xCategory,
  } = options;
  const activeItemStyle = {
    borderColor: '#000',
    borderWidth: 2,
    borderType: 'solid',
  };
  function activeStyle(row: any) {
    if (!row) {
      return false;
    }
    if (activeDomainName === DomainName.X) {
      return active.includes(row[xDimensionCode]);
    } else {
      return active.includes(row[colorDimensionCode]);
    }
  }
  const dataMap = toMap(dataSource, xDimensionCode);
  return {
    type: 'bar',
    name: name,
    data: xCategory.map((key) => ({
      name: key,
      itemStyle: activeStyle(dataMap.get(key)) && activeItemStyle,
      value: dataMap.has(key) ? dataMap.get(key)[valueCode] : null,
    })),
  };
}
function BarChart() {
  const chartContext = useChartContext();
  const active = useRdxValue(chartContext.runtimeActiveStates);
  const setActiveAndClearOthers = useRdxSetter(
    chartContext.runtimeActiveStateProxy
  );
  const value = useRdxValueLoader(chartContext.fetchChartData);
  console.log('requestParams: ', value, chartContext.fetchChartData.getId());
  const measure = useRdxValue(chartContext.selectMeasures);
  const xDimension = useRdxValue(
    chartContext.selectDimensionByDomainName(DomainName.X)
  );
  const colorDimension = useRdxValue(
    chartContext.selectDimensionByDomainName(DomainName.Color)
  );
  const dataSource = value.content || [];
  const brushSelected = React.useRef([]);
  const echartInstance = React.useRef(null);
  const colorCategory: Array<string> = Array.from(
    colorDimension
      ? dataSource.reduce((root, row, item) => {
          if (!root.has(row[colorDimension.code])) {
            root.add(row[colorDimension.code]);
          }
          return root;
        }, new Set<string>())
      : new Set<string>()
  );
  const xCategory: string[] = Array.from(
    dataSource.reduce((root, row, item) => {
      if (!root.has(row[xDimension.code])) {
        root.add(row[xDimension.code]);
      }
      return root;
    }, new Set<string>())
  );
  function generateSeriesBar(options: { name: string; dataSource: any[] }) {
    const { name, dataSource } = options;
    return generateSeriesCommon({
      xCategory: xCategory,
      dataSource,
      name: name,
      colorDimensionCode: colorDimension && colorDimension.code,
      xDimensionCode: xDimension.code,
      active: active.selectd,
      activeDomainName: active.domainName,
      valueCode: measure[0]?.code,
    });
  }
  const getOptions = () => {
    return {
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      brush: active.domainName === DomainName.X && {
        brushLink: 'all',
        toolbox: ['lineX', 'clear'],
        outOfBrush: {
          opacity: 0.1,
        },
        inBrush: {
          opacity: 1,
        },
      },
      xAxis: {
        type: 'category',
        data: xCategory,
      },
      tooltip: {
        trigger: 'axis',
      },
      yAxis: {
        type: 'value',
      },
      legend: {
        data: xCategory,
      },
      series: !colorDimension
        ? generateSeriesBar({
            dataSource,
            name: null,
          })
        : Array.from(colorCategory).map((colorKey) =>
            generateSeriesBar({
              dataSource: dataSource.filter(
                (item) => item[colorDimension.code] === colorKey
              ),
              name: colorKey,
            })
          ),
    };
  };
  return (
    <Loading inline={false} visible={isLoading(value.status)}>
      <div>
        <div>
          <strong style={{ paddingRight: 12 }}>选择通道</strong>
          <Radio.Group
            value={active.domainName}
            onChange={(v) => {
              setActiveAndClearOthers({
                selectd: [],
                domainName: v as any,
              });
            }}
            dataSource={[
              { label: 'x轴', value: DomainName.X },
              {
                label: '颜色',
                value: DomainName.Color,
                disabled: !colorDimension,
              },
            ]}
          />
        </div>
        <div>
          <strong style={{ paddingRight: 12 }}>排序方式</strong>
          <OrderControl />
        </div>
      </div>
      <HippoBaseChart
        chartRef={echartInstance}
        events={{
          brushSelected: (params) => {
            brushSelected.current = params.batch[0].selected[0].dataIndex;
          },
          brushend: (params) => {
            setActiveAndClearOthers((active) => {
              const inBrush = brushSelected.current.map(
                (item) => xCategory[item]
              );
              // 交叉的
              const intersection = active.selectd.filter((item) =>
                inBrush.includes(item)
              );
              return {
                ...active,
                selectd: [
                  ...active.selectd.filter(
                    (item) => !intersection.includes(item)
                  ),
                  ...inBrush.filter((item) => !intersection.includes(item)),
                ],
              };
            });
            echartInstance.current.dispatchAction({
              type: 'brush',
              areas: [],
            });
            echartInstance.current.dispatchAction({
              type: 'takeGlobalCursor',
              key: 'brush',
              brushOption: {
                brushType: false,
                brushMode: 'single',
              },
            });
          },
          click: (params) => {
            const value =
              active.domainName === DomainName.X
                ? params.data.name
                : params.seriesName;
            if (active.selectd.includes(value)) {
              setActiveAndClearOthers((active) => ({
                ...active,
                selectd: active.selectd.filter((item) => item !== value),
              }));
            } else {
              setActiveAndClearOthers((active) => ({
                ...active,
                selectd: [...active.selectd, value],
              }));
            }
          },
        }}
        option={getOptions()}
      ></HippoBaseChart>
    </Loading>
  );
}
function Detail() {
  return (
    <div>
      <h2>数据明细</h2>
      <Table2
        // @ts-ignore
        columns={[...dimensions, ...measures].map((item) => ({
          dataIndex: item,
          title: item,
        }))}
        dataSource={mockData}
      />
    </div>
  );
}

function FieldPools() {
  const { dimensions, measures } = useRdxValue(fieldPools);
  return (
    <Box style={{}}>
      <h3>meta</h3>
      <h4>维度：</h4>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {dimensions.map((item) => (
          <Tag>{item.label}</Tag>
        ))}
      </div>
      <h4>指标：</h4>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {measures.map((item) => (
          <Tag>{item.label}</Tag>
        ))}
      </div>
    </Box>
  );
}

function ChooseFieldPools() {
  const activeId = useRdxValue(activeBlock);
  const fields = useRdxValue(activeSelectFields);
  if (!fields) {
    return <div> 暂未选中图表。</div>;
  }
  const fieldsMap = fields.reduce((root, item) => {
    if (!root[item.domainName]) {
      root[item.domainName] = [];
    }
    root[item.domainName].push(item);
    return root;
  }, {} as { [key: string]: Field[] });
  const domains = [
    DomainName.X,
    DomainName.Y,
    DomainName.Color,
    DomainName.DrillDown,
  ];
  return (
    <Box>
      <h3>选中的池子 {activeId}</h3>
      <div>
        {domains.map((domain) => {
          return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <strong>{domain}:</strong>
              {fieldsMap[domain]?.map((item) => (
                <Tag>{item.label}</Tag>
              ))}
            </div>
          );
        })}
      </div>
    </Box>
  );
}
// function QuickAnalysis() {
//   const setDrills = useRdxSetter(runtimeDrillOperatorStates);
//   const setFilters = useRdxSetter(runtimeFilterOperatorStates);
//   return (
//     <div>
//       <h3>分析方式</h3>
//       <div>
//         1. 查看两个不同城市按照趋势的对比 通过颜色通道下钻，然后通过聚焦筛选{' '}
//         <Button shape='text' onClick={() => {}}>
//           分析
//         </Button>
//       </div>
//     </div>
//   );
// }

function SingleChart(props: { chartId: string; parentId: string }) {
  const setActive = useRdxSetter(activeBlock);
  const active = useRdxValue(isBlockActive(props.chartId));
  return (
    <ChartContext.Provider value={createChartContext(props)}>
      <div
        style={{ border: active ? '2px solid #23a3ff' : '2px solid lightgrey' }}
        onClick={() => {
          setActive(props.chartId);
        }}
      >
        <h2>{props.chartId}</h2>
        <div>
          <Box>
            {/* <QuickAnalysis /> */}
            <h3>高级分析操作</h3>
            <AdvancedAnalysisControl />
            <h3>筛选展示</h3>
            <FilterAndDrillValue />
            <h2>可视化方式</h2>
            <BarChart />
          </Box>
        </div>
      </div>
    </ChartContext.Provider>
  );
}

function Introduce() {
  return (
    <div>
      <div
        style={{
          fontSize: 14,
          lineHeight: '32px',
          gridColumnGap: '12px',
          gridGap: 12,
        }}
      >
        <div>
          看数目的： 1. 看数 2. 分析 3. 探索 4. 数据挖掘 5.洞察 6.归因
          <div>
            数据分析是为了提取有用信息和形成结论而对数据加以详细研究和概括总结的过程
          </div>
          <div>
            3.探索分析 <br />
            探索性数据分析方法注重数据的真实分布，强调数据的可视化，使分析者能一目了然看出数据中隐含的规律，从而得到启发，以此帮助分析者找到适合数据的模型。“探索性”是指分析者对待解问题的理解会随着研究的深入不断变化。
          </div>
          <div>
            4.数据挖掘 <br />
            数据挖掘，传说中的建模分析，也是这两年比较流行，大家都心向往之的。所用到的模型从最基本的线性回归、决策树到更复杂一些的随机森林、神经网络不尽相同，但数据挖掘岗位与BI最大的不同，就在于主要是通过建模来挖掘数据内在的一些关联、信息，产出与建模能力直接挂钩。
          </div>
          <div>
            5.数据洞察 <br />
            数据洞察，讲究的是如何从数据当中得到对生意有用的洞察，可以直接指导业务岗位的效率抑或效能的改善。它与前两者最大的区别，就是产出物，不是停留在信息，而是有意义的洞察。
          </div>
          <div>
            6.归因 <br />
            https://www.ichdata.com/web-attribution.html
          </div>
        </div>
        <div>
          olap分析操作： 1. roll-up 2. drill-down 3. slice 4.dice 5.pivot 6.
          drill though
        </div>

        <div>
          常见的分析方式： 1. 对比 2. 回溯 3. 细分 4. 相关 5. 假设 6.逆向 7.演绎
          8.归纳 https://www.yunyingpai.com/data/569279.html
        </div>
      </div>
    </div>
  );
}
export function InteractiveChart() {
  const [layout, setLayout] = useState(defaultLayout);
  return (
    <RdxContext>
      <div style={{ display: 'flex' }}>
        <div className='leftBar' style={{ display: 'flex', flex: '0 0 300px' }}>
          <FieldPools />
          <ChooseFieldPools />
        </div>
        <BlockContext.Provider value={createBlockContext()}>
          <div>
            <Button
              onClick={() => {
                setLayout(
                  produce(layout, (layout) => {
                    layout[0].children.push({
                      id: uuid(),
                      type: 'pie',
                    });
                  })
                );
              }}
            >
              新增一个图表
            </Button>
            <LayoutRenderer layout={layout} parentId={null} />
          </div>
        </BlockContext.Provider>
      </div>
      <Introduce />
    </RdxContext>
  );
}
const LayoutRenderer = (props: { layout; parentId }) => {
  const { layout, parentId = null } = props;
  return layout.map((item) => {
    return (
      <LayoutItem
        id={item.id}
        type={item.type}
        parentId={parentId}
        childrenData={item.children || ([] as any)}
      >
        <LayoutRenderer
          layout={item.children}
          parentId={item.id}
        ></LayoutRenderer>
      </LayoutItem>
    );
  });
};
const LayoutItem = (props: { id; type; parentId; childrenData; children }) => {
  const { id, type, children, childrenData, parentId } = props;
  if (type === 'container') {
    const blockSetter = useRdxSetter(blockAtoms(id));
    useMemo(() => {
      blockSetter(childrenData.map((item) => item.id));
    }, [children]);
    return <div style={{ display: 'flex' }}>{children}</div>;
  }
  return <SingleChart chartId={id} parentId={parentId} />;
};

const defaultLayout = [
  {
    id: 'block',
    type: 'container',
    children: [
      {
        id: 'test1',
        type: 'bar',
      },
    ],
  },
];
