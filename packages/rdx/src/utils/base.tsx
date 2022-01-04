import ReactDOM from 'react-dom'
export const batchUpdate = (callback: () => void) => {
  ReactDOM.unstable_batchedUpdates(callback);
};


export function isPromise(obj) {
  return (
    !!obj &&
    (typeof obj === 'object' || typeof obj === 'function') &&
    typeof obj.then === 'function'
  );
}


export function isAsyncFunction (asyncFn) {
  const AsyncFunction = (async () => {}).constructor;
  const GeneratorFunction = (function* () {} ).constructor;

  return (asyncFn instanceof AsyncFunction && AsyncFunction !== Function && AsyncFunction !== GeneratorFunction) === true  || isPromise(asyncFn)
}


export function normalizeValue(preValue: any, value: any) {
  let newValue;
  if(typeof value === 'function' ) {
    newValue = (value as any)(preValue)
  } else {
    newValue = value
  }
  return newValue
}