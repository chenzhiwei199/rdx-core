import React from 'react'
import styled from 'styled-components'
import {
  IFormComponentProps,
  PathContextInstance,
  usePathContext,
  useRdxContext,
  useFormId,
  IArrayMutators,
} from '@alife/rdx-form'
import { Button, Icon } from '@alife/hippo'
export interface IArrayRenderOptions {
  //  数组工具方法
  mutators: IArrayMutators
  //  当前操作行
  currentIndex: number
  // 数组最大条数限制
  maxLimit: number
  //  最小数据的限制
  minLimit: number
  // 是否是第一项，当时第一项的时候，不应该使用moveUp方法
  isFirst?: boolean
  // 是否是最后一项，当时最后一项时，不应该是用moveDown方法
  isLast?: boolean
  // 是否可以删除，当数组数量小于minLimit的时候为false，其他时候为true
  canDelete?: boolean
  // 是否可以新增， 当数组的数量大于maxLimit的时候为false，其他时候为true
  canAdd?: boolean
  // 获取当前表格的数据
  getValue: () => any
}
export interface IArrayCustomProps {
  maxLimit?: number
  minLimit?: number
  // 标题的渲染方法
  renderTitle?: (options: IArrayRenderOptions) => React.ReactNode
  // 新增按钮的渲染方法
  renderAddition?: (options: IArrayRenderOptions) => React.ReactNode
  // 数据为空时的渲染
  renderEmpty?: (options: IArrayRenderOptions) => React.ReactNode
  // 操作区域的渲染方法
  renderOperations?: (options: IArrayRenderOptions) => React.ReactNode
}

export interface IArrayItem {
  value: any
  paths: string[]
  children: React.ReactNode
}
export function OpreationComponent(props: { options: IArrayRenderOptions }) {
  const { options } = props
  const {
    currentIndex,
    canDelete,
    isLast,
    isFirst,
    mutators: { remove, moveDown, moveUp },
  } = options
  return (
    <>
      {canDelete && (
        <Icon type="ashbin" className="card-operate card-title-delete" onClick={() => remove(currentIndex)}></Icon>
      )}

      {!isFirst && (
        <Icon type="arrow-up" className="card-operate card-title-up" onClick={() => moveUp(currentIndex)}></Icon>
      )}
      {!isLast && (
        <Icon type="arrow-down" className="card-operate card-title-down" onClick={() => moveDown(currentIndex)}></Icon>
      )}
    </>
  )
}
export const ArrayList = (props: IFormComponentProps<IArrayCustomProps>) => {
  const { value = [], children, arrayHelper, disabled, componentProps: customProps = {} as any } = props
  const { push: add, getEmptyValue } = arrayHelper.mutators
  const context = useRdxContext()
  const {
    renderAddition = () => (
      <Button
        style={{ width: '100%'}}
        type="primary"
        onClick={() => {
          add(getEmptyValue())
        }}
      >
        添加一项
      </Button>
    ),
    renderTitle = () => '',
    renderOperations = options => <OpreationComponent options={options} />,
    renderEmpty = () => '请添加数据',
    maxLimit = 1000,
    minLimit = -1,
  } = customProps
  const getOptions = index => {
    const isFirst = index === 0
    const isLast = index === value.length - 1
    return {
      getValue: () => context.getTaskStateById(useFormId()),
      minLimit,
      getEmptyValue: () => getEmptyValue(),
      maxLimit,
      disabled: disabled,
      currentIndex: index,
      mutators: arrayHelper.mutators,
      isFirst: isFirst,
      isLast: isLast,
      canAdd: value.length < maxLimit,
      canDelete: value.length > minLimit,
    } as IArrayRenderOptions
  }
  const paths = usePathContext().paths
  return (
    <StyleCard>
      <div>
        {value.map((item, index) => {
          const options = getOptions(index)
          return (
            <StyleCardItem key={index} style={{ marginRight: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <StyleBody className="card-body">
                  {(children as any).props.type === 'object'
                    ? React.cloneElement(children as any, { name: `${index}` })
                    : React.cloneElement(children as any, { name: `${index}` })}
                </StyleBody>
                <div className="card-operates">{!disabled && renderOperations(options)}</div>
              </div>
            </StyleCardItem>
          )
        })}
      </div>

      {value.length === 0 && <StyleEmpty>{renderEmpty(getOptions(null))}</StyleEmpty>}
      {getOptions(null).canAdd && !disabled && (
        <PathContextInstance.Provider
          value={{
            paths: [...paths],
          }}
        >
          {renderAddition(getOptions(null))}
        </PathContextInstance.Provider>
      )}
    </StyleCard>
  )
}

const StyleBody = styled.div`
  /* margin-top: 12px; */
`
const StyleCardItem = styled.div`
  /* border: 1px solid #dcdee3; */
  /* padding: 0 12px 12px 12px; */
`
const StyleEmpty = styled.div`
  display: flex;
  flex-direction: center;
  align-items: center;
  justify-content: center;
`
const StyleCard = styled.div`
  .card-operate {
    cursor: pointer;
    color: #23a3ff;
    padding-left: 6px;
  }
`

export default Array
