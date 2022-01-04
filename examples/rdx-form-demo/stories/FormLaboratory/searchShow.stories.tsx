import React from 'react'
import { RdxContext, useRdxValue, createFormFatory, FormLayout, LayoutType } from '@alife/rdx-form'
import { hippoComponents } from '@alife/hippo-form-library'
import JsonView from 'react-inspector'
export default {
  title: '表单实验/表单多种展示形式',
  parameters: {
    info: { inline: true },
  },
}

const DefaultData: {
  object: { usename: string; password: string; passwordCheck?: string }
} = {
  object: { usename: 'leo', password: '123456' },
}

const { FormItem, formDataCompute, valueAndStatusShallowCompute } = createFormFatory({
  components: hippoComponents,
})({ formId: 'test', dataCompute: DefaultData })
const DataPreview = () => {
  const value = useRdxValue(formDataCompute)
  return <JsonView data={value}></JsonView>
}
const formItems = (preview: boolean = false) => {
  function getAlias() {
    return preview ? 'xxx' : undefined
  }
  return (
    <>
      <FormItem
        title={'用户名111'}
        name="usename"
        type="string"
        preview={preview}
        alias={getAlias()}
        componentType={'string'}
      ></FormItem>
      <FormItem
        title={'密码22'}
        name="password"
        type="string"
        preview={preview}
        alias={getAlias()}
        componentType={'string'}
      ></FormItem>
      <FormItem
        title={'密码确认'}
        name="passwordCheck"
        // 密码修改的时候，清空密码确认
        valueEffects={
          !preview
            ? [
                ({ onDependenciesSet, setSelf }) => {
                  onDependenciesSet(() => {
                    setSelf('')
                  }, [valueAndStatusShallowCompute('object.password')])
                },
              ]
            : []
        }
        // preview={preview}
        alias={getAlias()}
        rules={[
          ({ value, get }) => {
            const password = get(valueAndStatusShallowCompute('object.password')).value
            if (value.value !== password) {
              return '密码不一致'
            }
          },
        ]}
        type="string"
        componentType={'string'}
      ></FormItem>
    </>
  )
}
export const 多种表单展示态 = () => {
  return (
    <RdxContext>
      <FormItem name="object" type="object">
        <h2>筛选器</h2>
        <FormLayout layoutType={LayoutType.CssGrid}>{formItems()}</FormLayout>
        <h2>预览态</h2>
        <FormLayout layoutType={LayoutType.CssGrid}>{formItems(true)}</FormLayout>
      </FormItem>
      <DataPreview />
    </RdxContext>
  )
}
