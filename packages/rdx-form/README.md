### 数组数据能力建设

- 数组数据的操作能力，新增，删除，交换位置，更新数据，

### 树数据能力建设

- 交换数据的逻辑比较恶心，需要看看怎么做

### 表单生成器

- 组件注册
- 组件渲染
- 布局渲染

### 问题

- (已解决，通过 context)path 如何在父子组件中传递
- 异步方法如何序列化？async ?
- 数据格式的转化，内外维护的状态不一样，需要转化为外部的
- (已解决)数组形式不好实现
- **表单的 Compute 实现，需要升级，表单比较特殊，如果引用非原子元素，需要重新构造依赖关系**
- 隐藏项能不能不校验，或者隐藏项怎么区分
- 如何只展示必填项，而不使用非空校验
- 支持可以动态使用属性控制是否展示的容器组件
- get函数支持数组透传
- alias的情况，value和status需要拆开来, 
  组件和compute复用的场景，formBuilder只能初始化一次，如果通过创建多个表单实例来进行复用，那么compute fetch也需要写多次，显然是不太合理的，目前的处理方式是通过alias，但是alias也存在问题，当compute依赖shallowValueAndStatus的时候，需要通过compute => computeFamily来进行数据复用，这样使用是比较扯淡的，看看后面有没有什么比较好的方式，
  这里实际上就是两份表单，两份表单间有部分状态不太一样，这里涉及到后面如何复用表单、表单依赖的compute，compute中又依赖表单的场景
  比较理想的状态是全局使用一份表单，因为compute中依赖了表单的参数。

  有一个中间方案，就是获取数据，需要共享的compute，通过params来定义成computeFamily，这样可以通过参数来防止重复请求。
- 日志需要外部动态控制
- 表单的reset方法有问题，表单的reset怎么实现比较好呢？ atom  | compute 的逻辑呢？
### feature

- (完成)json to ts
- json to View
- 丰富校验能力，包含时间的校验等等
- 多个数据的校验能力
- (完成)ArrayCard、ArrayTable、Tree 都必须紧跟着 RdxFormItem 定义
  - ArrayTable 如果 children 的类型为 object，那么还需要跟着 RdxFormItem
  - ArrayCard、Tree 的子节点可以间隔多层，中间可以嵌套布局或者其他的 React 代码

### 例子

- 布局方式
  - single column 布局
- 表单类型
- 联动能力
- 受控状态
- 校验能力
  - 字符串校验
    - 非空
    - 时间最近几天？
    - 选中时间的范围？小于一周？
- 数组配置
- visible 和 disabled 能力

### 核心目标

1. 解决表单的性能问题
2. 表单研发效率的问题
3. 后端数据驱动的问题
4. 易用性的问题

### 表单分解

- 表单的值 【一份值】
- 表单的状态 【同一个表单可能有不同的状态】
  - 表单的规则注册
- 表单的错误信息 【一份错误信息】

### 数据逻辑

- 表单数据
- 表单状态
- 表单错误数据

```store
  state: {},
  status: {},
  errors: {},
```

- 获取表单数据，获取表单状态

### 表单组件和方法
- createForms 可以通过指定组件集合 & 数据源定义的方式生成表单的用法。
- FormItem 表单项，可以通过该表单项创建表单的 ui

### 属性种类
- 普通属性  a
- 组合属性  a|b

### 组件类型
同一个属性，可以绑定多个组件。

### 内部普通组件订阅表单的状态
  - useFormValue
  - 通过 useFormValue(id) 可以监听应用路径上的修改。
  - 通过 useFormCompute 的方式可以修改 get 和 set 的方法，进行衍生 atom 的计算
### 外部修改和监听表单内的数据
  - subscribeValue 订阅数据改变 (id | ids ) => { //callback}
  - subscribeStatus 订阅状态改变 (id | ids ) => { //callback}
  - emit 提交数据变更 (id | ids) => { //callback}
  - reset 重置数据状态为默认状态
  - getValues 获取最新的数据状态
#### 校验
  - validate 校验数据 () => Promise()
  - validateAll 校验所有数据
#### 自定义组件
  - 自定义组件的实现
  - 自定义数组型组件的实现
#### 联动
  - 内部自带联动逻辑处理，解释get、set
  - 通过 usePathContext 可以获取到当前组件所在位置的相对路径
#### 渲染
  - 布局方式可以使用通用的，也可以自定义
  - 通过 RenderContext 可以在表单项上进行一些自定义的实现
  - renderProps的方式支持



### 新版本设计升级， 将状态的粒度拆分的更加细
#### 状态拆分
- value?: T;
- visible?: boolean;
- preview?: boolean;
- disabled?: boolean;
- require?: boolean;
- componentProps?: { [key: string]: any };

#### feature
- 配置器 & 图表配置联动  --- 需要支持 监听作用域的数据
- 如何根据多种不同的时机校验
- ArrayTable & ArrayCard
  renderAddition,
  renderRemove,
  renderMoveDown,
  renderMoveUp,
  renderEmpty,
  renderExtraOperations,
- 


#### 统一调用方式
- setter


