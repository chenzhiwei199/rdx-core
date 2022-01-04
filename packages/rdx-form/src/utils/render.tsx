import {
  IFieldDefineWithChild,
  getChlidFieldInfo,
  IFieldInfo,
} from './functions';
import { IFieldBase } from '../global';
import React, { useContext } from 'react';
import { PathContextInstance, usePathContext } from '../hooks/pathContext';

function renderBasic(config: {
  children;
  rowIndex;
  extra?: any;
  processProps?: () => { [key: string]: any };
}) {
  const { children, extra, processProps, rowIndex } = config;
  return (
    <>
      {extra}
      {React.cloneElement(children, {
        ...(processProps && processProps()),
        name: rowIndex,
      })}
    </>
  );
}
function RenderObject({
  children,
  rowIndex,
  colIndex,
  processProps,
}: {
  children: React.ReactNode;
  rowIndex: number;
  colIndex: number;
  processProps?: () => { [key: string]: any };
}) {
  const field: IFieldInfo = getChlidFieldInfo(children);
  const { children: childrenInfo } = field;
  return (
    <>
      <PathContextInstance.Provider
        value={{
          paths: [...usePathContext().paths, rowIndex.toString()],
        }}
      >
        {React.cloneElement(childrenInfo[colIndex].child, {
          key: rowIndex,
          ...(processProps && processProps()),
        })}
      </PathContextInstance.Provider>
    </>
  ) as any;
}

export function RenderPerRow({
  children,
  rowIndex,
  extra,
}: {
  children?: any;
  rowIndex: number | string;
  extra?: any;
}) {
  const field: IFieldInfo = getChlidFieldInfo(children);
  let currentChildren = <></>;
  const { paths } = usePathContext();
  if (field.type === 'object') {
    currentChildren = (
      <PathContextInstance.Provider
        value={{
          paths: [...paths, rowIndex.toString()],
        }}
      >
        {extra}
        {field.childrenReactNode}
      </PathContextInstance.Provider>
    );
  } else {
    currentChildren = renderBasic({ children, rowIndex, extra });
  }
  return currentChildren;
}
export function RenderPerCell({
  children,
  rowIndex,
  colIndex,
  processProps,
}: {
  children: React.ReactNode;
  rowIndex: number;
  colIndex: number;
  processProps?: () => { [key: string]: any };
}) {
  const field: any = getChlidFieldInfo(children);
  let currentChildren = <></>;
  if (field.type === 'object') {
    currentChildren = (
      <RenderObject
        key={rowIndex}
        {...{
          children,
          rowIndex,
          colIndex,
          processProps,
        }}
      />
    );
  } else {
    currentChildren = renderBasic({ children, rowIndex, processProps });
  }
  return currentChildren;
}
