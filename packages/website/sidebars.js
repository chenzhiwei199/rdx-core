module.exports = {
  someSidebar: {
    Rdx介绍: [
      'introduce/coreConcepts',
      'introduce/motivation',
      'introduce/installation',
    ],
    基础教程: ['tutorial/Atom', 'tutorial/Compute'],
    API: [
      'api/RdxContext',
      'api/atom',
      'api/compute',
      'api/useRdxState',
      'api/useRdxStateLoader',
      'api/useRdxValue',
      'api/useRdxValueLoader',
      'api/useRdxSetter',
      'api/useRdxReset',
      'api/useRdxRefresh',
      'api/useRdxStatus',
      'api/waitForAll',
      'api/waitForSetter',
    ],
    Utils: ['utils/waitForAll', 'utils/waitForTrigger'],
    Examples: [
      'examples/searchList',
      'examples/searchListWithSearchButton',
      'examples/urlParse',
    ],
    RdxForm: [
      {
        RdxForm介绍: [
          'rdx-form/introduce/quick-start',
          'rdx-form/introduce/coreConcepts',
          'rdx-form/introduce/motivation',
          'rdx-form/introduce/installation',
        ],
        教程: [
          {
            'hippo-forms-library': [
              'rdx-form/tutorials/hippo-forms-library/hippo-forms-library',
              'rdx-form/tutorials/hippo-forms-library/ArrayTable',
              'rdx-form/tutorials/hippo-forms-library/StepForm'
            ],
          },
          'rdx-form/tutorials/shareState',
          'rdx-form/tutorials/shareComponent',
          'rdx-form/tutorials/renderProps',
          'rdx-form/tutorials/asyncDataSource',
          'rdx-form/tutorials/filterGroup',
          'rdx-form/tutorials/searchList',
          'rdx-form/tutorials/customWidget',
          'rdx-form/tutorials/customList',
          'rdx-form/tutorials/customFormRender',
        ],
        API: [
          
          {
            formBuilder: [
              'rdx-form/api/formBuilder/formBuilder',
              'rdx-form/api/formBuilder/RdxFormRoot',
              'rdx-form/api/formBuilder/FormItem',
              'rdx-form/api/formBuilder/getReferencedFormValueAtom',
              'rdx-form/api/formBuilder/getReferencedFormStatusAtom',
              'rdx-form/api/formBuilder/getReferencedFormCompute',
              'rdx-form/api/formBuilder/useValidator',
              'rdx-form/api/formBuilder/createFormStore',
            ],
          },
          'rdx-form/api/FormStore',
          'rdx-form/api/FormLayout',
          'rdx-form/api/Atom',
          'rdx-form/api/FormItemRenderComponentsContext',
        ],
        // Examples: [
        //   'rdx-form/baseComponent',
        //   'rdx-form/layout',
        //   'rdx-form/widgets',
        // ],
      },
    ],
    Features: [
      'feature/todo',
    ],
    ChangeLog: ['changelog']
  },
};
//
