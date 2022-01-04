import { ArrayCardField, IFormComponentProps, InferPropsType, ObjectField } from '@alife/rdx-form'
export * from './components'
import ArrayTableField from './components/array/ArrayTableField'
export { default as ArrayTableField } from './components/array/ArrayTableField'
export * from './components/array/ArrayTableField'
import {
  Input,
  Select,
  NumberPicker,
  Radio,
  Switch,
  Checkbox,
  DatePicker,
  TimePicker,
  Rating,
  Upload,
  Transfer,
  TreeSelect,
  TagFilter,
  CascaderSelect,
  RangeInput,
} from '@alife/hippo'

export * from './layouts'
export * from './baseComponent'
export * from '@alife/hippo'
export * from './base/Tips'
import { InputWhenActive } from './components/InputWhenActive'
import { SimpleList } from './components/array/SimpleList'
import { ActivateArray } from './components/array/ActivateArray'
import AsyncSelct from './components/AsyncSelect'
import { ArrayList } from './components/array/ArrayList'
import { TabArray } from './components/array/TabArray'
export const transformBaseComponent = <T extends any>(Cmp: T) => (props: IFormComponentProps<InferPropsType<T>>) => {
  const { value, onChange, state, disabled, preview, componentProps } = props
  return (
    // @ts-ignore
    <Cmp {...componentProps} state={state} isPreview={preview} disabled={disabled} value={value} onChange={onChange} />
  )
}
export const transformBooleanComponent = <T extends any>(Cmp: T) => (props: IFormComponentProps<InferPropsType<T>>) => {
  const { value, onChange, state, disabled, preview, componentProps } = props
  return (
    // @ts-ignore
    <Cmp
      {...componentProps}
      state={state}
      isPreview={preview}
      disabled={disabled}
      checked={value}
      onChange={onChange}
    />
  )
}

const hippoComponentsRef = {
  activateArray: ActivateArray,
  string: transformBaseComponent(Input),
  asyncSelect: transformBaseComponent(AsyncSelct),
  input: transformBaseComponent(Input),
  inputWhenActive: InputWhenActive,
  textArea: transformBaseComponent(Input.TextArea),
  boolean: transformBooleanComponent(Switch),
  switch: transformBooleanComponent(Switch),
  number: transformBaseComponent(NumberPicker),
  numberInput: transformBaseComponent(NumberPicker),
  select: transformBaseComponent(Select),
  autoComplete: transformBaseComponent(Select.AutoComplete),
  object: ObjectField,
  array: ArrayCardField,
  arrayTable: ArrayTableField,
  date: transformBaseComponent(DatePicker),
  month: transformBaseComponent(DatePicker.MonthPicker),
  year: transformBaseComponent(DatePicker.YearPicker),
  time: transformBaseComponent(TimePicker),
  rangePicker: transformBaseComponent(DatePicker.RangePicker),
  // @ts-ignore
  rating: transformBaseComponent(Rating as any),
  radio: transformBaseComponent(Radio.Group),
  upload: transformBaseComponent(Upload),
  // @ts-ignore
  transfer: transformBaseComponent(Transfer as any),
  treeSelect: transformBaseComponent(TreeSelect),
  tagFilter: transformBaseComponent(TagFilter),
  cascaderSelect: transformBaseComponent(CascaderSelect),
  rangeInput: transformBaseComponent(RangeInput),
  checkbox: transformBooleanComponent(Checkbox),
  checkboxGroup: transformBaseComponent(Checkbox.Group),
  simpleList: SimpleList,
  arrayList: ArrayList,
  arrayTab: TabArray,
}

// @ts-ignore
export const hippoComponents = hippoComponentsRef
