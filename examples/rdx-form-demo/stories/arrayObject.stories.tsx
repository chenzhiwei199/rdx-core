import React from 'react';
import { hippoComponents } from '@alife/hippo-form-library';
import { formBuilder, FormLayout, LayoutType } from '@alife/rdx-form';
import { Button } from '@alife/hippo';
export default {
  title: 'ArrayObject',
  parameters: {
    info: { inline: true },
  },
};
const baseForm = formBuilder({
  components: hippoComponents,
});
interface IModel {
  users: { name: string; age: number }[];
  articles: string[];
  userInfo: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    birthday: {
      year: string;
      month: string;
      day: string;
    };
    concat: {
      name: string;
      relation: string;
      phone: string;
    }[];
  }[];
}
const CommonForms = baseForm<IModel>();

export function 字符串数组() {
  return (
    <CommonForms.RdxFormRoot enabledStatePreview={true}>
      <CommonForms.FormItem
        type='array'
        componentType={'arrayTable'}
        name='articles'
      >
        <CommonForms.FormItem
          type='string'
          title='文章标题'
        ></CommonForms.FormItem>
      </CommonForms.FormItem>
    </CommonForms.RdxFormRoot>
  );
}
export function 对象数组() {
  return (
    <CommonForms.RdxFormRoot enabledStatePreview={true}>
      <CommonForms.FormItem
        type='array'
        componentType={'arrayTable'}
        name='users'
      >
        <CommonForms.FormItem type='object'>
          <CommonForms.FormItem
            type='string'
            name='email'
            title='邮箱'
          ></CommonForms.FormItem>
          <CommonForms.FormItem
            type='number'
            name='age'
            title='年龄'
            componentType='numberInput'
          ></CommonForms.FormItem>
        </CommonForms.FormItem>
      </CommonForms.FormItem>
    </CommonForms.RdxFormRoot>
  );
}

export function 组件部分自定义渲染() {
  return (
    <CommonForms.RdxFormRoot enabledStatePreview={true}>
      <CommonForms.FormItem
        type='array'
        componentType={'arrayTable'}
        name='users'
        componentProps={{
          renderAddition: ({ mutators }) => (
            <div>
              <Button onClick={() => mutators.push(mutators.getEmptyValue())}>
                push
              </Button>
              <Button onClick={() => mutators.unshift({})}>unshift</Button>
              <Button onClick={() => mutators.pop()}>pop</Button>
              <Button onClick={() => mutators.shift()}>shift</Button>
              <Button onClick={() => mutators.clear()}>clear</Button>
            </div>
          ),
          renderEmpty: () => (
            <div style={{ height: 50, lineHeight: '50px' }}>自定义空样式</div>
          ),
          renderOperations: ({ mutators, currentIndex }) => {
            return (
              <div>
                <div
                  onClick={() => {
                    mutators.remove(currentIndex);
                  }}
                >
                  删除当前行
                </div>
                <div
                  onClick={() => {
                    mutators.insert(currentIndex, mutators.getEmptyValue());
                  }}
                >
                  向上插入一个
                </div>
                <div
                  onClick={() => {
                    mutators.insert(currentIndex + 1, mutators.getEmptyValue());
                  }}
                >
                  向下插入一个
                </div>
              </div>
            );
          },
        }}
      >
        <CommonForms.FormItem type='object'>
          <CommonForms.FormItem
            type='string'
            name='name'
            title='名称'
          ></CommonForms.FormItem>
          <CommonForms.FormItem
            type='number'
            name='age'
            title='年龄'
            componentType='numberInput'
          ></CommonForms.FormItem>
        </CommonForms.FormItem>
      </CommonForms.FormItem>
    </CommonForms.RdxFormRoot>
  );
}

export function 复杂数组() {
  return (
    <CommonForms.RdxFormRoot enabledStatePreview={true}>
      <CommonForms.FormItem type='array' componentType={'array'} name='userInfo' defaultValue={[{}]} componentProps={{
        renderTitle: () => <span>用户信息项</span>
      }}>
        <CommonForms.FormItem type='object'>
          <FormLayout layoutType={LayoutType.Grid} autoRow={true}>
            <CommonForms.FormItem
              type='string'
              name='email'
              title='邮箱地址'
              layoutExtends={{
                span: 12,
              }}
            ></CommonForms.FormItem>
            <CommonForms.FormItem
              type='string'
              name='firstName'
              defaultValue={'赵6'}
              layoutExtends={{
                span: 12,
              }}
              title='姓名'
            ></CommonForms.FormItem>
            <CommonForms.FormItem
              type='string'
              name='password'
              layoutExtends={{
                span: 12,
              }}
              defaultValue={'你猜'}
              title='密码'
            ></CommonForms.FormItem>
            <CommonForms.FormItem
              type='string'
              name='birthday'
              defaultValue={new Date() as any}
              title='出生日期'
              layoutExtends={{
                span: 12,
              }}
              componentType='date'
            ></CommonForms.FormItem>
          </FormLayout>
          <FormLayout layoutType={LayoutType.Classic} labelCol={4} wrapCol={20}>
            <CommonForms.FormItem
              type='array'
              name='concat'
              title='紧急联系人'
              defaultValue={[{}]}
              componentProps={{
                renderAddition: (options) => (
                  <div
                    style={{
                      fontWeight: 500,
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                    onClick={() => {
                      options.mutators.push({});
                    }}
                  >
                    新增一个紧急联系人
                  </div>
                ),
              }}
              componentType={'arrayTable'}
            >
              <CommonForms.FormItem type='object'>
                <CommonForms.FormItem
                  type='string'
                  name='name'
                  tips='你猜有啥用'
                  title='名字'
                  layoutExtends={{
                    width: 100
                  }}
                  defaultValue={'张三'}
                  componentType='string'
                ></CommonForms.FormItem>
                <CommonForms.FormItem
                  type='string'
                  name='relation'
                  title='关系'
                  desc={'我就是一个描述'}
                  defaultValue={'1'}
                  componentProps={{
                    dataSource: [
                      {
                        label: '父母',
                        value: '1',
                      },
                      {
                        label: '兄弟姐妹',
                        value: '2',
                      },
                      {
                        label: '亲戚',
                        value: '3',
                      },
                      {
                        label: '朋友',
                        value: '4',
                      },
                    ],
                  }}
                  componentType='radio'
                ></CommonForms.FormItem>
                <CommonForms.FormItem
                  type='string'
                  name='phone'
                  title='联系方式'
                  defaultValue={'110'}
                  componentType='string'
                ></CommonForms.FormItem>
              </CommonForms.FormItem>
            </CommonForms.FormItem>
          </FormLayout>
        </CommonForms.FormItem>
      </CommonForms.FormItem>
    </CommonForms.RdxFormRoot>
  );
}

// userInfo: {
//   email: string
//   firstName: string
//   LastName: string
//   password: string
//   birthday: {
//     year: string
//     month: string
//     day: string
//   },
//   concat: {
//     name: string;
//     relation: string;
//     phone: string
//   }[]
// }[]
