'use strict'

import { NotifyPoint } from '../graph'
import { isAcyclic } from './alg'
import _ from './lodash'

var DEFAULT_EDGE_NAME = '\x00'
var GRAPH_NODE = '\x00'
var EDGE_KEY_DELIM = '\x01'

// Implementation notes:
//
//  * Node id query functions should return string ids for the nodes
//  * Edge id query functions should return an "edgeObj", edge object, that is
//    composed of enough information to uniquely identify an edge: {v, w, name}.
//  * Internally we use an "edgeId", a stringified form of the edgeObj, to
//    reference edges. This is because we need a performant way to look these
//    edges up and, object properties, which have string keys, are the closest
//    we're going to get to a performant hashtable in JavaScript.

export class AdvancedGraph {
  _nodeCount: number = 0
  _edgeCount: number = 0
  _isDirected: boolean
  _isMultigraph: boolean
  _isCompound: boolean
  _label: boolean
  _defaultNodeLabelFn: any
  _defaultEdgeLabelFn: any
  _nodes: Record<string, any>
  _parent: Record<string, any>
  _children: Record<string, any>
  _in: Record<string, any>
  _preds: Record<string, any>
  _out: Record<string, any>
  _sucs: Record<string, any>
  _edgeObjs: Record<string, any>
  _edgeLabels: Record<string, any>
  constructor(opts: { directed?: boolean; multigraph?: boolean; compound?: boolean }) {
    this._isDirected = _.has(opts, 'directed') ? opts.directed : true
    this._isMultigraph = _.has(opts, 'multigraph') ? opts.multigraph : false
    this._isCompound = _.has(opts, 'compound') ? opts.compound : false

    // Label for the graph itself
    this._label = undefined

    // Defaults to be set when creating a new node
    this._defaultNodeLabelFn = _.constant(() => 'test')

    // Defaults to be set when creating a new edge
    this._defaultEdgeLabelFn = _.constant(() => 'test')

    // v -> label
    this._nodes = {}

    if (this._isCompound) {
      // v -> parent
      this._parent = {}

      // v -> children
      this._children = {}
      this._children[GRAPH_NODE] = {}
    }

    // v -> edgeObj
    this._in = {}

    // u -> v -> Number
    this._preds = {}

    // v -> edgeObj
    this._out = {}

    // v -> w -> Number
    this._sucs = {}

    // e -> edgeObj
    this._edgeObjs = {}

    // e -> label
    this._edgeLabels = {}
  }

  isDirected = function() {
    return this._isDirected
  }

  isMultigraph = function() {
    return this._isMultigraph
  }

  isCompound = function() {
    return this._isCompound
  }

  setGraph = function(label) {
    this._label = label
    return this
  }

  graph = function() {
    return this._label
  }

  /* === Node functions ========== */

  setDefaultNodeLabel = function(newDefault) {
    if (!_.isFunction(newDefault)) {
      newDefault = _.constant(newDefault)
    }
    this._defaultNodeLabelFn = newDefault
    return this
  }

  nodeCount = function() {
    return this._nodeCount
  }

  nodes = function() {
    return _.keys(this._nodes)
  }

  sources = function() {
    var self = this
    return _.filter(this.nodes(), function(v) {
      return _.isEmpty(self._in[v])
    })
  }

  sinks = function() {
    var self = this
    return _.filter(this.nodes(), function(v) {
      return _.isEmpty(self._out[v])
    })
  }

  setNodes = function(vs, value) {
    var args = arguments
    var self = this
    _.each(vs, function(v) {
      if (args.length > 1) {
        self.setNode(v, value)
      } else {
        self.setNode(v)
      }
    })
    return this
  }

  setNode = function(v, value?: any) {
    if (_.has(this._nodes, v)) {
      if (arguments.length > 1) {
        this._nodes[v] = value
      }
      return this
    }

    this._nodes[v] = arguments.length > 1 ? value : this._defaultNodeLabelFn(v)
    if (this._isCompound) {
      this._parent[v] = GRAPH_NODE
      this._children[v] = {}
      this._children[GRAPH_NODE][v] = true
    }
    this._in[v] = {}
    this._preds[v] = {}
    this._out[v] = {}
    this._sucs[v] = {}
    ++this._nodeCount
    return this
  }

  node = function(v) {
    return this._nodes[v]
  }

  hasNode = function(v) {
    return _.has(this._nodes, v)
  }

  removeNode = function(v) {
    var self = this
    if (_.has(this._nodes, v)) {
      var removeEdge = function(e) {
        self.removeEdge(self._edgeObjs[e])
      }
      delete this._nodes[v]
      if (this._isCompound) {
        this._removeFromParentsChildList(v)
        delete this._parent[v]
        _.each(this.children(v), function(child) {
          self.setParent(child)
        })
        delete this._children[v]
      }
      _.each(_.keys(this._in[v]), removeEdge)
      delete this._in[v]
      delete this._preds[v]
      _.each(_.keys(this._out[v]), removeEdge)
      delete this._out[v]
      delete this._sucs[v]
      --this._nodeCount
    }
    return this
  }

