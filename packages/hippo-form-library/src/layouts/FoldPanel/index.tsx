import React from 'react'
import styled from 'styled-components'
import { Icon } from '@alife/hippo'
import { Tips } from '../../base/Tips'

const StyleDiv = styled.div`
  .shuhe-custom-block-content {
    transition: all 0.3s;
  }
  .shuhe-custom-block-header {
    padding: 0 8px;
    background: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .shuhe-custom-block-title {
      line-height: 32px;
      padding-left: 8px;
      height: 32px;
      position: relative;
      font-size: 14;
      font-weight: 500;
      color: #333;
      display: inline-block;
      /* ::before {
        content: '';
        display: inline-block;
        height: 16px;
        width: 3px;
        background: #23a3ff;
        position: absolute;
        left: 0;
        top: calc(50% - 16px / 2);
      } */
    }
  }
`

export const FoldPanel = (props: {
  title: any
  tips?: string
  defaultExpaned?: boolean
  children?: React.ReactNode
  preview?: boolean
}) => {
  const { title, tips, defaultExpaned = true, children, preview = false } = props
  const [expanded, setExpanded] = React.useState<boolean>(defaultExpaned)
  const expandStyle = {
    height: 'auto',
    padding: '0px 8px 8px 8px',
  }
  return (
    <React.Fragment>
      <Tips tips={tips}></Tips>
      <StyleDiv
        onClick={() => {
          !preview && setExpanded(!expanded)
        }}
      >
        <div className={`shuhe-custom-block-header `}>
          
          <div  className="shuhe-custom-block-title">{title}</div>
          {!preview && (
            <Icon
              size="xs"
              style={{ color: '#8C8C8C', transition: 'all 0.3s', transform: expanded ? 'rotate(90deg)' : '' }}
              type="arrow-right"
            />
          )}
        </div>
      </StyleDiv>
      <div
        className={`shuhe-custom-block-content`}
        style={{ height: 0, overflow: 'hidden', ...(expanded ? expandStyle : {}) }}
      >
        {props.children}
      </div>
    </React.Fragment>
  )
}
