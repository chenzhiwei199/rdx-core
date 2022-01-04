import { batchUpdate } from "./utils";

const taskQueue = new Set();

const scheduler = {
  isOn: false,
  add(task) {
    if (scheduler.isOn) {
      taskQueue.add(task);
    } else {
      task();
    }
  },
  flush() {
    console.log('taskQueue: ', taskQueue);
    // @ts-ignore
    taskQueue.forEach(task => task());
    console.log("hahah")
    taskQueue.clear();
  },
  on() {
    scheduler.isOn = true;
  },
  off() {
    scheduler.isOn = false;
  },
};

export function batch(fn, ctx, args) {
  // do not apply scheduler logic if it is already applied from a parent function
  // it would flush in the middle of the parent's batch
  if (scheduler.isOn) {
    return batchUpdate(() => fn.apply(ctx, args));
  }
  try {
    scheduler.on();
    return batchUpdate(() => fn.apply(ctx, args));
  } finally {
    scheduler.flush();
    
    scheduler.off();
  }
}

// this creates and returns a batched version of the passed function
// the cache is necessary to always map the same thing to the same function
// which makes sure that addEventListener/removeEventListener pairs don't break
const cache = new WeakMap();
export function batchFn(fn) {
  if (typeof fn !== 'function') {
    return fn;
  }
  let batched = cache.get(fn);
  if (!batched) {
    batched = new Proxy(fn, {
      apply(target, thisArg, args) {
        return batch(target, thisArg, args);
      },
    });
    cache.set(fn, batched);
  }
  return batched;
}
