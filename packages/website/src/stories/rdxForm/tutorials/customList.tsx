import React from 'react';
import {
  IFormComponentProps,
  formBuilder,
  IState,
  PathContextInstance,
  usePathContext,
} from '@alife/rdx-form';

const Input = (props: IFormComponentProps<any>) => {
  const { value, state, onChange, preview, disabled } = props;
  if (state === IState.Loading) {
    return <span>{'loading'}</span>;
  }
  if (preview) {
    return <span>{value}</span>;
  }
  return (
    <input
      style={{
        pointerEvents: disabled ? 'none' : 'unset',
        border: state === IState.Error ? '1px solid red' : '1px solid grey',
      }}
      value={value}
      onChange={(event) => {
        onChange(event.target.value);
      }}
    ></input>
  );
};

const ArrayList = (props: IFormComponentProps<any>) => {
  const { value = [], arrayHelper, children } = props;
  const { mutators } = arrayHelper;
  const { push, remove: remove, moveUp, moveDown,getEmptyValue } = mutators;
  const { paths } = usePathContext();
  return (
    <div>
      {value.map((item, index) => {
        return (
          <div style={{ display: 'flex' }}>
            {React.cloneElement(children as any, { name: `${index}` })}
            <span style={{ marginLeft: 12 }} onClick={() => remove(index)}>
              删除
            </span>
            <span style={{ marginLeft: 12 }} onClick={() => moveUp(index)}>
              上移
            </span>
            <span style={{ marginLeft: 12 }} onClick={() => moveDown(index)}>
              下移
            </span>
          </div>
        );
      })}
      <div onClick={() => push(getEmptyValue(children.props))} style={{ fontWeight: 'bold' }}>
        +新增一行
      </div>
    </div>
  );
};

const forms = formBuilder({
  components: {
    // 自定义一个组件
    input: Input,
    arrayList: ArrayList,
  },
});
const { RdxFormRoot, FormItem } = forms<{
  citys: string[];
  cityInfoss: {
    name: string;
  }[];
}>();

export function 自定义组件() {
  return (
    <RdxFormRoot enabledStatePreview={true}>
      <h2>字符串数组</h2>
      <FormItem
        title='城市列表'
        type='array'
        componentType={'arrayList'}
        name='citys'
      >
        <FormItem
          title='城市名称'
          type='string'
          componentType='input'
        ></FormItem>
      </FormItem>

      <h2>对象数组</h2>
      <FormItem
        type='array'
        title={'城市列表'}
        componentType={'arrayList'}
        name='cityInfoss'
      >
        <FormItem title='城市名称' type='object'>
          <FormItem
            name='name'
            title='城市名称'
            type='string'
            componentType='input'
          ></FormItem>
        </FormItem>
      </FormItem>
    </RdxFormRoot>
  );
}
