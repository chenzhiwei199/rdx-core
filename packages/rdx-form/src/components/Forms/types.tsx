import {DataModel,  IAtomEffect,  RdxReset, RdxValue, ValueOrUpdater} from '@alife/rdx'
import React, { ReactNode } from 'react';
import { IArrayMutators } from '../ArrayCardField/utils';


export enum EStandardType {
  Object = 'object',
  Array = 'array',
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
}
export type BaseType = keyof TypeMap;
export const BaseType = { ...EStandardType };
export interface TypeMap {
  object: Object;
  string: string;
  array: Array<any>;
  number: number;
  boolean: boolean;
}

export type SuspectType<T extends BaseType> = TypeMap[T];


export type Join<K , P > = 
K extends string | number 
? P extends string | number 
  ? `${K}${'.'}${P}` 
  : never 
: never;


export type JoinByVertical<K , P > = K extends string | number ? P extends string | number ?  `${K}${'|'}${ P}` : never : never;
type valueof<T> = T[keyof T]
type ArrayCondition<Conditon, Success, Fail> = Conditon extends [] ? Success : Fail;



/**
 * 通过数组的方式递归获取对应的类型
 */
export type TGet <GData extends IDataModel, GPath> =  
ArrayCondition<GPath, 
  GData,   
  // 推测数组
  GPath extends [infer First, ... infer Rest] 
  // 推测的类型
  ? GData extends Array<infer Type> 
  // 如果第一个是字符串或者数组
    ? First extends number | string 
      ? TGet<Type, Rest>
      : never
    : First extends keyof GData 
        ? TGet<GData[First], Rest>
        : never 
  : any
>;

export type TGetMixedArrayAndString<GData extends IDataModel, GPath> = GPath extends Array<any> ? TGetArrayPath<GData,GPath> : TGetByStringPath<GData, GPath>
export type TGetArrayPath<GData extends IDataModel, GPath> = 
GPath extends [] ? GData : 
GPath extends [infer First, ... infer Rest] 
?  First extends keyof GData
  ? TGetArrayPath<GData[First], Rest>
  :  GData extends Array<infer P> 
     ? TGetArrayPath<P, Rest> 
     : never
: GData extends Array<infer P > ? P :
 GPath extends  keyof GData  
  ? GData[GPath]
  : any

export type TGetByStringPath<GData extends IDataModel , GPath> = 
GPath extends `${infer First}${'.'}${infer Rest}` 
?  First extends keyof GData
  ? TGetByStringPath<GData[First], Rest>
  :  GData extends Array<infer P> 
     ? TGetByStringPath<P, Rest> 
     : never
: GData extends Array<infer P > ? P :
 GPath extends  keyof GData  
  ? GData[GPath]
  : any

/**
 * 通过递归的方式，推测返回数据的类型
 */
export type StringReturnResolver<D> = D extends Join<infer A, infer B> ? [A, ...StringReturnResolver<B>]: [D];
// export type StringReturnResolver<D> = any

/**
 * 通过a.b.c的方式递归获取对应的类型
 */
export type KeyPath<D extends IDataModel > =
  | []
  | (D extends Array<infer U>
      ? [number] | [number, ...KeyPath<U>]
      : D extends object
      ? valueof<{ [K in keyof D]: [K] | [K | string, ...KeyPath<D[K]>] }>
      : never)

/**
 * 通过递归的方式，推测数据类型
 */
export type TStringPathResolver<D extends IDataModel > =  
  D extends Array<infer P> 
     ? number | Join<number,TStringPathResolver<P>> :
    D extends object 
      ? valueof<{
        [K in keyof D]: K | Join<K,TStringPathResolver<D[K]>>
      }>
      : never



/**
 * 根据元数据的类型，推测可以输入的name类型
 */
export type TStringKeysResolver<D extends IDataModel > =  
      D extends Array<infer P > 
         ? TStringKeysResolver<P> :
        D extends object 
          ? valueof<{
            [K in keyof D]: K | JoinByVertical<K, Exclude<keyof D, K>  > | TStringKeysResolver<D[K]>
          }>
          : never

export type TArrayPathResolver<D extends IDataModel > =  
  D extends Array<infer P> 
     ? [number] | [number, ...TArrayPathResolver<P>]  : 
    D extends object 
      ? valueof<{
        [K in keyof D]: [K] | [K, ...TArrayPathResolver<D[K]>] 
      }>
      : []
          
/**
 * 合并a.b.c和[a, b, c]路径推测方式
 */
