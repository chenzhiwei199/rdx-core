import {
  createDeliversMap,
  createConfigMap,
  normalizeSingle2Arr,
  union,
  arr2Map,
  isInConfig,
} from './utils';
import { Point, NotifyPoint, IGraphDeps } from './types';
export const GLOBAL_DEPENDENCE_SCOPE = '*';

export interface Edge {
  // v => w
  v: string;
  w: string;
}

function cleanInVaildDeps(config: Point[]) {
  const configMap = createConfigMap(config);
  return config.map((item) => ({
    ...item,
    deps: (item.deps || []).filter((dep: IGraphDeps) =>
      isInConfig(configMap, dep.id)
    ),
  }));
}
export default class BaseGraph {
  config: Point[];
  configMap: Map<string, Point>;
  deliverMap: Map<string, string[]>;
  constructor(config: Point[]) {
    this.updateConfig(config);
  }

  circleExceptionCheck() {
    const circles = this.findCycles();

    if (circles.length > 0) {
      const circleInfo = circles.map((circle) => {
        return cleanInVaildDeps(
          this.config.filter((item) => circle.includes(item.key))
        ).map((circleDetail, index) => {
          const { key, deps} = circleDetail
          return `${index+1} ${key}---->\r\ndeps: ${deps.map(item => item.id).join('、')}\r\n`
        }).join('\r\n');
      })
      throw new Error(
        `--------------循环依赖检测依赖-----------\r\n${circleInfo.join('')}`
      );
    }
  }
  /**
   * 找到图的起始点
   */
  sinks() {
    return this.config
      .filter((item) => (item.deps || []).length === 0)
      .map((item) => item.key);
  }
  /**
   * 找到下游的点
   * @param v
   */
  successors(v: string) {
    return this.deliverMap.get(v) || [];
  }
  nodes() {
    return this.config.map((item) => item.key);
  }
  hasEdge(v: string, w: string) {
    return (this.deliverMap.get(v) || []).includes(w);
  }
  findCycles() {
    return this.tarjan().filter((cmpt) => {
      return (
        cmpt.length > 1 || (cmpt.length === 1 && this.hasEdge(cmpt[0], cmpt[0]))
      );
    });
  }

  /**
   *
   * @param k 起始点
   * @param visited 访问过的点
   * @param stack
   */
  dfs(k: string, visited: Set<string>) {
    visited.add(k);
    this.successors(k).forEach((successorKey) => {
      // 已经遍历的点就不需要找了
      if (!visited.has(successorKey)) {
        this.dfs(successorKey, visited);
      }
    });
  }
  getRelationConfig(keys: string[]) {
    const config = this.config.filter((item) => keys.includes(item.key));
    return cleanInVaildDeps(config);
  }
  isAcyclic() {
    let visited = new Set<string>();
    const startPoints = this.sinks();
    // 找不到起始点的情况
    if (startPoints.length === 0 && this.config.length !== 0) {
      return true;
    } else {
      startPoints.forEach((k) => {
        this.dfs(k, visited);
      });
      // 访问的点小于config的数量
      return visited.size < this.config.length;
    }
  }
  tarjan() {
    var index = 0;
    var stack = [];
    var visited = {}; // node id -> { onStack, lowlink, index }
    var results = [];

    function isVisited(w: string) {
      return Boolean(visited[w]);
    }
    const dfs = (v) => {
      var entry = (visited[v] = {
        onStack: true,
        lowlink: index,
        index: index++,
      });
      stack.push(v);

      this.successors(v).forEach(function(w) {
        if (!isVisited(w)) {
          dfs(w);
          entry.lowlink = Math.min(entry.lowlink, visited[w].lowlink);
        } else if (visited[w].onStack) {
          entry.lowlink = Math.min(entry.lowlink, visited[w].index);
        }
      });

      if (entry.lowlink === entry.index) {
        var cmpt = [];
        var w;
        do {
          w = stack.pop();
          visited[w].onStack = false;
          cmpt.push(w);
        } while (v !== w);
        results.push(cmpt);
      }
    };

    this.nodes().forEach(function(v) {
      if (!isVisited(v)) {
        dfs(v);
      }
    });

    return results;
  }

  public updateConfig(config: Point[]) {
    this.config = config;
    this.configMap = createConfigMap(config);
    this.deliverMap = createDeliversMap(config);
  }
  public getConfig() {
    return this.config;
  }

  /**
   * 根据派发关系来找到所有经过的节点
   * 找到当前点关联的所有点(排除除触发点以外作用域外的点)
   * @param newTriggerPoints
   * @param createDeliversMap
   */
  public getAllPointsByPoints(notifyPoints: NotifyPoint | NotifyPoint[]) {
    // 非数组，处理成数组
    let keys = new Set<string>();
    const visited  = new Set<string>()
    const newNotifyPoints = normalizeSingle2Arr<NotifyPoint>(notifyPoints);
    const traverse = (notifyKeys: NotifyPoint[]) => {
      notifyKeys.forEach((notifyKey) => {
        if (!notifyKey.downStreamOnly && !keys.has(notifyKey.key)) {
          keys.add(notifyKey.key);
        }
        if(!visited.has(notifyKey.key)) {
          visited.add(notifyKey.key)
          traverse(
            (this.deliverMap.get(notifyKey.key) || []).map((key) => ({
              key: key,
              downStreamOnly: false,
            }))
          );
        }
        
      });
    };
    traverse(newNotifyPoints);
    return Array.from(keys);
  }
}
function CycleException() {}
CycleException.prototype = new Error(); // must be an instance of Error to pass testing
