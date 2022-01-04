import React from 'react';
import { IRdxFormItem, IRdxFormItemAnyType } from '../components';
import { isFunction } from './base';

export function getEmptyValue(props: {
  type: string;
  defaultValue?: any | (() => any);
}) {
  const { type, defaultValue } = props;
  if (defaultValue !== undefined ) {
    return isFunction(defaultValue) ? defaultValue() : defaultValue;
  }
  if (type === 'array') {
    return [];
  } else if (type === 'object') {
    return {};
  } else if (type === 'string') {
    return '';
  } else if (type === 'number') {
    return undefined;
  } else {
    return undefined;
  }
}

export function getChlidFieldInfos(children: React.ReactNode) {
  let itemRefs: IFieldDefineWithChild[] = [];
  React.Children.forEach(children, (child: any, index) => {
    itemRefs.push(child.props);
  });
  return itemRefs;
}
export interface IFieldDefineWithChild extends IRdxFormItemAnyType {
  child: any;
}
export interface IFieldInfo extends IRdxFormItemAnyType {
  childrenReactNode?: React.ReactNode;
  childrenPropsInfo?: IFieldDefineWithChild[];
}

export function getChlidFieldInfo(children: React.ReactNode) {
  let fieldInfo: IFieldInfo = {} as any;
  React.Children.forEach(children, (child: any, index) => {
    if (index === 0) {
      if (child.props.type === 'object') {
        fieldInfo = {
          ...child.props,
          childrenPropsInfo: getChlidFieldInfos(children),
        };
      } else {
        fieldInfo = child.props;
      }
    }
  });
  return fieldInfo;
}

export const toArr = (val: any): any[] =>
  Array.isArray(val) ? val : val ? [val] : [];

export const normalizeCol = (
  col: { span: number; offset?: number } | number,
  defaultValue?: { span: number }
): { span: number; offset?: number } => {
  if (!col) {
    return defaultValue;
  } else {
    return typeof col === 'object' ? col : { span: Number(col) };
  }
};

/**
 *
 * @param fn {Function}   实际要执行的函数
 * @param delay {Number}  延迟时间，也就是阈值，单位是毫秒（ms）
 *
 * @return {Function}     返回一个“去弹跳”了的函数
 */
export function debounce(fn, delay) {
  // 定时器，用来 setTimeout
  let timer;
  // 返回一个函数，这个函数会在一个时间区间结束后的 delay 毫秒时执行 fn 函数
  return function() {
    // 保存函数调用时的上下文和参数，传递给 fn
    // tslint:disable-next-statement
    let context = this;
    let args = arguments;
    // 每次这个返回的函数被调用，就清除定时器，以保证不执行 fn
    clearTimeout(timer);
    // 当返回的函数被最后一次调用后（也就是用户停止了某个连续的操作），
    // 再过 delay 毫秒就执行 fn
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}

export function getValue(o, path, defaultValue?: any) {
  const keys = `${path}`.split('.');
  if (keys && keys.length > 0) {
    let temp = o;
    let index = 0;
    for (let key of keys) {
      if (index === keys.length - 1) {
        return temp[key] === undefined ? defaultValue : temp[key];
      } else if (temp[key] === undefined) {
        return defaultValue;
      } else {
        temp = temp[key];
      }
      index++;
    }
  } else {
    return o;
  }
}
export function setValue(target = {} as any, path, value) {
  const paths = `${path}`.split('.');
  if (paths && paths.length > 0) {
    let temp = target;
    let index = 0;
    for (let path of paths) {
      if (index === paths.length - 1) {
        temp[path] = value;
      } else {
        if (temp[path] === undefined) {
          temp[path] = {};
        }
        temp = temp[path];
      }

      index++;
    }
  }
  return target;
}
