import * as React from 'react'
import {
  atomFamily,
  compute,
  getAtomFamilyPrefix,
  getComputeFamilyPrefix,
  isRdxInstance,
  RdxState,
  RdxStore,
  stringify,
  useRdxContext,
  waitForFamilyChange,
  DefaultValue,
  Status,
  useRdxStateLoader,
  useRdxValue,
  waitForRegExp,
  ActionType,
  TargetType,
  RdxValue,
  RdxValueReference,
  rdxState,
  singleInstanceFactory,
  RdxGet,
  computeFamily,
  IRdxComputeGet,
  useRdxValueLoader,
  LoaderValue,
  isLoading,
  useRdxSetterLazy,
  RdxContextRuntimeInfo,
} from '@alife/rdx'
import { createArrayMutators } from './helper'
import {
  BaseType,
  FormChildren,
  IComponents,
  IFormComponent,
  IFormRenderItem,
  InferPropsType,
  IRdxFormItem,
  IRdxFormItemAnyType,
  IState,
  IViewModel,
  TArrayPathResolver,
  TGetArrayPath,
  TGetMixedArrayAndString,
  TGetByStringPath,
  TStringPathResolver,
} from '../Forms/types'
import { getEmptyValue, getValue, setValue } from '../../utils/functions'
import { getDefaultStatus } from '../Forms/atoms'
import { isEmpty } from '../../utils/isEmpty'
import { PathContextInstance, usePathContext } from '../../hooks/pathContext'
import { useFormCollectContext } from '../../hooks/FormItemCollectContext'
import { FormItemContextInstance } from '../../hooks/formContext'
import { IContentComponent, useFormItemRenderComponentsContext } from '../../hooks/renderContext'
import { IErrorMessage } from '../../hooks/formHooks'
import { clone } from '../Forms/utils'
import { IFormList, IValidateConfig } from '../Forms'
import invariant from 'invariant'
import { isError } from '../../utils/validator'
import { createId } from '../../utils/base'
export function encodeId(id, alias) {
  if (alias) {
    return `${id}$$${alias}`
  } else {
    return id
  }
}
export function decodeId(id) {
  return id.split('$$')
}

export function isAlias(id: string) {
  return id.includes('$$')
}
let computeId = 0
export function DynamicFormLayout<T>(props: {
  get: IRdxComputeGet<T>
  children: (params: LoaderValue<T>) => React.ReactNode
}) {
  const value = useRdxValueLoader(
    React.useMemo(
      () =>
        compute({
          id: 'DynamicFormLayout__' + computeId++,
          get: props.get as IRdxComputeGet<T>,
        }),
      [],
    ),
  )
  return <>{props.children(value)}</>
}
export class PathDecorate {
  config: Partial<IRdxFormItemAnyType>
  constructor(config: Partial<IRdxFormItemAnyType>) {
    this.config = config
  }

  // 名称是否和id相同
  isNameSameWithId() {
    const ids = this.config.id.split('.')
    const lastId = ids[ids.length - 1]
    return lastId === this.config.name
  }
  // 是否存在一个组件对应多个属性
  isMultiNames() {
    invariant(
      typeof this.config.name === 'string',
      `name的值为${this.config.name}，必须为字符串; path: ${this.config.id}`,
    )
    return (this.config.name as any)?.includes('|')
  }

  forkAndRemoveAlias() {
    return pathDecorate({
      ...this.config,
      alias: undefined,
    })
  }
  forkByName(name: string) {
    return pathDecorate({
      ...this.config,
      id: [...this.config.paths, name].join('.'),
    })
  }
  toJSON() {
    return encodeId(this.config.id, this.config.alias)
  }
}
let optionsCollect = new Map<string, IRdxFormItemAnyType>()
export function pathDecorate(options: Partial<IRdxFormItemAnyType>, virtual: boolean = false) {
  const createId = encodeId(options.id, options.alias)
  if (virtual) {
    if (!optionsCollect.has(createId)) {
      throw new Error(`id为${createId}的节点尚未初始化`)
    } else {
      options = optionsCollect.get(createId)
    }
  } else if (!optionsCollect.has(createId)) {
    optionsCollect.set(createId, options as any)
  }

  return new PathDecorate(options)
}

