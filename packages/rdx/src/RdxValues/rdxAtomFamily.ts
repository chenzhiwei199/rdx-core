import { IRdxBaseState, isRdxInstance, RdxState, RdxValue } from "../types/rdxBaseTypes";
import { atom, IAtomEffect } from "./rdxAtom";
import { stringify } from "./rdxComputeExtends";

export interface IRdxAtomFamilyState<GModel, GParams> extends IRdxBaseState {
  virtual?: boolean;
  defaultValue: GModel | Promise<GModel> | RdxState<GModel> | ((params: GParams) => GModel | Promise<GModel> | RdxState<GModel>);
  effects?: (params: GParams) => IAtomEffect<GModel>[];
}
export function getAtomFamilyPrefix(id: string) {
  return `${id}_atomFamily/`
}


export function singleInstanceFactory() {
  const atoms = new Map<string, any>()
  return {
    getInstance: <T extends any>(id: string ,createFn: () =>  T): T => {
      if(!atoms.has(id)) {
        const node = createFn()
        atoms.set(id, node)
        return node
      } else {
        return atoms.get(id)
      }
    }
  }
}
export function atomFamily<GModel, GParams>(config: IRdxAtomFamilyState<GModel, GParams>): (params: GParams) => RdxState<GModel extends () => infer P ? P : GModel > {
  const { getInstance } =singleInstanceFactory()
  const fn = (params: GParams) => {
    function evalDefaultValue() {
      if(isRdxInstance(config.defaultValue) ) {
        return config.defaultValue
      } else if(typeof config.defaultValue === 'function') {
        return (config.defaultValue as any)(params)
      } else {
        return config.defaultValue
      }
    }
    const id = `${getAtomFamilyPrefix(config.id)}${stringify(params, {
      allowFunctions: true
    })?? 'void'}`
    return getInstance(id, () => atom({
      ...config,
      id: id,
      effects: config.effects && config.effects(params),
      defaultValue: evalDefaultValue(),
    }))
  };
  // 增加内置属性
  fn.__id = config.id;
  fn.__familyId = `${getAtomFamilyPrefix(config.id)}`;
  return fn
}