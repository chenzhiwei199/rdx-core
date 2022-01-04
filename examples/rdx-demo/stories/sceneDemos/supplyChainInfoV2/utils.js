import {
  Types,
  styleMap,
  VirtualBusinessWarehouse,
  VirtualNode,
} from './constants';
function getRowIndex(index, colNumberInRow) {
  const positionIndex = index + 1;
  let rowNumber = Math.ceil(positionIndex / colNumberInRow) - 1;
  return rowNumber;
}
function getVirtualIndex(index, colNumberInRow) {
  let rowNumber = getRowIndex(index, colNumberInRow);
  const positionIndex = index + 1;
  const isEven = rowNumber % 2 === 0;
  let xDistance = 0;
  if (isEven) {
    xDistance = (positionIndex - 1) % colNumberInRow;
  } else {
    xDistance = colNumberInRow * (rowNumber + 1) - positionIndex;
  }
  return {
    row: rowNumber,
    xDistance,
  };
}
function getRealIndex(index, colNumberInRow) {
  let rowIndex = 0;
  if (index < colNumberInRow) {
    rowIndex = 0;
  } else {
    rowIndex = Math.ceil((index + 1 - colNumberInRow) / (colNumberInRow - 1));
  }
  Math.floor(index / colNumberInRow);
  return getVirtualIndex(index + rowIndex, colNumberInRow);
}
export function createLayout(options = {}) {
  const {
    schema = [],
    colGap = 50,
    rowGap = 30,
    rowNumbers = 3,
    nodeConfig = {},
  } = options;
  const { width = 200, height = 100 } = nodeConfig;
  const createNodes = (info) => {
    info = info.filter((item) => item !== '');
    let newNodes = [];
    for (let i = 0; i < info.length; i++) {
      const { row, xDistance } = getRealIndex(i, rowNumbers);
      const x = xDistance * (width + colGap);
      const y = row * (height + rowGap);
      newNodes.push({ ...info[i], x: width / 2 + x, y: height / 2 + y });
    }
    return newNodes;
  };

  const nodesInfos = schema.reduce((arr, item, index) => {
    const { type } = item;
    const fromFullInfo = {
      ...item,
      ...styleMap[type],
      index,
      key: `${type}-${index}`,
    };
    
    // if (isB2C) {
    //   return arr.concat([fromFullInfo, b2cWarehouse]);
    // } else {
    
    // }
    return arr.concat([fromFullInfo]);
  }, []);
  if (nodesInfos[nodesInfos.length - 1].type !== Types.Supplier) {
    nodesInfos.push({
      key: VirtualNode,
    });
  }
  const nodes = createNodes(nodesInfos);
  // 组装流程关系
  const edges = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    const from = nodes[i];
    const to = nodes[i + 1];
    edges.push({
      key: `${from.key}`,
      from: from.key,
      value: from.edgeValue,
      index: nodes[i].index,
      to: nodes[i + 1].key,
    });
  }
  return { nodes, edges };
}
