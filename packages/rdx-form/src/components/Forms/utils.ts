import React, { useRef, useEffect } from 'react';
import { Base, RdxStore } from '@alife/rdx';
import { setValue, getValue } from '../../utils';
import { produce } from 'immer';
import { BaseType, IComponents, IModel } from '../Forms/types';
import { FormStore } from './state';
export interface IRdxFormRoot<GSource, GCompoonentPropss extends IComponents> {
  children?: React.ReactNode;
  /**
   *  表单存储数据的store
   */
  store?: FormStore<GSource, GCompoonentPropss>;
  /**
   * 开启表单状态展示
   */
  enabledStatePreview?: boolean;
  /**
   * 通过JsonView来优化状态呈现的方式
   */
  JsonView?: React.FC<{ data: any }>;
  /**
   * 自动校验，默认是false，开启之后会在表单初始化的时候进行校验，但是不会展示，表单的校验信息会在表单被编辑后，或者依赖的表单项编辑展示
   */
  autoValidate?: boolean;
}

export class FormState<T> implements Base<IModel<T>> {
  store: any = {};
  clone(): Base<IModel<T>> {
    return new FormState(this.store);
  }
  merge(scope: string): void {
    throw new Error('Method not implemented.');
  }
  constructor(v) {
    this.store = v;
  }
  remove(key: string, scope?: string) {
    this.store = produce(this.store, (store) => {
      setValue(store, key, undefined);
      // delete store.runningState[key];
    });
  }
  update(key: string, value: IModel<T>, scope?: string): void {
    // let { value: currentV, ...rest } = value;
    this.store = produce(this.store, (store) => {
      setValue(store, key, value);
      // store.runningState[key] = {...store.runningState[key], ...rest};
    });
  }
  get(key: string, scope?: string): IModel<T> | null {
    const value = getValue(this.store, key);
    return value;
    // const others = this.store.runningState[key];
    // return value === undefined && others === undefined
    //   ? undefined
    //   : {
    //       disabled: false,
    //       value: value,
    //       ...others,
    //     };
  }
  getAll(): any {
    return this.store;
  }
}

export function createEmptyValue(type) {
  if (type === BaseType.Boolean) {
    return true;
  }
  if (type === BaseType.String) {
    return '';
  }
  if (type === BaseType.Array) {
    return [];
  }
  if (type === BaseType.Object) {
    return {};
  }
  if (type === BaseType.Number) {
    return 0;
  }
}

// function isRdxFormItem(obj) {
//   try {
//     return obj === FormItem;
//   } catch (e) {
//     return false; //
//   }
// }
// ReactChild | ReactFragment | ReactPortal | boolean | null | undefined
// function children2Json(children: React.ReactNode, useVirtual: boolean = false) {
//   const root = {};
//   function travserArray(paths, child) {
//     const currentChildrenProps = child.props;
//     const currentChildrenType = currentChildrenProps.type;
//     if ([BaseType.Object].includes(currentChildrenType)) {
//       set(root, [...paths, 0].join('.'), getEmptyValue(currentChildrenType));
//       travser([...paths, 0], currentChildrenProps.children);
//     } else if ([BaseType.Array].includes(currentChildrenType)) {
//       set(root, [...paths, 0].join('.'), getEmptyValue(currentChildrenType));
//       travserArray([...paths, 0], currentChildrenProps.children);
//     } else {
//       set(root, [...paths, 0].join('.'), getEmptyValue(currentChildrenType));
//     }
//   }
//   function travser(paths = [] as string[], children) {
//     React.Children.forEach(children, (child) => {
//       if (!child || !child.props) {
//         return;
//       }
//       if (isRdxFormItem(child.type)) {
//         if (!child.props.virtual || useVirtual) {
//           set(
//             root,
//             [...paths, child.props.name].join('.'),
//             getEmptyValue(child.props.type)
//           );
//           if ([BaseType.Object].includes(child.props.type)) {
//             travser([...paths, child.props.name], child.props.children);
//           } else if ([BaseType.Array].includes(child.props.type)) {
//             const currentChildren = child.props.children;
//             set(
//               root,
//               [...paths, child.props.name].join('.'),
//               getEmptyValue(child.props.type)
//             );
//             travserArray([...paths, child.props.name], currentChildren);
//           }
//         }
//       } else if (isFunction(child.type)) {
//         if (
//           child.type.prototype &&
//           (child.type.prototype.render ||
//             child.type.prototype.isPureReactComponent)
//         ) {
//           try {
//             travser(paths, new child.type(child.props).render());
//           } catch (error) {
//             travser(paths, child.props.children);
//           }
//         } else {
//           travser(paths, child.type(child.props));
//         }
//       } else {
//         travser(paths, child.props.children);
//       }
//     });
//   }
//   travser([], children);
//   return root;
// }

