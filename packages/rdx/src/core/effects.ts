import { DefaultValue } from '../hooks/base';

/**
 * localStorage数据存储
 *
 * @export
 * @param {string} localStorageKey 指定存在localStroage的key
 * @param {string} name 指定存在localStorage的对象的key
 * @returns
 */
export function localStorageEffect  (localStorageKey: string, name: string) {
  return ({ setSelf, onSet }) => {
    const v = localStorage.getItem(localStorageKey);
    if (v !== null) {
      try {
        setSelf(JSON.parse(v)[name]);
      } catch (error) {
        console.warn('localStorage 中数据有误', error);
      }
    }
    onSet((newValue) => {
      if (newValue instanceof DefaultValue) {
        localStorage.removeItem(localStorageKey);
      } else {
        let value = {};
        try {
          value = JSON.parse(localStorage.getItem(localStorageKey));
        } catch (error) {}

        value[name] = newValue;
        // 数据同步到localStorage中
        localStorage.setItem(localStorageKey, JSON.stringify(value));
      }
    });
  };
};

export const paramsEffect = (key: string) => ({ setSelf }) => {
  const url = new URL(window.location.href);
  setSelf(url.searchParams.get(key));
};
