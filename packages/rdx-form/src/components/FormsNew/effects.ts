import { DefaultValue } from '@alife/rdx'
import { getValue, setValue } from '../../utils/functions';
const localStorageEffectBase = (
  storageKey: string,
  options?: {
    // 从localStorage恢复的时候
    init?: (storageValue: string) => any;
    // 存储到localStorage的时候
    storageTransform?: (currentValue: any, preStorageValue: string) => string;
    // 当删除的时候
    onRemove?: () => void;
  }
) => {
  const {
    init = (v) => v,
    storageTransform = (currentValue) => currentValue,
    onRemove: remove = () => localStorage.removeItem(storageKey),
  } = options || {};
  return ({ setSelf, onSet }) => {
    const v = localStorage.getItem(storageKey);
    if (v !== null) {
      const newValue = init(v)
      if(newValue !== null) {
        setSelf(newValue);
      }
    }
    onSet((newValue) => {
      if (newValue instanceof DefaultValue) {
        remove();
      } else {
        // 数据同步到localStorage中
        localStorage.setItem(
          storageKey,
          storageTransform(newValue, localStorage.getItem(storageKey))
        );
      }
    });
  };
};

export function localStorageById(storageKey: string, name: string) {
  return localStorageEffectBase(storageKey, {
    init: (storageValue) => {
      try {
        return getValue(JSON.parse(storageValue), name)  
      } catch (error) {
        return null
      }
    },
    storageTransform: (currentValue, preStorageValue) => {
      let value = {} as any;
      try {
        value  = JSON.parse(preStorageValue)
      } catch (error) {
        
      } 
      setValue(value, name, currentValue) 
      return JSON.stringify(value)
    },
  })
}