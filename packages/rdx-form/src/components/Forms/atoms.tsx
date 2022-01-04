import {
  ActionType,
  atom,
  compute,
  ComputeErrorType,
  DEFAULT_VALUE,
  IRdxComputeGetParams,
  IRdxComputeSetParams,
  isPromise,
  rdxState,
  RdxState,
  TargetType,
  RdxStore,
  isRdxInstance,
  RdxValueReference,
} from '@alife/rdx';
import { useContext } from 'react';
import { useFormContext } from '../../hooks/FormComponentsCotnext';
import { PathContextInstance } from '../../hooks/pathContext';
import { createId, getNameFromId, getParentPath } from '../../utils/base';
import { getEmptyValue } from '../../utils/functions';
import { isEmpty } from '../../utils/isEmpty';
import { parseName } from '../FormsNew/atom';
import {
  IRdxFormItemAnyType,
  IValidateConfig,
  RdxFormGet,
  RdxFormHas,
  RdxFormSet,
  TFormValue,
} from './types';
import {
  enocdeIdByStateType,
  EFormStateType,
  isMultiNames,
  decodeIdByStateType,
} from './utils';

export const getCurrentFormState = (props: IRdxFormItemAnyType) => {
  const formStatus = getFormStatus(props);
  const formState = getFormValue(props as any);
  const multiFormStates = getMultiNameFormState(props);

  const { name } = props;
  return (config: any) => {
    if (isMultiNames(name as string)) {
      // 建立联系和 a|b的联系
      config.get(formState);
      // 建立联系和 a 、 b的联系
      const value = multiFormStates.map((atomState) =>
        config.get(atomState)
      ) as any;
      // 建立 a、b的引用关系
      
      return {
        ...config.get(formStatus),
        value: value,
      };
    } else {
      return {
        ...config.get(formStatus),
        value: config.get(formState),
      };
    }
  };
};
export function useFormIdByName(name: string) {
  const { paths } = useContext(PathContextInstance);
  // 唯一id
  const id = createId(name, paths);
  return id;
}
export function getDefaultStatus(props: IRdxFormItemAnyType) {
  const {
    visible = true,
    preview = false,
    disabled = false,
    require = false,
    componentProps = {},
    layoutExtends = {},
    title,
    showTitle
  } = props;
  return {
    title,
    showTitle,
    visible,
    preview,
    disabled,
    require,
    componentProps,
    layoutExtends,
  };
}

export function getFormValue(props: TFormValue<any, any>) {
  const { name, type, defaultValue } = props;
  const atomState = atom({
    virtual: isMultiNames(name as any),
    id: useFormIdByName(name as string),
    effects: props.valueEffects,
    defaultValue: getEmptyValue({ type, defaultValue }),
  });

  return compute({
    id: enocdeIdByStateType(useFormIdByName(name as string), EFormStateType.ValueIntercepter),
    get: ({ get }) => {
      return get(atomState);
    },
    set: ({ get, set, id }, newValue) => {
      const editState = rdxState({
        id: enocdeIdByStateType(decodeIdByStateType(id).id, EFormStateType.EditState),
      });
      if (!get(editState).modify) {
        set(
          editState,
          (state) => ({ ...state, modify: true })
        );
      }
      set(atomState, newValue);
    },
  });
}

export function getFormStatus(props: IRdxFormItemAnyType) {
  const { name, alias } = props;
  return atom({
    virtual: true,
    id: enocdeIdByStateType(
      useFormIdByName(name as string),
      EFormStateType.Status,
      alias
    ),
    defaultValue: getDefaultStatus(props),
  });
}

export function getMultiNameFormCompute(props: IRdxFormItemAnyType) {
  const { paths } = useContext(PathContextInstance);
  const { name, alias } = props;
  const computeProxy = getFormComptuteProxy(props)
  return isMultiNames(name as any)
    ? parseName(name as string).map((name, index) => {
        const id = createId(name, paths);
        return compute({
          id: enocdeIdByStateType(id, EFormStateType.Compute, alias),
          get: (config) => {
            const data =config.get(computeProxy)
            return {
              ...data,
              value: data.value[index]
            };
          },
          set: ({ get, set}, newValue) => {
            const data =get(computeProxy)
            set(computeProxy, {...newValue, value: [
              ...data.value.slice(0, index),
              newValue.value,
              ...data.value.slice(0, index+1),
            ]})
          }
        });
      })
    : [];
}

