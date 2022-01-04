import { NodeStatus, BasePoint, Point } from '../../graph';
import { CallbackOptions } from '../scheduledCore';
export type Callback = (
  currentKey: string | null,
  isRouterEnd: boolean,
  isCancel: () => boolean,
  next: () => void
) => void;
export type BaseCallback = (currentKey: string, next: () => void) => void;

export type ASYNC_TASK_Schedule = (taskInfo: TaskInfo) => Promise<void>;
export type SYNC_TASK_Schedule = (taskInfo: TaskInfo) => void;
export type MixedTask_Schedule = ASYNC_TASK_Schedule | SYNC_TASK_Schedule;
export interface IDeps {
  id: string | RegExp;
  weight?: number;
}
export interface PointWithWeight extends BasePoint {
  deps?: IDeps[];
}

export interface TaskInfo extends Point {
  // 当前任务被取消的标记
  isCancel: () => boolean;
  // 调用next，标志当前任务执行完成
  next: () => void;
}

export interface ICallbackInfo extends CallbackOptions {
  currentKey?: string | null;
  isEnd?: boolean;
  // 状态同步
  // syncStatus: (status: 'success' | 'fail') => void
  // 执行下一步任务
  // complete: () => void
}

export interface STATUS_CHANGE_INFO {
  // 当前触发节点
  key: string;
  groupKeys: string[];
  status: NodeStatus;
}
export enum TASK_PROCESS_TYPE {
  // (触发节点 下游节点) (当前运行图状态) (重复节点) (新图节点)
  UPDATE_RUNNING_GRAPH = 1,
  // 触发节点 触发状态
  STATUS_CHANGE = 2,
}

export interface IStatusInfo {
  id: string;
  status: NodeStatus;
}
export interface IEdgeCutFlow {
  // 环
  circle: string[];
  // 去掉的边
  edges: IEdge[];
}
export interface IEdge {
  source: string;
  target: string;
  reasonType: any;
}
export interface ISnapShotTrigger {
  // 当前状态下的全局图
  graph?: PointWithWeight[];
  // 原来点的运行状态
  preRunningPoints: (PointWithWeight & { status: NodeStatus })[];
  // 触发点
  triggerPoints: PointWithWeight[];
  // 被触发的点
  effectPoints: string[];
  // 冲突的点
  conflictPoints: string[];
  // 当前运行的点
  currentRunningPoints: string[];
}
