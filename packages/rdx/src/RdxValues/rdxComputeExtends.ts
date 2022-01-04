import { RdxState, IRdxBaseState } from '../types/rdxBaseTypes'
import { IRdxComputeGet, IRdxComputeSet } from './RdxCompute/types'
import { compute } from './RdxCompute'
import { isPromise } from '../utils/base'
import { singleInstanceFactory } from './rdxAtomFamily'

export function stringify(x: any, opt: { allowFunctions?: boolean } = { allowFunctions: true }, key?: string): string {
  // A optimization to avoid the more expensive JSON.stringify() for simple strings
  // This may lose protection for u2028 and u2029, though.
  if (typeof x === 'string' && !x.includes('"') && !x.includes('\\')) {
    return `"${x}"`
  }

  // Handle primitive types
  switch (typeof x) {
    case 'undefined':
      return '' // JSON.stringify(undefined) returns undefined, but we always want to return a string
    case 'boolean':
      return x ? 'true' : 'false'
    case 'number':
    case 'symbol':
      // case 'bigint': // BigInt is not supported in www
      return String(x)
    case 'string':
      // Add surrounding quotes and escape internal quotes
      return JSON.stringify(x)
    case 'function':
      if (opt?.allowFunctions !== true) {
        throw new Error('Attempt to serialize function in a Recoil cache key')
      }
      return `__FUNCTION(${x.name})__`
  }

  if (x === null) {
    return 'null'
  }
  // Fallback case for unknown types
  if (typeof x !== 'object') {
    return JSON.stringify(x) ?? ''
  }

  // Deal with all promises as equivalent for now.
  if (isPromise(x)) {
    return '__PROMISE__'
  }

  // Arrays handle recursive stringification
  if (Array.isArray(x)) {
    return `[${x.map((v, i) => stringify(v, opt, i.toString()))}]`
  }

  // If an object defines a toJSON() method, then use that to override the
  // serialization.  This matches the behavior of JSON.stringify().
  // Pass the key for compatibility.
  // Immutable.js collections define this method to allow us to serialize them.
  if (typeof x.toJSON === 'function') {
    // flowlint-next-line unclear-type: off
    return stringify(x.toJSON(key), opt, key)
  }

  // For built-in Maps, sort the keys in a stable order instead of the
  // default insertion order.  Support non-string keys.
  if (x instanceof Map) {
    const obj = {}
    for (const [k, v] of x) {
      // Stringify will escape any nested quotes
      obj[typeof k === 'string' ? k : stringify(k, opt)] = v
    }
    return stringify(obj, opt, key)
  }

  // For built-in Sets, sort the keys in a stable order instead of the
  // default insertion order.
  if (x instanceof Set) {
    return stringify(
      Array.from(x).sort((a, b) => stringify(a, opt).localeCompare(stringify(b, opt))),
      opt,
      key,
    )
  }

  // Anything else that is iterable serialize as an Array.
  if (x[Symbol.iterator] != null && typeof x[Symbol.iterator] === 'function') {
    // flowlint-next-line unclear-type: off
    return stringify(Array.from(x) as any, opt, key)
  }

  // For all other Objects, sort the keys in a stable order.
  return `{${Object.keys(x)
    .filter(key => x[key] !== undefined)
    .sort()
    // stringify the key to add quotes and escape any nested slashes or quotes.
    .map(key => `${stringify(key, opt)}:${stringify(x[key], opt, key)}`)
    .join(',')}}`
}
export interface IRdxComputeFamilyOperate<GModel, GParams> {
  get: (params: GParams) => IRdxComputeGet<GModel>
  set?: (params: GParams) => IRdxComputeSet<GModel>
}
export type IRdxComputeFamilyNode<GModel, GParams> = IRdxBaseState & IRdxComputeFamilyOperate<GModel, GParams>

export function getComputeFamilyPrefix(id: string) {
  return `${id}_computeFamily/`
}
export function computeFamily<GModel, GParams>(config: IRdxComputeFamilyNode<GModel, GParams>) {
  const { id, get, set } = config
  const { getInstance } = singleInstanceFactory()
  const fn = (params?: GParams) => {
    const depId = `${getComputeFamilyPrefix(id)}${stringify(params, {
      allowFunctions: true,
    })}`

    return getInstance(depId, () =>
      compute({
        id: depId,
        get: (...args) => {
          return get(params)(args[0] as any, args[1])
        },
        set: set
          ? (...args) => {
              set(params)(args[0] as any, args[1] as any, args[2])
            }
          : undefined,
      }),
    ) as RdxState<GModel>
  }
  fn.__id = id
  fn.__familyId = `${getComputeFamilyPrefix(config.id)}`
  return fn
}
