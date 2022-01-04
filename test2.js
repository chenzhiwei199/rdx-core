const a = [
  {
    "id": 1004,
    "json": [
      {
        "i": "0",
        "tileSize": "1*1",
        "extraCharts": [],
        "chart": {
          "id": "1",
          "entityType": "cube",
          "entityCode": "store_id",
          "sceneCode": "o2o",
          "props_schema": [],
          "wheres": [
            {
              "isVisible": false,
              "label": "门店",
              "op": "=",
              "type": "input",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1",
                "3",
                "2"
              ],
              "value": "store_id",
              "defaultValue": {
                "dynamicValue": "custom",
                "custom": "8007"
              },
              "chartId": "1"
            },
            {
              "isVisible": false,
              "label": "时间片",
              "op": "=",
              "type": "input",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1",
                "3",
                "2"
              ],
              "value": "timeSlice",
              "defaultValue": {
                "dynamicValue": "custom",
                "custom": "00:00:00~23:59:59"
              },
              "chartId": "1"
            },
            {
              "isVisible": false,
              "label": "时间",
              "op": "=",
              "type": "input",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": "date",
              "defaultValue": {
                "dynamicValue": "T"
              },
              "chartId": "1"
            }
          ],
          "type": "lately",
          "dataWindow": "day",
          "externalFormData": {
            "refreshType": "refreshByTime",
            "refreshTime": 180,
            "alerts": [
              {
                "column": "stockout_order_count",
                "op": ">",
                "dynamicValue": "fixed",
                "fixed": 0,
                "index": 0
              }
            ]
          }
        },
        "moved": false,
        "static": false
      }
    ]
  },
  {
    "id": 1113,
    "json": [
      {
        "i": "1",
        "tileSize": "1*1",
        "extraCharts": [],
        "chart": {
          "id": "1",
          "entityType": "metrics",
          "appCode": "wdk_ums_metrics",
          "props_schema": [],
          "wheres": [
            {
              "isVisible": true,
              "label": "开始时间：",
              "op": ">",
              "type": "date",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": "gmtCreateStart",
              "format": "YYYY-MM-DD",
              "defaultValue": {
                "dynamicValue": "customTime",
                "customTime": {
                  "status": "before",
                  "type": "D",
                  "value": 0
                }
              },
              "chartId": "1"
            },
            {
              "isVisible": true,
              "label": "结束时间",
              "op": "<=",
              "type": "date",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": "gmtModifiedEnd",
              "format": "YYYY-MM-DD",
              "defaultValue": {
                "dynamicValue": "customTime",
                "customTime": {
                  "status": "before",
                  "type": "D",
                  "value": 0
                }
              },
              "chartId": "1"
            },
            {
              "isVisible": true,
              "label": "销售单号：",
              "op": "=",
              "type": "input",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": "code",
              "chartId": "1",
              "request": []
            },
            {
              "isVisible": true,
              "label": "履约单号：",
              "op": "=",
              "type": "input",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": "fulfilOrderId",
              "chartId": "1"
            },
            {
              "isVisible": true,
              "label": "批次：",
              "op": "=",
              "type": "input",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": "outBatchCode",
              "chartId": "1"
            },
            {
              "isVisible": true,
              "label": " 波次：",
              "op": "=",
              "type": "input",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": "waveCode",
              "chartId": "1"
            },
            {
              "isVisible": true,
              "label": "部门：",
              "op": "=",
              "type": "asyncSelect",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": "deptCode",
              "chartId": "1",
              "request": [
                {
                  "url": "https://ums.hemaos.com/base/departmentManager/queryAllForSelect.json",
                  "label": "value",
                  "value": "code",
                  "requestFormat": "return data.info"
                }
              ],
              "defaultValue": {
                "dynamicValue": "none"
              }
            },
            {
              "isVisible": true,
              "label": "是否缺货占用:",
              "op": "=",
              "type": "select",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": "occupyStockoutStatus",
              "required": false,
              "defaultValue": {
                "dynamicValue": "params",
                "params": "occupyStockoutStatus"
              },
              "enum": [
                {
                  "label": "是",
                  "id": "1"
                },
                {
                  "label": "否",
                  "id": "0"
                }
              ],
              "chartId": "1"
            },
            {
              "isVisible": true,
              "label": "是否拣货缺货：",
              "op": "=",
              "type": "select",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": "pickStockoutStatus",
              "required": false,
              "defaultValue": {
                "dynamicValue": "params",
                "params": "pickStockoutStatus"
              },
              "enum": [
                {
                  "label": "是",
                  "id": "1"
                },
                {
                  "label": "否",
                  "id": "0"
                }
              ],
              "chartId": "1"
            },
            {
              "isVisible": false,
              "label": "仓",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "input",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": [
                "sys_warehouseId"
              ],
              "defaultValue": {
                "dynamicValue": "hemaos_login_info",
                "hemaos_login_info": "currentWarehouseId"
              },
              "chartId": "1"
            }
          ],
          "type": "lately",
          "dataWindow": "day",
          "code": "wdk_ums_metrics;saleDiffReport.query",
          "metricCode": "wdk_ums_metrics;saleDiffReport.query",
          "label": "销售差异查询",
          "tabTitle": "",
          "externalFormData": {
            "isShowTotalCount": true,
            "pageSize": 50,
            "sorts": []
          },
          "isChartTitleShow": false,
          "title": "titletest",
          "sceneCode": "",
          "entityCode": "",
          "moduleConfig": {}
        },
        "moved": false,
        "static": false
      }
    ]
  },
  {
    "id": 1320,
    "json": [
      {
        "i": "1",
        "tileSize": "1*1",
        "extraCharts": [],
        "chart": {
          "id": "1",
          "entityType": "metrics",
          "doubleAxisTypes": [
            "line",
            "line"
          ],
          "appCode": "wdk_ums_metrics",
          "metricCode": "wdk_ums_metrics;findGoodsTaskReport.query",
          "label": "找货任务报表",
          "props_schema": [],
          "wheres": [
            {
              "isVisible": true,
              "label": "创建时间",
              "op": "=",
              "format": "YYYY-MM-DD",
              "type": "rangeDate",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": [
                "gmtCreateStart",
                "gmtCreateEnd"
              ],
              "chartId": "1"
            },
            {
              "isVisible": true,
              "label": "找货单状态",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "select",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": "taskStatus",
              "defaultValue": {
                "dynamicValue": "none"
              },
              "chartId": "1",
              "enum": [
                {
                  "valueType": "dynamicValue",
                  "label": "待找货",
                  "id": "1"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "找货中",
                  "id": "2"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "找货完成",
                  "id": "3"
                }
              ],
              "request": []
            },
            {
              "isVisible": true,
              "label": "商品编码",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "input",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": "itemCodes",
              "chartId": "1",
              "defaultValue": {
                "placeholder": "最多50个编码,用空格分隔"
              }
            },
            {
              "isVisible": false,
              "label": "仓Id",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "input",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": "warehouseId",
              "chartId": "1",
              "defaultValue": {
                "dynamicValue": "wms_login_info",
                "wms_login_info": "warehouseId"
              }
            },
            {
              "isVisible": true,
              "label": "找货人",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "asyncSelect",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": "responsibleId",
              "chartId": "1",
              "request": [
                {
                  "url": "https://ums.hemaos.com/base/userManager/queryByKeyword.json",
                  "label": "userName",
                  "value": "id",
                  "requestFormat": "return data",
                  "params": [
                    {
                      "dynamicValue": "asyncInputValue",
                      "key": "keyword"
                    }
                  ]
                }
              ]
            },
            {
              "isVisible": true,
              "label": "拣货人",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "asyncSelect",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": "createdBy",
              "chartId": "1",
              "request": [
                {
                  "url": "https://ums.hemaos.com/base/userManager/queryByKeyword.json",
                  "label": "userName",
                  "value": "id",
                  "requestFormat": "return data",
                  "params": [
                    {
                      "dynamicValue": "asyncInputValue",
                      "key": "keyword"
                    }
                  ]
                }
              ]
            }
          ],
          "type": "lately",
          "dataWindow": "day",
          "code": "wdk_ums_metrics;findGoodsTaskReport.query",
          "externalFormData": {
            "isShowTotalCount": true,
            "pageSize": 10
          }
        },
        "moved": false,
        "static": false
      }
    ]
  },
  {
    "id": 1344,
    "json": [
      {
        "i": "1",
        "tileSize": "1*1",
        "extraCharts": [],
        "chart": {
          "id": "1",
          "entityType": "metrics",
          "doubleAxisTypes": [
            "line",
            "line"
          ],
          "appCode": "wdk_ums_metrics",
          "metricCode": "wdk_ums_metrics;queryRecheckDetail.query",
          "label": "打包复核查询",
          "props_schema": [],
          "wheres": [
            {
              "isVisible": true,
              "label": "开始时间",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "dateTime",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": "startDate",
              "chartId": "1",
              "defaultValue": {
                "dynamicValue": "T"
              }
            },
            {
              "isVisible": true,
              "label": "结束时间",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "dateTime",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": "endDate",
              "chartId": "1",
              "defaultValue": {
                "dynamicValue": "T",
                "customTime": {
                  "status": "after",
                  "type": "H"
                }
              }
            },
            {
              "isVisible": true,
              "label": "批次号",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "input",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": "batchCode",
              "chartId": "1"
            },
            {
              "isVisible": true,
              "label": "拣货容器号",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "input",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": "containerCode",
              "chartId": "1"
            },
            {
              "isVisible": true,
              "label": "商品编码",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "input",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": "targetDetailCode",
              "chartId": "1"
            }
          ],
          "type": "lately",
          "dataWindow": "day",
          "code": "wdk_ums_metrics;queryRecheckDetail.query",
          "externalFormData": {
            "isFullScreen": true,
            "isRefresh": true,
            "isShowTotalCount": true,
            "pageSize": 10,
            "hidden": false
          },
          "isChartTitleShow": false,
          "moduleConfig": {
            "isChartTitleCenter": false
          },
          "title": "titletest",
          "sceneCode": "",
          "entityCode": "",
          "chartTitleType": "custom"
        },
        "moved": false,
        "static": false,
        "isChartGroup": false
      }
    ]
  },
  {
    "id": 1767,
    "json": [
      {
        "i": "0",
        "tileSize": "1*1",
        "extraCharts": [],
        "chart": {
          "id": "2",
          "entityType": "metrics",
          "doubleAxisTypes": [
            "line",
            "line"
          ],
          "appCode": "wdk_ums_metrics",
          "metricCode": "wdk_ums_metrics;queryPackTaskDetail.query",
          "label": "查询打包任务明细",
          "props_schema": [],
          "wheres": [
            {
              "isVisible": true,
              "label": "编码",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "input",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "2"
              ],
              "value": "code",
              "defaultValue": {
                "placeholder": "请输入编码",
                "dynamicValue": "params",
                "params": "code"
              },
              "chartId": "2",
              "chartName": "查询打包任务明细",
              "subDefault": {
                "defaultValue": {
                  "dynamicValue": "none",
                  "params": "code"
                }
              }
            },
            {
              "isVisible": true,
              "label": "商品编码",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "input",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "2"
              ],
              "value": "itemCode",
              "defaultValue": {
                "placeholder": "请输入商品编码"
              },
              "chartId": "2",
              "chartName": "查询打包任务明细"
            },
            {
              "isVisible": true,
              "label": "商品名称",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "input",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "2"
              ],
              "value": "itemName",
              "defaultValue": {
                "placeholder": "请输入商品名称",
                "dynamicValue": "none"
              },
              "chartId": "2",
              "chartName": "查询打包任务明细"
            },
            {
              "isVisible": true,
              "label": "批次号",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "input",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "2"
              ],
              "value": "batchCode",
              "defaultValue": {
                "placeholder": "请输入批次号"
              },
              "chartId": "2",
              "chartName": "查询打包任务明细"
            },
            {
              "isVisible": true,
              "label": "波次号",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "input",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "2"
              ],
              "value": "waveCode",
              "defaultValue": {
                "placeholder": "请输入波次号"
              },
              "chartId": "2",
              "chartName": "查询打包任务明细"
            },
            {
              "isVisible": true,
              "label": "操作人名称",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "input",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "2"
              ],
              "value": "operatorName",
              "defaultValue": {
                "placeholder": "请输入操作人名称"
              },
              "chartId": "2",
              "chartName": "查询打包任务明细"
            },
            {
              "isVisible": true,
              "label": "配送站",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "input",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "2"
              ],
              "value": "deliveryName",
              "defaultValue": {
                "placeholder": "请输入配送站",
                "dynamicValue": "none"
              },
              "chartId": "2",
              "chartName": "查询打包任务明细"
            },
            {
              "isVisible": true,
              "label": "包裹号",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "input",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "2"
              ],
              "value": "flowCode",
              "defaultValue": {
                "placeholder": "请输入包裹号"
              },
              "chartId": "2",
              "chartName": "查询打包任务明细"
            },
            {
              "isVisible": true,
              "label": "拣货容器号",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "input",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "2"
              ],
              "value": "containerCode",
              "defaultValue": {
                "placeholder": "请输入拣货容器号"
              },
              "chartId": "2",
              "chartName": "查询打包任务明细"
            },
            {
              "isVisible": true,
              "label": "出库单号",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "input",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "2"
              ],
              "value": "outboundOrderCode",
              "defaultValue": {
                "placeholder": "请输入出库单号"
              },
              "chartId": "2",
              "chartName": "查询打包任务明细"
            },
            {
              "isVisible": true,
              "label": "任务状态",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "select",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "2"
              ],
              "value": "status",
              "defaultValue": {
                "placeholder": "请选择打包任务状态",
                "dynamicValue": "none"
              },
              "enum": [
                {
                  "valueType": "dynamicValue",
                  "label": "创建",
                  "id": "10"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "准备完成",
                  "id": "20"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "进行中",
                  "id": "30"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "完成",
                  "id": "40"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "挂起",
                  "id": "50"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "取消",
                  "id": "999"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "其他"
                }
              ],
              "chartId": "2",
              "chartName": "查询打包任务明细"
            },
            {
              "isVisible": true,
              "label": "开始时间",
              "op": "=",
              "format": null,
              "type": "rangeDate",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "2"
              ],
              "value": [
                "startTime",
                "endTime"
              ],
              "defaultValue": {
                "placeholder": "请选择开始时间",
                "dynamicValue": "none"
              },
              "chartId": "2",
              "chartName": "查询打包任务明细",
              "chartExtraConfig": {
                "disableDateConfig": {
                  "type": "none",
                  "start": "startTime",
                  "end": "endTime"
                },
                "width": "230",
                "hasClear": false
              }
            },
            {
              "isVisible": true,
              "label": "创建时间",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "rangeDate",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "2"
              ],
              "value": [
                "startDate",
                "endDate"
              ],
              "defaultValueEnd": {
                "placeholder": "请选择结束创建时间",
                "dynamicValue": "none"
              },
              "defaultValue": {
                "placeholder": "请选择开始创建时间",
                "dynamicValue": "none"
              },
              "chartId": "2",
              "chartName": "查询打包任务明细"
            }
          ],
          "type": "lately",
          "dataWindow": "day",
          "code": "wdk_ums_metrics;queryPackTaskDetail.query",
          "isChartTitleShow": true,
          "title": "titletest",
          "sceneCode": "",
          "entityCode": "",
          "chartTitle": "查询打包任务明细",
          "moduleConfig": {},
          "description": "选择筛选条件",
          "externalFormData": {
            "filterDisplayType": false,
            "isFullScreen": true,
            "isRefresh": true,
            "isShowTotalCount": true,
            "actions": []
          },
          "chartTitleType": "custom",
          "isWhereManual": false,
          "whereCompact": true
        },
        "moved": false,
        "static": false
      }
    ]
  },
  {
    "id": 1770,
    "json": [
      {
        "i": "1",
        "tileSize": "1*1",
        "extraCharts": [],
        "chart": {
          "id": "1",
          "entityType": "metrics",
          "doubleAxisTypes": [
            "line",
            "line"
          ],
          "appCode": "wdk_ums_metrics",
          "metricCode": "wdk_ums_metrics;queryPackTask.query",
          "label": "查询打包任务",
          "props_schema": [],
          "wheres": [
            {
              "isVisible": true,
              "label": "货主",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "asyncSelect",
              "relationCharts": [],
              "required": false,
              "remember": false,
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": [
                "cargoOwnerCode"
              ],
              "request": [
                {
                  "requestFormat": "return data.info",
                  "label": "name",
                  "value": "code",
                  "url": "https://ums.hemaos.com/base/cargoOwnerManager/queryCargoOwnerList.json",
                  "params": [
                    {
                      "dynamicValue": "asyncInputValue",
                      "key": "searchKey"
                    }
                  ]
                }
              ],
              "chartId": "1",
              "chartName": "查询打包任务"
            },
            {
              "isVisible": true,
              "label": "编码",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "input",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": "code",
              "defaultValue": {
                "placeholder": "请输入编码",
                "dynamicValue": "none",
                "params": "code"
              },
              "chartId": "1",
              "chartName": "查询打包任务",
              "subDefault": {
                "defaultValue": {
                  "dynamicValue": "none",
                  "params": "code"
                }
              }
            },
            {
              "isVisible": true,
              "label": "操作人名称",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "input",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": "operatorName",
              "defaultValue": {
                "placeholder": "请输入操作人名称"
              },
              "chartId": "1",
              "chartName": "查询打包任务"
            },
            {
              "isVisible": true,
              "label": "波次号",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "input",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": "waveCode",
              "defaultValue": {
                "placeholder": "请输入波次号"
              },
              "chartId": "1",
              "chartName": "查询打包任务"
            },
            {
              "isVisible": true,
              "label": "批次号",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "input",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": "batchCode",
              "defaultValue": {
                "placeholder": "请输入批次号"
              },
              "chartId": "1",
              "chartName": "查询打包任务"
            },
            {
              "isVisible": true,
              "label": "配送站",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "input",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": "deliveryName",
              "defaultValue": {
                "placeholder": "请输入配送站"
              },
              "chartId": "1",
              "chartName": "查询打包任务"
            },
            {
              "isVisible": true,
              "label": "任务状态",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "select",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": "status",
              "enum": [
                {
                  "valueType": "dynamicValue",
                  "label": "创建",
                  "id": "10"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "准备完成",
                  "id": "20"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "进行中",
                  "id": "30"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "完成",
                  "id": "40"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "挂起",
                  "id": "50"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "取消",
                  "id": "999"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "其他"
                }
              ],
              "defaultValue": {
                "placeholder": "请选择打包任务状态",
                "dynamicValue": "none"
              },
              "chartId": "1",
              "chartName": "查询打包任务"
            },
            {
              "isVisible": true,
              "label": "创建时间",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "rangeDate",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": [
                "startDate",
                "endDate"
              ],
              "defaultValue": {
                "placeholder": "请选择开始时间",
                "dynamicValue": "T"
              },
              "chartId": "1",
              "chartName": "查询打包任务",
              "defaultValueEnd": {
                "placeholder": "请选择结束时间",
                "dynamicValue": "T+1"
              },
              "chartExtraConfig": {
                "disableDateConfig": {
                  "type": "none"
                },
                "width": "230",
                "hasClear": false
              },
              "required": true
            }
          ],
          "type": "lately",
          "dataWindow": "day",
          "code": "wdk_ums_metrics;queryPackTask.query",
          "isChartTitleShow": true,
          "title": "titletest",
          "sceneCode": "",
          "entityCode": "",
          "chartTitle": "查询打包任务",
          "moduleConfig": {},
          "description": "选择筛选条件",
          "externalFormData": {
            "isFullScreen": true,
            "isRefresh": true,
            "isShowTotalCount": true
          }
        },
        "moved": false,
        "static": false
      }
    ]
  },
  {
    "id": 1852,
    "json": [
      {
        "i": "1",
        "tileSize": "1*1",
        "extraCharts": [],
        "chart": {
          "id": "1",
          "entityType": "metrics",
          "doubleAxisTypes": [
            "line",
            "line"
          ],
          "appCode": "wdk_ums_metrics",
          "metricCode": "wdk_ums_metrics;waveDetail.query",
          "label": "波次详情页面",
          "props_schema": [],
          "wheres": [
            {
              "isVisible": true,
              "label": "波次号",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "input",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": [
                "waveCode"
              ],
              "chartId": "1"
            },
            {
              "isVisible": true,
              "label": "波次开始时间",
              "op": "=",
              "format": "YYYY-MM-DD",
              "type": "date",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": [
                "beginCreated"
              ],
              "chartId": "1",
              "required": true
            },
            {
              "isVisible": true,
              "label": "波次结束时间",
              "op": "=",
              "format": "YYYY-MM-DD",
              "type": "date",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": [
                "endCreated"
              ],
              "chartId": "1",
              "required": true,
              "subDefault": {
                "defaultValue": {
                  "dynamicValue": "T"
                }
              }
            },
            {
              "isVisible": false,
              "label": "仓",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "input",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": [
                "sys_warehouseId"
              ],
              "defaultValue": {
                "dynamicValue": "hemaos_login_info",
                "hemaos_login_info": "currentWarehouseId"
              },
              "chartId": "1"
            }
          ],
          "type": "lately",
          "dataWindow": "day",
          "code": "wdk_ums_metrics;waveDetail.query",
          "whereCompact": false,
          "isWhereManual": true,
          "isChartTitleShow": true,
          "title": "titletest",
          "sceneCode": "",
          "entityCode": "",
          "moduleConfig": {
            "isChartTitleCenter": false
          },
          "externalFormData": {
            "isShowTotalCount": true,
            "hidden": false
          }
        },
        "moved": false,
        "static": false
      }
    ]
  },
  {
    "id": 1852,
    "json": [
      {
        "i": "1",
        "tileSize": "1*1",
        "extraCharts": [],
        "chart": {
          "id": "1",
          "entityType": "metrics",
          "doubleAxisTypes": [
            "line",
            "line"
          ],
          "appCode": "wdk_ums_metrics",
          "metricCode": "wdk_ums_metrics;waveDetail.query",
          "label": "波次详情页面",
          "props_schema": [],
          "wheres": [
            {
              "isVisible": true,
              "label": "波次号",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "input",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": [
                "waveCode"
              ],
              "chartId": "1"
            },
            {
              "isVisible": true,
              "label": "波次开始时间",
              "op": "=",
              "format": "YYYY-MM-DD",
              "type": "date",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": [
                "beginCreated"
              ],
              "chartId": "1",
              "required": true
            },
            {
              "isVisible": true,
              "label": "波次结束时间",
              "op": "=",
              "format": "YYYY-MM-DD",
              "type": "date",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": [
                "endCreated"
              ],
              "chartId": "1",
              "required": true,
              "subDefault": {
                "defaultValue": {
                  "dynamicValue": "T"
                }
              }
            },
            {
              "isVisible": false,
              "label": "仓",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "input",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": [
                "sys_warehouseId"
              ],
              "defaultValue": {
                "dynamicValue": "hemaos_login_info",
                "hemaos_login_info": "currentWarehouseId"
              },
              "chartId": "1"
            }
          ],
          "type": "lately",
          "dataWindow": "day",
          "code": "wdk_ums_metrics;waveDetail.query",
          "whereCompact": false,
          "isWhereManual": true,
          "isChartTitleShow": true,
          "title": "titletest",
          "sceneCode": "",
          "entityCode": "",
          "moduleConfig": {
            "isChartTitleCenter": false
          },
          "externalFormData": {
            "isShowTotalCount": true,
            "hidden": false
          }
        },
        "moved": false,
        "static": false
      }
    ]
  },
  {
    "id": 1852,
    "json": [
      {
        "i": "1",
        "tileSize": "1*1",
        "extraCharts": [],
        "chart": {
          "id": "1",
          "entityType": "metrics",
          "doubleAxisTypes": [
            "line",
            "line"
          ],
          "appCode": "wdk_ums_metrics",
          "metricCode": "wdk_ums_metrics;waveDetail.query",
          "label": "波次详情页面",
          "props_schema": [],
          "wheres": [
            {
              "isVisible": true,
              "label": "波次号",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "input",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": [
                "waveCode"
              ],
              "chartId": "1"
            },
            {
              "isVisible": true,
              "label": "波次开始时间",
              "op": "=",
              "format": "YYYY-MM-DD",
              "type": "date",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": [
                "beginCreated"
              ],
              "chartId": "1",
              "required": true
            },
            {
              "isVisible": true,
              "label": "波次结束时间",
              "op": "=",
              "format": "YYYY-MM-DD",
              "type": "date",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": [
                "endCreated"
              ],
              "chartId": "1",
              "required": true,
              "subDefault": {
                "defaultValue": {
                  "dynamicValue": "T"
                }
              }
            },
            {
              "isVisible": false,
              "label": "仓",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "input",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": [
                "sys_warehouseId"
              ],
              "defaultValue": {
                "dynamicValue": "hemaos_login_info",
                "hemaos_login_info": "currentWarehouseId"
              },
              "chartId": "1"
            }
          ],
          "type": "lately",
          "dataWindow": "day",
          "code": "wdk_ums_metrics;waveDetail.query",
          "whereCompact": false,
          "isWhereManual": true,
          "isChartTitleShow": true,
          "title": "titletest",
          "sceneCode": "",
          "entityCode": "",
          "moduleConfig": {
            "isChartTitleCenter": false
          },
          "externalFormData": {
            "isShowTotalCount": true,
            "hidden": false
          }
        },
        "moved": false,
        "static": false
      }
    ]
  },
  {
    "id": 1905,
    "json": [
      {
        "i": "1",
        "tileSize": "1*1",
        "extraCharts": [],
        "chart": {
          "id": "1",
          "entityType": "metrics",
          "doubleAxisTypes": [
            "line",
            "line"
          ],
          "appCode": "wdk_ums_metrics",
          "metricCode": "wdk_ums_metrics;pickingContainerDetail.query",
          "label": "pickingContainerDetail",
          "props_schema": [],
          "wheres": [
            {
              "isVisible": false,
              "label": "luCode",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "input",
              "relationCharts": [],
              "required": false,
              "remember": false,
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": [
                "luCode"
              ],
              "chartId": "1",
              "defaultValue": {
                "dynamicValue": "params",
                "params": "luCode"
              }
            }
          ],
          "type": "lately",
          "dataWindow": "day",
          "code": "wdk_ums_metrics;pickingContainerDetail.query",
          "externalFormData": {
            "isRefresh": false
          }
        },
        "moved": false,
        "static": false
      }
    ]
  },
  {
    "id": 1905,
    "json": [
      {
        "i": "1",
        "tileSize": "1*1",
        "extraCharts": [],
        "chart": {
          "id": "1",
          "entityType": "metrics",
          "doubleAxisTypes": [
            "line",
            "line"
          ],
          "appCode": "wdk_ums_metrics",
          "metricCode": "wdk_ums_metrics;pickingContainerDetail.query",
          "label": "pickingContainerDetail",
          "props_schema": [],
          "wheres": [
            {
              "isVisible": false,
              "label": "luCode",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "input",
              "relationCharts": [],
              "required": false,
              "remember": false,
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": [
                "luCode"
              ],
              "chartId": "1",
              "defaultValue": {
                "dynamicValue": "params",
                "params": "luCode"
              }
            }
          ],
          "type": "lately",
          "dataWindow": "day",
          "code": "wdk_ums_metrics;pickingContainerDetail.query",
          "externalFormData": {
            "isRefresh": false
          }
        },
        "moved": false,
        "static": false
      }
    ]
  },
  {
    "id": 1905,
    "json": [
      {
        "i": "1",
        "tileSize": "1*1",
        "extraCharts": [],
        "chart": {
          "id": "1",
          "entityType": "metrics",
          "doubleAxisTypes": [
            "line",
            "line"
          ],
          "appCode": "wdk_ums_metrics",
          "metricCode": "wdk_ums_metrics;pickingContainerDetail.query",
          "label": "pickingContainerDetail",
          "props_schema": [],
          "wheres": [
            {
              "isVisible": false,
              "label": "luCode",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "input",
              "relationCharts": [],
              "required": false,
              "remember": false,
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": [
                "luCode"
              ],
              "chartId": "1",
              "defaultValue": {
                "dynamicValue": "params",
                "params": "luCode"
              }
            }
          ],
          "type": "lately",
          "dataWindow": "day",
          "code": "wdk_ums_metrics;pickingContainerDetail.query",
          "externalFormData": {
            "isRefresh": false
          }
        },
        "moved": false,
        "static": false
      }
    ]
  },
  {
    "id": 2005,
    "json": [
      {
        "i": "0",
        "tileSize": "1*1",
        "extraCharts": [],
        "chart": {
          "id": "1",
          "entityType": "metrics",
          "doubleAxisTypes": [
            "line",
            "line"
          ],
          "appCode": "wdk_ums_metrics",
          "tenant": "WDK_METRICS",
          "label": "盒马在线数据中台;wdk_ums_metrics;querySortTaskNumByModeAndTool.query",
          "metricCode": "wdk_ums_metrics;querySortTaskNumByModeAndTool.query;WDK_METRICS",
          "props_schema": [],
          "wheres": [
            {
              "isVisible": true,
              "label": "仓",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "input",
              "isMergeFilter": false,
              "value": [
                "warehouseId"
              ],
              "chartId": "1",
              "chartName": "任务数量统计"
            },
            {
              "isVisible": true,
              "label": "仓类型",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "select",
              "isMergeFilter": false,
              "value": [
                "warehouseType"
              ],
              "defaultValue": {
                "dynamicValue": "default"
              },
              "enum": [
                {
                  "valueType": "dynamicValue",
                  "label": "正式仓",
                  "id": "1"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "测试仓",
                  "id": "2"
                }
              ]
            },
            {
              "isVisible": true,
              "label": "时间",
              "op": "=",
              "format": "YYYY-MM-DD",
              "type": "rangeDate",
              "isMergeFilter": false,
              "value": [
                "startTime",
                "endTime"
              ],
              "defaultValueEnd": {
                "dynamicValue": "T+1",
                "customTime": {
                  "type": "D",
                  "value": "1",
                  "status": "before"
                }
              },
              "required": true,
              "defaultValue": {
                "dynamicValue": "customTime",
                "customTime": {
                  "status": "before",
                  "type": "M",
                  "value": 1
                }
              }
            },
            {
              "isVisible": true,
              "label": "分货模式",
              "op": "in",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "select",
              "isMergeFilter": false,
              "value": [
                "sortModes"
              ],
              "request": [
                {
                  "requestFormat": "return data.data.listSortModeEnum.data",
                  "label": "value",
                  "value": "key",
                  "url": "https://ark.hemaos.com/graphql?domain=warehousing&api=listSortModeEnum"
                }
              ],
              "defaultValue": {
                "dynamicValue": "none"
              },
              "chartId": "1",
              "chartName": "任务数量统计"
            },
            {
              "isVisible": true,
              "label": "分货工具",
              "op": "in",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "select",
              "isMergeFilter": false,
              "value": [
                "sortTools"
              ],
              "request": [
                {
                  "requestFormat": "return data.data.listSortToolEnum.data",
                  "label": "value",
                  "value": "key",
                  "url": "https://ark.hemaos.com/graphql?domain=warehousing&api=listSortToolEnum"
                }
              ],
              "defaultValue": {
                "dynamicValue": "none"
              },
              "chartId": "1",
              "chartName": "任务数量统计"
            }
          ],
          "type": "lately",
          "dataWindow": "day",
          "code": "wdk_ums_metrics;querySortTaskNumByModeAndTool.query;WDK_METRICS",
          "externalFormData": {
            "filterDisplayType": false,
            "isWatermark": false,
            "isFullScreen": true,
            "isRefresh": false,
            "isShowTotalCount": true,
            "refreshType": "false",
            "hidden": false,
            "autoRefreshVisible": false,
            "sorts": [
              {
                "column": "实分数量",
                "desc": true
              },
              {
                "column": "任务数量",
                "desc": true
              },
              {
                "column": "仓id",
                "desc": false
              }
            ]
          },
          "isWhereManual": true,
          "whereCompact": true,
          "isChartTitleShow": true,
          "title": "titletest",
          "sceneCode": "",
          "entityCode": "",
          "chartTitle": "分货数量统计",
          "moduleConfig": {}
        },
        "moved": false,
        "static": false,
        "isChartGroup": false
      },
      {
        "i": "2",
        "tileSize": "1*1",
        "extraCharts": [],
        "chart": {
          "id": "2",
          "entityType": "metrics",
          "doubleAxisTypes": [
            "stack",
            "line"
          ],
          "appCode": "wdk_ums_metrics",
          "tenant": "WDK_METRICS",
          "label": "盒马在线数据中台;wdk_ums_metrics;querySortTaskNumByMode.query",
          "metricCode": "wdk_ums_metrics;querySortTaskNumByMode.query;WDK_METRICS",
          "props_schema": [],
          "wheres": [
            {
              "isVisible": true,
              "label": "时间",
              "op": "=",
              "format": "YYYY-MM-DD",
              "type": "rangeDate",
              "isMergeFilter": false,
              "value": [
                "startTime",
                "endTime"
              ],
              "defaultValueEnd": {
                "dynamicValue": "T+1",
                "customTime": {
                  "type": "D",
                  "value": "1",
                  "status": "before"
                }
              },
              "required": true,
              "defaultValue": {
                "dynamicValue": "T-7"
              }
            }
          ],
          "type": "lately",
          "dataWindow": "day",
          "code": "wdk_ums_metrics;querySortTaskNumByMode.query;WDK_METRICS",
          "externalFormData": {
            "isRefresh": true,
            "isShowTotalCount": false,
            "refreshType": "false",
            "sorts": [
              {
                "column": "实分数量",
                "desc": true
              }
            ]
          },
          "isChartTitleShow": true,
          "chartTitle": "典型仓",
          "moduleConfig": {},
          "title": "titletest",
          "sceneCode": "",
          "entityCode": ""
        },
        "moved": false,
        "static": false
      },
      {
        "i": "3",
        "tileSize": "1*1",
        "extraCharts": [],
        "chart": {
          "id": "3",
          "entityType": "metrics",
          "doubleAxisTypes": [
            "line",
            "line"
          ],
          "appCode": "wdk_ums_metrics",
          "tenant": "WDK_METRICS",
          "label": "盒马在线数据中台;wdk_ums_metrics;sortEfficiency.query",
          "metricCode": "wdk_ums_metrics;sortEfficiency.query;WDK_METRICS",
          "props_schema": [],
          "wheres": [
            {
              "isVisible": true,
              "label": "仓",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "select",
              "isMergeFilter": false,
              "value": [
                "warehouseId"
              ],
              "enum": [
                {
                  "valueType": "dynamicValue",
                  "label": "上海生鲜加工中心",
                  "id": "23"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "上海水产暂养中心",
                  "id": "278"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "上海冷链仓",
                  "id": "311"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "上海常温仓",
                  "id": "556"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "逸刻江桥冷藏仓",
                  "id": "20760110"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "北京生鲜加工中心",
                  "id": "1405"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "上海生鲜分仓",
                  "id": "9300002"
                }
              ],
              "defaultValue": {
                "dynamicValue": "default"
              },
              "chartId": "3",
              "required": true
            },
            {
              "isVisible": true,
              "label": "时间",
              "op": "=",
              "format": "YYYY-MM-DD",
              "type": "rangeDate",
              "isMergeFilter": false,
              "value": [
                "startTime",
                "endTime"
              ],
              "defaultValueEnd": {
                "dynamicValue": "T",
                "customTime": {
                  "type": "D",
                  "value": "1",
                  "status": "before"
                }
              },
              "required": true,
              "defaultValue": {
                "dynamicValue": "customTime",
                "customTime": {
                  "status": "before",
                  "type": "W",
                  "value": 4
                }
              }
            }
          ],
          "type": "lately",
          "dataWindow": "day",
          "code": "wdk_ums_metrics;sortEfficiency.query;WDK_METRICS",
          "externalFormData": {
            "isRefresh": false,
            "sorts": [
              {
                "column": "date",
                "desc": true
              }
            ]
          },
          "whereCompact": true,
          "isWhereManual": true,
          "isChartTitleShow": true,
          "title": "titletest",
          "sceneCode": "",
          "entityCode": "",
          "chartTitle": "分货平均人效",
          "moduleConfig": {}
        },
        "moved": false,
        "static": false
      },
      {
        "i": "4",
        "tileSize": "1*1",
        "extraCharts": [],
        "chart": {
          "id": "4",
          "entityType": "metrics",
          "doubleAxisTypes": [
            "interval",
            "line"
          ],
          "appCode": "wdk_ums_metrics",
          "tenant": "WDK_METRICS",
          "label": "盒马在线数据中台;wdk_ums_metrics;sortPersonEfficiency.query",
          "metricCode": "wdk_ums_metrics;sortPersonEfficiency.query;WDK_METRICS",
          "props_schema": [],
          "wheres": [
            {
              "isVisible": true,
              "label": "仓",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "select",
              "isMergeFilter": false,
              "value": [
                "warehouseId"
              ],
              "required": true,
              "enum": [
                {
                  "valueType": "dynamicValue",
                  "label": "上海生鲜加工中心",
                  "id": "23"
                }
              ]
            },
            {
              "isVisible": true,
              "label": "时间",
              "op": "=",
              "format": "YYYY-MM-DD",
              "type": "date",
              "isMergeFilter": false,
              "value": [
                "startTime"
              ],
              "required": true,
              "defaultValue": {
                "dynamicValue": "T-1"
              }
            }
          ],
          "type": "lately",
          "dataWindow": "day",
          "code": "wdk_ums_metrics;sortPersonEfficiency.query;WDK_METRICS",
          "isWhereManual": true,
          "externalFormData": {
            "pageSize": 10,
            "sorts": [
              {
                "column": "efficiency",
                "desc": true
              }
            ]
          },
          "isChartTitleShow": true,
          "chartTitle": "人效 top 10",
          "moduleConfig": {},
          "whereCompact": true
        },
        "moved": false,
        "static": false
      },
      {
        "i": "5",
        "tileSize": "1*1",
        "extraCharts": [],
        "chart": {
          "id": "5",
          "entityType": "metrics",
          "doubleAxisTypes": [
            "line",
            "line"
          ],
          "appCode": "wdk_ums_metrics",
          "tenant": "WDK_METRICS",
          "label": "盒马在线数据中台;wdk_ums_metrics;multiGenSortTaskRate.query",
          "metricCode": "wdk_ums_metrics;multiGenSortTaskRate.query;WDK_METRICS",
          "props_schema": [],
          "wheres": [
            {
              "isVisible": true,
              "label": "仓",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "select",
              "isMergeFilter": false,
              "value": [
                "warehouseId"
              ],
              "required": true,
              "enum": [
                {
                  "valueType": "dynamicValue",
                  "label": "北京生鲜加工中心",
                  "id": "1405"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "北京生鲜加工中心分仓",
                  "id": "20350054"
                }
              ],
              "defaultValue": {
                "dynamicValue": "default"
              }
            },
            {
              "isVisible": true,
              "label": "时间",
              "op": "=",
              "format": "YYYY-MM-DD",
              "type": "rangeDate",
              "isMergeFilter": false,
              "value": [
                "startTime",
                "endTime"
              ],
              "defaultValueEnd": {
                "dynamicValue": "T",
                "customTime": {
                  "type": "D",
                  "value": "1",
                  "status": "before"
                }
              },
              "defaultValue": {
                "dynamicValue": "T-7"
              },
              "required": true
            }
          ],
          "type": "lately",
          "dataWindow": "day",
          "code": "wdk_ums_metrics;multiGenSortTaskRate.query;WDK_METRICS",
          "externalFormData": {
            "sorts": [
              {
                "column": "date",
                "desc": false
              }
            ]
          },
          "whereCompact": true,
          "isChartTitleShow": true,
          "title": "titletest",
          "sceneCode": "",
          "entityCode": "",
          "chartTitle": "多次生成分货任务比例",
          "moduleConfig": {}
        },
        "moved": false,
        "static": false
      }
    ]
  },
  {
    "id": 2005,
    "json": [
      {
        "i": "0",
        "tileSize": "1*1",
        "extraCharts": [],
        "chart": {
          "id": "1",
          "entityType": "metrics",
          "doubleAxisTypes": [
            "line",
            "line"
          ],
          "appCode": "wdk_ums_metrics",
          "tenant": "WDK_METRICS",
          "label": "盒马在线数据中台;wdk_ums_metrics;querySortTaskNumByModeAndTool.query",
          "metricCode": "wdk_ums_metrics;querySortTaskNumByModeAndTool.query;WDK_METRICS",
          "props_schema": [],
          "wheres": [
            {
              "isVisible": true,
              "label": "仓",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "input",
              "isMergeFilter": false,
              "value": [
                "warehouseId"
              ],
              "chartId": "1",
              "chartName": "任务数量统计"
            },
            {
              "isVisible": true,
              "label": "仓类型",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "select",
              "isMergeFilter": false,
              "value": [
                "warehouseType"
              ],
              "defaultValue": {
                "dynamicValue": "default"
              },
              "enum": [
                {
                  "valueType": "dynamicValue",
                  "label": "正式仓",
                  "id": "1"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "测试仓",
                  "id": "2"
                }
              ]
            },
            {
              "isVisible": true,
              "label": "时间",
              "op": "=",
              "format": "YYYY-MM-DD",
              "type": "rangeDate",
              "isMergeFilter": false,
              "value": [
                "startTime",
                "endTime"
              ],
              "defaultValueEnd": {
                "dynamicValue": "T+1",
                "customTime": {
                  "type": "D",
                  "value": "1",
                  "status": "before"
                }
              },
              "required": true,
              "defaultValue": {
                "dynamicValue": "customTime",
                "customTime": {
                  "status": "before",
                  "type": "M",
                  "value": 1
                }
              }
            },
            {
              "isVisible": true,
              "label": "分货模式",
              "op": "in",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "select",
              "isMergeFilter": false,
              "value": [
                "sortModes"
              ],
              "request": [
                {
                  "requestFormat": "return data.data.listSortModeEnum.data",
                  "label": "value",
                  "value": "key",
                  "url": "https://ark.hemaos.com/graphql?domain=warehousing&api=listSortModeEnum"
                }
              ],
              "defaultValue": {
                "dynamicValue": "none"
              },
              "chartId": "1",
              "chartName": "任务数量统计"
            },
            {
              "isVisible": true,
              "label": "分货工具",
              "op": "in",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "select",
              "isMergeFilter": false,
              "value": [
                "sortTools"
              ],
              "request": [
                {
                  "requestFormat": "return data.data.listSortToolEnum.data",
                  "label": "value",
                  "value": "key",
                  "url": "https://ark.hemaos.com/graphql?domain=warehousing&api=listSortToolEnum"
                }
              ],
              "defaultValue": {
                "dynamicValue": "none"
              },
              "chartId": "1",
              "chartName": "任务数量统计"
            }
          ],
          "type": "lately",
          "dataWindow": "day",
          "code": "wdk_ums_metrics;querySortTaskNumByModeAndTool.query;WDK_METRICS",
          "externalFormData": {
            "filterDisplayType": false,
            "isWatermark": false,
            "isFullScreen": true,
            "isRefresh": false,
            "isShowTotalCount": true,
            "refreshType": "false",
            "hidden": false,
            "autoRefreshVisible": false,
            "sorts": [
              {
                "column": "实分数量",
                "desc": true
              },
              {
                "column": "任务数量",
                "desc": true
              },
              {
                "column": "仓id",
                "desc": false
              }
            ]
          },
          "isWhereManual": true,
          "whereCompact": true,
          "isChartTitleShow": true,
          "title": "titletest",
          "sceneCode": "",
          "entityCode": "",
          "chartTitle": "分货数量统计",
          "moduleConfig": {}
        },
        "moved": false,
        "static": false,
        "isChartGroup": false
      },
      {
        "i": "2",
        "tileSize": "1*1",
        "extraCharts": [],
        "chart": {
          "id": "2",
          "entityType": "metrics",
          "doubleAxisTypes": [
            "stack",
            "line"
          ],
          "appCode": "wdk_ums_metrics",
          "tenant": "WDK_METRICS",
          "label": "盒马在线数据中台;wdk_ums_metrics;querySortTaskNumByMode.query",
          "metricCode": "wdk_ums_metrics;querySortTaskNumByMode.query;WDK_METRICS",
          "props_schema": [],
          "wheres": [
            {
              "isVisible": true,
              "label": "时间",
              "op": "=",
              "format": "YYYY-MM-DD",
              "type": "rangeDate",
              "isMergeFilter": false,
              "value": [
                "startTime",
                "endTime"
              ],
              "defaultValueEnd": {
                "dynamicValue": "T+1",
                "customTime": {
                  "type": "D",
                  "value": "1",
                  "status": "before"
                }
              },
              "required": true,
              "defaultValue": {
                "dynamicValue": "T-7"
              }
            }
          ],
          "type": "lately",
          "dataWindow": "day",
          "code": "wdk_ums_metrics;querySortTaskNumByMode.query;WDK_METRICS",
          "externalFormData": {
            "isRefresh": true,
            "isShowTotalCount": false,
            "refreshType": "false",
            "sorts": [
              {
                "column": "实分数量",
                "desc": true
              }
            ]
          },
          "isChartTitleShow": true,
          "chartTitle": "典型仓",
          "moduleConfig": {},
          "title": "titletest",
          "sceneCode": "",
          "entityCode": ""
        },
        "moved": false,
        "static": false
      },
      {
        "i": "3",
        "tileSize": "1*1",
        "extraCharts": [],
        "chart": {
          "id": "3",
          "entityType": "metrics",
          "doubleAxisTypes": [
            "line",
            "line"
          ],
          "appCode": "wdk_ums_metrics",
          "tenant": "WDK_METRICS",
          "label": "盒马在线数据中台;wdk_ums_metrics;sortEfficiency.query",
          "metricCode": "wdk_ums_metrics;sortEfficiency.query;WDK_METRICS",
          "props_schema": [],
          "wheres": [
            {
              "isVisible": true,
              "label": "仓",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "select",
              "isMergeFilter": false,
              "value": [
                "warehouseId"
              ],
              "enum": [
                {
                  "valueType": "dynamicValue",
                  "label": "上海生鲜加工中心",
                  "id": "23"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "上海水产暂养中心",
                  "id": "278"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "上海冷链仓",
                  "id": "311"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "上海常温仓",
                  "id": "556"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "逸刻江桥冷藏仓",
                  "id": "20760110"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "北京生鲜加工中心",
                  "id": "1405"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "上海生鲜分仓",
                  "id": "9300002"
                }
              ],
              "defaultValue": {
                "dynamicValue": "default"
              },
              "chartId": "3",
              "required": true
            },
            {
              "isVisible": true,
              "label": "时间",
              "op": "=",
              "format": "YYYY-MM-DD",
              "type": "rangeDate",
              "isMergeFilter": false,
              "value": [
                "startTime",
                "endTime"
              ],
              "defaultValueEnd": {
                "dynamicValue": "T",
                "customTime": {
                  "type": "D",
                  "value": "1",
                  "status": "before"
                }
              },
              "required": true,
              "defaultValue": {
                "dynamicValue": "customTime",
                "customTime": {
                  "status": "before",
                  "type": "W",
                  "value": 4
                }
              }
            }
          ],
          "type": "lately",
          "dataWindow": "day",
          "code": "wdk_ums_metrics;sortEfficiency.query;WDK_METRICS",
          "externalFormData": {
            "isRefresh": false,
            "sorts": [
              {
                "column": "date",
                "desc": true
              }
            ]
          },
          "whereCompact": true,
          "isWhereManual": true,
          "isChartTitleShow": true,
          "title": "titletest",
          "sceneCode": "",
          "entityCode": "",
          "chartTitle": "分货平均人效",
          "moduleConfig": {}
        },
        "moved": false,
        "static": false
      },
      {
        "i": "4",
        "tileSize": "1*1",
        "extraCharts": [],
        "chart": {
          "id": "4",
          "entityType": "metrics",
          "doubleAxisTypes": [
            "interval",
            "line"
          ],
          "appCode": "wdk_ums_metrics",
          "tenant": "WDK_METRICS",
          "label": "盒马在线数据中台;wdk_ums_metrics;sortPersonEfficiency.query",
          "metricCode": "wdk_ums_metrics;sortPersonEfficiency.query;WDK_METRICS",
          "props_schema": [],
          "wheres": [
            {
              "isVisible": true,
              "label": "仓",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "select",
              "isMergeFilter": false,
              "value": [
                "warehouseId"
              ],
              "required": true,
              "enum": [
                {
                  "valueType": "dynamicValue",
                  "label": "上海生鲜加工中心",
                  "id": "23"
                }
              ]
            },
            {
              "isVisible": true,
              "label": "时间",
              "op": "=",
              "format": "YYYY-MM-DD",
              "type": "date",
              "isMergeFilter": false,
              "value": [
                "startTime"
              ],
              "required": true,
              "defaultValue": {
                "dynamicValue": "T-1"
              }
            }
          ],
          "type": "lately",
          "dataWindow": "day",
          "code": "wdk_ums_metrics;sortPersonEfficiency.query;WDK_METRICS",
          "isWhereManual": true,
          "externalFormData": {
            "pageSize": 10,
            "sorts": [
              {
                "column": "efficiency",
                "desc": true
              }
            ]
          },
          "isChartTitleShow": true,
          "chartTitle": "人效 top 10",
          "moduleConfig": {},
          "whereCompact": true
        },
        "moved": false,
        "static": false
      },
      {
        "i": "5",
        "tileSize": "1*1",
        "extraCharts": [],
        "chart": {
          "id": "5",
          "entityType": "metrics",
          "doubleAxisTypes": [
            "line",
            "line"
          ],
          "appCode": "wdk_ums_metrics",
          "tenant": "WDK_METRICS",
          "label": "盒马在线数据中台;wdk_ums_metrics;multiGenSortTaskRate.query",
          "metricCode": "wdk_ums_metrics;multiGenSortTaskRate.query;WDK_METRICS",
          "props_schema": [],
          "wheres": [
            {
              "isVisible": true,
              "label": "仓",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "select",
              "isMergeFilter": false,
              "value": [
                "warehouseId"
              ],
              "required": true,
              "enum": [
                {
                  "valueType": "dynamicValue",
                  "label": "北京生鲜加工中心",
                  "id": "1405"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "北京生鲜加工中心分仓",
                  "id": "20350054"
                }
              ],
              "defaultValue": {
                "dynamicValue": "default"
              }
            },
            {
              "isVisible": true,
              "label": "时间",
              "op": "=",
              "format": "YYYY-MM-DD",
              "type": "rangeDate",
              "isMergeFilter": false,
              "value": [
                "startTime",
                "endTime"
              ],
              "defaultValueEnd": {
                "dynamicValue": "T",
                "customTime": {
                  "type": "D",
                  "value": "1",
                  "status": "before"
                }
              },
              "defaultValue": {
                "dynamicValue": "T-7"
              },
              "required": true
            }
          ],
          "type": "lately",
          "dataWindow": "day",
          "code": "wdk_ums_metrics;multiGenSortTaskRate.query;WDK_METRICS",
          "externalFormData": {
            "sorts": [
              {
                "column": "date",
                "desc": false
              }
            ]
          },
          "whereCompact": true,
          "isChartTitleShow": true,
          "title": "titletest",
          "sceneCode": "",
          "entityCode": "",
          "chartTitle": "多次生成分货任务比例",
          "moduleConfig": {}
        },
        "moved": false,
        "static": false
      }
    ]
  },
  {
    "id": 2005,
    "json": [
      {
        "i": "0",
        "tileSize": "1*1",
        "extraCharts": [],
        "chart": {
          "id": "1",
          "entityType": "metrics",
          "doubleAxisTypes": [
            "line",
            "line"
          ],
          "appCode": "wdk_ums_metrics",
          "tenant": "WDK_METRICS",
          "label": "盒马在线数据中台;wdk_ums_metrics;querySortTaskNumByModeAndTool.query",
          "metricCode": "wdk_ums_metrics;querySortTaskNumByModeAndTool.query;WDK_METRICS",
          "props_schema": [],
          "wheres": [
            {
              "isVisible": true,
              "label": "仓",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "input",
              "isMergeFilter": false,
              "value": [
                "warehouseId"
              ],
              "chartId": "1",
              "chartName": "任务数量统计"
            },
            {
              "isVisible": true,
              "label": "仓类型",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "select",
              "isMergeFilter": false,
              "value": [
                "warehouseType"
              ],
              "defaultValue": {
                "dynamicValue": "default"
              },
              "enum": [
                {
                  "valueType": "dynamicValue",
                  "label": "正式仓",
                  "id": "1"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "测试仓",
                  "id": "2"
                }
              ]
            },
            {
              "isVisible": true,
              "label": "时间",
              "op": "=",
              "format": "YYYY-MM-DD",
              "type": "rangeDate",
              "isMergeFilter": false,
              "value": [
                "startTime",
                "endTime"
              ],
              "defaultValueEnd": {
                "dynamicValue": "T+1",
                "customTime": {
                  "type": "D",
                  "value": "1",
                  "status": "before"
                }
              },
              "required": true,
              "defaultValue": {
                "dynamicValue": "customTime",
                "customTime": {
                  "status": "before",
                  "type": "M",
                  "value": 1
                }
              }
            },
            {
              "isVisible": true,
              "label": "分货模式",
              "op": "in",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "select",
              "isMergeFilter": false,
              "value": [
                "sortModes"
              ],
              "request": [
                {
                  "requestFormat": "return data.data.listSortModeEnum.data",
                  "label": "value",
                  "value": "key",
                  "url": "https://ark.hemaos.com/graphql?domain=warehousing&api=listSortModeEnum"
                }
              ],
              "defaultValue": {
                "dynamicValue": "none"
              },
              "chartId": "1",
              "chartName": "任务数量统计"
            },
            {
              "isVisible": true,
              "label": "分货工具",
              "op": "in",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "select",
              "isMergeFilter": false,
              "value": [
                "sortTools"
              ],
              "request": [
                {
                  "requestFormat": "return data.data.listSortToolEnum.data",
                  "label": "value",
                  "value": "key",
                  "url": "https://ark.hemaos.com/graphql?domain=warehousing&api=listSortToolEnum"
                }
              ],
              "defaultValue": {
                "dynamicValue": "none"
              },
              "chartId": "1",
              "chartName": "任务数量统计"
            }
          ],
          "type": "lately",
          "dataWindow": "day",
          "code": "wdk_ums_metrics;querySortTaskNumByModeAndTool.query;WDK_METRICS",
          "externalFormData": {
            "filterDisplayType": false,
            "isWatermark": false,
            "isFullScreen": true,
            "isRefresh": false,
            "isShowTotalCount": true,
            "refreshType": "false",
            "hidden": false,
            "autoRefreshVisible": false,
            "sorts": [
              {
                "column": "实分数量",
                "desc": true
              },
              {
                "column": "任务数量",
                "desc": true
              },
              {
                "column": "仓id",
                "desc": false
              }
            ]
          },
          "isWhereManual": true,
          "whereCompact": true,
          "isChartTitleShow": true,
          "title": "titletest",
          "sceneCode": "",
          "entityCode": "",
          "chartTitle": "分货数量统计",
          "moduleConfig": {}
        },
        "moved": false,
        "static": false,
        "isChartGroup": false
      },
      {
        "i": "2",
        "tileSize": "1*1",
        "extraCharts": [],
        "chart": {
          "id": "2",
          "entityType": "metrics",
          "doubleAxisTypes": [
            "stack",
            "line"
          ],
          "appCode": "wdk_ums_metrics",
          "tenant": "WDK_METRICS",
          "label": "盒马在线数据中台;wdk_ums_metrics;querySortTaskNumByMode.query",
          "metricCode": "wdk_ums_metrics;querySortTaskNumByMode.query;WDK_METRICS",
          "props_schema": [],
          "wheres": [
            {
              "isVisible": true,
              "label": "时间",
              "op": "=",
              "format": "YYYY-MM-DD",
              "type": "rangeDate",
              "isMergeFilter": false,
              "value": [
                "startTime",
                "endTime"
              ],
              "defaultValueEnd": {
                "dynamicValue": "T+1",
                "customTime": {
                  "type": "D",
                  "value": "1",
                  "status": "before"
                }
              },
              "required": true,
              "defaultValue": {
                "dynamicValue": "T-7"
              }
            }
          ],
          "type": "lately",
          "dataWindow": "day",
          "code": "wdk_ums_metrics;querySortTaskNumByMode.query;WDK_METRICS",
          "externalFormData": {
            "isRefresh": true,
            "isShowTotalCount": false,
            "refreshType": "false",
            "sorts": [
              {
                "column": "实分数量",
                "desc": true
              }
            ]
          },
          "isChartTitleShow": true,
          "chartTitle": "典型仓",
          "moduleConfig": {},
          "title": "titletest",
          "sceneCode": "",
          "entityCode": ""
        },
        "moved": false,
        "static": false
      },
      {
        "i": "3",
        "tileSize": "1*1",
        "extraCharts": [],
        "chart": {
          "id": "3",
          "entityType": "metrics",
          "doubleAxisTypes": [
            "line",
            "line"
          ],
          "appCode": "wdk_ums_metrics",
          "tenant": "WDK_METRICS",
          "label": "盒马在线数据中台;wdk_ums_metrics;sortEfficiency.query",
          "metricCode": "wdk_ums_metrics;sortEfficiency.query;WDK_METRICS",
          "props_schema": [],
          "wheres": [
            {
              "isVisible": true,
              "label": "仓",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "select",
              "isMergeFilter": false,
              "value": [
                "warehouseId"
              ],
              "enum": [
                {
                  "valueType": "dynamicValue",
                  "label": "上海生鲜加工中心",
                  "id": "23"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "上海水产暂养中心",
                  "id": "278"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "上海冷链仓",
                  "id": "311"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "上海常温仓",
                  "id": "556"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "逸刻江桥冷藏仓",
                  "id": "20760110"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "北京生鲜加工中心",
                  "id": "1405"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "上海生鲜分仓",
                  "id": "9300002"
                }
              ],
              "defaultValue": {
                "dynamicValue": "default"
              },
              "chartId": "3",
              "required": true
            },
            {
              "isVisible": true,
              "label": "时间",
              "op": "=",
              "format": "YYYY-MM-DD",
              "type": "rangeDate",
              "isMergeFilter": false,
              "value": [
                "startTime",
                "endTime"
              ],
              "defaultValueEnd": {
                "dynamicValue": "T",
                "customTime": {
                  "type": "D",
                  "value": "1",
                  "status": "before"
                }
              },
              "required": true,
              "defaultValue": {
                "dynamicValue": "customTime",
                "customTime": {
                  "status": "before",
                  "type": "W",
                  "value": 4
                }
              }
            }
          ],
          "type": "lately",
          "dataWindow": "day",
          "code": "wdk_ums_metrics;sortEfficiency.query;WDK_METRICS",
          "externalFormData": {
            "isRefresh": false,
            "sorts": [
              {
                "column": "date",
                "desc": true
              }
            ]
          },
          "whereCompact": true,
          "isWhereManual": true,
          "isChartTitleShow": true,
          "title": "titletest",
          "sceneCode": "",
          "entityCode": "",
          "chartTitle": "分货平均人效",
          "moduleConfig": {}
        },
        "moved": false,
        "static": false
      },
      {
        "i": "4",
        "tileSize": "1*1",
        "extraCharts": [],
        "chart": {
          "id": "4",
          "entityType": "metrics",
          "doubleAxisTypes": [
            "interval",
            "line"
          ],
          "appCode": "wdk_ums_metrics",
          "tenant": "WDK_METRICS",
          "label": "盒马在线数据中台;wdk_ums_metrics;sortPersonEfficiency.query",
          "metricCode": "wdk_ums_metrics;sortPersonEfficiency.query;WDK_METRICS",
          "props_schema": [],
          "wheres": [
            {
              "isVisible": true,
              "label": "仓",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "select",
              "isMergeFilter": false,
              "value": [
                "warehouseId"
              ],
              "required": true,
              "enum": [
                {
                  "valueType": "dynamicValue",
                  "label": "上海生鲜加工中心",
                  "id": "23"
                }
              ]
            },
            {
              "isVisible": true,
              "label": "时间",
              "op": "=",
              "format": "YYYY-MM-DD",
              "type": "date",
              "isMergeFilter": false,
              "value": [
                "startTime"
              ],
              "required": true,
              "defaultValue": {
                "dynamicValue": "T-1"
              }
            }
          ],
          "type": "lately",
          "dataWindow": "day",
          "code": "wdk_ums_metrics;sortPersonEfficiency.query;WDK_METRICS",
          "isWhereManual": true,
          "externalFormData": {
            "pageSize": 10,
            "sorts": [
              {
                "column": "efficiency",
                "desc": true
              }
            ]
          },
          "isChartTitleShow": true,
          "chartTitle": "人效 top 10",
          "moduleConfig": {},
          "whereCompact": true
        },
        "moved": false,
        "static": false
      },
      {
        "i": "5",
        "tileSize": "1*1",
        "extraCharts": [],
        "chart": {
          "id": "5",
          "entityType": "metrics",
          "doubleAxisTypes": [
            "line",
            "line"
          ],
          "appCode": "wdk_ums_metrics",
          "tenant": "WDK_METRICS",
          "label": "盒马在线数据中台;wdk_ums_metrics;multiGenSortTaskRate.query",
          "metricCode": "wdk_ums_metrics;multiGenSortTaskRate.query;WDK_METRICS",
          "props_schema": [],
          "wheres": [
            {
              "isVisible": true,
              "label": "仓",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "select",
              "isMergeFilter": false,
              "value": [
                "warehouseId"
              ],
              "required": true,
              "enum": [
                {
                  "valueType": "dynamicValue",
                  "label": "北京生鲜加工中心",
                  "id": "1405"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "北京生鲜加工中心分仓",
                  "id": "20350054"
                }
              ],
              "defaultValue": {
                "dynamicValue": "default"
              }
            },
            {
              "isVisible": true,
              "label": "时间",
              "op": "=",
              "format": "YYYY-MM-DD",
              "type": "rangeDate",
              "isMergeFilter": false,
              "value": [
                "startTime",
                "endTime"
              ],
              "defaultValueEnd": {
                "dynamicValue": "T",
                "customTime": {
                  "type": "D",
                  "value": "1",
                  "status": "before"
                }
              },
              "defaultValue": {
                "dynamicValue": "T-7"
              },
              "required": true
            }
          ],
          "type": "lately",
          "dataWindow": "day",
          "code": "wdk_ums_metrics;multiGenSortTaskRate.query;WDK_METRICS",
          "externalFormData": {
            "sorts": [
              {
                "column": "date",
                "desc": false
              }
            ]
          },
          "whereCompact": true,
          "isChartTitleShow": true,
          "title": "titletest",
          "sceneCode": "",
          "entityCode": "",
          "chartTitle": "多次生成分货任务比例",
          "moduleConfig": {}
        },
        "moved": false,
        "static": false
      }
    ]
  },
  {
    "id": 2343,
    "json": [
      {
        "i": "1",
        "tileSize": "1*1",
        "extraCharts": [],
        "chart": {
          "id": "1",
          "entityType": "metrics",
          "doubleAxisTypes": [
            "line",
            "line"
          ],
          "appCode": "wdk_ums_metrics",
          "tenant": "WDK_METRICS",
          "label": "盒马在线数据中台;wdk_ums_metrics;test1212.query",
          "metricCode": "wdk_ums_metrics;test1212.query;WDK_METRICS",
          "props_schema": [],
          "wheres": [
            {
              "isVisible": true,
              "label": "开始时间",
              "op": "=",
              "format": "YYYY-MM-DD",
              "type": "date",
              "relationCharts": [],
              "required": true,
              "remember": false,
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": [
                "beginCreated"
              ],
              "chartId": "1"
            },
            {
              "isVisible": true,
              "label": "结束时间",
              "op": "=",
              "format": "YYYY-MM-DD",
              "type": "date",
              "relationCharts": [],
              "required": true,
              "remember": false,
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": [
                "endCreated"
              ],
              "chartId": "1"
            },
            {
              "isVisible": true,
              "label": "波次号",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "input",
              "relationCharts": [],
              "required": false,
              "remember": false,
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": [
                "waveCode"
              ],
              "chartId": "1"
            }
          ],
          "type": "lately",
          "dataWindow": "day",
          "code": "wdk_ums_metrics;test1212.query;WDK_METRICS",
          "externalFormData": {
            "isShowTotalCount": true
          }
        },
        "moved": false,
        "static": false
      }
    ]
  },
  {
    "id": 2536,
    "json": [
      {
        "i": "1",
        "tileSize": "1*1",
        "extraCharts": [],
        "chart": {
          "id": "1",
          "entityType": "metrics",
          "doubleAxisTypes": [
            "line",
            "line"
          ],
          "appCode": "wdk_ums_metrics",
          "metricCode": "wdk_ums_metrics;waveDetailUtil.query;WDK_METRICS",
          "label": "盒马在线数据中台;wdk_ums_metrics;waveDetailUtil.query",
          "props_schema": [],
          "wheres": [
            {
              "isVisible": true,
              "label": "仓",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "select",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": [
                "warehouseId"
              ],
              "defaultValue": {
                "dynamicValue": "none",
                "hemaos_login_info": ""
              },
              "chartId": "1",
              "enum": [
                {
                  "valueType": "dynamicValue",
                  "label": "上海B2C仓",
                  "id": "44"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "北京B2C仓",
                  "id": "366"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "深圳B2C仓",
                  "id": "5460005"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "上海B2C冷冻仓",
                  "id": "5460006"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "北京B2C冷冻仓",
                  "id": "8730001"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "广深B2C冷冻仓",
                  "id": "10110002"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "成都B2C冷冻仓",
                  "id": "12790001"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "西安B2C冷冻仓",
                  "id": "12800001"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "成都B2C仓",
                  "id": "12940004"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "西安B2C仓",
                  "id": "13000001"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "武汉B2C仓",
                  "id": "20220063"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "北京官旗店B2C仓",
                  "id": "21301083"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "深广官旗店B2C仓",
                  "id": "21360042"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "成都官旗店B2C仓",
                  "id": "21360088"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "武汉B2C冷冻仓",
                  "id": "21720093"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "上海B2C嘉兴仓",
                  "id": "22130878"
                }
              ],
              "chartName": "波次详情统计",
              "required": true,
              "remember": true
            },
            {
              "isVisible": true,
              "label": "波次号",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "input",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": [
                "waveCode"
              ],
              "chartId": "1",
              "chartName": "波次详情统计"
            },
            {
              "isVisible": true,
              "label": "波次开始时间",
              "op": "=",
              "format": "YYYY-MM-DD",
              "type": "date",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": [
                "beginCreated"
              ],
              "chartId": "1",
              "required": true,
              "chartName": "波次详情统计"
            },
            {
              "isVisible": true,
              "label": "波次结束时间",
              "op": "=",
              "format": "YYYY-MM-DD",
              "type": "date",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": [
                "endCreated"
              ],
              "chartId": "1",
              "required": true,
              "subDefault": {
                "defaultValue": {
                  "dynamicValue": "T"
                }
              },
              "chartName": "波次详情统计"
            }
          ],
          "type": "lately",
          "dataWindow": "day",
          "code": "wdk_ums_metrics;waveDetailUtil.query;WDK_METRICS",
          "whereCompact": false,
          "isWhereManual": true,
          "isChartTitleShow": true,
          "title": "titletest",
          "sceneCode": "",
          "entityCode": "",
          "moduleConfig": {
            "isChartTitleCenter": false
          },
          "externalFormData": {
            "isShowTotalCount": true,
            "hidden": false
          },
          "tenant": "WDK_METRICS",
          "chartTitle": "波次详情统计"
        },
        "moved": false,
        "static": false
      }
    ]
  },
  {
    "id": 2536,
    "json": [
      {
        "i": "1",
        "tileSize": "1*1",
        "extraCharts": [],
        "chart": {
          "id": "1",
          "entityType": "metrics",
          "doubleAxisTypes": [
            "line",
            "line"
          ],
          "appCode": "wdk_ums_metrics",
          "metricCode": "wdk_ums_metrics;waveDetailUtil.query;WDK_METRICS",
          "label": "盒马在线数据中台;wdk_ums_metrics;waveDetailUtil.query",
          "props_schema": [],
          "wheres": [
            {
              "isVisible": true,
              "label": "仓",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "select",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": [
                "warehouseId"
              ],
              "defaultValue": {
                "dynamicValue": "none",
                "hemaos_login_info": ""
              },
              "chartId": "1",
              "enum": [
                {
                  "valueType": "dynamicValue",
                  "label": "上海B2C仓",
                  "id": "44"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "北京B2C仓",
                  "id": "366"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "深圳B2C仓",
                  "id": "5460005"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "上海B2C冷冻仓",
                  "id": "5460006"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "北京B2C冷冻仓",
                  "id": "8730001"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "广深B2C冷冻仓",
                  "id": "10110002"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "成都B2C冷冻仓",
                  "id": "12790001"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "西安B2C冷冻仓",
                  "id": "12800001"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "成都B2C仓",
                  "id": "12940004"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "西安B2C仓",
                  "id": "13000001"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "武汉B2C仓",
                  "id": "20220063"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "北京官旗店B2C仓",
                  "id": "21301083"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "深广官旗店B2C仓",
                  "id": "21360042"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "成都官旗店B2C仓",
                  "id": "21360088"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "武汉B2C冷冻仓",
                  "id": "21720093"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "上海B2C嘉兴仓",
                  "id": "22130878"
                }
              ],
              "chartName": "波次详情统计",
              "required": true,
              "remember": true
            },
            {
              "isVisible": true,
              "label": "波次号",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "input",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": [
                "waveCode"
              ],
              "chartId": "1",
              "chartName": "波次详情统计"
            },
            {
              "isVisible": true,
              "label": "波次开始时间",
              "op": "=",
              "format": "YYYY-MM-DD",
              "type": "date",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": [
                "beginCreated"
              ],
              "chartId": "1",
              "required": true,
              "chartName": "波次详情统计"
            },
            {
              "isVisible": true,
              "label": "波次结束时间",
              "op": "=",
              "format": "YYYY-MM-DD",
              "type": "date",
              "relationCharts": [],
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": [
                "endCreated"
              ],
              "chartId": "1",
              "required": true,
              "subDefault": {
                "defaultValue": {
                  "dynamicValue": "T"
                }
              },
              "chartName": "波次详情统计"
            }
          ],
          "type": "lately",
          "dataWindow": "day",
          "code": "wdk_ums_metrics;waveDetailUtil.query;WDK_METRICS",
          "whereCompact": false,
          "isWhereManual": true,
          "isChartTitleShow": true,
          "title": "titletest",
          "sceneCode": "",
          "entityCode": "",
          "moduleConfig": {
            "isChartTitleCenter": false
          },
          "externalFormData": {
            "isShowTotalCount": true,
            "hidden": false
          },
          "tenant": "WDK_METRICS",
          "chartTitle": "波次详情统计"
        },
        "moved": false,
        "static": false
      }
    ]
  },
  {
    "id": 2560,
    "json": [
      {
        "i": "1",
        "tileSize": "1*1",
        "extraCharts": [],
        "chart": {
          "id": "1",
          "entityType": "metrics",
          "doubleAxisTypes": [
            "line",
            "interval"
          ],
          "appCode": "wdk_ums_metrics",
          "tenant": "WDK_METRICS",
          "label": "盒马在线数据中台;wdk_ums_metrics;wcsCostTime.query",
          "metricCode": "wdk_ums_metrics;wcsCostTime.query;WDK_METRICS",
          "props_schema": [],
          "wheres": [
            {
              "isVisible": true,
              "label": "选择时间",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "rangeDate",
              "isMergeFilter": false,
              "value": [
                "startTime",
                "endTime"
              ],
              "defaultValueEnd": {
                "dynamicValue": "T",
                "customTime": {
                  "type": "D",
                  "value": "1",
                  "status": "before"
                }
              },
              "required": true,
              "subDefault": {
                "defaultValueEnd": {
                  "dynamicValue": "T"
                }
              },
              "defaultValue": {
                "dynamicValue": "T"
              }
            },
            {
              "isVisible": true,
              "label": "门店",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "select",
              "isMergeFilter": false,
              "value": [
                "warehouseid"
              ],
              "request": [
                {
                  "requestFormat": "return data.map(item =>({\nlabel: item.value,\n  id: item.key\n}))",
                  "label": "label",
                  "value": "id",
                  "url": "https://ums.hemaos.com/common/idNameManager/warehouseList.json"
                }
              ],
              "required": true,
              "defaultValue": {
                "dynamicValue": "default"
              },
              "subDefault": {
                "defaultValue": {
                  "dynamicValue": "default"
                }
              }
            }
          ],
          "type": "lately",
          "dataWindow": "day",
          "code": "wdk_ums_metrics;wcsCostTime.query;WDK_METRICS"
        },
        "moved": false,
        "static": false
      }
    ]
  },
  {
    "id": 2560,
    "json": [
      {
        "i": "1",
        "tileSize": "1*1",
        "extraCharts": [],
        "chart": {
          "id": "1",
          "entityType": "metrics",
          "doubleAxisTypes": [
            "line",
            "interval"
          ],
          "appCode": "wdk_ums_metrics",
          "tenant": "WDK_METRICS",
          "label": "盒马在线数据中台;wdk_ums_metrics;wcsCostTime.query",
          "metricCode": "wdk_ums_metrics;wcsCostTime.query;WDK_METRICS",
          "props_schema": [],
          "wheres": [
            {
              "isVisible": true,
              "label": "选择时间",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "rangeDate",
              "isMergeFilter": false,
              "value": [
                "startTime",
                "endTime"
              ],
              "defaultValueEnd": {
                "dynamicValue": "T",
                "customTime": {
                  "type": "D",
                  "value": "1",
                  "status": "before"
                }
              },
              "required": true,
              "subDefault": {
                "defaultValueEnd": {
                  "dynamicValue": "T"
                }
              },
              "defaultValue": {
                "dynamicValue": "T"
              }
            },
            {
              "isVisible": true,
              "label": "门店",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "select",
              "isMergeFilter": false,
              "value": [
                "warehouseid"
              ],
              "request": [
                {
                  "requestFormat": "return data.map(item =>({\nlabel: item.value,\n  id: item.key\n}))",
                  "label": "label",
                  "value": "id",
                  "url": "https://ums.hemaos.com/common/idNameManager/warehouseList.json"
                }
              ],
              "required": true,
              "defaultValue": {
                "dynamicValue": "default"
              },
              "subDefault": {
                "defaultValue": {
                  "dynamicValue": "default"
                }
              }
            }
          ],
          "type": "lately",
          "dataWindow": "day",
          "code": "wdk_ums_metrics;wcsCostTime.query;WDK_METRICS"
        },
        "moved": false,
        "static": false
      }
    ]
  },
  {
    "id": 2716,
    "json": [
      {
        "i": "1",
        "tileSize": "1*1",
        "extraCharts": [
          {
            "chart": {
              "id": "2",
              "entityType": "metrics",
              "doubleAxisTypes": [
                "line",
                "line"
              ],
              "appCode": "wdk_ums_metrics",
              "tenant": "WDK_METRICS",
              "label": "盒马在线数据中台;wdk_ums_metrics;gridWarehouseYouXuanEffect.query",
              "metricCode": "wdk_ums_metrics;gridWarehouseYouXuanEffect.query;WDK_METRICS",
              "dimensions": [
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    }
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "网格仓"
                  },
                  "code": "warehouseName",
                  "name": "warehouseName",
                  "label": "warehouseName"
                },
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    }
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "团长数"
                  },
                  "code": "shopCount",
                  "name": "shopCount",
                  "label": "shopCount"
                },
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    }
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "分拣件数"
                  },
                  "code": "qtyNumber",
                  "name": "qtyNumber",
                  "label": "qtyNumber"
                },
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    }
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "分拣开始时间"
                  },
                  "code": "startTime",
                  "name": "startTime",
                  "label": "startTime"
                },
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    }
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "分拣结束时间"
                  },
                  "code": "endTime",
                  "name": "endTime",
                  "label": "endTime"
                },
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    }
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "分拣实时长（小时）"
                  },
                  "code": "workTime",
                  "name": "workTime",
                  "label": "workTime"
                },
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    }
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "分拣人数"
                  },
                  "code": "userCount",
                  "name": "userCount",
                  "label": "userCount"
                },
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    }
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "分拣人效（件数/小时）"
                  },
                  "code": "effect",
                  "name": "effect",
                  "label": "effect"
                }
              ],
              "indicators": [],
              "props_schema": [],
              "chartType": {
                "tag": "shuhe",
                "type": "pc",
                "id": 2,
                "name": "Table",
                "icon": [
                  "#icon-table",
                  "#icon-table_active"
                ],
                "description": "表格",
                "url": "//g.alicdn.com/wdk-frontend-release/shuhe-widgets/0.1.338/Table.js",
                "props_schema": [],
                "dimension_require": "n",
                "data_require": "n",
                "isRelease": true,
                "createdat": ""
              },
              "wheres": [
                {
                  "isVisible": true,
                  "label": "统计日期",
                  "op": "=",
                  "format": "YYYY-MM-DD",
                  "type": "date",
                  "relationCharts": [],
                  "required": true,
                  "remember": false,
                  "isMergeFilter": true,
                  "chartIds": [
                    "1",
                    "2",
                    "3"
                  ],
                  "value": [
                    "dateTime"
                  ],
                  "defaultValue": {
                    "dynamicValue": "none"
                  },
                  "chartId": "1",
                  "chartName": "中心仓人效明细统计",
                  "chartExtraConfig": {
                    "hasClear": true
                  }
                }
              ],
              "type": "lately",
              "dataWindow": "day",
              "code": "wdk_ums_metrics;gridWarehouseYouXuanEffect.query;WDK_METRICS",
              "chartFormData": {
                "defautlOpenRowLevel": 0,
                "isPaging": true,
                "isDisplayOrder": true,
                "downLoadType": "downLoadFront",
                "isDownLoad": false,
                "downLoadFront": {
                  "downloadName": "default"
                },
                "drillConfig": {
                  "isDrill": false,
                  "drillKey": "id",
                  "drillType": "base",
                  "isAlignRight": false,
                  "drillParentKey": "parentId",
                  "drillLevel": 0
                },
                "orderWidth": 35
              },
              "externalFormData": {
                "isShowTotalCount": true
              },
              "isChartTitleShow": true,
              "title": "titletest",
              "sceneCode": "",
              "entityCode": "",
              "moduleConfig": {},
              "description": "网格仓人效汇总统计",
              "chartTitle": "网格仓人效汇总统计",
              "tabTitle": "网格仓人效汇总统计"
            },
            "tileSize": "1*1",
            "textSchema": {
              "primaryIndicators": [],
              "secondaryIndicators": {}
            },
            "parentId": "1",
            "index": 1
          },
          {
            "chart": {
              "id": "3",
              "entityType": "metrics",
              "doubleAxisTypes": [
                "line",
                "line"
              ],
              "appCode": "wdk_ums_metrics",
              "tenant": "WDK_METRICS",
              "label": "盒马在线数据中台;wdk_ums_metrics;gridWarehouseYouXuanEffectDetail.query",
              "metricCode": "wdk_ums_metrics;gridWarehouseYouXuanEffectDetail.query;WDK_METRICS",
              "dimensions": [
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    }
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "网格仓"
                  },
                  "code": "warehouseName",
                  "name": "warehouseName",
                  "label": "warehouseName"
                },
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    }
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "作业人员"
                  },
                  "code": "userName",
                  "name": "userName",
                  "label": "userName"
                },
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    }
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "分拣件数"
                  },
                  "code": "qtyNumber",
                  "name": "qtyNumber",
                  "label": "qtyNumber"
                },
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    }
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "分拣开始时间"
                  },
                  "code": "startTime",
                  "name": "startTime",
                  "label": "startTime"
                },
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    }
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "分拣结束时间"
                  },
                  "code": "endTime",
                  "name": "endTime",
                  "label": "endTime"
                },
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    }
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "分拣时长"
                  },
                  "code": "workTime",
                  "name": "workTime",
                  "label": "workTime"
                },
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    }
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "分拣人效（件数/小时）"
                  },
                  "code": "effect",
                  "name": "effect",
                  "label": "effect"
                }
              ],
              "indicators": [],
              "props_schema": [],
              "chartType": {
                "tag": "shuhe",
                "type": "pc",
                "id": 2,
                "name": "Table",
                "icon": [
                  "#icon-table",
                  "#icon-table_active"
                ],
                "description": "表格",
                "url": "//g.alicdn.com/wdk-frontend-release/shuhe-widgets/0.1.338/Table.js",
                "props_schema": [],
                "dimension_require": "n",
                "data_require": "n",
                "isRelease": true,
                "createdat": ""
              },
              "wheres": [
                {
                  "isVisible": true,
                  "label": "统计日期",
                  "op": "=",
                  "format": "YYYY-MM-DD",
                  "type": "date",
                  "relationCharts": [],
                  "required": true,
                  "remember": false,
                  "isMergeFilter": true,
                  "chartIds": [
                    "1",
                    "2",
                    "3"
                  ],
                  "value": [
                    "dateTime"
                  ],
                  "defaultValue": {
                    "dynamicValue": "none"
                  },
                  "chartId": "1",
                  "chartName": "中心仓人效明细统计",
                  "chartExtraConfig": {
                    "hasClear": true
                  }
                }
              ],
              "type": "lately",
              "dataWindow": "day",
              "code": "wdk_ums_metrics;gridWarehouseYouXuanEffectDetail.query;WDK_METRICS",
              "chartFormData": {
                "isDownLoad": false,
                "downLoadType": "downLoadFront",
                "downLoadFront": {
                  "downloadName": "default"
                },
                "isPaging": true,
                "drillConfig": {
                  "isDrill": false,
                  "drillKey": "id",
                  "drillType": "base",
                  "isAlignRight": false,
                  "drillParentKey": "parentId",
                  "drillLevel": 0
                },
                "defautlOpenRowLevel": 0,
                "orderWidth": 40,
                "isDisplayOrder": true
              },
              "externalFormData": {
                "isShowTotalCount": true
              },
              "isChartTitleShow": true,
              "title": "titletest",
              "sceneCode": "",
              "entityCode": "",
              "chartTitle": "网格仓人效明细统计",
              "moduleConfig": {},
              "description": "网格仓人效明细统计",
              "tabTitle": "网格仓人效明细统计"
            },
            "tileSize": "1*1",
            "textSchema": {
              "primaryIndicators": [],
              "secondaryIndicators": {}
            },
            "parentId": "1",
            "index": 2
          }
        ],
        "chart": {
          "id": "1",
          "entityType": "metrics",
          "doubleAxisTypes": [
            "line",
            "line"
          ],
          "appCode": "wdk_ums_metrics",
          "tenant": "WDK_METRICS",
          "label": "盒马在线数据中台;wdk_ums_metrics;warehouseYouXuanEffect.query",
          "metricCode": "wdk_ums_metrics;warehouseYouXuanEffect.query;WDK_METRICS",
          "props_schema": [],
          "wheres": [
            {
              "isVisible": true,
              "label": "类型(仅中心仓生效)",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "select",
              "relationCharts": [],
              "required": false,
              "remember": false,
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": [
                "taskType"
              ],
              "defaultValue": {
                "dynamicValue": "none"
              },
              "enum": [
                {
                  "valueType": "dynamicValue",
                  "label": "拣货",
                  "id": "1"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "分货",
                  "id": "2"
                }
              ],
              "chartId": "1",
              "chartName": "中心仓人效明细统计"
            },
            {
              "isVisible": true,
              "label": "统计日期",
              "op": "=",
              "format": "YYYY-MM-DD",
              "type": "date",
              "relationCharts": [],
              "required": true,
              "remember": false,
              "isMergeFilter": true,
              "chartIds": [
                "1",
                "2",
                "3"
              ],
              "value": [
                "dateTime"
              ],
              "defaultValue": {
                "dynamicValue": "none"
              },
              "chartId": "1",
              "chartName": "中心仓人效明细统计",
              "chartExtraConfig": {
                "hasClear": true
              }
            }
          ],
          "type": "lately",
          "dataWindow": "day",
          "code": "wdk_ums_metrics;warehouseYouXuanEffect.query;WDK_METRICS",
          "externalFormData": {
            "isShowTotalCount": true
          },
          "isChartTitleShow": true,
          "title": "titletest",
          "sceneCode": "",
          "entityCode": "",
          "chartTitle": "中心仓人效明细统计",
          "moduleConfig": {},
          "description": "中心仓人效明细统计",
          "tabTitle": "中心仓人效明细统计"
        },
        "moved": false,
        "static": false,
        "isChartGroup": true
      }
    ]
  },
  {
    "id": 2716,
    "json": [
      {
        "i": "1",
        "tileSize": "1*1",
        "extraCharts": [
          {
            "chart": {
              "id": "2",
              "entityType": "metrics",
              "doubleAxisTypes": [
                "line",
                "line"
              ],
              "appCode": "wdk_ums_metrics",
              "tenant": "WDK_METRICS",
              "label": "盒马在线数据中台;wdk_ums_metrics;gridWarehouseYouXuanEffect.query",
              "metricCode": "wdk_ums_metrics;gridWarehouseYouXuanEffect.query;WDK_METRICS",
              "dimensions": [
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    }
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "网格仓"
                  },
                  "code": "warehouseName",
                  "name": "warehouseName",
                  "label": "warehouseName"
                },
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    }
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "团长数"
                  },
                  "code": "shopCount",
                  "name": "shopCount",
                  "label": "shopCount"
                },
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    }
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "分拣件数"
                  },
                  "code": "qtyNumber",
                  "name": "qtyNumber",
                  "label": "qtyNumber"
                },
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    }
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "分拣开始时间"
                  },
                  "code": "startTime",
                  "name": "startTime",
                  "label": "startTime"
                },
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    }
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "分拣结束时间"
                  },
                  "code": "endTime",
                  "name": "endTime",
                  "label": "endTime"
                },
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    }
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "分拣实时长（小时）"
                  },
                  "code": "workTime",
                  "name": "workTime",
                  "label": "workTime"
                },
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    }
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "分拣人数"
                  },
                  "code": "userCount",
                  "name": "userCount",
                  "label": "userCount"
                },
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    }
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "分拣人效（件数/小时）"
                  },
                  "code": "effect",
                  "name": "effect",
                  "label": "effect"
                }
              ],
              "indicators": [],
              "props_schema": [],
              "chartType": {
                "tag": "shuhe",
                "type": "pc",
                "id": 2,
                "name": "Table",
                "icon": [
                  "#icon-table",
                  "#icon-table_active"
                ],
                "description": "表格",
                "url": "//g.alicdn.com/wdk-frontend-release/shuhe-widgets/0.1.338/Table.js",
                "props_schema": [],
                "dimension_require": "n",
                "data_require": "n",
                "isRelease": true,
                "createdat": ""
              },
              "wheres": [
                {
                  "isVisible": true,
                  "label": "统计日期",
                  "op": "=",
                  "format": "YYYY-MM-DD",
                  "type": "date",
                  "relationCharts": [],
                  "required": true,
                  "remember": false,
                  "isMergeFilter": true,
                  "chartIds": [
                    "1",
                    "2",
                    "3"
                  ],
                  "value": [
                    "dateTime"
                  ],
                  "defaultValue": {
                    "dynamicValue": "none"
                  },
                  "chartId": "1",
                  "chartName": "中心仓人效明细统计",
                  "chartExtraConfig": {
                    "hasClear": true
                  }
                }
              ],
              "type": "lately",
              "dataWindow": "day",
              "code": "wdk_ums_metrics;gridWarehouseYouXuanEffect.query;WDK_METRICS",
              "chartFormData": {
                "defautlOpenRowLevel": 0,
                "isPaging": true,
                "isDisplayOrder": true,
                "downLoadType": "downLoadFront",
                "isDownLoad": false,
                "downLoadFront": {
                  "downloadName": "default"
                },
                "drillConfig": {
                  "isDrill": false,
                  "drillKey": "id",
                  "drillType": "base",
                  "isAlignRight": false,
                  "drillParentKey": "parentId",
                  "drillLevel": 0
                },
                "orderWidth": 35
              },
              "externalFormData": {
                "isShowTotalCount": true
              },
              "isChartTitleShow": true,
              "title": "titletest",
              "sceneCode": "",
              "entityCode": "",
              "moduleConfig": {},
              "description": "网格仓人效汇总统计",
              "chartTitle": "网格仓人效汇总统计",
              "tabTitle": "网格仓人效汇总统计"
            },
            "tileSize": "1*1",
            "textSchema": {
              "primaryIndicators": [],
              "secondaryIndicators": {}
            },
            "parentId": "1",
            "index": 1
          },
          {
            "chart": {
              "id": "3",
              "entityType": "metrics",
              "doubleAxisTypes": [
                "line",
                "line"
              ],
              "appCode": "wdk_ums_metrics",
              "tenant": "WDK_METRICS",
              "label": "盒马在线数据中台;wdk_ums_metrics;gridWarehouseYouXuanEffectDetail.query",
              "metricCode": "wdk_ums_metrics;gridWarehouseYouXuanEffectDetail.query;WDK_METRICS",
              "dimensions": [
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    }
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "网格仓"
                  },
                  "code": "warehouseName",
                  "name": "warehouseName",
                  "label": "warehouseName"
                },
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    }
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "作业人员"
                  },
                  "code": "userName",
                  "name": "userName",
                  "label": "userName"
                },
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    }
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "分拣件数"
                  },
                  "code": "qtyNumber",
                  "name": "qtyNumber",
                  "label": "qtyNumber"
                },
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    }
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "分拣开始时间"
                  },
                  "code": "startTime",
                  "name": "startTime",
                  "label": "startTime"
                },
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    }
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "分拣结束时间"
                  },
                  "code": "endTime",
                  "name": "endTime",
                  "label": "endTime"
                },
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    }
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "分拣时长"
                  },
                  "code": "workTime",
                  "name": "workTime",
                  "label": "workTime"
                },
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    }
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "分拣人效（件数/小时）"
                  },
                  "code": "effect",
                  "name": "effect",
                  "label": "effect"
                }
              ],
              "indicators": [],
              "props_schema": [],
              "chartType": {
                "tag": "shuhe",
                "type": "pc",
                "id": 2,
                "name": "Table",
                "icon": [
                  "#icon-table",
                  "#icon-table_active"
                ],
                "description": "表格",
                "url": "//g.alicdn.com/wdk-frontend-release/shuhe-widgets/0.1.338/Table.js",
                "props_schema": [],
                "dimension_require": "n",
                "data_require": "n",
                "isRelease": true,
                "createdat": ""
              },
              "wheres": [
                {
                  "isVisible": true,
                  "label": "统计日期",
                  "op": "=",
                  "format": "YYYY-MM-DD",
                  "type": "date",
                  "relationCharts": [],
                  "required": true,
                  "remember": false,
                  "isMergeFilter": true,
                  "chartIds": [
                    "1",
                    "2",
                    "3"
                  ],
                  "value": [
                    "dateTime"
                  ],
                  "defaultValue": {
                    "dynamicValue": "none"
                  },
                  "chartId": "1",
                  "chartName": "中心仓人效明细统计",
                  "chartExtraConfig": {
                    "hasClear": true
                  }
                }
              ],
              "type": "lately",
              "dataWindow": "day",
              "code": "wdk_ums_metrics;gridWarehouseYouXuanEffectDetail.query;WDK_METRICS",
              "chartFormData": {
                "isDownLoad": false,
                "downLoadType": "downLoadFront",
                "downLoadFront": {
                  "downloadName": "default"
                },
                "isPaging": true,
                "drillConfig": {
                  "isDrill": false,
                  "drillKey": "id",
                  "drillType": "base",
                  "isAlignRight": false,
                  "drillParentKey": "parentId",
                  "drillLevel": 0
                },
                "defautlOpenRowLevel": 0,
                "orderWidth": 40,
                "isDisplayOrder": true
              },
              "externalFormData": {
                "isShowTotalCount": true
              },
              "isChartTitleShow": true,
              "title": "titletest",
              "sceneCode": "",
              "entityCode": "",
              "chartTitle": "网格仓人效明细统计",
              "moduleConfig": {},
              "description": "网格仓人效明细统计",
              "tabTitle": "网格仓人效明细统计"
            },
            "tileSize": "1*1",
            "textSchema": {
              "primaryIndicators": [],
              "secondaryIndicators": {}
            },
            "parentId": "1",
            "index": 2
          }
        ],
        "chart": {
          "id": "1",
          "entityType": "metrics",
          "doubleAxisTypes": [
            "line",
            "line"
          ],
          "appCode": "wdk_ums_metrics",
          "tenant": "WDK_METRICS",
          "label": "盒马在线数据中台;wdk_ums_metrics;warehouseYouXuanEffect.query",
          "metricCode": "wdk_ums_metrics;warehouseYouXuanEffect.query;WDK_METRICS",
          "props_schema": [],
          "wheres": [
            {
              "isVisible": true,
              "label": "类型(仅中心仓生效)",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "select",
              "relationCharts": [],
              "required": false,
              "remember": false,
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": [
                "taskType"
              ],
              "defaultValue": {
                "dynamicValue": "none"
              },
              "enum": [
                {
                  "valueType": "dynamicValue",
                  "label": "拣货",
                  "id": "1"
                },
                {
                  "valueType": "dynamicValue",
                  "label": "分货",
                  "id": "2"
                }
              ],
              "chartId": "1",
              "chartName": "中心仓人效明细统计"
            },
            {
              "isVisible": true,
              "label": "统计日期",
              "op": "=",
              "format": "YYYY-MM-DD",
              "type": "date",
              "relationCharts": [],
              "required": true,
              "remember": false,
              "isMergeFilter": true,
              "chartIds": [
                "1",
                "2",
                "3"
              ],
              "value": [
                "dateTime"
              ],
              "defaultValue": {
                "dynamicValue": "none"
              },
              "chartId": "1",
              "chartName": "中心仓人效明细统计",
              "chartExtraConfig": {
                "hasClear": true
              }
            }
          ],
          "type": "lately",
          "dataWindow": "day",
          "code": "wdk_ums_metrics;warehouseYouXuanEffect.query;WDK_METRICS",
          "externalFormData": {
            "isShowTotalCount": true
          },
          "isChartTitleShow": true,
          "title": "titletest",
          "sceneCode": "",
          "entityCode": "",
          "chartTitle": "中心仓人效明细统计",
          "moduleConfig": {},
          "description": "中心仓人效明细统计",
          "tabTitle": "中心仓人效明细统计"
        },
        "moved": false,
        "static": false,
        "isChartGroup": true
      }
    ]
  },
  {
    "id": 2735,
    "json": [
      {
        "i": "0",
        "tileSize": "1*1",
        "extraCharts": [],
        "chart": {
          "id": "1",
          "entityType": "metrics",
          "doubleAxisTypes": [
            "line",
            "line"
          ],
          "appCode": "wdk_ums_metrics",
          "tenant": "WDK_METRICS",
          "label": "盒马在线数据中台;wdk_ums_metrics;pressureFlowQuery.query",
          "metricCode": "wdk_ums_metrics;pressureFlowQuery.query;WDK_METRICS",
          "props_schema": [],
          "wheres": [
            {
              "isVisible": true,
              "label": "压力类型",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "select",
              "relationCharts": [],
              "required": true,
              "remember": false,
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": [
                "configId"
              ],
              "request": [
                {
                  "requestFormat": "\nvar x = data.data.results;\n\n\nfor (i = 0; i < x.length; i++) { \n     var y = x[i].status\n     if(y==0){\n         delete x[i]\n         \n     }\n }\n\nreturn data.data.results",
                  "label": "name",
                  "value": "id",
                  "url": "https://taskcenter.hemaos.com/pressureCenter/queryPressure?pageSize=50&pageNo=1"
                }
              ],
              "chartId": "1",
              "chartName": "仓内压力趋势"
            }
          ],
          "type": "lately",
          "dataWindow": "day",
          "code": "wdk_ums_metrics;pressureFlowQuery.query;WDK_METRICS",
          "isChartTitleShow": true,
          "title": "titletest",
          "sceneCode": "",
          "entityCode": "",
          "chartTitle": "仓内压力趋势",
          "moduleConfig": {},
          "isWhereManual": false,
          "externalFormData": {
            "isRefresh": true,
            "isShowTotalCount": false,
            "refreshType": "refreshByTime",
            "refreshTime": 60,
            "autoRefreshVisible": true,
            "alerts": [
              {
                "type": "current",
                "alertIcon": "danger",
                "op": ">=",
                "column": "pressureValue",
                "dynamicValue": "fixed",
                "fixed": 180
              }
            ]
          }
        },
        "moved": false,
        "static": false
      }
    ]
  },
  {
    "id": 2735,
    "json": [
      {
        "i": "0",
        "tileSize": "1*1",
        "extraCharts": [],
        "chart": {
          "id": "1",
          "entityType": "metrics",
          "doubleAxisTypes": [
            "line",
            "line"
          ],
          "appCode": "wdk_ums_metrics",
          "tenant": "WDK_METRICS",
          "label": "盒马在线数据中台;wdk_ums_metrics;pressureFlowQuery.query",
          "metricCode": "wdk_ums_metrics;pressureFlowQuery.query;WDK_METRICS",
          "props_schema": [],
          "wheres": [
            {
              "isVisible": true,
              "label": "压力类型",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "select",
              "relationCharts": [],
              "required": true,
              "remember": false,
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": [
                "configId"
              ],
              "request": [
                {
                  "requestFormat": "\nvar x = data.data.results;\n\n\nfor (i = 0; i < x.length; i++) { \n     var y = x[i].status\n     if(y==0){\n         delete x[i]\n         \n     }\n }\n\nreturn data.data.results",
                  "label": "name",
                  "value": "id",
                  "url": "https://taskcenter.hemaos.com/pressureCenter/queryPressure?pageSize=50&pageNo=1"
                }
              ],
              "chartId": "1",
              "chartName": "仓内压力趋势"
            }
          ],
          "type": "lately",
          "dataWindow": "day",
          "code": "wdk_ums_metrics;pressureFlowQuery.query;WDK_METRICS",
          "isChartTitleShow": true,
          "title": "titletest",
          "sceneCode": "",
          "entityCode": "",
          "chartTitle": "仓内压力趋势",
          "moduleConfig": {},
          "isWhereManual": false,
          "externalFormData": {
            "isRefresh": true,
            "isShowTotalCount": false,
            "refreshType": "refreshByTime",
            "refreshTime": 60,
            "autoRefreshVisible": true,
            "alerts": [
              {
                "type": "current",
                "alertIcon": "danger",
                "op": ">=",
                "column": "pressureValue",
                "dynamicValue": "fixed",
                "fixed": 180
              }
            ]
          }
        },
        "moved": false,
        "static": false
      }
    ]
  },
  {
    "id": 2741,
    "json": [
      {
        "i": "1",
        "tileSize": "1*1",
        "extraCharts": [
          {
            "chart": {
              "id": "2",
              "entityType": "metrics",
              "doubleAxisTypes": [
                "line",
                "line"
              ],
              "appCode": "wdk_ums_metrics",
              "tenant": "WDK_METRICS",
              "label": "盒马在线数据中台;wdk_ums_metrics;gridWarehouseUserEffect.query",
              "metricCode": "wdk_ums_metrics;gridWarehouseUserEffect.query;WDK_METRICS",
              "dimensions": [
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    }
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "网格仓"
                  },
                  "code": "warehouseName",
                  "name": "warehouseName",
                  "label": "warehouseName"
                },
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    }
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "作业人员"
                  },
                  "code": "userName",
                  "name": "userName",
                  "label": "userName"
                },
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    }
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "总任务数"
                  },
                  "code": "taskCount",
                  "name": "taskCount",
                  "label": "taskCount"
                },
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    }
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "分播件数"
                  },
                  "code": "qtyNumber",
                  "name": "qtyNumber",
                  "label": "qtyNumber"
                },
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    }
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "分播开始时间"
                  },
                  "code": "startTime",
                  "name": "startTime",
                  "label": "startTime"
                },
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    }
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "分播结束时间"
                  },
                  "code": "endTime",
                  "name": "endTime",
                  "label": "endTime"
                },
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    },
                    "desc": "分播结束时间-分播开始时间"
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "分播时间差"
                  },
                  "code": "workTime",
                  "name": "workTime",
                  "label": "workTime"
                },
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    }
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "分播人效（件数/小时）"
                  },
                  "code": "effect",
                  "name": "effect",
                  "label": "effect"
                }
              ],
              "indicators": [],
              "props_schema": [],
              "chartType": {
                "tag": "shuhe",
                "type": "pc",
                "id": 2,
                "name": "Table",
                "icon": [
                  "#icon-table",
                  "#icon-table_active"
                ],
                "description": "表格",
                "url": "//g.alicdn.com/wdk-frontend-release/shuhe-widgets/0.1.338/Table.js",
                "props_schema": [],
                "dimension_require": "n",
                "data_require": "n",
                "isRelease": true,
                "createdat": ""
              },
              "wheres": [
                {
                  "isVisible": true,
                  "label": "统计日期",
                  "op": "in",
                  "format": "YYYY-MM-DD",
                  "type": "date",
                  "relationCharts": [],
                  "required": true,
                  "remember": false,
                  "isMergeFilter": true,
                  "chartIds": [
                    "1",
                    "2"
                  ],
                  "value": [
                    "dateTime"
                  ],
                  "defaultValue": {
                    "dynamicValue": "T-1"
                  },
                  "chartId": "1",
                  "chartName": ""
                },
                {
                  "isVisible": true,
                  "label": "仓编码",
                  "op": "=",
                  "format": "YYYY-MM-DD HH:mm:ss",
                  "type": "input",
                  "relationCharts": [],
                  "required": false,
                  "remember": false,
                  "isMergeFilter": true,
                  "chartIds": [
                    "1",
                    "2"
                  ],
                  "value": [
                    "warehouseCodes"
                  ],
                  "isPreview": true,
                  "defaultValue": {
                    "dynamicValue": "cookie",
                    "cookie": "WDK_WAREHOUSE_CODE"
                  }
                }
              ],
              "type": "lately",
              "dataWindow": "day",
              "code": "wdk_ums_metrics;gridWarehouseUserEffect.query;WDK_METRICS",
              "chartFormData": {
                "isDownLoad": false,
                "downLoadType": "downLoadService",
                "downLoadFront": {
                  "downloadName": "default"
                },
                "isPaging": true,
                "drillConfig": {
                  "isDrill": false,
                  "drillKey": "id",
                  "drillType": "base",
                  "isAlignRight": false,
                  "drillParentKey": "parentId",
                  "drillLevel": 0
                },
                "defautlOpenRowLevel": 0,
                "isDownload": true
              },
              "isChartTitleShow": true,
              "title": "titletest",
              "sceneCode": "",
              "entityCode": "",
              "moduleConfig": {},
              "tabTitle": "人效明细",
              "externalFormData": {
                "isShowTotalCount": true
              }
            },
            "tileSize": "1*1",
            "textSchema": {
              "primaryIndicators": [],
              "secondaryIndicators": {}
            },
            "parentId": "1"
          }
        ],
        "chart": {
          "id": "1",
          "entityType": "metrics",
          "doubleAxisTypes": [
            "line",
            "line"
          ],
          "appCode": "wdk_ums_metrics",
          "tenant": "WDK_METRICS",
          "label": "盒马在线数据中台;wdk_ums_metrics;gridWarehouseUserEffectDetail.query",
          "metricCode": "wdk_ums_metrics;gridWarehouseUserEffectDetail.query;WDK_METRICS",
          "props_schema": [],
          "wheres": [
            {
              "isVisible": true,
              "label": "统计日期",
              "op": "in",
              "format": "YYYY-MM-DD",
              "type": "date",
              "relationCharts": [],
              "required": true,
              "remember": false,
              "isMergeFilter": true,
              "chartIds": [
                "1",
                "2"
              ],
              "value": [
                "dateTime"
              ],
              "defaultValue": {
                "dynamicValue": "T-1"
              },
              "chartId": "1",
              "chartName": ""
            },
            {
              "isVisible": true,
              "label": "仓编码",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "input",
              "relationCharts": [],
              "required": false,
              "remember": false,
              "isMergeFilter": true,
              "chartIds": [
                "1",
                "2"
              ],
              "value": [
                "warehouseCodes"
              ],
              "isPreview": true,
              "defaultValue": {
                "dynamicValue": "cookie",
                "cookie": "WDK_WAREHOUSE_CODE"
              }
            }
          ],
          "type": "lately",
          "dataWindow": "day",
          "code": "wdk_ums_metrics;gridWarehouseUserEffectDetail.query;WDK_METRICS",
          "isChartTitleShow": true,
          "title": "titletest",
          "sceneCode": "",
          "entityCode": "",
          "chartTitle": "",
          "moduleConfig": {},
          "externalFormData": {
            "isShowTotalCount": true
          },
          "description": "人效汇总",
          "tabTitle": "人效汇总"
        },
        "moved": false,
        "static": false,
        "isChartGroup": true
      }
    ]
  },
  {
    "id": 2742,
    "json": [
      {
        "i": "1",
        "tileSize": "1*1",
        "extraCharts": [
          {
            "chart": {
              "id": "2",
              "entityType": "metrics",
              "doubleAxisTypes": [
                "line",
                "line"
              ],
              "appCode": "wdk_ums_metrics",
              "tenant": "WDK_METRICS",
              "label": "盒马在线数据中台;wdk_ums_metrics;gridWarehouseUserEffect.query",
              "metricCode": "wdk_ums_metrics;gridWarehouseUserEffect.query;WDK_METRICS",
              "dimensions": [
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    }
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "网格仓"
                  },
                  "code": "warehouseName",
                  "name": "warehouseName",
                  "label": "warehouseName"
                },
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    }
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "作业人员"
                  },
                  "code": "userName",
                  "name": "userName",
                  "label": "userName"
                },
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    }
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "总任务数"
                  },
                  "code": "taskCount",
                  "name": "taskCount",
                  "label": "taskCount"
                },
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    }
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "分播件数"
                  },
                  "code": "qtyNumber",
                  "name": "qtyNumber",
                  "label": "qtyNumber"
                },
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    }
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "分播开始时间"
                  },
                  "code": "startTime",
                  "name": "startTime",
                  "label": "startTime"
                },
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    }
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "分播结束时间"
                  },
                  "code": "endTime",
                  "name": "endTime",
                  "label": "endTime"
                },
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    },
                    "desc": "分播结束时间-分播开始时间"
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "分播时间差"
                  },
                  "code": "workTime",
                  "name": "workTime",
                  "label": "workTime"
                },
                {
                  "auxiliaryData": {
                    "commons": []
                  },
                  "dataFormatter": {
                    "type": "number",
                    "isCeil": true,
                    "number": {
                      "decimalDigits": 2,
                      "thousandthSeparated": true
                    },
                    "percent": {
                      "decimalDigits": 2
                    }
                  },
                  "dataRequest": {},
                  "extra": {
                    "invisible": false
                  },
                  "labelAdvanced": {
                    "type": "none",
                    "drillType": "out",
                    "dialog": {
                      "width": 800,
                      "height": 400
                    }
                  },
                  "labelFormatter": {
                    "type": false,
                    "alias": "分播人效（件数/小时）"
                  },
                  "code": "effect",
                  "name": "effect",
                  "label": "effect"
                }
              ],
              "indicators": [],
              "props_schema": [],
              "chartType": {
                "tag": "shuhe",
                "type": "pc",
                "id": 2,
                "name": "Table",
                "icon": [
                  "#icon-table",
                  "#icon-table_active"
                ],
                "description": "表格",
                "url": "//g.alicdn.com/wdk-frontend-release/shuhe-widgets/0.1.338/Table.js",
                "props_schema": [],
                "dimension_require": "n",
                "data_require": "n",
                "isRelease": true,
                "createdat": ""
              },
              "wheres": [
                {
                  "isVisible": true,
                  "label": "统计日期",
                  "op": "in",
                  "format": "YYYY-MM-DD",
                  "type": "date",
                  "relationCharts": [],
                  "required": true,
                  "remember": false,
                  "isMergeFilter": true,
                  "chartIds": [
                    "1",
                    "2"
                  ],
                  "value": [
                    "dateTime"
                  ],
                  "defaultValue": {
                    "dynamicValue": "T-1"
                  },
                  "chartId": "1",
                  "chartName": ""
                },
                {
                  "isVisible": true,
                  "label": "网格仓",
                  "op": null,
                  "format": "YYYY-MM-DD HH:mm:ss",
                  "type": "asyncSelect",
                  "relationCharts": [],
                  "required": true,
                  "remember": false,
                  "isMergeFilter": true,
                  "chartIds": [
                    "1",
                    "2"
                  ],
                  "value": [
                    "warehouseCodes"
                  ],
                  "isPreview": false,
                  "defaultValue": {
                    "dynamicValue": "all",
                    "cookie": "WDK_WAREHOUSE_CODE"
                  },
                  "chartId": "1",
                  "chartName": "",
                  "enum": [],
                  "subDefault": {
                    "defaultValue": {
                      "dynamicValue": "default"
                    }
                  },
                  "request": [
                    {
                      "requestFormat": "return data.data.queryGridWarehouseEnumGeneral.data",
                      "label": "value",
                      "value": "code",
                      "url": "https://ark.hemaos.com/graphql/warehousing/queryGridWarehouseEnumGeneral"
                    }
                  ]
                }
              ],
              "type": "lately",
              "dataWindow": "day",
              "code": "wdk_ums_metrics;gridWarehouseUserEffect.query;WDK_METRICS",
              "chartFormData": {
                "isDownLoad": false,
                "downLoadType": "downLoadService",
                "downLoadFront": {
                  "downloadName": "default"
                },
                "isPaging": true,
                "drillConfig": {
                  "isDrill": false,
                  "drillKey": "id",
                  "drillType": "base",
                  "isAlignRight": false,
                  "drillParentKey": "parentId",
                  "drillLevel": 0
                },
                "defautlOpenRowLevel": 0,
                "isDownload": true
              },
              "isChartTitleShow": true,
              "title": "titletest",
              "sceneCode": "",
              "entityCode": "",
              "moduleConfig": {},
              "tabTitle": "人效明细",
              "externalFormData": {
                "isShowTotalCount": true
              }
            },
            "tileSize": "1*1",
            "textSchema": {
              "primaryIndicators": [],
              "secondaryIndicators": {}
            },
            "parentId": "1",
            "index": 1
          }
        ],
        "chart": {
          "id": "1",
          "entityType": "metrics",
          "doubleAxisTypes": [
            "line",
            "line"
          ],
          "appCode": "wdk_ums_metrics",
          "tenant": "WDK_METRICS",
          "label": "盒马在线数据中台;wdk_ums_metrics;gridWarehouseUserEffectDetail.query",
          "metricCode": "wdk_ums_metrics;gridWarehouseUserEffectDetail.query;WDK_METRICS",
          "props_schema": [],
          "wheres": [
            {
              "isVisible": true,
              "label": "统计日期",
              "op": "in",
              "format": "YYYY-MM-DD",
              "type": "date",
              "relationCharts": [],
              "required": true,
              "remember": false,
              "isMergeFilter": true,
              "chartIds": [
                "1",
                "2"
              ],
              "value": [
                "dateTime"
              ],
              "defaultValue": {
                "dynamicValue": "T-1"
              },
              "chartId": "1",
              "chartName": ""
            },
            {
              "isVisible": true,
              "label": "网格仓",
              "op": null,
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "asyncSelect",
              "relationCharts": [],
              "required": true,
              "remember": false,
              "isMergeFilter": true,
              "chartIds": [
                "1",
                "2"
              ],
              "value": [
                "warehouseCodes"
              ],
              "isPreview": false,
              "defaultValue": {
                "dynamicValue": "all",
                "cookie": "WDK_WAREHOUSE_CODE"
              },
              "chartId": "1",
              "chartName": "",
              "enum": [],
              "subDefault": {
                "defaultValue": {
                  "dynamicValue": "default"
                }
              },
              "request": [
                {
                  "requestFormat": "return data.data.queryGridWarehouseEnumGeneral.data",
                  "label": "value",
                  "value": "code",
                  "url": "https://ark.hemaos.com/graphql/warehousing/queryGridWarehouseEnumGeneral"
                }
              ]
            }
          ],
          "type": "lately",
          "dataWindow": "day",
          "code": "wdk_ums_metrics;gridWarehouseUserEffectDetail.query;WDK_METRICS",
          "isChartTitleShow": true,
          "title": "titletest",
          "sceneCode": "",
          "entityCode": "",
          "chartTitle": "",
          "moduleConfig": {},
          "externalFormData": {
            "isShowTotalCount": true
          },
          "description": "人效汇总",
          "tabTitle": "人效汇总"
        },
        "moved": false,
        "static": false,
        "isChartGroup": true
      }
    ]
  },
  {
    "id": 2746,
    "json": [
      {
        "i": "1",
        "tileSize": "1*1",
        "extraCharts": [],
        "chart": {
          "id": "1",
          "entityType": "metrics",
          "doubleAxisTypes": [
            "line",
            "line"
          ],
          "appCode": "wdk_ums_metrics",
          "tenant": "WDK_METRICS",
          "label": "盒马在线数据中台;wdk_ums_metrics;centerWarehouseEffect.query",
          "metricCode": "wdk_ums_metrics;centerWarehouseEffect.query;WDK_METRICS",
          "props_schema": [],
          "wheres": [
            {
              "isVisible": true,
              "label": "统计日期",
              "op": "=",
              "format": "YYYY-MM-DD",
              "type": "date",
              "relationCharts": [],
              "required": true,
              "remember": false,
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": [
                "dateTime"
              ],
              "chartId": "1"
            },
            {
              "isVisible": true,
              "label": "仓编码",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "input",
              "relationCharts": [],
              "required": true,
              "remember": false,
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": [
                "warehouseCodes"
              ],
              "defaultValue": {
                "dynamicValue": "cookie",
                "cookie": "WDK_WAREHOUSE_CODE"
              },
              "chartId": "1",
              "isPreview": true
            }
          ],
          "type": "lately",
          "dataWindow": "day",
          "code": "wdk_ums_metrics;centerWarehouseEffect.query;WDK_METRICS",
          "externalFormData": {
            "isShowTotalCount": true
          }
        },
        "moved": false,
        "static": false
      }
    ]
  },
  {
    "id": 2746,
    "json": [
      {
        "i": "1",
        "tileSize": "1*1",
        "extraCharts": [],
        "chart": {
          "id": "1",
          "entityType": "metrics",
          "doubleAxisTypes": [
            "line",
            "line"
          ],
          "appCode": "wdk_ums_metrics",
          "tenant": "WDK_METRICS",
          "label": "盒马在线数据中台;wdk_ums_metrics;centerWarehouseEffect.query",
          "metricCode": "wdk_ums_metrics;centerWarehouseEffect.query;WDK_METRICS",
          "props_schema": [],
          "wheres": [
            {
              "isVisible": true,
              "label": "统计日期",
              "op": "=",
              "format": "YYYY-MM-DD",
              "type": "date",
              "relationCharts": [],
              "required": true,
              "remember": false,
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": [
                "dateTime"
              ],
              "chartId": "1"
            },
            {
              "isVisible": true,
              "label": "仓编码",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "input",
              "relationCharts": [],
              "required": true,
              "remember": false,
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": [
                "warehouseCodes"
              ],
              "defaultValue": {
                "dynamicValue": "cookie",
                "cookie": "WDK_WAREHOUSE_CODE"
              },
              "chartId": "1",
              "isPreview": true
            }
          ],
          "type": "lately",
          "dataWindow": "day",
          "code": "wdk_ums_metrics;centerWarehouseEffect.query;WDK_METRICS",
          "externalFormData": {
            "isShowTotalCount": true
          }
        },
        "moved": false,
        "static": false
      }
    ]
  },
  {
    "id": 2747,
    "json": [
      {
        "i": "1",
        "tileSize": "1*1",
        "extraCharts": [],
        "chart": {
          "id": "1",
          "entityType": "metrics",
          "doubleAxisTypes": [
            "line",
            "line"
          ],
          "appCode": "wdk_ums_metrics",
          "tenant": "WDK_METRICS",
          "label": "盒马在线数据中台;wdk_ums_metrics;centerWarehouseEffect.query",
          "metricCode": "wdk_ums_metrics;centerWarehouseEffect.query;WDK_METRICS",
          "props_schema": [],
          "wheres": [
            {
              "isVisible": true,
              "label": "统计日期",
              "op": "=",
              "format": "YYYY-MM-DD",
              "type": "date",
              "relationCharts": [],
              "required": true,
              "remember": false,
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": [
                "dateTime"
              ],
              "chartId": "1"
            },
            {
              "isVisible": true,
              "label": "中心仓",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "select",
              "relationCharts": [],
              "required": true,
              "remember": false,
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": [
                "warehouseCodes"
              ],
              "defaultValue": {
                "dynamicValue": "none",
                "cookie": "WDK_WAREHOUSE_CODE"
              },
              "chartId": "1",
              "isPreview": false,
              "enum": [
                {
                  "valueType": "dynamicValue",
                  "label": "优选武汉中心仓",
                  "id": "YX42Z0001"
                }
              ]
            }
          ],
          "type": "lately",
          "dataWindow": "day",
          "code": "wdk_ums_metrics;centerWarehouseEffect.query;WDK_METRICS",
          "externalFormData": {
            "isShowTotalCount": true
          }
        },
        "moved": false,
        "static": false
      }
    ]
  },
  {
    "id": 2747,
    "json": [
      {
        "i": "1",
        "tileSize": "1*1",
        "extraCharts": [],
        "chart": {
          "id": "1",
          "entityType": "metrics",
          "doubleAxisTypes": [
            "line",
            "line"
          ],
          "appCode": "wdk_ums_metrics",
          "tenant": "WDK_METRICS",
          "label": "盒马在线数据中台;wdk_ums_metrics;centerWarehouseEffect.query",
          "metricCode": "wdk_ums_metrics;centerWarehouseEffect.query;WDK_METRICS",
          "props_schema": [],
          "wheres": [
            {
              "isVisible": true,
              "label": "统计日期",
              "op": "=",
              "format": "YYYY-MM-DD",
              "type": "date",
              "relationCharts": [],
              "required": true,
              "remember": false,
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": [
                "dateTime"
              ],
              "chartId": "1"
            },
            {
              "isVisible": true,
              "label": "中心仓",
              "op": "=",
              "format": "YYYY-MM-DD HH:mm:ss",
              "type": "select",
              "relationCharts": [],
              "required": true,
              "remember": false,
              "isMergeFilter": true,
              "chartIds": [
                "1"
              ],
              "value": [
                "warehouseCodes"
              ],
              "defaultValue": {
                "dynamicValue": "none",
                "cookie": "WDK_WAREHOUSE_CODE"
              },
              "chartId": "1",
              "isPreview": false,
              "enum": [
                {
                  "valueType": "dynamicValue",
                  "label": "优选武汉中心仓",
                  "id": "YX42Z0001"
                }
              ]
            }
          ],
          "type": "lately",
          "dataWindow": "day",
          "code": "wdk_ums_metrics;centerWarehouseEffect.query;WDK_METRICS",
          "externalFormData": {
            "isShowTotalCount": true
          }
        },
        "moved": false,
        "static": false
      }
    ]
  }
]
const entityType= []
const wheres = []
a.forEach(item => {
  item.json.forEach((s) => {
    entityType.push({
      id: item.id,
      entityType: s.chart.entityType,
      code: s.chart.code
    })
    s.chart.wheres.forEach((where) => {
      if(where.request && where.request.length > 0 ) {
        where.request.forEach(req => {
          wheres.push({ id: item.id, url: req.url})
        })
      }
    })
  })
})