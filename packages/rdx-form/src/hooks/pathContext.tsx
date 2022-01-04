import React, { useContext } from 'react';
export const PathContextInstance = React.createContext<{
  paths: string[];
}>({
  paths: [],
});

export function usePathContext() {
  const { paths }  = useContext(PathContextInstance)
  return {
    paths,
    parentPaths: paths.slice(0, paths.length - 1)
  }
}