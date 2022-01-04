### 配置一个页面，需要进行的动作
1. mdx页面
2. 代码
3. mdx + 代码进行组织


### rdx 文档
- isLoading
- waitForAll
- waitForSet
- waitForTrigger(干掉)
- useRdxStatus（先干掉）
### rdxForm 文档
- RdxFormRoot
    - createValueAtom
    - createStatusAtom
    - createComputeAtom
- useRdxFormState
- useRdxFormStateLoader
- useRdxFormValue
- useRdxFormValueLoader
- useRdxFormSetter
- useRdxFormReset
- useRdxFormRefresh
- FormStore
    - getState
    - getComputeState
    - subscribeAll
    - subscribe
    - unsubscribe （要改造一下，多传个path）
    - useLinkFormComputeState
    - useLinkFormValueState
    - useLinkFormStatusState
    - reset
    - refresh
    - setFormValue
    - setFormStatus
    - setFormCompute
    - validate

### 页面数据来源
    - 表单状态
    - 页面状态 atom
    - 衍生状态
        - 接口
        - localStorage
        - params
        - 通信