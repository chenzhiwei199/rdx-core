import { NotifyPoint, normalizeSingle2Arr } from '../graph'
import Base from './base'
import { END } from './utils'
import { ICallbackInfo, ISnapShotTrigger, IStatusInfo, PointWithWeight } from './typings/global'
import ScheduledCore, { CallbackOptions } from './scheduledCore'
import EE from 'eventemitter3'
import { Log } from '../utils/log'
import { AdvancedGraph } from '../newGraph/graph'
import { isAcyclic } from '../newGraph/alg'
export interface IError {
  currentKey: string
  notFinishPoint: string[]
  errorMsg: string
}
export type ISuccess = ICallbackInfo
export type IBeforeCall = ISnapShotTrigger
export type IEventValues = ISuccess | IError | IBeforeCall | IStatusChange
export type IStatusChange = IStatusInfo
export enum IEventType {
  onCall = 'onCall',
  onBeforeCall = 'onBeforeCall',
  onError = 'onError',
  onSuccess = 'onSuccess',
  onStart = 'onStart',
}
export default class DeliverByCallback<T> extends Base<PointWithWeight> {
  ee?: EE<IEventType, IEventValues>
  constructor(
    config: PointWithWeight[],
    graph: AdvancedGraph,
    options: { logger: Log; canReuse?: (id: string) => boolean },
  ) {
    super(config, graph, options)
    this.ee = new EE<IEventType, IEventValues>()
  }

  getEE() {
    return this.ee
  }

  /**
   *
   * @param newWho 谁的下游节点
   */
  notifyDownstream = (who: NotifyPoint | NotifyPoint[]) => {
    const newWho = normalizeSingle2Arr<NotifyPoint>(who)
    if (newWho.every(w => isString(w.key))) {
      this.deliver(newWho)
    } else if (!who || (Array.isArray(who) && who.length === 0)) {
      this.deliver(newWho)
    } else {
      console.warn('触发节点的格式必须为{ key: string, scope?: string }')
    }
  }

  deliver(executeTasks: NotifyPoint[]) {
    // downstreamOnly: boolean = false
    // 异常情况兼容
    // if (executeTasks.length === 0) {
    //   return;
    // }
    // 获的未运行完成的点
    // let { pendingPoints } = this.beforeDeliver(executeTasks)

    // const newPendingPoints = this.getTaskByPoints(pendingPoints)
    // this.circleExceptionCheck(newPendingPoints)

    // 更新ScheduleCore
    this.scheduledCore = this.scheduledCore.fork(executeTasks)

    // !传递新触发节点, 需要看一下onStart外部如何使用的？
    this.ee.emit(IEventType.onStart, 
      // this.getExecutingStates(executeTasks)
      { currentRunningPoints: this.scheduledCore.dataSource}
      )
    // 启动任务
    this.scheduledCore.start(this.callbackFunction.bind(this))
  }

  getNextPoint(key) {
    return this.scheduledCore.getNextPoint(key)
  }
  getRealtionNotFinishPoints(key) {
    return this.scheduledCore.getWillFinishPoint(key)
  }

  private callbackFunction(currentKey: string, options: CallbackOptions) {
    if (currentKey === END) {
      // 结束状态
      this.ee.emit(IEventType.onCall, { isEnd: true })
    } else {
      // onCall前的回调
      this.ee.emit(IEventType.onBeforeCall, { currentKey: currentKey })
      // 记录图的运行时状态
      if (currentKey !== null) {
        this.ee.emit(IEventType.onCall, {
          ...options,
          currentKey: currentKey,
          // syncStatus: (status) => {
          //   if(status === 'fail') {
          //     this.getRealtionNotFinishPoints(currentKey).forEach((p) => {
          //       this.graph.setFinish(p);
          //     });
          //   } else if(status === 'success') {
          //     this.graph.setFinish(currentKey);
          //   }
          // },
          // onError: onErrorProcess,
          // onSuccess: onSuccessProcess,
          isEnd: false,
        } as ICallbackInfo)
      }
    }
  }
}
export function isString(myVar: any) {
  return typeof myVar === 'string' || myVar instanceof String
}
