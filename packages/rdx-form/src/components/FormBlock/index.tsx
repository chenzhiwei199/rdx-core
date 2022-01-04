import React from 'react'
import styled from 'styled-components'
const StyleFormBlock = styled.div`
  .form-block-title {
    position: relative;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #e6e7eb;
    padding-left: 8px;
    margin-bottom: 8px;
    &::before {
      content: '';
      display: inline-block;
      height: 16px;
      width: 3px;
      background: #5584ff;
      position: absolute;
      left: 0;
      top: calc(50% - 16px / 2);
    }
  }
`
export function FormBlock({ title, children }) {
  return (
    <StyleFormBlock>
      <div className="form-block-title">{title}</div>
      {children}
    </StyleFormBlock>
  )
}
