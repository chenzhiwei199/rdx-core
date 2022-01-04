import { Button, Icon } from '@alife/hippo'
import React from 'react'
import { FlexCell, FlexCol, FlexRow } from '../../../baseComponent'
import { IArrayMutators, IFormComponentProps } from '@alife/rdx-form'
import { useState } from 'react'
export function ActivateArray(
  props: IFormComponentProps<{
    title?: React.ReactNode
    mainColumn?: React.ReactElement
    mainColumnStyle?: React.CSSProperties
    containerStyle?: React.CSSProperties
    contentStyle?: React.CSSProperties
    placeholder?: React.ReactNode
    active?: number
    onActive?: (active: number) => void
    operates?: (props: { mutators?: IArrayMutators }) => React.ReactNode
    rowOperates?: (props: { mutators?: IArrayMutators; index: number }) => React.ReactNode
  }>,
) {
  const { value, componentProps, arrayHelper, children } = props
  const {
    mainColumn,
    contentStyle,
    mainColumnStyle,
    title,
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
        <span>
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
          }}
        >
          <Icon type="add"></Icon>
        </Button>
      )
    },
  } = componentProps
  const [innerActive, innerSetActive] = useState()
  let active = outerOnActive ? outerActive : innerActive
  let onActive = outerOnActive ? outerOnActive : innerSetActive
  return (
    <FlexRow style={{ display: 'flex', ...containerStyle }}>
      <FlexCell col={1} style={{ ...mainColumnStyle }}>
        <FlexRow style={{ justifyContent: 'space-between' }}>
          <FlexCell col={1}>{title}</FlexCell>
          <FlexCell
            style={{
              flexGrow: 0,
            }}
          >
            {operates({ mutators: arrayHelper.mutators })}
          </FlexCell>
        </FlexRow>
        <FlexCol>
          {value.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                onActive?.(index)
              }}
              style={{
                justifyContent: 'space-between',
                display: 'flex',
                alignItems: 'center',
                background: active === index ? '#eaf8fe' : 'white',
              }}
            >
              {React.cloneElement(mainColumn, { name: index + '' })}
              {rowOperates({ mutators: arrayHelper.mutators, index })}
            </div>
          ))}
        </FlexCol>
      </FlexCell>
      <FlexCell col={1} style={contentStyle}>
        {active !== undefined && active < value.length
          ? React.cloneElement(children, { name: active + '' })
          : placeholder}
      </FlexCell>
    </FlexRow>
  )
}
