import { useContext } from 'react';
import { rdxState, useRdxContext } from '@alife/rdx';
import { PathContextInstance } from '../hooks/pathContext';

export function isFunction(a: any) {
  return typeof a === 'function';
}

export const useFormId = () => {
  const { paths = [] } = useContext(PathContextInstance);
  return paths.join('.');
};

export function createId(name: any, paths: string[]) {
  return [...paths, name].join('.');
}

export function normalize(v: string | string[]) {
  let ids: string[] = [];
  if (!Array.isArray(v)) {
    ids = v.split('.');
  }
  return ids;
}
export function getNameFromId(id: string | string[]) {
  let ids = normalize(id);
  return ids[ids.length - 1];
}
export function getParentPath(id) {
  let ids = normalize(id);
  return ids.slice(0, ids.length - 1);
}
export function useFormPathParse() {
  const context = useRdxContext();

  return {
    getSiblingProperties: (id: string, name: string) => {
      const paths = id.split('.');
      const parentPaths = paths.slice(0, paths.length - 1);
      const grandPaths = paths.slice(0, paths.length - 2);
      return rdxState({
        id: [...parentPaths, name].join('.'),
      });
    },
    getSameColProperties: (id: string, name: string) => {
      const paths = id.split('.');
      const parentPaths = paths.slice(0, paths.length - 1);
      const grandPaths = paths.slice(0, paths.length - 2);
      const allColKeys = context
        .getValidTaskKeys()
        .filter((key) =>
          new RegExp(`${grandPaths.join('.')}\.\\w\.${name}$`).test(key)
        );
      return allColKeys
        .filter((key) =>
          new RegExp(`${grandPaths.join('.')}\.\\w\.${name}$`).test(key)
        )
        .map((item) =>
          rdxState({
            id: [...parentPaths, name].join('.'),
          })
        );
    },
  };
}
