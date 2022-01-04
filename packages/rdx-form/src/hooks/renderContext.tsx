import React, { useContext } from 'react'
import styled from 'styled-components'
import { BaseType, IFormInfo } from '../components/Forms/types'
import { Tooltip } from '../components/Tooltip'
import { createLayout } from './formLayoutHoooks'
type TReactComponent<T> = React.FC<T> | React.ComponentClass<T>
export interface IFormItemRenderComponentContext {
  TitleComponent: TReactComponent<IContentComponent>
  ContentComponent: TReactComponent<IContentComponent>
  WrapperComponent: TReactComponent<IContentComponent>
}

export const DefaultFormItemRenderComponents = {
  TitleComponent,
  ContentComponent,
  WrapperComponent,
}
export const FormItemRenderComponentsContext = React.createContext<IFormItemRenderComponentContext>(
  DefaultFormItemRenderComponents,
)
export function useFormItemRenderComponentsContext() {
  return React.useContext(FormItemRenderComponentsContext)
}

export interface IMessageComponent {
  msg?: string
}
export interface IContentComponent extends IFormInfo {
  id: string
  useMargin?: boolean
  children?: React.ReactNode
  type?: BaseType
}

export function ErrorComponent(props: IMessageComponent) {
  return (
    <div
      title={props.msg}
      style={{
        color: 'red',
        width: '100%',
        maxHeight: 32,
        maxWidth: 300,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    >
      {props.msg}
    </div>
  )
}
export function DescComponent(props: IMessageComponent) {
  return <div style={{ color: '#999999' }}>{props.msg}</div>
}
export function WrapperComponent(props: IContentComponent) {
  const { type, useMargin = true, wrapperStyle, children, id, layoutExtends = {} } = props
  const { containerStyle } = createLayout(layoutExtends.span)
  return (
    <FormItemWrapper
      data-id={id}
      useMargin={useMargin && type !== BaseType.Object}
      style={{ ...containerStyle, ...wrapperStyle }}
      className="rdx-form-item-wrapper"
    >
      {children}
    </FormItemWrapper>
  )
}
export function ContentComponent(props: IContentComponent) {
  const {
    children,
    title,
    showTitle = true,
    tips,
    contentStyle: contentStyleOuter,
    layoutExtends = {},
    tipsPosition = 'after',
  } = props
  const { contentStyle } = createLayout(layoutExtends.span, showTitle && !!title)
  return (
    <FormStyleItemContent style={{ ...contentStyle, ...contentStyleOuter }} className="rdx-form-item-content-wrapper">
      {children}
      {tips && tipsPosition === 'after' && <Tips tips={tips} />}

      <DescComponent msg={props.desc} />
      <ErrorComponent msg={props.errorMsg} />
      <ErrorComponent msg={(props.formErrorMsg || []).join(',')} />
    </FormStyleItemContent>
  )
}
export function Tips(props: { tips: string }) {
  const { tips } = props
  return (
    <Tooltip
      trigger={
        <span
          style={{
            verticalAlign: 'middle',
            paddingLeft: '6px',
          }}
        >
          <svg
            // t='1602216301118'
            // className='icon'
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            // p-id='1385'
            width="14"
            height="14"
          >
            <path
              d="M512 1024C229.069 1024 0 794.829 0 512S229.069 0 512 0c282.931 0 512 229.171 512 512s-229.069 512-512 512z m-0.034-93.12c231.073 0.066 418.98-187.942 418.913-418.914 0.067-230.904-187.84-418.912-418.913-418.912-231.005 0-418.912 187.907-418.912 418.912 0 231.073 187.907 418.98 418.912 418.913z m-46.511-651.607h93.09v93.09h-93.09v-93.09z m93.09 465.445h-93.09V465.455h93.09v279.263z"
              fill="#8a8a8a"
              p-id="1386"
            ></path>
          </svg>
        </span>
      }
    >
      <div dangerouslySetInnerHTML={{ __html: tips }}></div>
    </Tooltip>
  )
}
export function TitleComponent(props: IContentComponent) {
  const { title, require,titleStyle, showTitle = true, tips, layoutExtends = {}, tipsPosition = 'after' } = props
  const { labelStyle } = createLayout(layoutExtends.span, showTitle && !!title)
  return (
    <>
      {title && showTitle && (
        <FormStyleItemLabel style={{...labelStyle, ...titleStyle}} require={require} className="rdx-form-item-title">
          {title}
          {tips && tipsPosition === 'before' && <Tips tips={tips} />}
        </FormStyleItemLabel>
      )}
    </>
  )
}

const FormStyleItemLabel = styled.div<{
  require: boolean
}>`
  line-height: 28px;
  vertical-align: top;
  color: #666666;
  display: inline-block;
  text-align: right;
  padding-right: 12px;
  line-height: 28px;
  ::before {
    display: ${props => (props.require ? 'visible' : 'none')};
    content: '*';
    color: #ff3000;
    margin-right: 4px;
  }
`
const FormStyleItemContent = styled.div<{
  col?: number
}>`
  line-height: 28px;
  /* flex:  */
`
const FormItemWrapper = styled.div<{
  useMargin: boolean
}>`
  // border: 1px dashed transparent;
  padding-bottom: ${props => {
    return props.useMargin ? 12 : 0
  }}px;
`
