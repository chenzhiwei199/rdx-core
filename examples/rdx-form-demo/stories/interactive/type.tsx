export enum Sort {
  ASC = 'ASC',
  DESC = 'DESC',
  None = 'NONE',
}

export interface SortData {
  key: string;
  value: Sort;
}

export interface DataSource {
  dataSetId: number
  field: Field[]
}

export enum DomainType {
  Dimension = 'dimension',
  TimeDimension = 'time',
  All = 'all',
  Measure = 'measure',
}
export enum DomainName {
  DrillDown = 'drillDown',
  // 颜色通道
  Color = 'color',
  // X轴通道
  X = 'x',
  // y轴通道
  Y = 'y',
  LeftY = 'leftY',
  RightY = 'rightY',

  Measure = 'measure',
  LeftColor = 'leftColor',
  RightColor = 'rightColor',
  Size = 'size',
  // 表格列
  Column = 'column',
  Mark = 'mark',
  Row = 'row',
  // 筛选器中的文本和值通道
  Label = 'label',
  Value = 'value',
  ParentId = 'parentId',
  Id = 'id',
}
export interface Field {
  label: string;
  code: string;
  // 原始数据类型
  originDomainType: DomainType;
  // 视觉通道的数据类型
  domainType: DomainType;
  // 视觉通道的类型
  domainName: DomainName;
  alias?: string;
  sort?: Sort;
}

export enum AnalysisOperatorType {
  Drill = 'drill',
  Filter = 'filter',
}