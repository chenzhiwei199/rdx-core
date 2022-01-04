import { atom, RdxState, useRdxSetter, useRdxStateBindingCallback } from '@alife/rdx'
import { ISingleWidgetState, layoutSchema, parseSchema } from '../model'
import { produce } from 'immer'
import { v1 as uuid } from 'uuid'
import { useNodeContext } from '../context/NodeContext'

export enum InsertType {
  Insert = 'insert',
  InsertAfter = 'insertAfter',
  InsertBefore = 'insertBefore',
}
export function createInsertFunc() {
  const { path, uniqueId } = useNodeContext()
  const set = useRdxSetter(layoutSchema)
  // 找到兄弟节点
  const load = useRdxStateBindingCallback()
  return (data: ISingleWidgetState, inserType: InsertType = InsertType.Insert) => {
    // @ts-ignore
    set((state, operates) => {
      const newState = produce(state, state => {
        // 获取到其他引用的值, 并修改其他的值
        const id = uuid()

        const { layout, widgets } = parseSchema({
          properties: {
            [id]: data,
          },
        })
        //
        const root = layout[0]
        // 删除无效状态
        delete widgets[root.uniqueId]
        Object.keys(widgets).forEach(key => {
          load(
            atom<ISingleWidgetState>(
              {
                id: key,
                defaultValue: widgets[key],
              },
              // effect(state as any, path, id, uniqueId, operates)
            ),
          )
        })

        state[inserType](path, root.children[0])
      })
      return newState
    })
  }
}