  setParent = function(v, parent) {
    if (!this._isCompound) {
      throw new Error('Cannot set parent in a non-compound graph')
    }

    if (_.isUndefined(parent)) {
      parent = GRAPH_NODE
    } else {
      // Coerce parent to string
      parent += ''
      for (var ancestor = parent; !_.isUndefined(ancestor); ancestor = this.parent(ancestor)) {
        if (ancestor === v) {
          throw new Error('Setting ' + parent + ' as parent of ' + v + ' would create a cycle')
        }
      }

      this.setNode(parent)
    }

    this.setNode(v)
    this._removeFromParentsChildList(v)
    this._parent[v] = parent
    this._children[parent][v] = true
    return this
  }

  _removeFromParentsChildList = function(v) {
    delete this._children[this._parent[v]][v]
  }

  parent = function(v) {
    if (this._isCompound) {
      var parent = this._parent[v]
      if (parent !== GRAPH_NODE) {
        return parent
      }
    }
  }

  children = function(v) {
    if (_.isUndefined(v)) {
      v = GRAPH_NODE
    }

    if (this._isCompound) {
      var children = this._children[v]
      if (children) {
        return _.keys(children)
      }
    } else if (v === GRAPH_NODE) {
      return this.nodes()
    } else if (this.hasNode(v)) {
      return []
    }
  }

  predecessors = function(v) {
    var predsV = this._preds[v]
    if (predsV) {
      return _.keys(predsV)
    }
  }

  successors = function(v) {
    var sucsV = this._sucs[v]
    if (sucsV) {
      return _.keys(sucsV)
    }
  }

  neighbors = function(v) {
    var preds = this.predecessors(v)
    if (preds) {
      return _.union(preds, this.successors(v))
    }
  }

  isLeaf = function(v) {
    var neighbors
    if (this.isDirected()) {
      neighbors = this.successors(v)
    } else {
      neighbors = this.neighbors(v)
    }
    return neighbors.length === 0
  }

  filterNodes = function(filter) {
    var copy = new this.constructor({
      directed: this._isDirected,
      multigraph: this._isMultigraph,
      compound: this._isCompound,
    })

    copy.setGraph(this.graph())

    var self = this
    _.each(this._nodes, function(value, v) {
      if (filter(v)) {
        copy.setNode(v, value)
      }
    })

    _.each(this._edgeObjs, function(e) {
      if (copy.hasNode(e.v) && copy.hasNode(e.w)) {
        copy.setEdge(e, self.edge(e))
      }
    })

    var parents = {}
    function findParent(v) {
      var parent = self.parent(v)
      if (parent === undefined || copy.hasNode(parent)) {
        parents[v] = parent
        return parent
      } else if (parent in parents) {
        return parents[parent]
      } else {
        return findParent(parent)
      }
    }

    if (this._isCompound) {
      _.each(copy.nodes(), function(v) {
        copy.setParent(v, findParent(v))
      })
    }

    return copy
  }

  /* === Edge functions ========== */

  setDefaultEdgeLabel = function(newDefault) {
    if (!_.isFunction(newDefault)) {
      newDefault = _.constant(newDefault)
    }
    this._defaultEdgeLabelFn = newDefault
    return this
  }

  edgeCount = function() {
    return this._edgeCount
  }

  edges = function() {
    return _.values(this._edgeObjs)
  }

  setPath = function(vs, value) {
    var self = this
    var args = arguments
    _.reduce(vs, function(v, w) {
      if (args.length > 1) {
        self.setEdge(v, w, value)
      } else {
        self.setEdge(v, w)
      }
      return w
    })
    return this
  }

