import { CycleException, topsort } from "./topsort";

// 是非循环的。 false 则是循环的。
export function isAcyclic(g) {
  try {
    topsort(g);
  } catch (e) {
    if (e instanceof CycleException) {
      return false;
    }
    throw e;
  }
  return true;
}
