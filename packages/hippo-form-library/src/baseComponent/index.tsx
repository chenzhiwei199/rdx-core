import * as React from 'react'
import styled from 'styled-components'

export const FlexRow = styled.div`
  display: flex;
`

export const FlexCell = styled.div<{ col?: number }>`
  flex: ${props => props.col || 1};
`

export const FlexCol = styled.div<{ col?: number }>`
  display: flex;
  flex: ${props => props.col || 1};
  flex-direction: column;
`

export const StyledGrid = styled.div<{ col?: number }>`
  display: grid;
  grid-template-columns: ${props => `repeat(auto-fill, minmax(${100 / props.col}%, 1fr))`};
`