// ! 由于用户使用string的场景很多，这里把通过ISource推导关了
type TPath<ISource extends IDataModel > =  TStringPathResolver<ISource>  | RdxValue<any> // TStringPathResolver<ISource>| KeyPath<ISource>

// ! 这个代码会导致ts编译死循环
// export type TGetByString<GSource, GPath> = TGet<GSource, StringReturnResolver<GPath>>
// export type TGetByString<GSource, GPath> = any
/**
 *  合并a.b.c和[a, b, c]获取返回数据的类型方式
 */

export type  TResult<ISource extends IDataModel , INode> = INode extends RdxValue<infer P > ? P 
: INode extends string[]
? TGet<ISource, INode>
: INode extends string
? TGetByStringPath<ISource, INode>
: never
export type TModelResult<ISource extends IDataModel , INode> = INode extends RdxValue<infer P > ? P 
: INode extends string[]
? IModel<TGet<ISource, INode>>
: INode extends TGetByStringPath<ISource, INode>
? IModel<TGetByStringPath<ISource, INode>>
: IModel<any>




/**
 * 视图状态
 */
export interface IViewModel<T, G> {
  value?: T;
  visible?: boolean;
  preview?: boolean;
  disabled?: boolean;
  require?: boolean;
  componentProps?: G;
  title?: string;
  showTitle?: boolean;
  layoutExtends?: ILayoutExtends
}

/**
 * 视图状态
 */
export type IModel<T>  = IViewModel<T, { [key: string]: any }>



export type RdxFormGet<ISource extends IDataModel> = <INode extends TPath<ISource> >(node:  INode) => TModelResult<ISource,  INode>
export type RdxFormHas<ISource extends IDataModel> = <INode extends TPath<ISource> >(node:  INode) => boolean
export type RdxFormSet<ISource extends IDataModel> = <INode extends TPath<ISource> >(
  node: INode ,
  value: ValueOrUpdater<TModelResult<ISource, INode>>,
  alias?: string
) => void;

export type IRdxFormComputeGet<ISource, GBaseType extends BaseType, GComponentProps extends { [key: string]: any}> = (config: {
  id: string;
  /**
   * 表单值和状态的合并模型
   */
  mixedValueAndStatus?: IModel<SuspectType<GBaseType>>;
  /**
   * 当事件冲突时触发时候的回调
   *
   * @memberof ReactionContext
   */
  callbackMapWhenConflict: (callback: () => void) => void;
  get: RdxFormGet<ISource>;
}) => DataModel<IModel<SuspectType<GBaseType>> & { componentProps?: GComponentProps}>;

export type IRdxFormComputeSet<ISource, GBaseType extends BaseType> = (
  config: {
    id: string;
    // value: IModel<SuspectType<GBaseType>>;
    get: RdxFormGet<ISource>;
    set: RdxFormSet<ISource>;
    reset: RdxReset;
  },
  newValue: IModel<SuspectType<GBaseType>> ,
  alias?: string
) => void;

export interface IRuleParams<ISource, GBaseType extends BaseType> {
  id: string;
  value: IModel<SuspectType<GBaseType>>;
  get: RdxFormGet<ISource>;
  has: RdxFormHas<ISource>;
}

export type IRule<ISource, GBaseType extends BaseType> = ((params: IRuleParams<ISource, GBaseType>) => string | undefined )| ((params: IRuleParams<ISource, GBaseType>) => Promise<string | undefined>);

 /**
  * 组件的props
  */
export interface IBaseFormComponentProps {
  // 值
  value: any,
  // 值改变的回调
  onChange?: (value:any) => void
  // 状态
  state?: IState
  // 是否可用
  disabled?: boolean;
  // 是否预览
  preview?:boolean
  // 是否必填
  require?: boolean
  
}
export interface IFormComponentProps<T extends any> extends IBaseFormComponentProps {
  children?: React.ReactElement
   // 数组的操作方法, 使用该方法可以精确控制更新
   arrayHelper?: {
    mutators?: IArrayMutators
  }
  componentProps?:  T
}

export enum IState {
  Loading = 'loading',
  Error = 'error',
}

/**
 * 表单实际渲染的节点
 */
export interface IFormRenderItem {
  // 当时无效布局节点的时候，不需要布局
  info: IFormInfo;
  baseProps: IBaseFormComponentProps
  formTypes: IFormTypes<BaseType, any>;
  componentProps: { [key:string]: any}
  isLayout?: boolean;
}


/**
 * 表单的类型
 */
