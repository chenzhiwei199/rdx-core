import { ICube } from "./aggregateCore";

export interface Order {
  code: string;
  type: OrderType;
}
export enum OrderType {
  Asc = 'asc',
  Desc = 'desc',
}
export interface IQueryConfig extends ICube {
  filters?: Filters;
  orders?: Order[];
}

export type Filters = (Filter[] | Filter)[];
export interface Filter {
  member: DimNames | string;
  operator: Operator;
  values: any;
}
export enum Operator {
  equals = 'equals',
  notEquals = 'notEquals',
  contains = 'contains',
  notContains = 'notContains',
  gt = 'gt',
  gte = 'gte',
  lt = 'lt',
  lte = 'lte',
  inDateRange = 'inDateRange',
  notInDateRange = 'notInDateRange',
  beforeDate = 'beforeDate',
  afterDate = 'afterDate',
}

export type DimNames =
  | '单据日期'
  | '地区名称'
  | '业务员名称'
  | '客户分类'
  | '客户名称'
  | '存货名称'
  | '部门名称'
  | '存货分类'
  | '存货编码'
  | '业务员编码'
  | '订单号'
  | '客户编码'
  | '部门编码'
  | '订单明细号';