// 收集所有字段
export interface IFormRoot {
  id: string
  valueAtom: (params: PathDecorate) => RdxState<any>
  computeState: (params: PathDecorate) => RdxState<any>
  validateCompute: (params: PathDecorate) => RdxState<any>
  formDataCompute: any
}
export const FormRootContext = React.createContext<IFormRoot>(null)

export function parseName(name: string = '') {
  return name.split('|')
}

export function createFormInfos(formId: string) {
  // const { contextId } = React.useContext(RdxContextRuntimeInfo)
  // formId = contextId + '-' + formId
  const KEY = {
    fetchAsyncKey: formId + '-fetchAsyncValue',
    statusKey: formId + '-status',
    valueKey: formId + '-value',
    valueInterceptKey: formId + '-valueIntercept',
    editStateKey: formId + '-editState',
    computeInterceptKey: formId + '-computeIntercept',
    computeStateKey: formId + '-computeState',
    validateKey: formId + '-validate',
    valueAndStatusComputeKey: formId + '-valueAndStatusAtom',
  }
  return {
    KEY,
    interceptFormId: formId,
  }
}

export function checkNested(obj, keys) {
  var args = keys.split('.')

  for (var i = 0; i < args.length; i++) {
    if (!obj || !obj.hasOwnProperty(args[i])) {
      return false
    }
    obj = obj[args[i]]
  }
  return true
}

function atoms(config: { interceptFormId; KEY }, dataCompute?: any) {
  const { KEY } = config
  /**
   * 默认值初始化
   */
  const fetchAsyncValue = computeFamily({
    id: KEY.fetchAsyncKey,
    get: (params: PathDecorate) => ({ get, id: currentId }, context) => {
      const defaultData = isRdxInstance(dataCompute) ? get(dataCompute as any) ?? {} : dataCompute
      const { id } = params.config
      const defaultValue = getEmptyValue(params.config as any)
      // 如果父节点有数据，则到父节点中取
      const paths = id.split('.')
      const parentPaths = paths.slice(0, paths.length - 1)
      // 默认值 > 父组件初始化的数据 > 当前组件
      const getFromParent = () => {
        if (parentPaths.length > 0) {
          const parentValue = get(valueAtom(pathDecorate({ id: parentPaths.join('.') }))) ?? {}
          if (parentValue) {
            const valueFromParent = getValue(parentValue, paths[paths.length - 1])
            return valueFromParent === undefined ? defaultValue : valueFromParent
          } else {
            return defaultValue
          }
        } else {
          return defaultValue
        }
      }
      // 只有初始化阶段，会从defaultData中获取，否则从表单默认值中获取
      const data =
        context.hasTask(currentId) && context.getTaskStatusById(currentId)?.value === Status.IDeal
          ? getFromParent()
          : checkNested(defaultData, id)
          ? // 从上下游数据中取
            getValue(defaultData, id)
          : // 从父级取
            getFromParent()
      // : // ! 要考虑数组的可变性，数组是可以删除的, 场景： 原来数组是[1, 2,3], 删掉一个，再增加一个，这个时候默认值应该是以组件的默认值为准，而不是DefaultData优先了
      // getValue(defaultData, id) === undefined
      // ? getFromParent()
      // : getValue(defaultData, id)
      // !支持从上一层获取数据
      // TODO: 要定义一下取数规则，比如数组中一个多层嵌套的对象，这种情况要考虑
      return data
    },
  })
  // 值状态
  const valueAtom = atomFamily({
    id: KEY.valueKey,
    defaultValue: (params: PathDecorate) => {
      return fetchAsyncValue(params)
    },
    effects: params => params.config?.valueEffects || [],
  })
  const statusAtom = atomFamily({
    virtual: true,
    id: KEY.statusKey,
    defaultValue: (params: PathDecorate) => {
      return getDefaultStatus(params.config as any)
    },
    effects: params => params.config.statusEffects,
  })
  return {
    valueAtom,
    statusAtom,
  }
}

// 可以脱离表单获取数据
const { getInstance } = singleInstanceFactory()

