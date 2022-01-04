import { Filters, Operator, Order, OrderType } from './types';

function normalizeArr(v) {
  if(!Array.isArray(v)) {
    return [v]
  }else {
    return v
  }
}
function equal(value, compare, op: Operator): boolean {
  switch (op) {
    case Operator.equals:
      return value === compare;
    case Operator.notEquals:
      return value !== compare;
    case Operator.contains:
      return normalizeArr(compare).includes(value);
    case Operator.notContains:
      return !normalizeArr(compare).includes(value);
    default:
      throw new Error('暂不支持操作符');
  }
}
export function dataOrder(data: any[], orders: Order[] = []) {
  if(orders.length === 0 ) {
    return data
  }
  // 目前仅实现单层排序
  return data.slice(0).sort((pre, next) => {
    const order = orders[0]
    if(pre[order.code] >  next[order.code]) {
      return order.type === OrderType.Asc ? 1 : -1
    } else {
      return order.type === OrderType.Asc ? -1 : 1
    }
  })
}
export function dataFilter(data: any[], filters: Filters = []) {
  return data.filter((row) => {
    let willFilter = false;

    filters.forEach((rowFilter) => {
      if (Array.isArray(rowFilter)) {
        // or filter
        if (
          rowFilter.every((orFilter) => {
            return !equal(
              row[orFilter.member],
              orFilter.values,
              orFilter.operator
            );
          })
        ) {
          willFilter = true;
        }
      } else {
        // and filter
        if (
          !equal(row[rowFilter.member], rowFilter.values, rowFilter.operator)
        ) {
          willFilter = true;
        }
      }
    });
    return !willFilter;
  });
}
