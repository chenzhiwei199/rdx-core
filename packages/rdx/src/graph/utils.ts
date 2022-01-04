import { Point } from "./types";


export function isDepsMatch(id: string, deps: string | RegExp ){
  if(typeof deps === 'string') {
    return id === deps
  } else {
    return deps.test(id)
  }
}
export function isInConfig(configMap: Map<string , any>, deps: string | RegExp ){
  if(typeof deps === 'string') {
    return configMap.has(deps)
  } else {
    return Array.from((configMap.keys())).some(key => deps.test(key))
  }
}
/**
 * 根据依赖，需要发送通知的下游节点
 * @param config
 */
export function createDeliversMap(config: Point[]) {
  const deliversMap = new Map() as Map<string, string[]>;
  function addDeliver(targetId: string, deliverId: string ) {
    const currentRelations = deliversMap.get(targetId);
    if (currentRelations) {
      currentRelations.push(deliverId);
    } else {
      deliversMap.set(targetId, [deliverId]);
    }
  }
  for (const item of config) {
    for (const dep of item.deps || []) 
    {
      const { id } = dep
      if(typeof id === 'string') {
        addDeliver(id, item.key)
      } else {
        config.filter(item => id.test(item.key)).forEach((target) => {
          addDeliver(target.key, item.key)
        })
      }
      
    }
  }
  return deliversMap;
}
//

export function createConfigMap<T extends { key: string }>(config: T[]) {
  return config.reduce((currentMap, item) => {
    currentMap.set(item.key, item);
    return currentMap;
  }, new Map<string, T>());
}

export function normalizeSingle2Arr<T>(point: T | T[]) {
  if (!Array.isArray(point)) {
    return [point];
  } else {
    return point;
  }
}
export function arr2Map<T>(source: T[], getKey: (v: T) => string) {
  const m = new Map<string, T>();
  source.forEach(item => {
    const key = getKey(item);
    m.set(key, item);
  });
  return m;
}
export function union<T>(source: T[], byKey: (v: T) => string = (t: any) => t) {
  const arr = [];
  const m = new Map();
  source.forEach(item => {
    const key = byKey(item);
    if (!m.has(key)) {
      arr.push(item);
      m.set(key, item);
    }
  });
  return arr;
}

export interface Data {
  id: string;
  deps?: { id: string; weight?: number }[];
}
