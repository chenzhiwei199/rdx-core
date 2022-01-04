import React from 'react';
import {
  formBuilder,
  FormLayout,
  LabelTextAlign,
  LayoutType,
} from '@alife/rdx-form';

// export default {
//   title: '布局',
//   parameters: {
//     info: { inline: true },
//   },
// };

const forms = formBuilder({
  components: {
    input: (props) => {
      const { value, onChange } = props;
      return (
        <input
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
          }}
        ></input>
      );
    },
  },
});
const { RdxFormRoot, FormItem } = forms<{
  province: string;
  city: string;
}>();

export function 布局() {
  return (
    <RdxFormRoot enabledStatePreview={true}>
      <h2>内联</h2>
      <h3>默认 </h3>
      <FormLayout layoutType={LayoutType.Inline}>
        <FormItem
          title='省份'
          type='string'
          validateFirst={true}
          tips='我是tip'
          desc='我是描述'
          require={true}
          componentType={'input'}
          name='city'
        ></FormItem>
        <FormItem
          title='城市'
          type='string'
          validateFirst={true}
          tips='我是tip'
          desc='我是描述'
          require={true}
          componentType={'input'}
          name='province'
        ></FormItem>
      </FormLayout>
      <h3>默认 labelWidth wrapperWidth</h3>
      <FormLayout
        layoutType={LayoutType.Inline}
        labelWidth={200}
        wrapWidth={300}
      >
        <FormItem
          title='省份'
          type='string'
          validateFirst={true}
          tips='我是tip'
          desc='我是描述'
          require={true}
          alias={'默认 labelWidth wrapperWidth'}
          componentType={'input'}
          name='city'
        ></FormItem>
        <FormItem
          title='城市'
          type='string'
          validateFirst={true}
          tips='我是tip'
          desc='我是描述'
          require={true}
          alias={'默认 labelWidth wrapperWidth'}
          componentType={'input'}
          name='province'
        ></FormItem>
      </FormLayout>
      <h3>默认 labelTextAlign= LabelTextAlign.Top</h3>
      <FormLayout
        layoutType={LayoutType.Inline}
        labelTextAlign={LabelTextAlign.Top}
      >
        <FormItem
          title='省份'
          type='string'
          validateFirst={true}
          tips='我是tip'
          desc='我是描述'
          require={true}
          alias={'labelTextAlign= LabelTextAlign.Right'}
          componentType={'input'}
          name='city'
        ></FormItem>
        <FormItem
          title='城市'
          type='string'
          validateFirst={true}
          tips='我是tip'
          desc='我是描述'
          require={true}
          alias={'labelTextAlign= LabelTextAlign.Right'}
          componentType={'input'}
          name='province'
        ></FormItem>
      </FormLayout>
      <hr />
      <h2>经典</h2>
      <FormLayout layoutType={LayoutType.Classic}>
        <FormItem
          title='省份'
          type='string'
          validateFirst={true}
          tips='我是tip'
          desc='我是描述'
          require={true}
          alias={'经典-默认'}
          componentType={'input'}
          name='province'
        ></FormItem>
        <FormItem
          title='城市'
          type='string'
          validateFirst={true}
          tips='我是tip'
          desc='我是描述'
          require={true}
          alias={'经典-默认'}
          componentType={'input'}
          name='city'
        ></FormItem>
      </FormLayout>
      <h3>默认 labelCol = 4 wrapperCol = 20</h3>
      <FormLayout layoutType={LayoutType.Classic} labelCol={4} wrapCol={20}>
        <FormItem
          title='省份'
          type='string'
          validateFirst={true}
          tips='我是tip'
          desc='我是描述'
          require={true}
          alias={'经典-labelCol 4 wrapperCol 20'}
          componentType={'input'}
          name='city'
        ></FormItem>
        <FormItem
          title='城市'
          type='string'
          validateFirst={true}
          tips='我是tip'
          desc='我是描述'
          require={true}
          alias={'经典-labelCol 4 wrapperCol 20'}
          componentType={'input'}
          name='province'
        ></FormItem>
      </FormLayout>
      <h3>默认 labelTextAlign= LabelTextAlign.Left</h3>
      <FormLayout
        layoutType={LayoutType.Classic}
        labelTextAlign={LabelTextAlign.Left}
      >
        <FormItem
          title='省份'
          type='string'
          validateFirst={true}
          tips='我是tip'
          desc='我是描述'
          require={true}
          alias={'默认 labelTextAlign= LabelTextAlign.Left<'}
          componentType={'input'}
          name='city'
        ></FormItem>
        <FormItem
          title='城市'
          type='string'
          validateFirst={true}
          tips='我是tip'
          desc='我是描述'
          require={true}
          alias={'默认 labelTextAlign= LabelTextAlign.Left<'}
          componentType={'input'}
          name='province'
        ></FormItem>
      </FormLayout>
      <h3>默认 labelTextAlign= LabelTextAlign.Top</h3>
      <FormLayout
        layoutType={LayoutType.Classic}
        labelTextAlign={LabelTextAlign.Top}
      >
        <FormItem
          title='省份'
          type='string'
          validateFirst={true}
          tips='我是tip'
          desc='我是描述'
          require={true}
          alias={'默认 labelTextAlign= LabelTextAlign.Top<'}
          componentType={'input'}
          name='city'
        ></FormItem>
        <FormItem
          title='城市'
          type='string'
          validateFirst={true}
          tips='我是tip'
          desc='我是描述'
          require={true}
          alias={'默认 labelTextAlign= LabelTextAlign.Top<'}
          componentType={'input'}
          name='province'
        ></FormItem>
      </FormLayout>
      <hr />
      <h2>Grid布局</h2>
      <h3> Grid 默认布局</h3>
      <FormLayout layoutType={LayoutType.Grid}>
        <FormItem
          title='省份 span = 1'
          type='string'
          validateFirst={true}
          tips='我是tip'
          desc='我是描述'
          require={true}
          alias={'Grid'}
          componentType={'input'}
          layoutExtends={{
            span: 1,
          }}
          name='province'
        ></FormItem>
        <FormItem
          title='城市 span = 2'
          type='string'
          validateFirst={true}
          tips='我是tip'
          desc='我是描述'
          require={true}
          alias={'Grid'}
          componentType={'input'}
          name='city'
          layoutExtends={{
            span: 2,
          }}
        ></FormItem>
      </FormLayout>

      <h3> Grid labelTextAlign Top</h3>
      <FormLayout
        layoutType={LayoutType.Grid}
        labelTextAlign={LabelTextAlign.Top}
      >
        <FormItem
          title='省份 span = 1'
          type='string'
          validateFirst={true}
          tips='我是tip'
          desc='我是描述'
          require={true}
          alias={'Grid labelTextAlign Top'}
          componentType={'input'}
          layoutExtends={{
            span: 1,
          }}
          name='province'
        ></FormItem>
        <FormItem
          title='城市 span = 2'
          type='string'
          validateFirst={true}
          tips='我是tip'
          desc='我是描述'
          require={true}
          alias={'Grid labelTextAlign Top'}
          componentType={'input'}
          name='city'
          layoutExtends={{
            span: 2,
          }}
        ></FormItem>
      </FormLayout>
      <h3> Grid labelTextAlign Left</h3>
      <FormLayout
        layoutType={LayoutType.Grid}
        labelTextAlign={LabelTextAlign.Left}
      >
        <FormItem
          title='省份 span = 1'
          type='string'
          validateFirst={true}
          tips='我是tip'
          desc='我是描述'
          require={true}
          alias={'Grid labelTextAlign Left'}
          componentType={'input'}
          layoutExtends={{
            span: 8,
          }}
          name='province'
        ></FormItem>
        <FormItem
          title='城市 span = 2'
          type='string'
          validateFirst={true}
          tips='我是tip'
          desc='我是描述'
          require={true}
          alias={'Grid labelTextAlign Left'}
          componentType={'input'}
          name='city'
          layoutExtends={{
            span: 16,
          }}
        ></FormItem>
      </FormLayout>
    </RdxFormRoot>
  );
}