export interface IFormTypes<GBaseType extends BaseType,GComponentType > {
  // 组件类型
  componentType?: GComponentType extends string ? GComponentType : any;
  // 数据类型
  type: GBaseType;
}
export interface IFormInfo extends IFormBasic{
  // 响应函数中的错误信息
  errorMsg?: string;
  // 表单中的错误信息
  formErrorMsg?: string[];
}

/**
 * 表单基础属性
 */
export interface IFormBasic {
  wrapperStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
  useMargin?: boolean
  // 是否可见,表单统一调用
  visible?: boolean;
  // 是否展示title
  showTitle?: boolean;
  // 标题
  title?: string;
  // 详情
  desc?: string;
  // 表单提示信息
  tips?: string ;
  // 表单提示信息的位置，默认表单后面
  tipsPosition?: 'before' | 'after'
  // 展示必填标记且开启不为空校验
  require?: boolean;
  // 布局扩展字段
  layoutExtends?: ILayoutExtends
}

export type InferPropsType<T extends any> = T extends React.FC<infer P > ? P : T extends React.ComponentClass<infer K > ? K : any

export type IFormComponent = React.FC<IFormComponentProps<any>> | React.ComponentClass<IFormComponentProps<any>>
export interface IComponents {
  [key: string]: IFormComponent
}
 
export type IDataModel = Record<string, any>;

export type TFormValue<
  GSource,
  GBaseType extends BaseType,
> = {
  // 唯一id
  name?: TStringKeysResolver<GSource>;
  type: GBaseType
  defaultValue:  SuspectType<GBaseType>;
  valueEffects?: IAtomEffect<SuspectType<GBaseType>>[];
}



export interface ILayoutExtends { span?: number; [key: string]: any}

export type  TFormStatus<G extends any>  = Omit<IViewModel<any, G>, 'value'> 

export type IRdxFormItemAnyType = IRdxFormItem<any,any,any,any,any>

export type FormChildren = ReactNode | ((props: IFormComponentProps<any>) => React.ReactNode)
export type TComponentTypes<GCompoonentPropss> = keyof GCompoonentPropss
export type IFormList<GSource extends IDataModel,GCompoonentPropss> = {
  children: ((props: IFormComponentProps<GCompoonentPropss>) => React.ReactNode)
} & IRdxFormItemBase<GSource, 'array', GCompoonentPropss>
/**
 * 表单最外层暴露给用户的
 * type用户传的，componentType也是用户传的，get方法根据ISource推断
 */
export type IRdxFormItem<
GSource extends IDataModel, 
GBaseType extends BaseType, 
GComponentType extends TComponentTypes<GCompoonentPropss> ,  
GCompoonentPropss extends IComponents, 
GChildren extends FormChildren,
> = IRdxFormItemBase<GSource,GBaseType,  GComponentType extends string ? GCompoonentPropss[GComponentType] : any> & {
  children?: GChildren
}  & IFormTypes<GBaseType, 
GComponentType> 



export type IRdxFormItemBase<
GSource extends IDataModel, 
GBaseType extends BaseType, 
GComponentProps,  
> = IFormBasic &
 {
  id?: string;
  // 表单衍生状态
  get?: IRdxFormComputeGet<GSource, GBaseType, GComponentProps>;
  // 表单衍生设置器
  set?: IRdxFormComputeSet<GSource, GBaseType>;
  // 副作用处理
  valueEffects?: IAtomEffect<SuspectType<GBaseType>>[]
  // 状态副作用处理
  statusEffects?: IAtomEffect<TFormStatus<any>>[]
  // 默认值
  defaultValue?: SuspectType<GBaseType> | (() => SuspectType<GBaseType>);
  // 是否是虚拟状态，是的话不存储在表单整体的状态的中
  virtual?: boolean;
  // 唯一id
  name?: TStringKeysResolver<GSource>;
  // 表单别名，共享表单数据，但不共享表单状态
  alias?: string
  // 校验规则
  rules?: IRule<GSource, GBaseType>[];
  validateConfig?: IValidateConfig;
  // paths
  paths?: string[]
  // 是否使用下间距
  useMargin?: boolean;
}  & TFormStatus<GComponentProps >
// 根据子节点推测
// GChildren extends Function ? InferPropsType<GChildren>:

export interface IValidateConfig {
   // 是否初次校验
   validateFirst?: boolean;
   // 为空校验的提示的信息
   emptyErrorMessage?: string
   // 是否忽略自带的未为空校验，默认为false
   ignoreEmptyValidate: boolean;
   // 自动校验
   autoValidate?: boolean
   // 忽略隐藏项， 默认为true
  //  ignoreInvisible: boolean;
}
