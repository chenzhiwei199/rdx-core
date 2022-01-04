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
  RdxValue,
  RdxValueReference,
  rdxState,
  singleInstanceFactory,
  RdxGet,
  computeFamily,
} from '@alife/rdx'
import { createArrayMutators } from '../FormsNew/helper'
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
  TGetMixedArrayAndString,
  TStringPathResolver,
} from '../Forms/types'
import { getEmptyValue, getValue, setValue } from '../../utils/functions'
import { getDefaultStatus } from '../Forms/atoms'
import { PathContextInstance, usePathContext } from '../../hooks/pathContext'
import { useFormCollectContext } from '../../hooks/FormItemCollectContext'
import { FormItemContextInstance } from '../../hooks/formContext'
import { IContentComponent, useFormItemRenderComponentsContext } from '../../hooks/renderContext'
import { clone } from '../Forms/utils'
import { checkNested, encodeId, pathDecorate, PathDecorate, isAlias, decodeId, createFormInfos } from '../FormsNew/atom'
import { createId } from '../../utils/base'

// 收集所有字段









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
    valueAtom: (params: PathDecorate) => {
      return valueAtom(params.forkAndRemoveAlias());
    },
    statusAtom,
  }
}

// 可以脱离表单获取数据
const { getInstance } = singleInstanceFactory()

export function createQuickFormFactory<GComponents extends IComponents>(options: { components?: GComponents }) {
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
      const AtomKeys = [KEY.valueKey, KEY.statusKey]
      const { valueAtom: valueIntercept, statusAtom } = atoms(formInfos, dataCompute)

      /**
       * 用来执行外部传入的get 和 set方法
       */
      const computeState = computeFamily({
        virtual: true,
        id: KEY.computeStateKey,
        get: (params: PathDecorate) =>
          params.config.get
            ? config => {
                const { name, paths } = params.config
                const mixedValueAndStatus = {
                  ...config.get(
                    statusAtom(
                      pathDecorate({
                        ...params.config,
                        id: createId(name, paths),
                      }),
                    ),
                  ),
                  value: config.get(valueIntercept(params)),
                }
                return params.config.get({
                  ...config,
                  mixedValueAndStatus,
                  id: parseFamilyId(config.id),
                  get: config.get,
                })
              }
            : config => {
                const { name, paths } = params.config
                return {
                  ...config.get(
                    statusAtom(
                      pathDecorate({
                        ...params.config,
                        id: createId(name, paths),
                      }),
                    ),
                  ),
                  value: config.get(valueIntercept(params)),
                }
              },
        set: (params: PathDecorate) => (config, newValue: any) => {
          const { name, paths } = params.config
          const statusParams = pathDecorate({
            ...params.config,
            id: createId(name, paths),
          })
          if (params.config.set) {
            // !是否要判断是自己
          
            params.config.set(
              {
                ...config,
                id: parseFamilyId(config.id),
                // ! 需要注意一下
                get: config.get,
                set: (atom: any, newValue: any) => {
                  if (atom.getId() === computeState(pathDecorate({ id: parseFamilyId(config.id) as any })).getId()) {
                    // 设置数据的兼容，避免重复调用自己，否则要提供setSelf的api
                    if (newValue instanceof DefaultValue) {
                      config.reset(valueIntercept(params))
                      config.reset(statusAtom(statusParams))
                    } else {
                      const { value, ...status } = newValue
                      config.set(valueIntercept(params), newValue.value)
                      config.set(statusAtom(statusParams), status as any)
                    }
                  } else {
                    config.set(atom, newValue)
                  }
                },
                reset: config.reset,
              },
              newValue,
            )
          } else {
            if (newValue instanceof DefaultValue) {
              config.reset(valueIntercept(params))
              config.reset(statusAtom(statusParams))
            } else {
              const { value, ...status } = newValue
              config.set(valueIntercept(params), newValue.value)
              config.set(statusAtom(statusParams), status as any)
            }
          }
        },
      })

      function parseFamilyId(id) {
        return JSON.parse(id.split('/')[1])
      }

      const formDataCompute = (compute({
        id: `${interceptFormId}/formDataCompute`,
        get: ({ get }) => {
          const baseData = clone(isRdxInstance(dataCompute) ? get(dataCompute as any) ?? {} : dataCompute)
          const value = get(waitForFamilyChange(computeState))
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
        const { id, content, state, setNextContentState, errorMsg } = useFormState(props)
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
              formErrorMsg: [],
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
      // @ts-ignore
      function valueAndStatusDeepCompute<GPath extends TStringPathResolver<GSource> | TArrayPathResolver<GSource>>(
        id: GPath,
      ): RdxValueReference<TGetMixedArrayAndString<GSource, GPath>> {
        return waitForRegExpCompute(id as string) as any
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

      return {
        id: interceptFormId,
        // 表单数据变更
        formDataCompute,
        // 表单重置
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
        // 获取错误信息
        // @ts-ignore
        // 获取数据和compute
        valueAndStatusShallowCompute,
        // 这个很可能造成死循环
        valueComputeByRegexp: valueAndStatusDeepCompute,
      }
    })
  }
}