  /*
   * setEdge(v, w, [value, [name]])
   * setEdge({ v, w, [name] }, [value])
   */
  setEdge(v, w, name?: any, value?: any) {
    var valueSpecified = false
    var arg0 = arguments[0]

    if (typeof arg0 === 'object' && arg0 !== null && 'v' in arg0) {
      v = arg0.v
      w = arg0.w
      name = arg0.name
      if (arguments.length === 2) {
        value = arguments[1]
        valueSpecified = true
      }
    } else {
      v = arg0
      w = arguments[1]
      name = arguments[3]
      if (arguments.length > 2) {
        value = arguments[2]
        valueSpecified = true
      }
    }

    v = '' + v
    w = '' + w
    if (!_.isUndefined(name)) {
      name = '' + name
    }

    var e = edgeArgsToId(this._isDirected, v, w, name)
    if (_.has(this._edgeLabels, e)) {
      if (valueSpecified) {
        this._edgeLabels[e] = value
      }
      return this
    }

    if (!_.isUndefined(name) && !this._isMultigraph) {
      throw new Error('Cannot set a named edge when isMultigraph = false')
    }

    // It didn't exist, so we need to create it.
    // First ensure the nodes exist.
    this.setNode(v)
    this.setNode(w)

    this._edgeLabels[e] = valueSpecified ? value : this._defaultEdgeLabelFn(v, w, name)

    var edgeObj = edgeArgsToObj(this._isDirected, v, w, name)
    // Ensure we add undirected edges in a consistent way.
    v = edgeObj.v
    w = edgeObj.w

    Object.freeze(edgeObj)
    this._edgeObjs[e] = edgeObj
    incrementOrInitEntry(this._preds[w], v)
    incrementOrInitEntry(this._sucs[v], w)
    this._in[w][e] = edgeObj
    this._out[v][e] = edgeObj
    this._edgeCount++
    return this
  }

  edge = function(v, w, name) {
    var e =
      arguments.length === 1 ? edgeObjToId(this._isDirected, arguments[0]) : edgeArgsToId(this._isDirected, v, w, name)
    return this._edgeLabels[e]
  }

  hasEdge = function(v, w, name) {
    var e =
      arguments.length === 1 ? edgeObjToId(this._isDirected, arguments[0]) : edgeArgsToId(this._isDirected, v, w, name)
    return _.has(this._edgeLabels, e)
  }

  removeEdge = function(v, w, name?: any) {
    var e =
      arguments.length === 1 ? edgeObjToId(this._isDirected, arguments[0]) : edgeArgsToId(this._isDirected, v, w, name)
    var edge = this._edgeObjs[e]
    if (edge) {
      v = edge.v
      w = edge.w
      delete this._edgeLabels[e]
      delete this._edgeObjs[e]
      decrementOrRemoveEntry(this._preds[w], v)
      decrementOrRemoveEntry(this._sucs[v], w)
      delete this._in[w][e]
      delete this._out[v][e]
      this._edgeCount--
    }
    return this
  }

  getAllNodesByCurrentNodes(newNotifyPoints: NotifyPoint[]) {
    // 环检测
    // 非数组，处理成数组
    let keys = new Set<string>()
    const visited = new Set<string>()
    const traverse = (notifyKeys: NotifyPoint[]) => {
      notifyKeys.forEach(notifyKey => {
        if (!notifyKey.downStreamOnly && !keys.has(notifyKey.key)) {
          keys.add(notifyKey.key)
        }
        if (!visited.has(notifyKey.key)) {
          visited.add(notifyKey.key)
          traverse(
            (this.outEdges(notifyKey.key) || []).map(node => ({
              key: node.w,
              downStreamOnly: false,
            })),
          )
        }
      })
    }
    traverse(newNotifyPoints)
    return Array.from(keys)
  }
  inEdges = function(v: string, u?: string) {
    var inV = this._in[v]
    if (inV) {
      var edges = _.values(inV)
      if (!u) {
        return edges
      }
      return _.filter(edges, function(edge) {
        return edge.v === u
      })
    } else {
      return []
    }
  }

  outEdges = function(v: string, w?: string): { v: string; w: string; name: string }[] {
    var outV = this._out[v]
    if (outV) {
      var edges = _.values(outV)
      if (!w) {
        return edges
      }
      return _.filter(edges, function(edge) {
        return edge.w === w
      })
    }
  }

  nodeEdges = function(v, w) {
    var inEdges = this.inEdges(v, w)
    if (inEdges) {
      return inEdges.concat(this.outEdges(v, w))
    }
  }
}
/* === Graph functions ========= */

function incrementOrInitEntry(map, k) {
  if (map[k]) {
    map[k]++
  } else {
    map[k] = 1
  }
}

function decrementOrRemoveEntry(map, k) {
  if (!--map[k]) {
    delete map[k]
  }
}

function edgeArgsToId(isDirected, v_, w_, name) {
  var v = '' + v_
  var w = '' + w_
  if (!isDirected && v > w) {
    var tmp = v
    v = w
    w = tmp
  }
  return v + EDGE_KEY_DELIM + w + EDGE_KEY_DELIM + (_.isUndefined(name) ? DEFAULT_EDGE_NAME : name)
}

function edgeArgsToObj(isDirected, v_, w_, name) {
  var v = '' + v_
  var w = '' + w_
  if (!isDirected && v > w) {
    var tmp = v
    v = w
    w = tmp
  }
  var edgeObj = { v: v, w: w, name: undefined }
  if (name) {
    edgeObj.name = name
  }
  return edgeObj
}

function edgeObjToId(isDirected, edgeObj) {
  return edgeArgsToId(isDirected, edgeObj.v, edgeObj.w, edgeObj.name)
}