export function getMultiNameFormState(props: IRdxFormItemAnyType) {
  const { paths } = useContext(PathContextInstance);
  const { name } = props;
  const componentId = createId(name, paths);
  return isMultiNames(name as any)
    ? parseName(name as string).map((name, index) => {
        const id = createId(name, paths);
        const atomState = atom({
          id: id,
          defaultValue: getEmptyValue(props)[index],
        });
        return compute({
          id: enocdeIdByStateType(id, EFormStateType.ValueIntercepter),
          get: ({ get }) => {
            return get(atomState);
          },
          set: ({ get, set }, newValue) => {
            const editState = rdxState({
              id: enocdeIdByStateType(componentId, EFormStateType.EditState),
            });
            if (!get(editState).modify) {
              set(
                rdxState({
                  id: enocdeIdByStateType(
                    componentId,
                    EFormStateType.EditState
                  ),
                }),
                (state) => ({ ...state, modify: true })
              );
            }
            set(atomState, newValue);
          },
        });
      })
    : [];
}
export function getEditStateAtom(
  id: string,
  alias: string,
  autoValidate: boolean
) {
  return atom({
    virtual: true,
    id: enocdeIdByStateType(id, EFormStateType.EditState, alias),
    defaultValue: {
      modify: false,
      autoValidate,
    },
  });
}

export const createHasFn: (
  config: IRdxComputeGetParams,
  context: RdxStore
) => RdxFormHas<any> = (config, context) => (
  id: string | RdxState<any>,
  alias?: string
) => {
  if (isRdxInstance(id)) {
    return true;
  } else if (typeof id === 'string') {
    // ! 处理组件为加载的情况
    return context.hasTask(enocdeIdByStateType(id, EFormStateType.Compute, alias))
  }
};
export const createGetFn: (
  config: IRdxComputeGetParams,
  context: RdxStore
) => RdxFormGet<any> = (config, context) => (
  id: string | RdxState<any>,
  alias?: string
) => {
  if (isRdxInstance(id)) {
    return config.get(id as any);
  } else if (typeof id === 'string') {
    // ! 处理组件为加载的情况

    const value = config.get(
      rdxState({
        id: enocdeIdByStateType(id, EFormStateType.Compute, alias),
      })
    );
    // sync state，不然数据对应不上
    return value;
  }
};

export function valueFn(preValue: any, currentValue: any) {
  let newValue = currentValue;
  if (currentValue instanceof Function) {
    newValue = currentValue(preValue);
  }
  return newValue;
}
export const createSetFn: (config: IRdxComputeSetParams) => RdxFormSet<any> = (
  config
) => (id, currentValue, alias) => {
  // 设置数据
  // @ts-ignore
  if (id instanceof RdxState || id instanceof RdxValueReference) {
    config.set(id, currentValue);
  } else if (typeof id === 'string') {
    try {
      const name = getNameFromId(id);
      const isMultiName = isMultiNames(name);
      const names = parseName(name);
      // 设置数据
      if (currentValue === DEFAULT_VALUE) {
        names.forEach((currentName, index) => {
          config.set(
            rdxState({
              id: enocdeIdByStateType(
                createId(currentName, getParentPath(id)),
                EFormStateType.ValueIntercepter
              ),
            }),
            currentValue
          );
        });
        config.set(
          rdxState({
            id: enocdeIdByStateType(
              createId(name, getParentPath(id)),
              EFormStateType.Status,
              alias
            ),
          }),
          // 这里的合并是浅合并
          currentValue
        );
      } else {
        // 准备之前的数据
        let preValue: any;
        if (isMultiName) {
          preValue = {
            value: names.map((currentName) =>
              config.get(
                rdxState({
                  id: enocdeIdByStateType(
                    createId(currentName, getParentPath(id)),
                    EFormStateType.ValueIntercepter
                  ),
                })
              )
            ),
            ...config.get<any>(
              rdxState({
                id: enocdeIdByStateType(id, EFormStateType.Status),
              })
            ),
          };
        } else {
          preValue = {
            value: config.get(rdxState({ id: id })),
            ...config.get<any>(
              rdxState({
                id: enocdeIdByStateType(id, EFormStateType.Status),
              })
            ),
          };
        }

        // 处理ValueOrUpdate
        let newValue: any = valueFn(preValue, currentValue);

        const { value, ...rest } = newValue;
        const { value: prePreValue, ...restPreValue } = preValue;

        if (newValue.hasOwnProperty('value')) {
          const evaluateValue = (index) => {
            if (!Array.isArray(value) || !value) {
              return undefined;
            } else {
              return value[index];
            }
          };
          names.forEach((currentName, index) => {
            config.set(
              rdxState({
                id: enocdeIdByStateType(
                  createId(currentName, getParentPath(id)),
                  EFormStateType.ValueIntercepter
                ),
              }),
              isMultiName ? evaluateValue(index) : value
            );
          });
        }
        config.set(
          rdxState({
            id: enocdeIdByStateType(
              createId(name, getParentPath(id)),
              EFormStateType.Status,
              alias
            ),
          }),
          // 这里的合并是浅合并
          { ...restPreValue, ...rest }
        );
      }

      // createValidator({...preValue, ...currentValue});
    } catch (error) {
      console.warn(error);
    }
  }
};

