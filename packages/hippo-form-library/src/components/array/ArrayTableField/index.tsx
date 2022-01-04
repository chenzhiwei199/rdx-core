import React, { memo, useContext, useEffect, useMemo } from 'react';
import {
  IFormComponentProps,
  PathContextInstance,
  usePathContext,
  IArrayCustomProps,
  useRdxContext,
  IArrayRenderOptions,
  useFormId,
  useOptionsFactory,
} from '@alife/rdx-form';
import styled from 'styled-components';
import { Table, Icon, Balloon } from '@alife/hippo';

const ArrayTableField = (
  props: IFormComponentProps<Omit<IArrayCustomProps, 'renderTitle'>>
) => {
  const { value = [], disabled, children, arrayHelper, componentProps } = props;
  const { mutators } = arrayHelper;
  const { remove, moveDown, moveUp, push, getEmptyValue } = mutators;
  const {
    // 少了不能删
    minLimit = 0,
    // 多了不能加
    maxLimit = 1000,
    renderEmpty,
    renderOperations = (options) => {
      const { currentIndex: index, isFirst, isLast } = options;
      return (
        <StyledIconWrapper>
          {value.length > minLimit && (
            <Icon
              onClick={() => {
                remove(index);
              }}
              type='ashbin'
            />
          )}
          {!isFirst && (
            <Icon
              onClick={() => {
                moveUp(index);
              }}
              type='arrow-up'
            ></Icon>
          )}
          {!isLast && (
            <Icon
              onClick={() => {
                moveDown(index);
              }}
              type='arrow-down'
            ></Icon>
          )}
        </StyledIconWrapper>
      );
    },
    renderAddition = () => (
      <StyledAdd
        onClick={() => {
          push(getEmptyValue());
        }}
      >
        新增一项
      </StyledAdd>
    ),
  } = componentProps;
  const context = useRdxContext();
  const getOptions = useOptionsFactory(props)

  const operateColumn = {
    dataIndex: '____operation',
    title: '操作',
    width: 150,
    cell: (v, index) => {
      // @ts-ignore
      return renderOperations(getOptions(index));
    },
  };
  const isObject = (children as any).props.type === 'object';
  const columns = isObject
    ? React.Children.map((children as any).props.children, (item) => ({
        info: item.props,
        children: item,
      }))
    : [{ info: (children as any).props, children: children }];
  const paths = usePathContext().paths;
  return (
    <StyleCard>
      <Table
        {...({} as any)}
        emptyRender={
          renderEmpty ? () => renderEmpty(getOptions(null)) : undefined
        }
        showZebra={true}
        // !应该数据更新的地方有bug，导致这里不生成新对象会挂
        dataSource={value}
      >
        {[
          ...columns.map((item, colIndex) => ({
            dataIndex: item.info.name,
            width: item.info.layoutExtends && item.info.layoutExtends.width,
            title: (
              <span>
                {item.info.title}{' '}
                {item.info.tips && (
                  <Balloon trigger={<Icon type='prompt'></Icon>}>
                    {item.info.tips}
                  </Balloon>
                )}
              </span>
            ),
            cell: (value, rowIndex) => {
              let cmp;
              if (isObject) {
                cmp = (
                  <PathContextInstance.Provider
                    value={{
                      paths: [...paths, rowIndex.toString()],
                    }}
                  >
                    {React.cloneElement(item.children, { tips: undefined, showTitle: false })}
                  </PathContextInstance.Provider>
                );
              } else {
                cmp = React.cloneElement(item.children, {
                  showTitle: false,
                  tips: undefined,
                  name: rowIndex.toString(),
                });
              }
              return <div key={`${item.info.name}-${rowIndex}`}>{cmp}</div>;
            },
          })),
          !disabled && operateColumn,
        ]
          .filter(Boolean)
          .map((item) => {
            return (
              <Table.Column
                key={item.dataIndex || item.title || 'default'}
                {...item}
              />
            );
          })}
      </Table>
      <PathContextInstance.Provider
        value={{
          paths: [...paths],
        }}
      >
        {value.length < maxLimit &&
          !disabled &&
          renderAddition(getOptions(null))}
      </PathContextInstance.Provider>
    </StyleCard>
  );
};

const StyledIconWrapper = styled.div`
  .next-icon {
    font-size: 16px;
    border: 1px solid transparent;
    padding: 0 6px;
    :hover {
      color: #23a;
      border: 1px dashed #23a;
    }
  }
`;

const StyleCard = styled.div`
  td.hippo-table-cell {
    vertical-align: top;
  }
  box-shadow: none;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(238, 238, 238);
  border-image: initial;
`;
const StyledAdd = styled.div`
  padding: 10px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(251, 251, 251);
  border-left: 1px solid rgb(220, 222, 227);
  border-right: 1px solid rgb(220, 222, 227);
  border-bottom: 1px solid rgb(220, 222, 227);
`;
export default ArrayTableField;
