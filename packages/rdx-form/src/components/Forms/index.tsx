import React, { useContext, useEffect, useMemo } from 'react'
import {
  ActionType,
  RdxContext,
  TRdxUseStateReturn,
  Status,
  TargetType,
  RdxValueReference,
  rdxState,
  useRdxValue,
  useRdxStateLoader,
  useRdxContext,
} from '@alife/rdx'
import { PathContextInstance } from '../../hooks/pathContext'
import { FormItemContextInstance } from '../../hooks/formContext'
import { getEmptyValue } from '../../utils/functions'
import {
  IComponents,
  IDataModel,
  IFormRenderItem,
  IModel,
  IRdxFormItem,
  IState,
  InferPropsType,
  IFormComponent,
  TStringPathResolver,
  TGetByStringPath,
  SuspectType,
  BaseType,
  TFormStatus,
  IViewModel,
  RdxFormGet,
  RdxFormSet,
  FormChildren,
} from './types'
import { IContentComponent, useFormItemRenderComponentsContext } from '../../hooks/renderContext'

import { createId } from '../../utils/base'
import { enocdeIdByStateType, EFormStateType, FormState, IRdxFormRoot } from './utils'
import Preview from '../Preview'
import { FormComponentsContext, useFormContext } from '../../hooks/FormComponentsCotnext'
import { FormStore, createFormStore } from './state'
import { getDefaultStatus, getFormStatus, getValidateCompute, getFormCompute } from './atoms'
import { useValidator } from '../../hooks/formHooks'
import { createArrayMutators } from '../ArrayCardField/utils'
import { useFormCollectContext } from '../../hooks/FormItemCollectContext'
export * from './types'
export * from './state'
export * from './utils'
export * from './atoms'
export enum DepsType {
  Relative = 'Relative',
  Absolute = 'Absolute',
}