export function getFormComptuteProxy(props: IRdxFormItemAnyType) {
  const { name, alias, get } = props;
  // 加载state & status atom
  const getFormStateFn = getCurrentFormState(props);
  return compute({
    virtual: true,
    id: enocdeIdByStateType(useFormIdByName(name as string), EFormStateType.ComputeProxy, alias),
    get: get
    ? (config, context) => {
        const beforeValue = getFormStateFn(config);
        const getFunc = get({
          ...config,
          id: decodeIdByStateType(config.id).id,
          get: createGetFn(config, context),
          mixedValueAndStatus: beforeValue,
        });
        
        // 置为非初始化
        if (isPromise(getFunc)) {
          return (getFunc as any).then((newValue) => {
            // 这里是浅合并，合并表单展示的数据
            return {
              ...beforeValue,
              ...(newValue || {}),
            };
          });
        } else {
          // 这里是浅合并，合并表单展示的数据
          return {
            ...beforeValue,
            ...(getFunc || {}),
          };
        }
      }
    : (config) => {
        // 获取数据， 获取依赖关系
        return getFormStateFn(config);
      }
  })
}
// !为了支持两个name拆开的compute
export function getFormCompute(props: IRdxFormItemAnyType) {
  const { name, alias, set } = props;
  // 加载state & status atom
  const computeProxy = getFormComptuteProxy(props)
  const multipleCompute = getMultiNameFormCompute(props)
  return compute({
    virtual: true,
    id: enocdeIdByStateType(useFormIdByName(name as string), EFormStateType.Compute, alias),
    get: ({ get}) => {
      multipleCompute.map(compute => get(compute))
      const value = get(computeProxy)
      return value
    },
    set: set
      ? (config, newValue, context) => {
          set(
            {
              ...config,
              id: decodeIdByStateType(config.id).id,
              get: createGetFn(config, context),
              set: createSetFn(config),
            },
            newValue
          );
        }
      : (config, newValue) => {
          // 设置原子的状态
          createSetFn(config)(decodeIdByStateType(config.id).id , newValue, alias);
        },
  });
}
export function getValidateCompute(props: IRdxFormItemAnyType) {
  const {
    name,
    alias,
    title,
    rules = [],
    validateConfig = {} as IValidateConfig
    
  } = props;
  const {
    validateFirst,
    ignoreEmptyValidate = false,
    emptyErrorMessage,
  } = validateConfig
  const formContext = useFormContext();
  return compute<string[]>({
    virtual: true,
    id: enocdeIdByStateType(useFormIdByName(name as string), EFormStateType.Error, alias),
    get: async (config, context) => {
      const editStateAtom = getEditStateAtom(decodeIdByStateType(config.id).id , alias, formContext.autoValidate)
      const { modify, autoValidate } = config.get(
        editStateAtom
      );
      const formState = config.get<any>(rdxState({ id: enocdeIdByStateType(decodeIdByStateType(config.id).id,EFormStateType.Compute ,alias)  }));
      // 没修改， 不自动校验，不初次校验，则返回空数组
      if (!modify && !autoValidate && !validateFirst) {
        return [];
      } else {
        let relyModify = false;
        let infos = [];
        const emptyRule = ({ value }) => {
          if (isEmpty(value.value)) {
            return emptyErrorMessage || `${title}不能为空!`;
          } else {
            return undefined;
          }
        };

        for (let rule of formState.require
          ? rules.concat(ignoreEmptyValidate ? [] : [ emptyRule])
          : rules) {
          infos.push(
            await rule({
              value: formState,
              has: (id) => {
                return createHasFn(config, context)(id)
              },
              get: (id) => {
                if (
                  typeof id === 'string' &&
                  config.get<{ modify: boolean, autoValidate: boolean }>(
                    editStateAtom
                  ).modify
                ) {
                  relyModify = true;
                }
                return createGetFn(config, context)(id);
              },
              id: decodeIdByStateType(config.id).id,
            })
          );
        }
        // 开启第一次校验， 则跳过是否修改的判断
        if (relyModify || modify || validateFirst) {
          return infos.filter((item) => !isEmpty(item));
        } else {
          return [];
        }
      }
      
    },
  });
}
