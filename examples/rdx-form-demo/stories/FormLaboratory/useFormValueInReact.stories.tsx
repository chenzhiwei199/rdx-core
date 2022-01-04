import React from 'react'
import { RdxContext, useRdxValue, createFormFatory, FormLayout, LayoutType, useRdxSetter, atom } from '@alife/rdx-form'
import { hippoComponents } from '@alife/hippo-form-library'
import JsonView from 'react-inspector'
export default {
  title: '表单实验/表单外部获取表单状态',
  parameters: {
    info: { inline: true },
  },
}

const DefaultData: {
  object: { usename: string; password: string; passwordCheck?: string }
  rest: string
} = {
  object: { usename: 'leo', password: '123456' },
  rest: '222',
}

const {
  FormItem,
  formDataCompute,
  valueAndStatusShallowCompute,
  valueComputeByRegexp,
} = createFormFatory({
  components: hippoComponents,
})({ formId: 'test', dataCompute: DefaultData })
const DataPreview = () => {
  const value = useRdxValue(formDataCompute)
  return (
    <div>
      <h2>表单所有数据</h2>
      <JsonView expandLevel={4} data={value}></JsonView>
    </div>
  )
}
const ShallowDataPreview = () => {
  const data = useRdxValue(valueAndStatusShallowCompute('object.usename'))
  return (
    <div>
      <h2>外部浅引用表单数据:</h2> {data?.value}
    </div>
  )
}
const DeepDataPreview = () => {
  const data = useRdxValue(valueComputeByRegexp('object'))
  return (
    <div>
      <h2>外部浅引用表单数据:</h2>
      <JsonView expandLevel={4} data={data}></JsonView>
    </div>
  )
}
export const 字符串数组测试 = () => {
  const set = useRdxSetter(valueAndStatusShallowCompute('object.usename'))
  return (
    <RdxContext>
      <FormLayout layoutType={LayoutType.Classic}>
        <FormItem title="对象" name="object" type="object">
          <FormItem title={'用户名'} name="usename" type="string" componentType={'string'}></FormItem>
          <FormItem title={'密码'} name="password" type="string" componentType={'string'}></FormItem>
          <FormItem
            title={'密码确认'}
            name="passwordCheck"
            componentProps={{
              onBlur: () => {
                set
              },
              onFocus: () => {},
            }}
            // 密码修改的时候，清空密码确认
            rules={[
              ({ value, get }) => {
                const password = get(valueAndStatusShallowCompute('object.password')).value
                if (value.value !== password) {
                  return '密码不一致'
                }
              },
            ]}
            type="string"
            // // 是否进行关联校验
            // autoValidate={true}
            // validateFirst={true}
            componentType={'string'}
          ></FormItem>
        </FormItem>
      </FormLayout>
      <ShallowDataPreview />
      <DeepDataPreview />
      <DataPreview />
    </RdxContext>
  )
}
