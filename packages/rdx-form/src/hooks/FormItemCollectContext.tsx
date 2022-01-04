import React, { useRef } from 'react';
import { IRdxFormItemAnyType } from '../components';
export interface IFormItemCollectContext {
  getAll: () => Map<string, IRdxFormItemAnyType>;
  add: (id: string, info: IRdxFormItemAnyType) => void;
  remove: (id: string) => void;
}
export const FormItemCollectContext = React.createContext<
  IFormItemCollectContext
>(null);
export function useFormCollectContext() {
  return React.useContext(FormItemCollectContext);
}

export const CollectFormItems = (props: { children: any}) => {
  const collectRef = useRef(new Map<string, IRdxFormItemAnyType>());
  // 获取所有error的状态
  return (
    <FormItemCollectContext.Provider
      value={{
        getAll: () => {
          return collectRef.current;
        },
        add: (id, info) => {
          collectRef.current.set(id, info);
        },
        remove: (id) => {
          collectRef.current.delete(id);
        }
      }}
    >
      {props.children}
    </FormItemCollectContext.Provider>
  );
};