export function createFormFactory<GComponents extends IComponents>(options: { components?: GComponents }) {
  const { components } = options
  type GCompoonentPropss = {
    [K in keyof GComponents]: K extends string ? InferPropsType<GComponents[K]>['componentProps'] : any
  }
  return function formBuilder<GSource extends Record<string, any>>(options: {
    formId: string
    dataCompute?: GSource | RdxValue<GSource>
    middlewares?: ((
      props: IRdxFormItem<GSource, any, any, GCompoonentPropss, any>,
    ) => IRdxFormItem<GSource, any, any, GCompoonentPropss, any>)[]
  }) {
    const { formId, dataCompute = {} as any, middlewares = [] } = options
    const formInfos = createFormInfos(formId)
    const { KEY, interceptFormId } = formInfos
    return getInstance(interceptFormId, () => {
      const AtomKeys = [KEY.valueKey, KEY.statusKey, KEY.editStateKey]
      function likeFormState(key: string) {
        // ${id}_atomFamily/
        // "test-computeState-computeFamily/"object.password""
        return key.split('/')[0].replace(`_atomFamily|_computeFamily`, '') === key
      }
      const { valueAtom, statusAtom } = atoms(formInfos, dataCompute)

      /**
       *  用来记入编辑状态
       */
      const valueIntercept = computeFamily({
        id: KEY.valueInterceptKey,
        get: (params: PathDecorate) => ({ get }) => {
          return get(valueAtom(params.forkAndRemoveAlias()))
        },
        set: (params: PathDecorate) => ({ get, set }, newValue) => {
          const { name, paths } = params.config
          // 这里也是因为多个属性绑定一个组件的逻辑，看看是否能挪移到valueAndStatus
          // ! 透出给用户时候用的rdxState，需要感知到状态变化
          // 通过name和path组合出编辑态的id, 一个组件映射多个属性的时候，多个属性的修改绑定的是一个编辑状态。
          const editStateId = createId(name, paths)
          const editState = editStateAtom(pathDecorate({ ...params.config, id: editStateId }))
          // 同步编辑状态
          if (!get(editState).modify) {
            set(editState, state => ({ ...state, modify: true }))
          }
          set(valueAtom(params.forkAndRemoveAlias()), newValue)
        },
      })

      /**
       *  用来抹平 一个组件映射多个属性的compute
       *  1. id = a | b, name = a | b
       *  2. id = a , name = a | b
       */
      const smoothAssociationForMultiAttr = computeFamily({
        id: KEY.valueAndStatusComputeKey,
        get: (params: PathDecorate) => config => {
          const { name, paths } = params.config

          let value
          if (params.isNameSameWithId() && params.isMultiNames()) {
            // 多属性 & 属性和名称相同
            value = parseName(name as string).map((name, index) => {
              return config.get(
                valueIntercept(
                  pathDecorate({
                    ...params.config,
                    id: createId(name, paths),
                    // 需要定制默认值
                    defaultValue: getEmptyValue(params.config as any)[index],
                  }),
                ),
              )
            })
          } else {
            value = config.get(valueIntercept(params))
          }
          // status通过name 和paths来获取, 通过id来获取数据
          return {
            ...config.get(
              statusAtom(
                pathDecorate({
                  ...params.config,
                  id: createId(name, paths),
                }),
              ),
            ),
            value: value,
          }
        },
        set: (params: PathDecorate) => (config, newValue: any) => {
          // status通过name 和paths来获取, 通过id来获取数据
          const { name, paths } = params.config
          const statusParams = pathDecorate({
            ...params.config,
            id: createId(name, paths),
          })
          // 设置原子的状态, 1. 通过decodeId方法，解析出路径， 然后设置值
          if (newValue instanceof DefaultValue) {
            if (params.isMultiNames()) {
              parseName(params.config.name as string).forEach(currentName => {
                config.reset(valueIntercept(params.forkByName(currentName)))
              })
            } else {
              config.reset(valueIntercept(params))
            }
            config.reset(statusAtom(statusParams))
          } else {
            const { value, ...status } = newValue
            if (params.isMultiNames()) {
              parseName(params.config.name as string).forEach((currentName, index) => {
                config.set(valueIntercept(params.forkByName(currentName)), newValue.value[index])
              })
            } else {
              config.set(valueIntercept(params), newValue.value)
            }
            config.set(statusAtom(statusParams), status as any)
          }
        },
      })

      /**
       * 用来执行外部传入的get 和 set方法
       */
      const computeIntercept = computeFamily({
        virtual: true,
        id: KEY.computeInterceptKey,
        get: (params: PathDecorate) =>
          params.config.get
            ? config => {
                return params.config.get({
                  ...config,
                  mixedValueAndStatus: config.get(smoothAssociationForMultiAttr(params)),
                  id: parseFamilyId(config.id),
                  get: config.get,
                })
              }
            : config => {
                // 获取数据， 获取依赖关系
                return config.get(smoothAssociationForMultiAttr(params))
              },
        set: (params: PathDecorate) => (config, newValue) => {
          if (
            params.config.set
            // &&
          ) {
            params.config.set(
              {
                ...config,
                id: parseFamilyId(config.id),
                // ! 需要注意一下
                get: config.get,
                set: (atom: any, newValue) => {
                  if (atom.getId() === computeState(pathDecorate({ id: parseFamilyId(config.id) as any })).getId()) {
                    // 设置数据的兼容，避免重复调用自己，否则要提供setSelf的api
                    config.set(
                      smoothAssociationForMultiAttr(new PathDecorate({ id: parseFamilyId(config.id) })),
                      newValue,
                    )
                  } else {
                    config.set(atom, newValue)
                  }
                },
                reset: config.reset,
              },
              newValue,
            )
          } else {
            config.set(smoothAssociationForMultiAttr(params), newValue)
          }
        },
      })
      /**
       *  一个组件对应多个属性，为每个组件生成一个compute
       * @param props
       */
      function bindMultiNameFormCompute(props: PathDecorate) {
        const { name } = props.config
        return props.isMultiNames()
          ? parseName(name as string).map((name, index) => {
              return computeIntercept(props.forkByName(name)) as any
            })
          : []
      }
      const computeState = computeFamily<IViewModel<any, any>, PathDecorate>({
        virtual: true,
        id: KEY.computeStateKey,
        get: (params: PathDecorate) => ({ get }) => {
          // 一个组件映射多个属性的时候，苟泽多属性的compute，方便外围消费
          bindMultiNameFormCompute(params).map(compute => get(compute))
          const value = get(computeIntercept(params))
          return value
        },
        set: (params: PathDecorate) => (config, newValue) => {
          config.set(computeIntercept(params), newValue)
        },
      })
      const editStateAtom = atomFamily({
        id: KEY.editStateKey,
        virtual: true,
        defaultValue: (params: PathDecorate) => {
          return {
            modify: false,
            autoValidate: false,
          }
        },
      })

      function parseFamilyId(id) {
        return JSON.parse(id.split('/')[1])
      }
      const validateCompute = computeFamily({
        id: KEY.validateKey,
        get: (params: PathDecorate) => (config, context) => {
          const { get } = config
          // validateKey的key, 需要先parse
          const { id, title, rules = [], validateConfig = {} as IValidateConfig } = params.config
          const { validateFirst, emptyErrorMessage, autoValidate = true, ignoreEmptyValidate = false } = validateConfig
          // 共享编辑态
          const editState = editStateAtom(params.forkAndRemoveAlias())
          //
          const { modify } = get(editState)
          const formState = get(computeState(params))
          const emptyRule = ({ value }) => {
            if (isEmpty(value.value)) {
              return emptyErrorMessage || `${title}不能为空!`
            } else {
              return undefined
            }
          }

          const newRules = formState.require ? rules.concat(ignoreEmptyValidate ? [] : [emptyRule]) : rules
          async function validate() {
            // 没修改， 不自动校验，不初次校验，则返回空数组
            if (!modify && !autoValidate && !validateFirst) {
              return []
            } else {
              let relyModify = false
              let infos = []

              for (let rule of newRules) {
                infos.push(
                  await rule({
                    value: formState,
                    has: (atom: any) => {
                      return context.hasTask(atom.getId())
                    },
                    get: id => {
                      // 如果关联的表单，有alias， 那么用哪个
                      // 嗅探value依赖
                      const stateId = (id as RdxState<any>).getId()
                      if (
                        likeFormState(stateId) &&
                        get<{ modify: boolean; autoValidate: boolean }>(
                          editStateAtom(pathDecorate({ id: parseFamilyId(stateId) })),
                        ).modify
                      ) {
                        relyModify = true
                      }
                      // ! 这里需要转化为atom
                      return config.get(id as any)
                    },
                    id: id,
                  }),
                )
              }
              // 开启第一次校验， 则跳过是否修改的判断
              if (relyModify || modify || validateFirst) {
                return infos.filter(item => !isEmpty(item))
              } else {
                return []
              }
            }
          }
          if (newRules.length > 0) {
            return validate()
          } else {
            return []
          }
        },
      })
      const formDataCompute = (compute({
        id: `${interceptFormId}/formDataCompute`,
        get: ({ get }) => {
          const baseData = clone(isRdxInstance(dataCompute) ? get(dataCompute as any) ?? {} : dataCompute)
          const value = get(waitForFamilyChange(computeIntercept))
          const cloneData = baseData
          // 移除alias 移除 a|b
          Object.keys(value).forEach(key => {
            if (!key.includes('|')) {
              if (isAlias(key)) {
                const [currentKey, alias] = decodeId(key)
                setValue(cloneData, currentKey, clone(value[key]?.value))
              } else {
                setValue(cloneData, key, clone(value[key]?.value))
              }
            }
          })
          return cloneData
        },
        // set: ({ set, reset }, newValue, context) => {
        //   getValidAtoms(context, '', true).forEach(key => {
        //     if (newValue instanceof DefaultValue) {
        //       reset(computeState(pathDecorate({ id: key }, true)))
        //     } else {
        //       set(computeState(pathDecorate({ id: key }, true)), state => ({
        //         ...state,
        //         value: newValue,
        //       }))
        //     }
        //   })

        // },
      }) as unknown) as RdxState<GSource>
      const waitForRegExpCompute = computeFamily({
        id: `${interceptFormId}_waitForRegExpCompute`,
        get: (id: string) => ({ get }) => {
          const reg = new RegExp(`^${getComputeFamilyPrefix(KEY.computeStateKey) + '"' + id}`)
          const value = get(waitForRegExp(reg))

          const cloneData = {}
          Object.keys(value).forEach(key => {
            const keypath = JSON.parse(key.replace(new RegExp(`^${getComputeFamilyPrefix(KEY.computeStateKey)}`), ''))
            if (!key.includes('|') && !isAlias(key) && value[key]) {
              setValue(cloneData, keypath, value[key].value)
            }
          })
          return clone(getValue(cloneData, id))
        },
        set: (id: string) => ({ set, reset }, newValue, context) => {
          getValidKeysFromCollect(context, id, true).forEach(key => {
            context.removeTask(key)
          })
          if (newValue instanceof DefaultValue) {
            reset(computeState(pathDecorate({ id }, true)))
          } else {
            set(computeState(pathDecorate({ id }, true)), state => ({
              ...state,
              value: newValue,
            }))
          }
        },
      })
      const getPathKey = targetKey => {
        const pathKey = JSON.parse(targetKey.replace(getAtomFamilyPrefix(KEY.valueKey), '')) as string
        return pathKey
      }
      const isPathLike = (targetKey, currentPath, excludeSelf: boolean = false) => {
        const pathKey = getPathKey(targetKey)
        return pathKey.startsWith(currentPath) && (excludeSelf ? pathKey !== currentPath : true)
      }
      const getValidAtoms = (context: RdxStore, matchKey: string, excludeSelf?: boolean) => {
        const keys = Array.from(context.getTasks().keys()).filter(
          key => key.startsWith(getAtomFamilyPrefix(KEY.valueKey)) && isPathLike(key, matchKey, excludeSelf),
        )
        return keys
      }
      const getValidIds = (context: RdxStore, matchKey: string, excludeSelf?: boolean) => {
        return getValidAtoms(context, matchKey, excludeSelf).map(key => getPathKey(key))
      }
      const getValidKeysFromCollect = (context: RdxStore, matchKey: string, excludeSelf?: boolean) => {
        let validKeys = [] as string[]
        // 扩展成所有的key
        getValidAtoms(context, matchKey, excludeSelf).forEach(key => {
          const pathKey = getPathKey(key)
          Object.keys(KEY).forEach(currentKey => {
            if (AtomKeys.includes(KEY[currentKey])) {
              validKeys.push(getAtomFamilyPrefix(KEY[currentKey]) + stringify(pathKey, {}))
            } else {
              validKeys.push(getComputeFamilyPrefix(KEY[currentKey]) + stringify(pathKey, {}))
            }
          })
        })
        return validKeys
      }

      function useFormState<
        GBaseType extends BaseType,
        GComponentType extends keyof GCompoonentPropss,
        GChildren extends FormChildren
      >(props: IRdxFormItem<GSource, GBaseType, GComponentType, GCompoonentPropss, GChildren>) {
        const { name } = props
        const { paths } = React.useContext(PathContextInstance)
        // 唯一id
        const id = createId(name, paths)
        const params = pathDecorate({ ...props, id, paths })
        // 获取默认值`
        const defaultValue = {
          ...getDefaultStatus(props),
          value: getEmptyValue(props),
        }

        // ! 初始化默认状态, 先注释掉，看看后面怎么用
        // initStatus(props as any);
        // 生成rdx atom定义
        const [contentState, setNextContentState] = useRdxStateLoader(computeState(params))
        const errorState = useRdxValue(validateCompute(params))
        // 当get函数为异步的时候，使用表单的默认值作为初始化的状态
        const { status, errorMsg, content = defaultValue } = contentState
        const { visible } = content
        // 表单状态逻辑
        let state = undefined
        if (status === Status.Waiting || status === Status.Running) {
          state = IState.Loading
        } else if (Status.Error === status) {
          state = IState.Error
        }
        const collect = useFormCollectContext()
        React.useEffect(() => {
          if (visible) {
            collect && collect.add(id, props)
          }
          return () => {
            collect && collect.remove(id)
          }
        }, [visible])
        return {
          id,
          content: content,
          errorMsg,
          setNextContentState,
          errorState,
          state,
        }
      }
      const propsMiddlewares = (props: IRdxFormItemAnyType) => {
        const { name } = props
        const { paths } = React.useContext(PathContextInstance)
        // 唯一id
        const id = createId(name, paths)
        return middlewares.reduce((params, middleware) => middleware(params as any) as any, {
          ...props,
          id,
          paths,
        }) as any
      }
      const FormItem = <
        GBaseType extends BaseType,
        GComponentType extends keyof GCompoonentPropss,
        GChildren extends FormChildren
      >(
        props: IRdxFormItem<GSource, GBaseType, GComponentType, GCompoonentPropss, GChildren>,
      ) => {
        props = propsMiddlewares(props)
        const {
          name,
          desc,
          tips,
          children,
          type,
          tipsPosition,
          componentType,
          useMargin,
          contentStyle,
          titleStyle,
          wrapperStyle,
        } = props
        const { id, content, state, setNextContentState, errorState, errorMsg } = useFormState(props)
        // @ts-ignore
        const invalidField = type === 'layout'
        // 如果父级是数组，则使用父级的name
        // 表格场景，强制不能嵌套，因为布局是由表格掌控的
        const {
          title,
          showTitle,
          visible,
          disabled,
          require,
          preview,
          value,
          componentProps,
          layoutExtends = {},
        } = content
        const item = (
          <BaseFormItem
            id={id}
            isLayout={invalidField}
            baseProps={{
              value: value,
              require,
              state,
              preview: preview,
              disabled: disabled,
              onChange: v => {
                // const newValue = { ...contentState.content, value: v };
                setNextContentState(state => ({ ...state, value: v }))
              },
            }}
            info={{
              contentStyle,
              titleStyle,
              wrapperStyle,
              useMargin,
              showTitle,
              visible,
              title,
              desc,
              tipsPosition,
              tips: tips,
              require: require,
              layoutExtends,
              formErrorMsg: errorState,
              errorMsg: errorMsg,
            }}
            formTypes={{
              type,
              componentType: componentType,
            }}
            componentProps={componentProps || ({} as any)}
          >
            {children}
          </BaseFormItem>
        )

        return invalidField ? (
          item
        ) : (
          <PathContextInstance.Provider value={{ paths: id.split('.') }}>
            <FormItemContextInstance.Provider value={{ name: name as string }}>{item}</FormItemContextInstance.Provider>
          </PathContextInstance.Provider>
        )
      }
      const BaseFormItem = (props: IFormRenderItem & { id: string; children?: React.ReactNode }) => {
        const { children, formTypes, info, baseProps, componentProps, isLayout, id } = props
        const { type, componentType } = formTypes
        const { visible = true } = info
        const rdxStore = useRdxContext()
        const mutators = createArrayMutators({
          formId: KEY.valueKey,
          value: baseProps.value,
          onChange: v => {
            baseProps.onChange(v)
          },
          children,
          getValidAtoms: (key: string) => getValidAtoms(rdxStore, key),
          getValidKeysFromCollect: (key: string) => getValidKeysFromCollect(rdxStore, key),
        })

        const { WrapperComponent, TitleComponent, ContentComponent } = useFormItemRenderComponentsContext()

        const CmpProps = {
          ...baseProps,
          arrayHelper: {
            mutators,
          },
          componentProps,
        }

        const Cmp: IFormComponent = components[componentType || (type as any)]
        let component: any
        if (typeof children === 'function') {
          component = children(CmpProps)
        } else {
          if (Cmp) {
            component = <Cmp {...CmpProps}>{children as any}</Cmp>
          } else {
            console.warn(`xCompnent:${componentType}, type: ${type} not found!!!`)
          }
        }

        const renderInfo: IContentComponent = { ...info, id, type, children }
        return (
          <>
            {isLayout
              ? component
              : visible && (
                  <WrapperComponent {...renderInfo}>
                    <TitleComponent {...renderInfo}></TitleComponent>
                    <ContentComponent {...renderInfo}>{component}</ContentComponent>
                  </WrapperComponent>
                )}
          </>
        )
      }
      // @ts-ignore
      function valueAndStatusShallowCompute<GPath extends TStringPathResolver<GSource> | TArrayPathResolver<GSource>>(
        id: GPath,
        alias?: string,
      ): RdxValueReference<IViewModel<TGetMixedArrayAndString<GSource, GPath>, any>> {
        if (Array.isArray(id)) {
          id = id.join('.') as any
        }
        if (alias) {
          id = encodeId(id, alias) as any
        }

        const newId = getComputeFamilyPrefix(KEY.computeStateKey) + stringify(new PathDecorate({ id } as any))
        return rdxState({
          id: newId,
        }) as any
      }
      function valueAndStatusDeepCompute<GPath extends TStringPathResolver<GSource> | TArrayPathResolver<GSource>>(
        id: GPath,
      ): RdxValueReference<TGetMixedArrayAndString<GSource, GPath>> {
        return waitForRegExpCompute(id as string) as any
      }
      function createValidator<GSource>(formContext: RdxStore) {
        async function validator(
          newId: string[],
          options?: {
            ignoreInvisible: boolean
            alias: string
          },
        ) {
          const { ignoreInvisible = false, alias } = options || ({} as any)
          const allKeys = newId
            .filter(id => {
              if (!formContext.getTaskStateById(computeState(pathDecorate({ id, alias })).getId())) {
                return true
              }
              return ignoreInvisible
                ? formContext.getTaskStateById(computeState(pathDecorate({ id, alias })).getId())?.visible === true
                : true
            })
            .map(id => ({
              id,
              value: formContext.getTaskStateById(editStateAtom(pathDecorate({ id }, false)).getId()),
            }))
          // ! 要想办法构造alias的modifyKey
          const allModifyKeys = allKeys.filter(item => {
            return !item.value?.modify
          })
          // ! 这里是hack方案，有没有办法批量触发
          allModifyKeys.forEach(({ id, value }) => {
            validateCompute()
            formContext.updateState(
              editStateAtom(pathDecorate({ id }, false)).getId(),
              ActionType.Update,
              TargetType.TaskState,
              { ...value, modify: true },
            )
          })
          function normalizeError(row: { id: string; value: string }) {
            const validateId = validateCompute(pathDecorate({ id: row.id, alias }, false)).getId()
            let msg
            if (formContext.getTaskStatusById(validateId)?.value === Status.IDeal) {
              msg = formContext.getTaskStateById(validateId)
            } else if (formContext.getTaskStatusById(validateId)?.value === Status.Error) {
              msg['节点初始化出错']
            } else {
              msg = ['节点尚未初始化完成']
            }
            return {
              id: row.id,
              msg,
            }
          }
          if (allModifyKeys.length > 0) {
            const res = formContext.watchOnce(
              allKeys.map(item => validateCompute(pathDecorate({ id: item.id, alias }, false)).getId()),
            )
            formContext.batchDepsChangeAtOnce(
              allModifyKeys.map(item => ({
                key: editStateAtom(pathDecorate({ id: item.id }, false)).getId(),
                downStreamOnly: true,
              })),
              'validate',
            )
            return res.then(res => {
              return allKeys.map(normalizeError)
            })
          } else {
            return allKeys.map(normalizeError)
          }
        }
        return function(
          id?: TStringPathResolver<GSource> | TStringPathResolver<GSource>[],
          options?: {
            ignoreInvisible: boolean
            alias: string
          },
        ): Promise<IErrorMessage> {
          const newId = id as string | string[]

          if (!newId) {
            // getValidAtoms()
            const allKeys = getValidIds(formContext, '')
            return validator(allKeys, options).then(res => ({
              isError: isError(res.map(item => item.msg)),
              errorMsg: res,
            }))
          } else if (Array.isArray(newId)) {
            return validator(newId, options).then(res => ({
              isError: isError(res.map(item => item.msg)),
              errorMsg: res,
            }))
          } else {
            return validator([newId], options).then(res => {
              return {
                isError: isError(res.map(item => item.msg)),
                errorMsg: res[0],
              }
            })
          }
        }
      }
      function useValidator() {
        return createValidator<GSource>(useRdxContext())
      }
      function FormDataPreview(props: { children?: (props: { data: GSource }) => React.ReactElement }) {
        const value = useRdxValue(formDataCompute)
        return props.children ? (
          props.children({ data: value })
        ) : (
          <div>
            <pre>{JSON.stringify(value, null, 2)}</pre>
          </div>
        )
      }
      function useFormReset() {
        const formContext = useRdxContext()
        const setter = useRdxSetterLazy()
        return () => {
          formContext.batchReset(getValidAtoms(formContext, '', true))
          // .forEach(key => {
          //   const cm = computeState(pathDecorate({ id: key }, true))
          //   setter(cm, state => ({
          //     ...state,
          //     value: DefaultValue,
          //   }))
          // })
        }
      }

      function valueAtomFamily<GPath extends TStringPathResolver<GSource> | TArrayPathResolver<GSource>>(
        id: GPath,
      ): RdxValueReference<IViewModel<TGetMixedArrayAndString<GSource, GPath>, any>> {
        return valueAtom(pathDecorate({ id: id as any })) as any
      }
      return {
        id: interceptFormId,
        // 表单数据变更
        formDataCompute,
        // 表单重置
        useFormReset,
        FormDataPreview,
        // 表单项
        FormItem,
        // 抹平上下文
        FormContext: (props: { children: any }) => {
          return <PathContextInstance.Provider value={{ paths: [] }}>{props.children}</PathContextInstance.Provider>
        },
        // 表单列表
        // FormList,
        // 校验器
        valueAtomFamily,
        useValidator,
        // 获取错误信息
        // @ts-ignore
        errorCompute: <GPath extends TStringPathResolver<GSource>>(id: GPath) =>
          validateCompute(pathDecorate({ id: id as string }, true)),
        // 获取数据和compute
        valueAndStatusShallowCompute,
        // 这个很可能造成死循环
        valueComputeByRegexp: valueAndStatusDeepCompute,
      }
    })
  }
}
