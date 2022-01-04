import { useRdxContext, getAtomFamilyPrefix, stringify } from '@alife/rdx'
import { useFormId } from '../../utils/base'
import { getChlidFieldInfo, getEmptyValue } from '../../utils/functions'

export interface IArrayMutators {
  // 新增一个
  push: (newValue: any) => void
  // 最前面新增一个
  unshift: (newValue: any) => void
  // 移除最前面一个
  shift: () => void
  // 移除最后一个
  pop: () => void
  // 插入一个
  insert: (index: number, newValue: any) => void
  // 下移
  moveDown: (index: number) => void
  // 上移
  moveUp: (index: number) => void
  // 移除一个
  remove: (index: number) => void
  // 移除全部
  clear: () => void
  // 交换位置
  move: (preIndex: number, nextIndex: number) => void
  // 获取空数据
  getEmptyValue: () => any
}
export function createArrayMutators(config: {
  formId: string
  value: any
  onChange: any
  children?: any
  getValidKeysFromCollect: (key: string) => string[]
  getValidAtoms: (key: string) => string[]
}): IArrayMutators {
  const { formId, value, onChange, children, getValidAtoms, getValidKeysFromCollect } = config
  // 1. 删除数据
  // 2. 通知下游依赖节点更新
  const id = useFormId()
  const context = useRdxContext()
  const fieldDefine = getChlidFieldInfo(children)
  const getValue = () => value

  /**
   *  数组向后移动
   * @param formIndex
   */
  function getValidKeys(index) {
    const keys = getValidKeysFromCollect(`${id}.${index}`)
    console.log('keys: ', keys)
    return keys
  }
  /**
   *  数组向后移动
   * @param formIndex
   */
  function batchMoveForward(formIndex: number) {
    for (let tempIndex = formIndex; tempIndex < getValue().length - 1; tempIndex++) {
      move(tempIndex, tempIndex + 1)
    }
  }
  /**
   *  数组向迁移懂
   * @param formIndex
   */
  function batchMoveBackward(formIndex: number) {
    for (let tempIndex = getValue().length; tempIndex > formIndex; tempIndex--) {
      move(tempIndex - 1, tempIndex)
    }
  }
  function removeTaskStateByKeys(index) {
    // 从小到大清理，所以后倒序
    getValidKeys(index)
      .reverse()
      .forEach(key => {
        context.removeTask(key)
      })
  }
  /**
   * 获取所有状态的节点
   * @param index
   */
  function getTaskStateByIndex(index) {
    return getValidAtoms(`${id}.${index}`)
      .reverse()
      .reduce(
        (root, currentKey) => {
          root.tasks[currentKey] = context.getTaskById(currentKey)
          root.states[currentKey] = context.getTaskStateById(currentKey)
          root.status[currentKey] = context.getTaskStatusById(currentKey)
          return root
        },
        {
          status: {} as Record<string, any>,
          tasks: {} as Record<string, any>,
          states: {} as Record<string, any>,
        },
      )
  }

  function replaceIdByIndex(key, newIndex) {
    const [prefix, currentId] = key.split('/')
    const ids = JSON.parse(currentId).split('.')
    const arrayIds = id.split('.')
    const newId = [...arrayIds, newIndex, ...ids.slice(arrayIds.length + 1)].join('.')
    return `${prefix}/${stringify(newId, {})}`
  }
  function applyTaskAndStatus(
    state: {
      states: Record<string, any>
      status: Record<string, any>
      tasks: Record<string, any>
    },
    newIndex: string,
  ) {
    Object.keys(state.tasks).forEach(key => {
      const newKey = replaceIdByIndex(key, newIndex)
      context.setTaskStateById(newKey, state.states[key])
      context.setTaskStatusById(newKey, state.status[key])
    })
  }
  function notifyDownStreams(startIndex, endIndex) {
    let keys = [] as string[]
    for (let index = startIndex; index < endIndex; index++) {
      keys = keys.concat(getValidAtoms(`${id}.${index}`))
    }
    context.batchDepsChangeAtOnce(
      keys.map(item => ({ key: item, downStreamOnly: true })),
      'form-array-notify',
    )
  }
  const move = (preIndex, nextIndex) => {
    // cache状态
    const preState = getTaskStateByIndex(preIndex)
    const nextState = getTaskStateByIndex(nextIndex)
    // 移除旧状态
    removeTaskStateByKeys(preIndex)
    removeTaskStateByKeys(nextIndex)
    // 切换为新状态
    applyTaskAndStatus(preState, nextIndex)
    applyTaskAndStatus(nextState, preIndex)
  }
  const remove = index => {
    // 1. 更新数据
    // 2. 通知下游
    batchMoveForward(index)
    removeTaskStateByKeys(getValue().length - 1)
    onChange(getValue().slice(0, getValue().length - 1))
  }
  const clear = () => {
    for (let index = 0; index < getValue().length; index++) {
      removeTaskStateByKeys(index)
    }
    onChange([])
  }
  const moveUp = index => {
    if (index - 1 < 0) {
      return
    }
    move(index - 1, index)
    // notifyDownStreams(index-1, index + 1)
    onChange([...getValue()])
  }
  const moveDown = index => {
    if (index + 1 > getValue().length) {
      return
    }
    move(index, index + 1)
    // notifyDownStreams(index, index + 1 + 1)
    onChange([...getValue()])
  }
  // 后面插入一个
  const push = (newValue: any) => {
    // getEmptyValue(fieldDefine)
    onChange([...getValue(), newValue])
  }
  // 前面插入一个
  const unshift = (newValue: any) => {
    batchMoveBackward(0)
    // 交换位置后第一个是无效的
    onChange([newValue, ...getValue().slice(0)])
  }

  // 前面移除一个
  const shift = () => {
    batchMoveForward(0)
    onChange(getValue().slice(0, getValue().length - 1))
  }
  // 后面移除一个
  const pop = () => {
    removeTaskStateByKeys(getValue().length - 1)
    onChange(getValue().slice(0, getValue().length - 1))
  }

  const insert = (index: number, newValue: any) => {
    batchMoveBackward(index)
    onChange([...getValue().slice(0, index), newValue, ...getValue().slice(index)])
  }

  return {
    getEmptyValue: () => {
      return getEmptyValue((children as React.ReactElement).props)
    },
    insert,
    unshift,
    shift,
    push,
    remove,
    pop,
    moveDown,
    moveUp,
    clear: clear,
    move: (preIndex, nextIndex) => {
      move(preIndex, nextIndex)
      notifyDownStreams(preIndex, nextIndex + 1)
    },
  }
}
