export default {
  title: 'formStore',
  parameters: {
    info: { inline: true },
  },
};

import React, { useEffect, useRef } from 'react';
import { hippoComponents } from '@alife/hippo-form-library';
import { formBuilder, FormStore } from '@alife/rdx-form';
import { Button, Message } from '@alife/hippo';
const formFn = formBuilder({
  components: hippoComponents,
});
// 通过模型定义，创建带模型含义的表单
interface IModel {
  unit: number;
  amount: number;
  total: number;
  show: boolean;
  province: string;
  city: string;
}
const AreaForms = formFn<IModel>();
const {
  FormItem,
  RdxFormRoot,
  createFormStore,
  getReferencedFormValueAtom,
} = AreaForms;

function Preview(props: {
  formStore: FormStore<IModel, typeof hippoComponents>;
}) {
  return (
    <div>
      <div>表单值</div>
      {JSON.stringify(props.formStore.getState())}
      <div>表单衍生值</div>
      {JSON.stringify(props.formStore.getComputeState())}
    </div>
  );
}
export function Sample() {
  const formStore = useRef(createFormStore());
  const singleCallback = React.useCallback((v) => {
    console.log('v: ', v);
    Message.notice({
      content: '省份的值变化啦：' + v,
    });
  }, []);
  const globalCallback = React.useCallback((v) => {
    Message.notice({
      content: '全局值变化啦' + JSON.stringify(v),
    });
  }, []);
  return (
    <RdxFormRoot store={formStore.current}>
      <FormItem
        title='省份'
        require={true}
        name='province'
        type='string'
        componentType={'input'}
      ></FormItem>
      <FormItem
        title='城市'
        require={true}
        name='city'
        type='string'
        componentType={'input'}
      ></FormItem>
      <Button
        onClick={() => {
          formStore.current.validate('province').then((msg) => {
            if (msg.isError) {
              Message.notice({
                content: msg.errorMsg,
              });
            }
          });
        }}
      >
        校验省份
      </Button>
      <Button
        onClick={() => {
          formStore.current.validate(['province', 'city']).then((msg) => {
            if (msg.isError) {
              Message.notice({
                content: msg.errorMsg,
              });
            }
          });
        }}
      >
        校验省份&城市
      </Button>
      <Button
        onClick={() => {
          formStore.current.validate().then((msg) => {
            if (msg.isError) {
              Message.notice({
                content: msg.errorMsg,
              });
            }
          });
        }}
      >
        校验全部
      </Button>
      <Button
        onClick={() => {
          formStore.current.setValue(
            getReferencedFormValueAtom('province'),
            '浙江省'
          );
        }}
      >
        设置省份为浙江省
      </Button>
      <Button
        onClick={() => {
          formStore.current.subscribe(
            getReferencedFormValueAtom('province'),
            singleCallback
          );
        }}
      >
        开启订阅省份消息
      </Button>
      <Button
        onClick={() => {
          formStore.current.unsubscribe(
            getReferencedFormValueAtom('province'),
            singleCallback
          );
        }}
      >
        取消订阅省份消息
      </Button>
      <Button
        onClick={() => {
          formStore.current.subscribeAll(globalCallback);
        }}
      >
        开启订阅全部表单消息
      </Button>
      <Button
        onClick={() => {
          formStore.current.unsubscribeAll(globalCallback);
        }}
      >
        取消订阅全部表单消息
      </Button>
      <Preview formStore={formStore.current} />
    </RdxFormRoot>
  );
}
