import React, { useState } from 'react'
import {
  RdxContext,
  useRdxValue,
  createFormFatory,
  FormLayout,
  LayoutType,
  atom,
  DefaultValue,
  useRdxState,
} from '@alife/rdx-form'
import { hippoComponents } from '@alife/hippo-form-library'
import JsonView from 'react-inspector'
import { Button, Icon } from '@alife/hippo'
import styled from 'styled-components'
export default {
  title: '表单实验/可见控制',
  parameters: {
    info: { inline: true },
  },
}

const CardDiv = styled.div<{ show: boolean }>`
  box-shadow: rgba(0, 0, 0, 0.1) 1px 1px 4px 0px;
  padding: ${props => (props.show ? '12px' : '12px 12px 0px 12px')};
  transition: all 0.3s;
  border: 1px solid lightgrey;
`
export function Card({ children }) {
  const [visible, setVisible] = useRdxState(visibleAtom)
  return (
    <CardDiv show={visible}>
      {children}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          text
          type="primary"
          onClick={() => {
            setVisible(visible => !visible)
          }}
        >
          {visible ? '收起' : '隐藏'}
          <Icon type={visible ? 'arrow-up' : 'arrow-down'}></Icon>
        </Button>
      </div>
    </CardDiv>
  )
}
const DefaultData: {
  object: {
    usename: string
    password: string
    passwordCheck?: string
    sex?: string
    age?: number
    career?: string
    hobby?: string
    idCard?: string
    hasChild?: string
  }
} = {
  object: { usename: 'leo', password: '123456' },
}

const { FormItem, formDataCompute, valueAndStatusShallowCompute } = createFormFatory({
  components: hippoComponents,
})({
  formId: 'test',
  dataCompute: DefaultData,
  middlewares: [
    params => {
      return {
        ...params,
      }
    },
  ],
})
const DataPreview = () => {
  const value = useRdxValue(formDataCompute)
  return <JsonView data={value}></JsonView>
}

const visibleAtom = atom({
  id: 'visibleAtom',
  defaultValue: true,
})

const visibleEffect = ({ setSelf, onDependenciesSet }) => {
  onDependenciesSet(
    curValue => {
      console.log('onDependenciesSet curValue: ', curValue)
      setSelf(status => {
        if (status instanceof DefaultValue) {
        } else {
          return {
            ...status,
            visible: curValue[0],
          }
        }
      })
    },
    [visibleAtom],
  )
}
export function EffectWrapper({ children }) {
  return (
    <>
      {React.Children.map(children, (child, index) => {
        return React.cloneElement(child, {
          ...child.props,
          statusEffects: index > 2 ? [visibleEffect] : [],
        })
      })}
    </>
  )
}
export const 可见属性控制 = () => {
  return (
    <RdxContext>
      <Card>
        <FormItem title="对象" name="object" type="object">
          <FormLayout layoutType={LayoutType.CssGrid}>
            <EffectWrapper>
              <FormItem title={'用户名'} name="usename" type="string" componentType={'string'}></FormItem>
              <FormItem title={'密码'} name="password" type="string" componentType={'string'}></FormItem>
              <FormItem
                title={'密码确认'}
                name="passwordCheck"
                // 密码修改的时候，清空密码确认
                valueEffects={[
                  ({ onDependenciesSet, setSelf }) => {
                    onDependenciesSet(() => {
                      setSelf('')
                    }, [valueAndStatusShallowCompute('object.password')])
                  },
                ]}
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
              <FormItem title={'性别'} name="sex" type="string" componentType={'string'} />
              <FormItem title={'年龄'} name="age" type="number" componentType={'number'} />
              <FormItem title={'爱好'} name="hobby" type="string" componentType={'string'} />
              <FormItem title={'身份证号'} name="idCard" type="string" componentType={'string'} />
              <FormItem title={'是否有孩子'} name="hasChild" type="string" componentType={'switch'} />
            </EffectWrapper>
          </FormLayout>
        </FormItem>
      </Card>
      <DataPreview />
    </RdxContext>
  )
}
