import { atom, compute, useRdxValue } from '@alife/rdx'
import TreeSolver from './TreeSolver'
import { IJsonSchema } from './types'
import { v1 as uuid } from 'uuid'
export const layoutSchema = atom({
  id: 'layoutSchema',
  defaultValue: new TreeSolver([]),
})
export const widgetsSchema = atom({
  id: 'widgetsSchema',
  defaultValue: {} as IWidgetState,
})

export const activeAtom = atom({
  id: 'active',
  defaultValue: null as string,
})
export const useActiveStrict = uniqueId => {
  return useRdxValue(activeAtom, {
    shouldUpdate: state => {
      return state === uniqueId
    },
  })
}

export interface ILayout {
  uniqueId: string
  parentUniqueId: string | null
  children?: ILayout[]
}
export type ISingleWidgetState = Omit<IJsonSchema, 'properties'>
export interface IWidgetState {
  [key: string]: ISingleWidgetState
}

/**
 * 1. 需要
 * @param schema
 */
export function parseSchema(schema: IJsonSchema): { layout: ILayout[]; widgets: IWidgetState } {
  const widgets: IWidgetState = {}
  function travser(config: { schemas: IJsonSchema[]; parentId: string | null; paths?: string[] }) {
    const { schemas, parentId, paths } = config
    return schemas.map(schema => {
      const { properties, ...rest } = schema
      const uniqueId = uuid()
      widgets[uniqueId] = rest
      return {
        uniqueId,
        parentId,
        children:
          schema.properties &&
          travser({
            schemas: Object.keys(schema.properties).map(item => ({
              name: item,
              ...schema.properties[item],
            })),
            paths: [...paths, schema.name],
            parentId: uniqueId,
          }),
      }
    })
  }
  return {
    layout: travser({
      schemas: [schema],
      paths: [],
      parentId: null,
    }),
    widgets: widgets,
  }
}

export function toSchema(config: { layout: ILayout[]; widgets: IWidgetState }) {
  const { layout = [], widgets } = config
  function travser(layout: ILayout[]) {
    return layout
      .map(item => {
        const { uniqueId, children } = item
        const currentWidget = widgets[uniqueId]
        return {
          ...currentWidget,
          properties: children && travser(children),
        }
      })
      .reduce((root, item) => {
        const { name, ...rest } = item
        root[name] = rest
        return root
      }, {})
  }
  return travser(layout)
}