// export function parseName(name: string = '') {
//   return name.split('|');
// }
export function isMultiNames(name: string = '') {
  return name.includes('|');
}

export enum EFormStateType {
  // Value = 'value',
  // Visible = 'visible',
  // Disabled = 'disabled',
  // Preview = 'preview',
  ValueIntercepter = 'StateIntercepter',
  EditState = 'editState',
  Compute = 'compute',
  ComputeProxy = 'computeProxy',
  ComputeForSingleName = 'ComputeForSingleName',
  Status = 'status',
  Error = 'error',
  Rule = 'rule',
}
export function createTemplateByStateType(type: EFormStateType) {
  return `${type}\\$\\$`;
}
export function createIdWithAliasByStateType(id: string, alias?: string) {
  return `${id}${alias ? '$$' + alias : ''}`;
}
export function enocdeIdByStateType(
  id: string,
  type: EFormStateType,
  alias?: string
) {
  if (type) {
    return `${type}$$${id}${alias ? '$$' + alias : ''}`;
  } else {
    return id;
  }
}
export function decodeIdByStateType(key: string) {
  if (key.includes('$$')) {
    const data = key.split('$$');
    return {
      type: data[0],
      id: data[1],
      alias: data[2],
    };
  } else {
    return {
      id: key,
    };
  }
}

export function getValidateKeys(formContext: RdxStore) {
  const allKeys = Array.from<string>(formContext.getTasks().keys())
    .filter((key) =>
      new RegExp(`\^${EFormStateType.EditState}\\$\\$.+`).test(key)
    )
    .map(
      (key) =>
        key.match(new RegExp(`\^${EFormStateType.EditState}\\$\\$(.+)`))[1]
    );
  return allKeys;
}

export function isString<T>(v: T) {
  return typeof v === 'string';
}
export function computeState2FormState(values: any, virtualData: any) {
  const newValue = Object.keys(virtualData)
    .filter((key) => key.startsWith(`${EFormStateType.Compute}$$`))
    .reduce((root, key) => {
      const { id, alias, type } = decodeIdByStateType(key);
      const paths = id.split('.');
      const lastValue = paths[paths.length - 1];
      if (lastValue.includes('|')) {
        lastValue.split('|').forEach((currentName, index) => {
          const newId = [...paths.slice(0, paths.length - 1), currentName].join(
            '.'
          );
          if (virtualData[key].value) {
            console.log('virtualData[key].value[index]: ', key, virtualData[key].value[index]);
            setValue(
              root,
              newId,
              virtualData[key].value[index] ? JSON.parse(JSON.stringify(virtualData[key].value[index])): virtualData[key].value[index]
            );
          } else {
            setValue(root, newId, undefined);
          }
        });
      } else {
        setValue(root, id, !virtualData[key] || virtualData[key].value === undefined ? undefined :  JSON.parse(JSON.stringify(virtualData[key].value)));
      }
      return root;
    }, JSON.parse(JSON.stringify(values)) as any);
  return newValue;
}




export function clone(item: any) {
  if (!item) {
    return item;
  } // null, undefined values check

  var types = [Number, String, Boolean],
    result;

  // normalizing primitives if someone did new String('aaa'), or new Number('444');
  types.forEach(function(type) {
    if (item instanceof type) {
      result = type(item);
    }
  });

  if (typeof result == 'undefined') {
    if (Object.prototype.toString.call(item) === '[object Array]') {
      result = [];
      item.forEach(function(child, index, array) {
        result[index] = clone(child);
      });
    } else if (typeof item == 'object') {
      // testing that this is DOM
      if (item.nodeType && typeof item.cloneNode == 'function') {
        result = item.cloneNode(true);
      } else if (!item.prototype) {
        // check that this is a literal
        if (item instanceof Date) {
          result = new Date(item);
        } else {
          // it is an object literal
          result = {};
          for (var i in item) {
            result[i] = clone(item[i]);
          }
        }
      } else {
        // depending what you would like here,
        // just keep the reference, or create new object
        if (false && item.constructor) {
          // would not advice to do that, reason? Read below
          result = new item.constructor();
        } else {
          result = item;
        }
      }
    } else {
      result = item;
    }
  }

  return result;
}
