import { IRdxTask } from "../types";

export interface Base<T> {
  remove(key: string, scope?: string): void;
  update(key: string, value: T, scope?: string): void 
  get(key: string, scope?: string): T | null 
  getAll(): any 
}
export class BaseMap<T extends Object> implements Base<T> {
  v: Map<string, T | null>;
  // itemCreateCallback: (key: string) => void;
  private itemUpdateCallback: (type: 'update' | 'remove' | 'add',  key: string,preValue?: T,  newValue?: T) => void;
  private afterItemUpdate: (key: string) => void
  // onItemCreate(callback: (key: string) => void) {
  //   this.itemCreateCallback = callback;
  // }
  onItemUpdate(callback: (type: 'update' | 'remove' | 'add', key: string, preValue?: T,  newValue?: T) => void) {
    this.itemUpdateCallback = callback;
  }
  onAfterItemUpdate(callback: (key: string) => void) {
    this.afterItemUpdate = callback;
  }
  constructor(v: Map<string, T | null>) {
    this.v = v;
  }
  get(key: string) {
    return this.v.get(key) || null;
  }
  removeAll() {
    this.v.clear()
  }
  remove(rkey: string) {
    this.itemUpdateCallback && this.itemUpdateCallback('remove', rkey, )
    this.v.delete(rkey)
    this.afterItemUpdate && this.afterItemUpdate(rkey)
  }
  update(key: string, value: T) {

    this.itemUpdateCallback && this.itemUpdateCallback(this.v.get(key) ? 'update' : 'add', key, this.v.get(key) as any, value)
    this.v.set(key, value as any);
    this.afterItemUpdate && this.afterItemUpdate(key)
  }
  getAll() {
    return this.v;
  }
}
export class TaskMap  extends BaseMap<IRdxTask<any>> {
  deliverMap: Map<string, string[]>
  remove(key: string) {
    // 1. 更新数据
    super.remove(key)
    // // 2. 更新关联关系  *删除deliver节点 
    // const currentTask = this.get(key)
    // currentTask.deps.forEach((dep) => {
    //   this.deliverMap.get(dep)
    // })
    // this.deliverMap.delete()
    
  }
  update(key: string, value: IRdxTask<any>) {
    // 1. 更新数据
    // 2. 创建关联关系
    super.update(key, value)
    value.deps
  }
}

export class BaseObject<T extends Object> implements Base<T> {
  constructor(v: { [key: string]: T | null }) {
    this.v = v;
  }
  v: { [key: string]: T | null };
  remove(key: string) {
    // 去掉了解构，太耗时了
    delete this.v[key]
    
  }
  getAll() {
    return this.v;
  }
  get(key: string): T {
    return this.v[key] as T;
  }
  update(key: string, value: T) {
    this.v[key]  = value
  }
}

// export class ScopeObject<T extends Object> extends BaseObject<T> {
//   scopeEditState: Map<string, BaseObject<T>>;
//   constructor(
//     v: { [key: string]: T | null },
//     scopeState?: Map<string, BaseObject<T>>
//   ) {
//     super(v);
//     this.scopeEditState = new Map();
//     // ?有点问题, 新建，不引用原来对象
//     if (scopeState) {
//       Array.from(scopeState.keys()).forEach((scope) => {
//         this.scopeEditState.set(scope, scopeState.get(scope));
//       });
//     }
//   }
//   getCurrentScopeState(scope?: string) {
//     return this.scopeEditState.get(scope);
//   }
//   hasScopeState(scope?: string) {
//     return Boolean(this.scopeEditState.get(scope));
//   }
//   get(key: string, scope?:string) {
//     if (!scope) {
//       return super.get(key);
//     }
//     const scopeState = this.getCurrentScopeState(scope);
//     const vInScope = scopeState && scopeState.get(key);
//     if (scopeState && vInScope !== undefined) {
//       return vInScope;
//     } else {
//       return super.get(key);
//     }
//   }
//   remove(key: string, scope?: string) {
//     super.remove(key, scope);
//     if (this.hasScopeState(scope)) {
//       // 清理作用域数据
//       this.scopeEditState.set(scope, null);
//     }
//   }
//   merge(scope) {
//     const hasScope = this.hasScopeState(scope);
//     if (hasScope) {
//       // 获取当前作用域的数据
//       const currentScopeState = this.getCurrentScopeState(scope);
//       // 清理作用域数据
//       this.scopeEditState.set(scope, null);
//       // 合并到全局数据中
//       this.v = Object.assign({}, super.getAll(), currentScopeState.getAll());
//     }
//   }
//   clone() {
//     return new ScopeObject<T>(super.getAll(), this.scopeEditState) as any;
//   }
//   update(key, value, scope) {
//     let state = super.getAll();
//     if (!scope) {
//       state = super.update(key, value, scope).getAll();
//     } else {
//       const hasScope = this.hasScopeState(scope);
//       if (!hasScope) {
//         this.scopeEditState.set(scope, new BaseObject({ [key]: value }));
//       } else {
//         const currentScopeState = this.getCurrentScopeState(scope);
//         this.scopeEditState.set(scope, currentScopeState.update(key, value));
//       }
//     }
//     this.v = state
//   }
// }
