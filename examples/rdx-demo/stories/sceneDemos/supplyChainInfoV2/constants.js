export const VirtualNode = '我是一个虚拟的节点~~~~'
export const VirtualBusinessWarehouse = '我是一个虚拟的经营仓~~~~'

export const Types = {
  BusinessStore: 'businessStore',
  BusinessWarehouse: 'businessWarehouse',
  Warehouse: 'warehouse',
  Supplier: 'supplier',
};
export const styleMap = {
  [Types.BusinessStore]: {
    label: '经营店',
    shortLabel: '店',
    key: 'supplierNo',
    backgroundColor: '#977FF5',
    required: true,
  },
  [Types.BusinessWarehouse]: {
    label: '经营仓',
    shortLabel: '仓',
    key: 'managementWarehouse',
    backgroundColor: '#45CDE6',
    required: true,
  },
  [Types.Warehouse]: {
    label: '大仓',
    shortLabel: '仓',
    key: 'logistics',
    backgroundColor: '#45CDE6',
    deliveryInfo: 'distributeInfo',
    required: true,
  },
  [Types.Supplier]: {
    label: '配送供应商',
    shortLabel: '供',
    key: 'supplierNo',
    backgroundColor: '#977FF5',
    deliveryInfo: 'purchaseInfo',
    required: true,
  },
};
export const DeliverType  = {
  Direct : '1',
  Allocation : '2',
  UnifiedAllocation: '3',
  Cross: '4',
}
export const deliverDataSource = [
  { label: "直配", value: DeliverType.Direct},
  { label: "调拨", value: DeliverType.Allocation},
  { label: "统配", value: DeliverType.UnifiedAllocation},
  { label: "越库", value: DeliverType.Cross},
]


export const NodeType = {
  Edge :'Edge',
  Node : 'Node',
}