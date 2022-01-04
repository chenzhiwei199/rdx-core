import {
  Graph,
  BasePoint,
  normalizeSingle2Arr,
  createConfigMap,
  GLOBAL_DEPENDENCE_SCOPE,
  NotifyPoint,
  arr2Map,
  union,
  isInConfig,
  Point
} from "../graph";
import { graphAdapter, point2WithWeightAdapter } from "./utils";
import { PointWithWeight, ISnapShotTrigger } from "./typings/global";
import ScheduledCore from "./scheduledCore";
import { Log } from "../utils/log";
import { AdvancedGraph } from "../newGraph";

export default abstract class BaseQueue<T extends PointWithWeight> {
  config: T[] = [] as T[];
  running: boolean = false;
  scheduledCore?: ScheduledCore;
  runningId: string = "none";
  graph: Graph;
  advancedGraph: AdvancedGraph
  canReuse?: (id: string) => boolean;
  constructor(config: T[], advancedGraph: AdvancedGraph, options: { logger: Log; canReuse?: (id: string) => boolean }) {
    this.scheduledCore = new ScheduledCore(advancedGraph, options)
    this.advancedGraph = advancedGraph;
    // this.updateTasks(config);
  }

  // updateTasks(config: T[]) {
  //   if (!this.graph) {
  //     this.graph = new Graph(graphAdapter(config));
  //   } else {
  //     this.graph.updateConfig(graphAdapter(config));
  //   }
  //   this.config = config
  //   this.configMap = createConfigMap(config);
  //   // 更新全局图
  // }


  

  getCircleExceptionsMsg(points: Point[]) {
    return 'detect circle deps' + JSON.stringify(this.getCircles(points))
  }

  circleExceptionCheck(points: Point[]) {
    const graph = new Graph(points);
    graph.circleExceptionCheck()
  }
  getCircles(points: Point[]) {
    const graph = new Graph(points);
    const circles = graph.findCycles();
    return circles
  }

  isRunning() {
    return this.scheduledCore.isScheduleRunning();
  }

  getIntersectPoints(downStreamPoints: string[]): string[] {
    const runningPoints = this.getNotFinishPoints();
    const intersectPoints = downStreamPoints.filter(p => {
      return runningPoints.some(rp => rp === p);
    });
    return intersectPoints;
  }

  getRunningGraph() {
    return this.scheduledCore.inDegree;
  }
  
  getNotFinishPoints() {
    return this.scheduledCore.getNotFinishPoints()
  }
  /**
   * 获取即将要执行任务
   * @param executeTasks
   * @param downstreamOnly
   */
  getPendingPoints(executeTasks: NotifyPoint[]) {
    
    if (!this.scheduledCore.isScheduleRunning()) {
      return this.graph.getAllPointsByPoints(executeTasks);
    } else {
      return this.getCurrentPoints(executeTasks);
    }
  }

  getCurrentPoints(triggerPoints: BasePoint[]) {
    // 1 运行的图
    const allTriggerPointsByRuntimeGraph = this.getNotFinishPoints()
    // 2 触发的新图
    const allTriggerPoints = this.graph.getAllPointsByPoints(triggerPoints);
    // 有运行状态的的节点
    // 3 图点的合并
    const afterUnionGraph = union(
      [...allTriggerPointsByRuntimeGraph, ...allTriggerPoints],
      a => a
    );
    // 4 返回图
    return afterUnionGraph as string[];
  }


  cleanInVaildDeps(config: PointWithWeight[]) {
    const configMap = createConfigMap(config);
    return config.map((item) => ({
      ...item,
      deps: (item.deps || []).filter((dep) =>
        isInConfig(configMap, dep.id)
      ),
    }));
  }
  // cleanInVaildDeps(config: PointWithWeight[]) {
  //   const configMap = arr2Map(config, a => a && a.key);
  //   return config.map(item => ({
  //     ...item,
  //     deps: (item.deps || []).filter(dep => configMap.get(dep.id))
  //   }));
  // }
  getExecutingStates(executeTask: NotifyPoint | NotifyPoint[]) {
    const executeTasks = normalizeSingle2Arr(executeTask);
    // const notFinishSet = new Set(this.getNotFinishPoints())
    let {
      pendingPoints,
    } = this.getWillExecuteInfo(executeTasks);
    return {
      // graph: this.config,
      // preRunningPoints: this.getTaskByPoints(
      //   this.getNotFinishPoints()
      // ).map(item => ({ ...item, status: this.scheduledCore.getStatus(item.key) })),
      // triggerPoints: point2WithWeightAdapter(executeTasks),
      // effectPoints: downStreamPoints,
      // conflictPoints: intersectPoints,
      // currentRunningPoints: point2WithWeightAdapter(newPendingPoints)
    } as ISnapShotTrigger;
  }
  getWillExecuteInfo(executeTasks: NotifyPoint | NotifyPoint[]) {
    // 数据格式类型统一处理
    // @ts-ignore
    const normalizeExecuteTasks = normalizeSingle2Arr<NotifyPoint>(
      executeTasks
    );

    // 获取即将要执行的任务
    let pendingPoints = this.getPendingPoints(normalizeExecuteTasks);
    
    //  触发的下游节点
    let downStreamPoints = this.graph.getAllPointsByPoints(
      normalizeExecuteTasks
    );
    // 构建运行时图
    const intersectPoints = this.getIntersectPoints(downStreamPoints);

    return { downStreamPoints, intersectPoints, pendingPoints };
  }
  beforeDeliver(executeTasks: NotifyPoint | NotifyPoint[]) {
    const {
      downStreamPoints,
      intersectPoints,
      pendingPoints
    } = this.getWillExecuteInfo(executeTasks);
    const pendingConfig = this.config.filter(rowConfig =>
      pendingPoints.includes(rowConfig.key)
    );
    // 设置当前任务流的节点状态
    // this.graph.updateRunningGraph(graphAdapter(pendingConfig));

    return { downStreamPoints, intersectPoints, pendingPoints };
  }
}
