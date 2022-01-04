import React, { memo, useContext } from 'react'
import styled from 'styled-components'
import { IFormComponentProps } from '../Forms'
import { PathContextInstance, usePathContext, useRdxContext } from '../../hooks'
import { IArrayMutators } from './utils'
import { useFormId } from '../../utils'
export * from './utils'
export interface IArrayBaseRenderOptions {
  //  数组工具方法
  mutators: IArrayMutators
  // 数组最大条数限制
  maxLimit: number
  //  最小数据的限制
  minLimit: number
  // 是否可以删除，当数组数量小于minLimit的时候为false，其他时候为true
  canDelete?: boolean
  // 是否可以新增， 当数组的数量大于maxLimit的时候为false，其他时候为true
  canAdd?: boolean
  // 获取当前表格的数据
  getValue: () => any
}
export interface IArrayRenderOptions extends IArrayBaseRenderOptions {
  //  当前操作行
  currentIndex: number
  // 是否是第一项，当时第一项的时候，不应该使用moveUp方法
  isFirst?: boolean
  // 是否是最后一项，当时最后一项时，不应该是用moveDown方法
  isLast?: boolean
}
export interface IArrayCustomProps {
  maxLimit?: number
  minLimit?: number
  // 标题的渲染方法
  renderTitle?: (options: IArrayRenderOptions) => React.ReactNode
  // 新增按钮的渲染方法
  renderAddition?: (options: IArrayBaseRenderOptions) => React.ReactNode
  // 数据为空时的渲染
  renderEmpty?: (options: IArrayBaseRenderOptions) => React.ReactNode
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
        <span className="card-operate card-title-delete" onClick={() => remove(currentIndex)}>
          删除
        </span>
      )}

      {!isFirst && (
        <span className="card-operate card-title-up" onClick={() => moveUp(currentIndex)}>
          上移
        </span>
      )}
      {!isLast && (
        <span className="card-operate card-title-down" onClick={() => moveDown(currentIndex)}>
          下移
        </span>
      )}
    </>
  )
}
export function useArrayBaseOptions(options: IFormComponentProps<IArrayCustomProps>) {
  const { value, arrayHelper, disabled, componentProps } = options
  const { maxLimit = 1000, minLimit = -1 } = componentProps
  const context = useRdxContext()
  return {
    getValue: () => context.getTaskStateById(useFormId()),
    getEmptyValue: () => arrayHelper.mutators.getEmptyValue(),
    canAdd: value.length < maxLimit,
    canDelete: value.length > minLimit,
    disabled: disabled,
    minLimit,
    maxLimit,
    mutators: arrayHelper.mutators,
  }
}
export function useOptionsFactory(options: IFormComponentProps<IArrayCustomProps>) {
  const { value } = options
  const baseOptions = useArrayBaseOptions(options)
  return index => {
    const isFirst = index === 0
    const isLast = index === value.length - 1
    return {
      ...baseOptions,
      currentIndex: index,
      isFirst: isFirst,
      isLast: isLast,
    } as IArrayRenderOptions
  }
}
export const ArrayCardField = (props: IFormComponentProps<IArrayCustomProps>) => {
  const { value = [], children, arrayHelper, disabled, componentProps: customProps = {} as any } = props
  const { push: add, getEmptyValue } = arrayHelper.mutators
  const context = useRdxContext()
  const {
    renderAddition = () => (
      <StyledAdd
        onClick={() => {
          add(getEmptyValue())
        }}
      >
        添加一项
      </StyledAdd>
    ),
    renderTitle = () => '',
    renderOperations = options => <OpreationComponent options={options} />,
    renderEmpty = () => (
      <img
        src="//img.alicdn.com/tfs/TB1cVncKAzoK1RjSZFlXXai4VXa-184-152.svg"
        style={{ background: 'transparent' }}
      ></img>
    ),
  } = customProps
  const getOptions = useOptionsFactory(props)
  const paths = usePathContext().paths
  return (
    <StyleCard>
      {value.map((item, index) => {
        const options = getOptions(index)
        return (
          <StyleCardItem key={index} style={{ marginTop: options.isFirst ? 0 : 12 }}>
            <PathContextInstance.Provider
              value={{
                paths: [...paths, index.toString()],
              }}
            >
              <StyledItemHeader className="card-title">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {index + 1}.{renderTitle(options)}
                </div>
                <div className="card-operates">{!disabled && renderOperations(options)}</div>
              </StyledItemHeader>
            </PathContextInstance.Provider>

            <StyleBody className="card-body">
              {(children as any).props.type === 'object'
                ? React.cloneElement(children as any, { name: `${index}` })
                : React.cloneElement(children as any, { name: `${index}` })}
            </StyleBody>
          </StyleCardItem>
        )
      })}
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
  margin-top: 12px;
`
const StyleCardItem = styled.div`
  border: 1px solid #dcdee3;
  padding: 0 12px 12px 12px;
`
const StyleEmpty = styled.div`
  display: flex;
  border: 1px solid #dcdee3;
  flex-direction: center;
  align-items: center;
  justify-content: center;
`
const StyleCard = styled.div``
const StyledItemHeader = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e6e7eb;
  margin-bottom: 0;
  font-size: 16px;
  margin-bottom: 12px;
  .card-operates {
    .card-operate {
      cursor: pointer;
      margin-left: 6px;
    }
  }
`
const StyledAdd = styled.div`
  border: 1px solid #dcdee3;
  margin-top: 20px;
  margin-bottom: 3px;
  display: flex;
  cursor: pointer;
  -webkit-box-pack: center;
  justify-content: center;
  box-shadow: rgba(0, 0, 0, 0.1) 1px 1px 4px 0px;
  background: rgb(255, 255, 255);
  padding: 10px 0px;
`
export default Array
