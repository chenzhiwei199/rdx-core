import React, { Component } from 'react'
import { DeliverType, NodeType, Types } from './constants'
import Supply from './index'
export default {
  title: '场景专题/配送链路配置',
  parameters: {
    info: { inline: true }
  }
}

const o2oSchema = [
  {
    type: 'businessStore',
    value: '普通门店',
    isB2C: false
  }
]

const b2cSchema = [
  {
    type: 'businessStore',
    value: 'b2c门店',
    isB2C: true
  },
  {
    type: Types.BusinessWarehouse,
  }
]
class Base extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      schema: props.schema
    }
  }
  componentDidUpdate(nextProps) {
    if(this.props.schema !== nextProps.schema) {
      this.setState({
        schema: nextProps.schema
      })
    }
  }
  render () {
    const { title } = this.props
    const { schema } = this.state
    return (
      <div>
        <h3>{title}</h3>
        <br />
        <Supply
          schema={schema}
          onChange={(value, index, type) => {
            const valueType = type === NodeType.Edge ? 'edgeValue' : 'value'
            let newSchema = [
              ...schema.slice(0, index),
              { ...schema[index], [valueType]: value },
              ...schema.slice(index + 1)
            ]
            const afterChangeEdgeValue = newSchema[index].edgeValue

            if (type === NodeType.Edge) {
              // 选中了直配,需要清理后面选中的点
              if (afterChangeEdgeValue === DeliverType.Direct) {
                newSchema = newSchema.slice(0, index + 1)
                newSchema.push({
                  type: Types.Supplier
                })
              } else {
                // 如果最后一个是供应商，需要先干掉
                const last = newSchema[newSchema.length - 1]
                const next = newSchema[index + 1]
                if (last.type === Types.Supplier) {
                  newSchema = newSchema.slice(0, index + 1)
                  newSchema.push({
                    type: Types.Warehouse
                  })
                } else if (!next) {
                  newSchema.push({
                    type: Types.Warehouse
                  })
                }
              }
            }
            this.setState({
              schema: newSchema
            })
          }}
        />
        <pre>{JSON.stringify(schema, null, 2)}</pre>
      </div>
    )
  }
}
export const  配送链路  = () =>  {
  return (
    <div>
      <Base schema={ b2cSchema} title={'B2C'} />
      <Base schema={o2oSchema} title={'O2O'} />
    </div>
  )
}
