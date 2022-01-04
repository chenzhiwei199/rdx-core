enum ISettingType {
  JSFunction = 'JSFunction',
  JSExpression = 'JSExpression',
}


export interface IJsonSchema {
  // 唯一id,因为name是一个输入项，无法作为唯一的标记
  uniqueId?: string;
  //数据类型
  type?: string;
  // 组件类型 基础组件 | 布局组件 | 业务组件
  componentType?: string;
  // 组件额外属性
  componentProps?: { [key: string]: any };
  // 关联属性, 布局组件没有
  name?: string;
  // 描述
  desc?: string;
  // 标题
  title?: string;
  // 提示
  tips?: string;
  // 默认是否可见
  defaultVisible?: boolean;
  // 默认值
  defaultValue?: any;
  // 是否必填，需要校验非空
  require?: boolean;
  // 获取 值 & 状态
  get?: {
    type: ISettingType.JSFunction;
    value: string;
  };
  // 设置值
  set?: {
    type: ISettingType;
    value: string;
  };
  // 校验规则
  rules?: {
    type: ISettingType;
    value: string;
  }[];
  properties?: {
    [key: string]: IJsonSchema;
  };
}