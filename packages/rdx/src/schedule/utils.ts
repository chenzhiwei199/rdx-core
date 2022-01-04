import { PointWithWeight, IDeps } from './typings/global';
import { Point, IGraphDeps } from '../graph';

export const END = 'i am i end subscribe, hahaha';




export const findSameArray = (sourceArr: string[], targetArr: string[]) => {
  return targetArr.find((item) => sourceArr.includes(item));
};
export enum ReasonType {
  TriggerInnEdge = 'TriggerInnEdge',
  SmallWeight = 'SmallWeight',
  WeightEqualAndNotFirst = 'WeightEqualAndNotFirst',
}


export function graphAdapter(pointWithWeight: PointWithWeight[]) {
  return pointWithWeight.map((p) => {
    return {
      ...p,
      deps: (p.deps || ([] as IDeps[])).map((dep) => {
        if (typeof dep === 'string') {
          return {
            id: dep,
          };
        } else {
          const { id, ...others } = dep;
          return {
            id: dep.id,
            value: others,
          };
        }
      }),
    };
  });
}

export function point2WithWeightAdapter(pointWithWeight: Point[]) {
  return pointWithWeight.map((p) => {
    return {
      ...p,
      id: p.key,
      deps: (p.deps || ([] as IGraphDeps[])).map((dep) => {
        return {
          id: dep.id,
        };
      }),
    };
  });
}

export function graphLibAdapter(pointWithWeight: PointWithWeight[]) {
  return pointWithWeight.map((p) => {
    return {
      ...p,
      id: p.key,
      deps: (p.deps || ([] as { id: string; weight: number }[])).map((dep) => {
        if (typeof dep === 'string') {
          return {
            id: dep,
          };
        } else {
          return dep;
        }
      }),
    };
  });
}
