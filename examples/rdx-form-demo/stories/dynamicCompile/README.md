
### 目标
1. 解耦组件研发和组件使用的联系
  - 组件最合适的开发方式是通过npm包的方式进行研发
  解法： 通过远程加载，动态的编译的方式可以解决这个问题

2. 搭建状态的，要保证用户常规搭建、添加新组件等方式的使用体验最佳
  - 保证组件加载的速度足够的快
  - 组件编译的速度足够快
  - 新增组件之后的等待时间足够长

问题一: 为什么不让组件自己打包，因为组件自己打包需要考虑是否将组件所有依赖都加载的问题?
  这个问题不应该交由组件的开发者来考虑，组件的开发者应该主要负责功能的实现，要降低对平台受限的感知。

问题二： 如何来加载组件呢？
  通过解析页面对组件的依赖，动态的在服务端进行打包并返回。

问题三： 开发过程中新增组件怎么加载？
  - 强奸用户法
    用户必须去新增组件后，重新刷新页面才能使用新的组件。
  - 
  
思路： 
  - 常态的组件通过script 的方式动态引入，可以大大提升组件依赖的加载的速度
  -
    


### 方案一： 直接通过unpkg加载文件

**一些问题** 
- 加载Hippo因为依赖太多，需要解析很久
- 如果文件比较少使用，也会加载很久，比如rdx
- 后期如果组件中使用到类似组件，很可能导致页面加载的耗时会非常的长

### 方案二： 通过dependency-packager 加载文件