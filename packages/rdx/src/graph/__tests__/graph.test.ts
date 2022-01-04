import Graph from '../Graph'

describe('graph图算法测试', () => {
  it('环检测', () => {
    const g = new Graph([
      {
        key: 'a',
        deps: [{ id: 'b' }],
      },
      {
        key: 'b',
        deps: [{ id: 'a' }],
      },
    ])
    const g2 = new Graph([
      {
        key: 'a',
        deps: [{ id: 'b' }],
      },
      {
        key: 'b',
        deps: [{ id: 'a' }],
      },
      {
        key: 'c',
      },
    ])
    expect(g.isAcyclic()).toBeTruthy()
    expect(g2.isAcyclic()).toBeTruthy()
  })
  it('非环检测', () => {
    const noCycleGraph = new Graph([
      {
        key: 'a',
      },
    ])
    expect(!noCycleGraph.isAcyclic()).toBeTruthy()
  })

  it('节点检测', () => {
    const g = new Graph([
      {
        // 无依赖
        key: 'a',
      },
      {
        key: 'b',
        // 依赖一个
        deps: [{ id: 'a' }],
      },
      {
        key: 'c',
        // 依赖多个
        deps: [{ id: 'b' }, { id: 'a' }],
      },
      {
        key: 'd',
        // 依赖的依赖
        deps: [{ id: 'b' }, { id: 'c' }],
      },
    ])
    function sort(array) {
      return array.sort((pre, next) => {
        return pre > next ? 1 : -1
      })
    }
    // 下游节点检测
    expect(g.getAllPointsByPoints({ key: 'a', downStreamOnly: true })).toEqual(['b', 'c', 'd'])
    // 包含当前节点
    expect(g.getAllPointsByPoints({ key: 'a', downStreamOnly: false })).toEqual(['a', 'b', 'c', 'd'])
    // 多个触发点
    expect(
      g.getAllPointsByPoints([
        { key: 'a', downStreamOnly: false },
        { key: 'a', downStreamOnly: true },
      ]),
    ).toEqual(['a', 'b', 'c', 'd'])
  })

  it('正则匹配节点', () => {
    const g = new Graph([
      {
        // 无依赖
        key: 'a',
      },
      {
        // 无依赖
        key: 'ab',
      },
      {
        // 无依赖
        key: 'ba',
      },
      {
        key: 'b',
        // 依赖一个
        deps: [{ id: new RegExp(/^a/) }],
      },
    ])
    // 下游节点检测
    expect(g.getAllPointsByPoints({ key: 'a', downStreamOnly: true })).toEqual(['b'])
    // 包含当前节点
    expect(g.getAllPointsByPoints({ key: 'a', downStreamOnly: false })).toEqual(['a', 'b'])
    //  正则匹配
    expect(g.getAllPointsByPoints({ key: 'ab', downStreamOnly: true })).toEqual(['b'])
    expect(g.getAllPointsByPoints({ key: 'ba', downStreamOnly: true })).toEqual([])
  })

  it('下游节点触发检测', () => {
    const d = [
      {
        key: 'pageDataSourceListAtom',
        deps: [],
      },
      {
        key: 'dataSettingByChartState_atomFamily/"test"',
        deps: [],
      },
      {
        key: 'dataSettingByChart-computeFamily/"test"',
        deps: [
          {
            id: 'dataSettingByChartState_atomFamily/"test"',
            value: {},
          },
        ],
      },
      {
        key: 'chartSettingByChart_atomFamily/"test"',
        deps: [],
      },
      {
        key: 'chartSettingByChartCompute`-computeFamily/"test"',
        deps: [
          {
            id: 'chartSettingByChart_atomFamily/"test"',
            value: {},
          },
        ],
      },
      {
        key: 'batchDataSourceListCompute',
        deps: [
          {
            id: 'pageDataSourceListAtom',
            value: {},
          },
        ],
      },
      {
        key: 'activeDataSetMeta-computeFamily/"test"',
        deps: [
          {
            id: 'batchDataSourceListCompute',
            value: {},
          },
        ],
      },
      {
        key: 'chartViewByChart-computeFamily/"test"',
        deps: [
          {
            id: 'chartSettingByChart_atomFamily/"test"',
            value: {},
          },
        ],
      },
      {
        key: 'fetchData-computeFamily/"test"',
        deps: [
          {
            id: 'dataSettingByChart-computeFamily/"test"',
            value: {},
          },
        ],
      },
    ]
    const g = new Graph(d)
    g.getAllPointsByPoints([
      {
        key: 'pageDataSourceListAtom',
        downStreamOnly: true,
      },
      {
        key: 'dataSettingByChartState_atomFamily/"test"',
        downStreamOnly: true,
      },
      {
        key: 'dataSettingByChart-computeFamily/"test"',
        downStreamOnly: true,
      },
      {
        key: 'chartSettingByChart_atomFamily/"test"',
        downStreamOnly: true,
      },
      {
        key: 'chartSettingByChartCompute`-computeFamily/"test"',
        downStreamOnly: true,
      },
      {
        key: 'batchDataSourceListCompute',
        downStreamOnly: false,
      },
      {
        key: 'activeDataSetMeta-computeFamily/"test"',
        downStreamOnly: false,
      },
      {
        key: 'chartViewByChart-computeFamily/"test"',
        downStreamOnly: true,
      },
      {
        key: 'fetchData-computeFamily/"test"',
        downStreamOnly: false,
      },
    ])
  })
})
