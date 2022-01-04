import * as React from 'react'
import {
  IArrayCustomProps,
  IArrayRenderOptions,
  IFormComponentProps,
  PathContextInstance,
  useArrayBaseOptions,
  useOptionsFactory,
  usePathContext,
} from '@alife/rdx-form'
import { FlexCol, StyledGrid } from '../../../baseComponent'
import { Button, Icon } from '@alife/hippo'
import styled from 'styled-components'
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
`
export function SimpleList(
  props: IFormComponentProps<
    {
      containerStyle?: React.CSSProperties
      titleStyle?: React.CSSProperties
    } & IArrayCustomProps
  >,
) {
  const { value, children, disabled, arrayHelper, componentProps } = props
  const paths = usePathContext().paths
  const baseOptions = useArrayBaseOptions(props)
  const getOptions = useOptionsFactory(props)
  const {
    titleStyle,
    containerStyle,
    renderAddition = () => (
      <Button
        type="primary"
        onClick={() => {
          arrayHelper.mutators.push(arrayHelper.mutators.getEmptyValue())
        }}
      >
        新增一项
      </Button>
    ),
    renderEmpty = () => (
      <div
        // src="//img.alicdn.com/tfs/TB1cVncKAzoK1RjSZFlXXai4VXa-184-152.svg"
        style={{
          padding: '20px 0px',
          border: '1px dashed rgb(134, 134, 130)',
          textAlign: 'center',
          verticalAlign: 'middle',
          color: 'rgb(134, 134, 130)',
          background: 'transparent',
          borderRadius: 4,
          marginBottom: 12
        }}
      >
        {' '}
        请添加数据
      </div>
    ),
    renderOperations = options => {
      const { currentIndex: index, mutators, isFirst, isLast, minLimit } = options
      return (
        <StyledIconWrapper>
          {value.length > minLimit && (
            <Icon
              onClick={() => {
                mutators.remove(index)
              }}
              type="ashbin"
            />
          )}
          {!isFirst && (
            <Icon
              onClick={() => {
                mutators.moveUp(index)
              }}
              type="arrow-up"
            ></Icon>
          )}
          {!isLast && (
            <Icon
              onClick={() => {
                mutators.moveDown(index)
              }}
              type="arrow-down"
            ></Icon>
          )}
        </StyledIconWrapper>
      )
    },
  } = componentProps
  const titles = ((children as React.ReactElement).props.children as React.ReactElement[]).map(item => item.props.title)
  const childrens = (children as React.ReactElement).props.children as React.ReactElement[]
  const length = childrens.length
  return (
    <FlexCol style={containerStyle}>
      {
        <StyledGrid col={renderOperations ? length + 1 : length}>
          {titles.map((title, index) => (
            <span key={index} style={titleStyle}>
              {title}
            </span>
          ))}
        </StyledGrid>
      }
      {value.map((item, index) =>
        React.cloneElement(children, {
          name: index + '',
          children: (
            <StyledGrid key={index} col={renderOperations ? length + 1 : length}>
              {React.Children.map(childrens, item => {
                return React.cloneElement(item, { showTitle: false })
              })}
              {renderOperations && renderOperations(getOptions(index))}
            </StyledGrid>
          ),
        }),
      )}
      {value.length === 0 && renderEmpty(baseOptions)}
      {!disabled && (
        <PathContextInstance.Provider
          value={{
            paths: [...paths],
          }}
        >
          {renderAddition(getOptions(baseOptions))}
        </PathContextInstance.Provider>
      )}
    </FlexCol>
  )
}
