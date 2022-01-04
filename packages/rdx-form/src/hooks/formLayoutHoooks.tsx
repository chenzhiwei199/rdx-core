import { createContext, useContext } from 'react'

export enum LayoutType {
  Grid = 'grid',
  CssGrid = 'cssGrid',
  Inline = 'inline',
  Classic = 'classic',
  Base = 'base',
}

export enum LabelTextAlign {
  Left = 'left',
  Right = 'right',
  Top = 'top',
}
export interface LayoutContext {
  // 标题所占列数
  labelCol?: number
  // 表单渲染组件所占列数
  wrapCol?: number
  // 标题宽度，仅仅支持在 LayoutType.Inline模式下使用
  labelWidth?: number
  // 表单渲染器的宽度，仅仅支持在 LayoutType.Inline模式下使用
  wrapWidth?: number
  // 布局类型
  layoutType?: LayoutType
  // 文本对齐方式, 指定为LabelTextAlign.Top则为上下排列的结构
  labelTextAlign?: LabelTextAlign
  // 是否自动换行，仅在LayoutType.Grid模式下生效
  autoRow?: boolean
  // Grid总列数，仅在LayoutType.Grid模式下生效
  columns?: number
  cssGridColumns?: number
}
export const LayoutContextInstance = createContext<LayoutContext>({})
function getWidth(col: number, max: number = 24) {
  const colspan = (col / max) * 100
  return `${colspan}%`
}

export function createLayout(span: number, showTitle: boolean = true) {
  const layout = useContext(LayoutContextInstance)
  const {
    layoutType = LayoutType.Base,
    columns = 24,
    cssGridColumns = 3,
    labelWidth,
    labelTextAlign = 'right',
    labelCol = 8,
    wrapWidth,
    wrapCol = 16,
  } = layout
  const containerStyle: React.CSSProperties = {}
  const labelStyle: React.CSSProperties = {}
  const contentStyle: React.CSSProperties = {}
  if (layoutType === LayoutType.Base) {
    containerStyle.display = 'flex'
    if (labelTextAlign === LabelTextAlign.Top) {
      containerStyle.flexDirection = 'column'
      labelStyle.textAlign = 'left'
    } else {
      labelStyle.textAlign = labelTextAlign
    }
    labelStyle.width = labelWidth
    contentStyle.width = wrapWidth
    labelStyle.flexGrow = 0
    contentStyle.flex = 1
  } else if (layoutType === LayoutType.Classic) {
    containerStyle.display = 'flex'
    if (labelTextAlign === LabelTextAlign.Top) {
      containerStyle.flexDirection = 'column'
      labelStyle.textAlign = 'left'
    } else {
      labelStyle.textAlign = labelTextAlign
    }
    labelStyle.flex = `0 0 ${labelWidth ? labelWidth + 'px' : getWidth(labelCol)}`
    contentStyle.flex = `0 0 ${wrapWidth ? wrapWidth + 'px' : getWidth(showTitle ? wrapCol : wrapCol + labelCol)}`
    contentStyle.overflow = 'hidden'
  } else if (layoutType === LayoutType.Inline) {
    containerStyle.display = 'inline-block'
    if (labelTextAlign === LabelTextAlign.Right || labelTextAlign === LabelTextAlign.Left) {
      labelStyle.display = 'inline-block'
      labelStyle.width = labelWidth
      contentStyle.width = wrapWidth
      contentStyle.display = 'inline-block'
      labelStyle.textAlign = labelTextAlign
    }
    labelStyle.width = labelWidth
    contentStyle.width = wrapWidth
    contentStyle.marginRight = 20
  } else if (layoutType === LayoutType.Grid) {
    containerStyle.display = 'flex'
    containerStyle.flex = labelStyle.flex = `0 0 ${getWidth(span, columns)}`
    if (labelTextAlign === LabelTextAlign.Top) {
      containerStyle.flexDirection = 'column'
      labelStyle.textAlign = 'left'
    } else {
      labelStyle.textAlign = labelTextAlign
    }
    labelStyle.flex = `0 0 ${getWidth(labelCol)}`
    contentStyle.flex = `0 0 ${getWidth(wrapCol)}`
  } else if (layoutType === LayoutType.CssGrid) {
    containerStyle.display = 'flex'
    containerStyle.flex = labelStyle.flex = `0 0 ${getWidth(span, columns)}`
    if (labelTextAlign === LabelTextAlign.Top) {
      containerStyle.flexDirection = 'column'
      labelStyle.textAlign = 'left'
    } else {
      labelStyle.textAlign = labelTextAlign
    }
    labelStyle.flex = `0 0 ${getWidth(labelCol)}`
    contentStyle.flex = `0 0 ${getWidth(wrapCol)}`
  }
  return {
    containerStyle,
    labelStyle,
    contentStyle,
  }
}