export const emptyJson = {
  type: 'layout',
  componentType: 'page',
  properties: {},
}
export const testJson = {
  type: 'layout',
  componentType: 'page',
  properties: {
    'b1a014a5-323f-4f52-9ca8-62d1290ece99': {
      type: 'layout',
      uniqueId: '4cfba57f-48e0-4381-9e92-8f32b1837583',
      componentType: 'row',
      properties: {
        '3e6eaec0-ce2f-4b51-ac54-4801a2cc06d0': {
          type: 'layout',
          componentType: 'col',
          componentProps: {
            span: 12,
          },
          properties: {
            '61482e61-3e9b-468d-af06-f7afcea4479e': {
              type: 'string',
              uniqueId: '8b8756f6-7dac-4801-9fa0-61bd223e8c45',
              title: '未命名',
            },
            'ce149f6c-d5d7-4e07-8f00-a4175102ae50': {
              type: 'string',
              uniqueId: '7b6033a6-856c-4805-8fd4-17e1919cc56c',
              title: '未命名',
            },
          },
        },
        '1303da61-8d02-4494-b27e-a2772787a7bf': {
          type: 'layout',
          componentType: 'col',
          componentProps: {
            span: 12,
          },
          properties: {},
        },
      },
    },
  },
}
export const mockJsonRowAndCol: IJsonSchema = {
  uniqueId: '967468dc-568e-453d-8921-6e320da66e02',
  type: 'layout',
  componentType: 'page',
  properties: {
    NO_NAME_FIELD_0: {
      name: 'NO_NAME_FIELD_0',
      type: 'layout',
      componentType: 'floorLayout',
      componentProps: {
        title: '楼层1',
      },
      properties: {
        NO_NAME_FIELD_1: {
          type: 'layout',
          name: 'NO_NAME_FIELD_1',
          componentType: 'row',
          title: '嵌套布局',
          properties: {
            NO_NAME_FIELD_2: {
              type: 'layout',
              name: 'NO_NAME_FIELD_2',
              componentType: 'col',
              componentProps: {
                span: 12,
              },
              properties: {
                a: {
                  title: 'aaaa',
                  type: 'string',
                },
              },
            },
            NO_NAME_FIELD_3: {
              type: 'layout',
              name: 'NO_NAME_FIELD_3',
              componentType: 'col',
              componentProps: {
                span: 12,
              },
              properties: {
                b: {
                  title: 'b',
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
    NO_NAME_FIELD_4: {
      name: 'NO_NAME_FIELD_4',
      type: 'layout',
      componentType: 'floorLayout',
      componentProps: {
        title: '楼层1',
      },
      properties: {
        NO_NAME_FIELD_5: {
          type: 'layout',
          name: 'NO_NAME_FIELD_5',
          componentType: 'row',
          title: '嵌套布局',
          properties: {
            NO_NAME_FIELD_2: {
              type: 'layout',
              name: 'NO_NAME_FIELD_6',
              componentType: 'col',
              componentProps: {
                span: 12,
              },
              properties: {
                c: {
                  title: 'c',
                  type: 'string',
                },
              },
            },
            NO_NAME_FIELD_7: {
              type: 'layout',
              name: 'NO_NAME_FIELD_7',
              componentType: 'col',
              componentProps: {
                span: 12,
              },
              properties: {
                d: {
                  title: 'd',
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  },
}

export const mockJson: IJsonSchema = {
  uniqueId: '967468dc-568e-453d-8921-6e320da66e02',
  type: 'layout',
  componentType: 'page',
  properties: {
    NO_NAME_FIELD_1: {
      uniqueId: '3a47532c-caf7-4dc8-bcfe-f8259164f19c',
      name: 'NO_NAME_FIELD_1',
      componentType: 'floorLayout',
      componentProps: {
        title: '楼层1',
      },
      properties: {
        NO_NAME_FIELD_1: {
          uniqueId: 'a3710263-8d54-4b5d-87a9-aae38ade0350',
          name: 'NO_NAME_FIELD_1',
          componentType: 'nestLayout',
          title: '嵌套布局',
          componentProps: {
            layout: [
              {
                type: 'container',
                children: [
                  {
                    type: 'containerPanel',
                    children: [
                      {
                        type: 'nestLayer',
                        children: [
                          {
                            type: 'row',
                            children: [
                              {
                                type: 'col',
                                w: 12,
                                children: [
                                  {
                                    type: 'nestAtom',
                                    h: 1,
                                    id: '665efb20-e0fe-4ba0-9d70-ddcdc8bb9dea',
                                  },
                                ],
                              },
                              {
                                type: 'col',
                                w: 12,
                                children: [
                                  {
                                    type: 'nestAtom',
                                    h: 1,
                                    id: 'e83c63ee-e495-4a75-91cd-d023c8c8a763',
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          properties: {
            c: {
              uniqueId: '665efb20-e0fe-4ba0-9d70-ddcdc8bb9dea',
              title: 'a',
              type: 'string',
            },
            d: {
              uniqueId: 'e83c63ee-e495-4a75-91cd-d023c8c8a763',
              title: 'b',
              type: 'string',
              componentType: 'select',
              componentProps: {
                dataSource: [
                  {
                    label: '1',
                    value: '1',
                  },
                ],
              },
            },
          },
        },
      },
    },
    NO_NAME_FIELD_0: {
      uniqueId: '86c97988-8058-4a6a-b566-30aff5e93694',
      name: 'NO_NAME_FIELD_0',
      componentType: 'floorLayout',
      componentProps: {
        title: '楼层2',
      },
      properties: {
        NO_NAME_FIELD_1: {
          uniqueId: 'bef1050c-743f-4c92-bc12-8e52376ea09d',
          name: 'NO_NAME_FIELD_1',
          componentType: 'nestLayout',
          title: '嵌套布局',
          componentProps: {
            layout: [
              {
                type: 'container',
                children: [
                  {
                    type: 'containerPanel',
                    children: [
                      {
                        type: 'nestLayer',
                        children: [
                          {
                            type: 'row',
                            children: [
                              {
                                type: 'col',
                                w: 12,
                                children: [
                                  {
                                    type: 'nestAtom',
                                    h: 1,
                                    id: '1097cd02-d6b8-412e-b3d6-8b9eac7efe8c',
                                  },
                                ],
                              },
                              {
                                type: 'col',
                                w: 12,
                                children: [
                                  {
                                    type: 'nestAtom',
                                    h: 1,
                                    id: 'b3cd57f6-9ecd-4ee3-9ba0-2e1063097293',
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          properties: {
            a: {
              uniqueId: '1097cd02-d6b8-412e-b3d6-8b9eac7efe8c',
              name: 'a',
              title: 'a',
              type: 'string',
            },
            b: {
              uniqueId: 'b3cd57f6-9ecd-4ee3-9ba0-2e1063097293',
              name: 'b',
              title: 'b',
              type: 'string',
              componentType: 'select',
              componentProps: {
                dataSource: [
                  {
                    label: '1',
                    value: '1',
                  },
                ],
              },
            },
          },
        },
      },
    },
  },
}
