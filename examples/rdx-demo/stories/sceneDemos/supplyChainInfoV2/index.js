import React, { Component } from 'react';
import { createLayout } from './utils';
import SupplyChain from './chart';
import { deliverDataSource, NodeType, Types, VirtualNode } from './constants';
import { Balloon, Icon, Select } from '@alife/hippo';
import '@alife/hippo/dist/hippo.css';

class EdgeSelect extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      error: false,
      dataSource: [],
    };
  }
  componentDidMount() {
    const { value, onChange } = this.props;
    console.log('componentDidMount: ', value);
    this.setState({
      loading: true,
    });
    setTimeout(() => {
      const dataSource = deliverDataSource;
      this.setState(
        {
          dataSource,
          loading: false,
        },
        () => {
          // 1. 如果外部没有值，则初始化
          // 2. 如果外部有值，则要检验是否在结果集中
          if (!value) {
            onChange(dataSource[0].value);
          } else if (!dataSource.find((item) => item.value === value)) {
            this.setState({
              error: true,
            });
          }
        }
      );
    }, 1000);
  }
  componentDidUpdate(nextProps) {
    // 当上一个门店选中值改变的时候，需要重新获取请求
    if (this.props.relyNodeValue !== nextProps.relyNodeValue) {
      this.setState({
        loading: true,
      });
      setTimeout(() => {
        const dataSource = deliverDataSource;
        this.setState(
          {
            dataSource,
            loading: false,
          },
          () => {
            nextProps.onChange(dataSource[0].value);
          }
        );
      }, 1000);
    }
  }
  render() {
    const { value, onChange } = this.props;
    return (
      <span>
        <Select
          value={value}
          onChange={(value) => {
            this.setState(
              {
                error: false,
              },
              () => {
                onChange(value);
              }
            );
          }}
          state={this.state.loading === true ? 'loading' : undefined}
          dataSource={this.state.dataSource}
        />
        {this.state.error && (
          <Balloon
            trigger={
              <Icon type='error' style={{ fontSize: 12, color: 'red' }}></Icon>
            }
          >
            <div>当前选中值不在配送类型中</div>
          </Balloon>
        )}
      </span>
    );
  }
}
export default class SupplyChainInfo extends Component {
  static displayName = 'SupplyChainInfo';

  constructor(props) {
    super(props);
  }

  nodeRender = ({ node }) => {
    const { schema, onChange } = this.props;
    const {
      key,
      value,
      index,
      type,
      shortLabel,
      label,
      backgroundColor,
      required,
    } = node;
    const isPreview = type === Types.BusinessStore;
    return (
      <div
        style={{
          padding: '15px 0px',
          display: 'flex',
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* 虚拟节点不展示 */}
        {key === VirtualNode ? (
          <span></span>
        ) : (
          <div
            style={{
              display: 'flex',
              width: '100%',
              height: '100%',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 32,
                width: 32,
                lineHeight: 40,
                borderRadius: '50%',
                backgroundColor: backgroundColor || 'rgb(132,104,204)',
                color: '#fff',
                fontSize: '16px',
              }}
            >
              {shortLabel}
            </div>
            <strong className={required ? 'label-required' : ''}>
              {label}
            </strong>
            <div>
              <Select
                disabled={isPreview}
                value={value}
                onChange={(value) => {
                  onChange(value, index, NodeType.Node);
                }}
                dataSource={[{ label: '1', value: '1' }]}
              />
              {isPreview && (
                <Balloon
                  trigger={
                    <Icon
                      style={{
                        marginLeft: 6,
                        color: 'lightgrey',
                        fontSize: 10,
                      }}
                      type='prompt'
                    ></Icon>
                  }
                >
                  <div>请到商品适用门店范围中修改哦</div>
                </Balloon>
              )}
            </div>
          </div>
        )}

        {/* <FieldComponent
          {...parentProps}
          store={store}
          componentCode={key}
          changeSelect={(value, storeIdx, key) =>
            props.changeSelect(value, storeIdx, key)
          }
        /> */}
      </div>
    );
  };

  edgeRender = ({ edge, from, to }) => {
    const { schema, onChange } = this.props;
    const { value, index } = edge;
    return (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          color: '#fff',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 20,
        }}
      >
        {/* 前一个选项选中值且不为b2c的时候展示 */}
        {from.value && from.isB2C !== true && (
          <EdgeSelect
            relyNodeValue={from.value}
            // 根据value值是否改变，来判断是否重新获取数据
            value={edge.value}
            onChange={(value) => {
              onChange(value, index, NodeType.Edge);
            }}
            dataSource={deliverDataSource}
          />
        )}
      </div>
    );
  };

  render() {
    const { schema, onChange } = this.props;
    const { nodes: newNodes, edges: newEdges } = createLayout({
      schema,
      rowNumbers: 4,
    });

    return (
      <SupplyChain
        nodeConfig={{
          width: 160,
          height: 120,
        }}
        NodeRender={this.nodeRender}
        EdgeRender={this.edgeRender}
        edgeConfig={{
          width: 150,
          height: 70,
          color: 'rgb(184,184,184)',
          extraWidth: 50,
        }}
        left={10}
        top={10}
        svgConfig={{
          width: newNodes.length >= 3 ? 960 : 520,
          height: Math.ceil(newNodes.length / 4) * (120 + 10),
        }}
        nodes={newNodes}
        edges={newEdges}
      />
    );
  }
}