export function formBuilder<GComponents extends IComponents>(options: { components: GComponents }) {
  type GCompoonentPropss = {
    [K in keyof GComponents]: K extends string ? InferPropsType<GComponents[K]>['componentProps'] : any
  }

  return <GSource extends IDataModel>() => {
    function useReferencedFormComputeState<
      GPath extends TStringPathResolver<GSource>,
      GComponentType extends keyof GCompoonentPropss
    >(path: GPath): TRdxUseStateReturn<IViewModel<TGetByStringPath<GSource, GPath>, GCompoonentPropss[GComponentType]>> {
      return useRdxStateLoader(rdxState({ id: enocdeIdByStateType(path, EFormStateType.Compute) }))
    }
    function useReferencedFormValueState<GPath extends TStringPathResolver<GSource>>(
      path: GPath,
    ): TRdxUseStateReturn<TGetByStringPath<GSource, GPath>> {
      return useRdxStateLoader(
        rdxState({
          id: enocdeIdByStateType(path, EFormStateType.ValueIntercepter),
        }),
      )
    }

    function useReferencedFormStatusState<GComponentType extends keyof GCompoonentPropss>(
      path: TStringPathResolver<GSource>,
    ): TRdxUseStateReturn<TFormStatus<GCompoonentPropss[GComponentType]>> {
      return useRdxStateLoader(rdxState({ id: enocdeIdByStateType(path, EFormStateType.Status) }))
    }

    // function useFormValueState<GBaseType extends BaseType>(
    //   props: TFormValue<GSource, GBaseType>
    // ): TRdxUseStateReturn<SuspectType<GBaseType>> {
    //   return useRdxFormStateLoader<SuspectType<GBaseType>>(getFormValue(props));
    // }

    function getReferencedFormValueAtom<GPath extends TStringPathResolver<GSource> | RegExp>(
      path: GPath,
    ): RdxValueReference<TGetByStringPath<GSource, GPath>> {
      // TODO: 这里需要判断实例组件加载了没有，没有将会变成loading状态, useEffect中如果检测到还没有加载，则会warning 提醒.
      return rdxState({
        id: enocdeIdByStateType(path as any, EFormStateType.ValueIntercepter),
      })
    }

    function getReferencedFormStatusAtom<GPath extends TStringPathResolver<GSource>>(
      path: GPath,
    ): RdxValueReference<TFormStatus<any>> {
      // TODO: 这里需要判断实例组件加载了没有，没有将会变成loading状态, useEffect中如果检测到还没有加载，则会warning 提醒.
      return rdxState({
        id: enocdeIdByStateType(path, EFormStateType.Status),
      })
    }

    function getReferencedFormCompute<GPath extends TStringPathResolver<GSource>>(
      path: GPath,
    ): RdxValueReference<IViewModel<TGetByStringPath<GSource, GPath>, any>> {
      // TODO: 这里需要判断实例组件加载了没有，没有将会变成loading状态, useEffect中如果检测到还没有加载，则会warning 提醒.
      return rdxState({
        id: enocdeIdByStateType(path, EFormStateType.Compute),
      })
    }
    function useFormComputeState<
      GBaseType extends BaseType,
      GComponentType extends keyof GCompoonentPropss,
      GChildren extends FormChildren
    >(
      props: IRdxFormItem<GSource, GBaseType, GComponentType, GCompoonentPropss, GChildren>,
    ): TRdxUseStateReturn<IViewModel<SuspectType<GBaseType>, GCompoonentPropss[GComponentType]>> {
      return useRdxStateLoader<IModel<SuspectType<GBaseType>>>(getFormCompute(props)) as any
    }

    // function useFormStatusState<GComponentType extends keyof GCompoonentPropss>(
    //   props: TFormStatusProps<GSource, any, GComponentType, GCompoonentPropss>
    // ): TRdxUseStateReturn<TFormStatus<GCompoonentPropss[GComponentType]>> {
    //   return useRdxFormStateLoader(getFormStatus(props as any) as any);
    // }

    function initStatus<GBaseType extends BaseType, GComponentType extends string>(
      props: IRdxFormItem<GSource, GBaseType, GComponentType, GCompoonentPropss, GCompoonentPropss[GComponentType]>,
    ) {
      const context = useRdxContext()
      const defaultStatus = getDefaultStatus(props)
      const atomStatus = getFormStatus(props)
      useMemo(() => {
        const value = context.getTaskStateById(atomStatus.getId())
        // 没有实例的情况且value存在的情况,要初始化状态
        if (!context.hasTask(atomStatus.getId()) && value) {
          context.updateState(atomStatus.getId(), ActionType.Update, TargetType.TaskState, defaultStatus)
        }
      }, [])
    }

    const FormItem = <
      GBaseType extends BaseType,
      GComponentType extends keyof GCompoonentPropss,
      GChildren extends FormChildren
    >(
      props: IRdxFormItem<GSource, GBaseType, GComponentType, GCompoonentPropss, GChildren>,
    ) => {
      const { name, title, desc, tips, children, type, showTitle, tipsPosition, componentType } = props
      const { paths } = useContext(PathContextInstance)
      // 唯一id
      const id = createId(name, paths)
      // @ts-ignore
      const invalidField = type === 'layout'
      // 获取默认值`
      const defaultValue = {
        ...getDefaultStatus(props),
        value: getEmptyValue(props),
      }

      // 初始化默认状态
      initStatus(props as any)
      // 生成rdx atom定义
      const [contentState, setNextContentState] = useFormComputeState(props)
      const errorState = useRdxValue(getValidateCompute(props))
      // 当get函数为异步的时候，使用表单的默认值作为初始化的状态
      const { status, errorMsg, content = defaultValue } = contentState
      const { visible, disabled, require, preview, value, componentProps, layoutExtends = {} } = content
      // 表单状态逻辑
      let state = undefined
      if (status === Status.Waiting || status === Status.Running) {
        state = IState.Loading
      } else if (Status.Error === status) {
        state = IState.Error
      }
      const collect = useFormCollectContext()
      useEffect(() => {
        if (visible) {
          collect && collect.add(id, props)
        }
        return () => {
          collect && collect.remove(id)
        }
      }, [visible])
      // 如果父级是数组，则使用父级的name
      // 表格场景，强制不能嵌套，因为布局是由表格掌控的
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
              const newValue = { ...contentState.content, value: v }
              setNextContentState(newValue)
            },
          }}
          info={{
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
        <PathContextInstance.Provider value={{ paths: [...paths, name as string] }}>
          <FormItemContextInstance.Provider value={{ name: name as string }}>{item}</FormItemContextInstance.Provider>
        </PathContextInstance.Provider>
      )
    }
    const BaseFormItem = (props: IFormRenderItem & { id: string; children?: React.ReactNode }) => {
      const { children, formTypes, info, baseProps, componentProps, isLayout, id } = props
      const { type, componentType: componentType } = formTypes
      const { visible = true } = info
      const mutators = createArrayMutators(v => {
        baseProps.onChange(v)
      }, children)

      const { WrapperComponent, TitleComponent, ContentComponent } = useFormItemRenderComponentsContext()

      const CmpProps = {
        ...baseProps,
        arrayHelper: {
          mutators,
        },
        componentProps,
      }

      const Cmp: IFormComponent = useFormContext().components[componentType || (type as any)]
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

    const RdxFormRoot = (props: IRdxFormRoot<GSource, GCompoonentPropss>) => {
      const {
        children,
        store = new FormStore<GSource, GCompoonentPropss>({}),
        // onChange,
        JsonView,
        autoValidate = false,
        enabledStatePreview,
        // enabledTypescriptGenerte,
        // typescriptGenerateOptions = { rootName: 'RootObject' },
        ...rest
      } = props

      return (
        <FormComponentsContext.Provider
          value={{
            components: options.components,
            autoValidate,
          }}
        >
          <RdxContext
            {...rest}
            withStore={context => {
              store._initContext(context)
            }}
            initializeState={store._initState}
            createStore={data => {
              return new FormState(data) as any
            }}
            onChange={() => {
              // onChange && onChange(store);
            }}
          >
            {children}
            {enabledStatePreview && <Preview JsonView={JsonView} />}
          </RdxContext>
        </FormComponentsContext.Provider>
      )
    }

    return {
      FormItem,
      RdxFormRoot,
      getReferencedFormValueAtom,
      getReferencedFormStatusAtom,
      getReferencedFormCompute,
      useValidator: () => useValidator<GSource>(),
      createFormStore: (values?: Partial<GSource>) => createFormStore<GSource, GCompoonentPropss>(values),
    }
  }
}
