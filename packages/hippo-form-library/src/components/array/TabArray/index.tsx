import { Button, Icon } from '@alife/hippo'
import React from 'react'
import { FlexCell, FlexCol, FlexRow } from '../../../baseComponent'
import { IArrayMutators, IFormComponentProps } from '@alife/rdx-form'
import { useState } from 'react'
export function TabArray(
  props: IFormComponentProps<{
    title?: React.ReactNode
    mainColumn?: React.ReactElement
    mainColumnStyle?: React.CSSProperties
    containerStyle?: React.CSSProperties
    contentStyle?: React.CSSProperties
    placeholder?: React.ReactNode
    active?: number
    onActive?: (active: number,) => void
    operates?: (props: { mutators?: IArrayMutators }) => React.ReactNode
    rowOperates?: (props: { mutators?: IArrayMutators; index: number }) => React.ReactNode
  }>,
) {
  const { value, componentProps, arrayHelper, children } = props
  const {
    mainColumn,
    contentStyle,
    mainColumnStyle,
    title = '默认标题',
    placeholder,
    containerStyle,
    active: outerActive,
    onActive: outerOnActive,
    rowOperates = ({ index }) => {
      const data = [
        {
          icon: 'arrow-up',
          action: () => {
            arrayHelper.mutators.moveUp(index)
          },
        },
        {
          icon: 'arrow-down',
          action: () => {
            arrayHelper.mutators.moveDown(index)
          },
        },
        {
          icon: 'ashbin',
          action: () => {
            arrayHelper.mutators.remove(index)
          },
        },
      ]
      return (
        <span style={{ marginLeft: 12 }}>
          {data.map((item, index) => (
            <Button
              text
              key={item.icon}
              style={{ marginLeft: index !== 0 && 6 }}
              type="primary"
              onClick={ev => {
                ev.stopPropagation()
                item.action()
              }}
            >
              <Icon type={item.icon}></Icon>
            </Button>
          ))}
        </span>
      )
    },
    operates = () => {
      return (
        <Button
          type="primary"
          text
          onClick={() => {
            arrayHelper.mutators.push(arrayHelper.mutators.getEmptyValue())
            onActive(value.length)
          }}
        >
          <Icon type="add"></Icon>
        </Button>
      )
    },
  } = componentProps
  // 默认高亮第一项
  const [innerActive, innerSetActive] = useState(0)
  let active = outerOnActive ? outerActive : innerActive
  let onActive = outerOnActive ? outerOnActive : innerSetActive
  return (
    <FlexCol style={{ display: 'flex', width: '100%', ...containerStyle }}>
      <FlexCell col={1} style={{ paddingBottom: 12,width: '100%', ...mainColumnStyle }}>
        <FlexRow style={{ justifyContent: 'space-between', width: '100%', }}>
          <FlexRow style={{ display: 'flex', width: '100%', alignItems: 'center', borderBottom: '1px solid lightgrey' }}>
            {value.length === 0 && '请点击添加按钮，新增一项'}
            <div style={{ flex: 1, whiteSpace: 'nowrap', overflowX: 'auto', overflowY: 'hidden', display: 'flex' }}>
              {value.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    onActive?.(index)
                  }}
                  style={{
                    padding: '12px 16px',
                    marginRight: 12,
                    justifyContent: 'space-between',
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: active === index ? 500 : 'unset',
                    color: active === index ? '#3862cf' : '#333',
                    transition: 'all .3s linear',
                    borderBottom: active === index ? '2px solid #3862cf' : '2px solid white',
                  }}
                >
                  {mainColumn && React.cloneElement(mainColumn, { name: index + '' })}
                  {title && `${title}.${index + 1}`}
                  {rowOperates({ mutators: arrayHelper.mutators, index })}
                </div>
              ))}
            </div>
            <div style={{ flexShrink: 0, marginLeft: 12 }}>{operates({ mutators: arrayHelper.mutators })}</div>
          </FlexRow>
        </FlexRow>
      </FlexCell>
      <FlexCell col={1} style={contentStyle}>
        {active !== undefined && active < value.length
          ? React.cloneElement(children, { name: active + '' })
          : placeholder}
      </FlexCell>
    </FlexCol>
  )
}
