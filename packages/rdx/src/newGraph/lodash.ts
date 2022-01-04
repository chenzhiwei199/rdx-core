// eslint-disable-next-line no-redeclare
/* global window */

function clone(item) {
  if (!item) {
    return item
  } // null, undefined values check

  var types = [Number, String, Boolean],
    result

  // normalizing primitives if someone did new String('aaa'), or new Number('444');
  types.forEach(function(type) {
    if (item instanceof type) {
      result = type(item)
    }
  })

  if (typeof result == 'undefined') {
    if (Object.prototype.toString.call(item) === '[object Array]') {
      result = []
      item.forEach(function(child, index, array) {
        result[index] = clone(child)
      })
    } else if (typeof item == 'object') {
      // testing that this is DOM
      if (item.nodeType && typeof item.cloneNode == 'function') {
        result = item.cloneNode(true)
      } else if (!item.prototype) {
        // check that this is a literal
        if (item instanceof Date) {
          result = new Date(item)
        } else {
          // it is an object literal
          result = {}
          for (var i in item) {
            result[i] = clone(item[i])
          }
        }
      } else {
        // depending what you would like here,
        // just keep the reference, or create new object
        if (false && item.constructor) {
          // would not advice to do that, reason? Read below
          result = new item.constructor()
        } else {
          result = item
        }
      }
    } else {
      result = item
    }
  }

  return result
}
export default {
  clone: clone,
  constant: v => v,
  each: (nodes: any[], callback) => {
    return nodes.forEach(callback)
  },
  filter: (nodes: any[], callback) => {
    return nodes.filter(callback)
  },
  has: (v, key) => {
    return !!v[key]
  },
  isArray: v => {
    return Array.isArray(v)
  },
  isEmpty: function isEmpty(value) {
    return (
      value === undefined ||
      value === null ||
      (typeof value === 'object' && Object.keys(value).length === 0) ||
      (typeof value === 'string' && value.trim().length === 0)
    )
  },
  isFunction: v => {
    return typeof v === 'function'
  },
  isUndefined: v => {
    return v === undefined
  },
  keys: v => {
    return Object.keys(v)
  },
  map: (nodes: any[], callback) => {
    return nodes.map(callback)
  },
  reduce: (nodes: any[], callback) => {
    return nodes.reduce(callback)
  },
  size: v => {
    return Object.keys(v).length
  },
  union: (x, y) => {
    var obj = {}
    for (var i = x.length - 1; i >= 0; --i) obj[x[i]] = x[i]
    for (var i = y.length - 1; i >= 0; --i) obj[y[i]] = y[i]
    var res = []
    for (var k in obj) {
      if (obj.hasOwnProperty(k))
        // <-- optional
        res.push(obj[k])
    }
    return res
  },
  values: v => {
    return Object.keys(v).map(key => v[key])
  },
}
