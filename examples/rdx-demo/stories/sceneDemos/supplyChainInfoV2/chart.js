import React, { Component } from 'react';
// import FieldComponent from "./fieldComponent";

function getTranslate(x, y) {
  return `translate(${x}, ${y})`;
}

export function arr2Map(source, getKey) {
  const m = new Map();
  source.forEach((item) => {
    const key = getKey(item);
    m.set(key, item);
  });
  return m;
}

function createLayoutInfo(from, to, nodeInfo) {
  const { x: fromX, y: fromY } = from;
  const { x: toX, y: toY } = to;
  const { width, height } = nodeInfo;
  const xMiddle = Math.abs(fromX - toX);
  const yMiddle = Math.abs(fromY - toY);
  const xDistacne = xMiddle - width;
  const yDistacne = yMiddle - height;
  // 方向
  let isToRight = true;
  if (fromX - toX > 0) {
    isToRight = false;
  }
  const isContrast = isToRight ? 1 : -1;
  let isTurningPoint = false;
  if (toY - fromY > 0) {
    isTurningPoint = true;
  }
  const halfNodeWidth = width / 2;
  const halfNodeHeight = height / 2;
  return {
    xDistacne,
    yDistacne,
    isContrast,
    isTurningPoint,
    halfNodeWidth,
    halfNodeHeight,
    xMiddle,
    yMiddle,
  };
}

function getEdgeTranslate(from, to, nodeInfo, edgeInfo) {
  const { x: fromX, y: fromY } = from;
  const { y: toY } = to;
  const { xMiddle, isContrast, isTurningPoint } = createLayoutInfo(
    from,
    to,
    nodeInfo
  );
  return getTranslate(
    // fromX + (isTurningPoint ? 0 : xMiddle / 2) * isContrast,
    fromX + (xMiddle / 2) * isContrast,
    // - edgeInfo.height / 2
    // isTurningPoint?( fromY +  (yMiddle * 3) / 4) : (fromY -  nodeInfo.height / 4 ),
    isTurningPoint ? toY - nodeInfo.height / 4 : fromY - nodeInfo.height / 4
  );
}

function getPath(from, to, nodeInfo, edgeInfo) {
  const { extraWidth = 0 } = edgeInfo;
  const {
    isTurningPoint,
    isContrast,
    xDistacne,
    yMiddle,
    halfNodeHeight,
    halfNodeWidth,
  } = createLayoutInfo(from, to, nodeInfo);
  const { x, y } = getStartPoint(from, to, nodeInfo, edgeInfo);
  const turningPointWidth =
    (xDistacne + halfNodeWidth + extraWidth) * isContrast;
  if (!isTurningPoint) {
    return `M ${x} ${y} h ${(xDistacne + extraWidth * 2 + 8) * isContrast} `;
  }
  return `M ${x} ${y + 8} v ${yMiddle - (3 * nodeInfo.height) / 4 - 8 - 8} h${
    turningPointWidth >= 0 ? turningPointWidth + 8 : turningPointWidth - 8
  }`;
}

function getStartPoint(from, to, nodeInfo, edgeInfo) {
  const { x: fromX, y: fromY } = from;
  const { extraWidth = 0 } = edgeInfo;
  const {
    isTurningPoint,
    isContrast,
    halfNodeHeight,
    halfNodeWidth,
  } = createLayoutInfo(from, to, nodeInfo);

  if (!isTurningPoint) {
    return {
      x: fromX + (halfNodeWidth - extraWidth) * isContrast,
      y: fromY - halfNodeHeight / 2,
    };
  }
  return {
    x: fromX,
    y: fromY + halfNodeHeight + 8,
  };
}


export default class SupplyChain extends Component {
  componentDidMount() {
    console.log("SupplyChain didmount");
  }
  render() {
    let {
      NodeRender,
      EdgeRender,
      nodes,
      edges = [],
      nodeConfig = {
        width: 50,
        height: 50,
      },
      svgConfig = {
        width: 1000,
        height: 1000,
      },
      edgeConfig = {
        width: 50,
        height: 50,
      },
      left,
      top,
    } = this.props;

    const { width: nodeWidth, height: nodeHeight } = nodeConfig;
    const { width: edgeWidth, height: edgeHeight, color } = edgeConfig;
    if (left === undefined) {
      left = nodeWidth / 2;
    }
    if (top === undefined) {
      top = nodeHeight / 2;
    }
    const nodeMap = arr2Map(nodes, (node) => node.key);

    return (
      <svg
        width={svgConfig.width}
        height={svgConfig.height}
        style={{ margin: '10px 0' }}
      >
        <g transform={getTranslate(left, top)}>
          {nodes.map((node) => {
            const { x, y } = node;
            return (
              <g key={`${node.key}`} transform={getTranslate(x, y)}>
                <foreignObject
                  x={-nodeWidth / 2}
                  y={-nodeHeight / 2}
                  width={nodeWidth}
                  height={nodeHeight}
                >
                  
                  <div style={{ width: nodeWidth, height: nodeHeight }}>
                    <NodeRender key={node.key} node={node} />
                  </div>
                </foreignObject>
              </g>
            );
          })}
          {edges.map((edge) => {
            const { key, from, to } = edge;
            const fromNode = nodeMap.get(from);
            const toNode = nodeMap.get(to);
            const { x, y } = getStartPoint(
              fromNode,
              toNode,
              nodeConfig,
              edgeConfig
            );
            return (
              <g key={key}>
                <g>
                  <circle fill={color} cx={x} cy={y} r='4' />
                </g>
                <path
                  fill={'transparent'}
                  stroke={color}
                  strokeWidth={2}
                  d={getPath(fromNode, toNode, nodeConfig, {
                    ...edgeConfig,
                    extraWidth: edgeConfig.extraWidth - 8,
                  })}
                />
                <g
                  transform={getEdgeTranslate(
                    fromNode,
                    toNode,
                    nodeConfig,
                    edgeConfig
                  )}
                >
                  
                  <foreignObject
                  key={111}
                    x={-edgeWidth / 2}
                    y={-edgeHeight / 2}
                    width={edgeWidth}
                    height={edgeHeight}
                  >
                    {
                      <div style={{ width: edgeWidth, height: edgeHeight }}>
                        <EdgeRender
                          key={key}
                          edge={edge}
                          from={nodeMap.get(edge.from)}
                          to={nodeMap.get(edge.from)}
                        />
                      </div>
                    }
                  </foreignObject>
                </g>
              </g>
            );
          })}
        </g>
      </svg>
    );
  }
}
