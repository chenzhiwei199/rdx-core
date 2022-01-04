import { RdxState, RdxValueReadOnly, RdxValueReference } from '../../types/rdxBaseTypes'
import { getId, normalizeValue } from '../../utils'
import { RdxStore } from '../../core/RdxStore'
import { IRdxComputeSet, IRdxComputeReadOnlyState, IRdxComputeWriteState } from './types'
import { createReactionInfo } from './utils'
import { DataPersistType, TaskEventTriggerType } from '../../types/dataPersistType'
import { Status } from '../../types/base'
import { ICollectDeps } from '../../types'

function createNext(context: RdxStore, set?: IRdxComputeSet<any>) {
  return (id, value, depsCellects: ICollectDeps) => {
    let endFlag = { flag: false }
    if (set) {
      try {
        set(
          {
            id: id,
            // value: mutators.get(id),
            has: (atom) => {
              return context.hasTask(atom.getId())
            },
            set: (atom, value) => {
              // ! 这里注意，如果是异步的compute，设置了数据，则当前compute的get是要重新执行的
              if (!context.hasTask(atom.getId())) {
                atom.load(context)
              }
              const newValue = normalizeValue(context.getTaskStateById(atom.getId()), value)
              if(endFlag.flag) {
                let asyncDepsCollectArray = [] as string[]
                let asyncDepsCollect = (key: string) =>  asyncDepsCollectArray.push(key)
                context.innerNext(atom.getId(), newValue, { collect: asyncDepsCollect})
                asyncDepsCollect(atom.getId())
                context.transaction(() => {
                  context.batchDepsChange(asyncDepsCollectArray.map(key => ({
                    key: key,
                    downStreamOnly: true,
                  })), TaskEventTriggerType.AsyncSet)
                })
              } else {
                context.innerNext(atom.getId(), newValue,depsCellects)
                // mutators.set(atom, newValue);
                depsCellects.collect(atom.getId())
              }
            },
            get: atom => {
              if (!context.getTaskStatusById(atom.getId()) && !(atom instanceof RdxValueReference)) {
                 atom.load(context)
              }
              if (!context.getTaskStatusById(atom.getId()) || context.getTaskStatusById(atom.getId()).value !== Status.IDeal) {
                throw new Error(atom.getId() + '数据还未准备好')
              }
              return context.getTaskStateById(atom.getId())
            },
            reset: atom => {
              console.log('context.hasTask(atom.getId()): ', context.hasTask(atom.getId()), atom.getId());
              if (!context.hasTask(atom.getId())) {
                atom.load(context)
              }
              context.resetById(atom.getId())
              depsCellects.collect(atom.getId())
            },
          },
          value,
          context,
        )
      } catch (error) {
        throw new Error(id + '节点数据设置错误' + error)
      }
    } else {
      throw new Error('compute节点：' + id + '没有提供set方法，无法设置数据。')
    }
    // 状态置为true，已经结束了
    endFlag.flag = true
  }
}

export function compute<GModel>(config: IRdxComputeReadOnlyState<GModel>): RdxValueReadOnly<GModel>

export function compute<GModel>(config: IRdxComputeWriteState<GModel>): RdxState<GModel>

export function compute<GModel>(node: any) {
  const { id, virtual = true, get } = node
  const load = (context: RdxStore) => {
    context.emit(DataPersistType.TaskLoad, `${DataPersistType.TaskLoad}-${node.id}`)
    // 捕获依赖和数据
    const reactionInfo = createReactionInfo(context, {
      id,
      get: get,
    })
    return {
      next: createNext(context, (node as any).set),
      virtual,
      ...reactionInfo,
    }
  }
  if (node.set) {
    const atom: RdxState<GModel> = new RdxState({
      ...node,
      virtual,
      load,
    })
    return atom
  } else {
    const atom = (new RdxState({
      ...node,
      virtual,
      load,
    }) as unknown) as RdxValueReadOnly<GModel>
    return atom
  }
}
