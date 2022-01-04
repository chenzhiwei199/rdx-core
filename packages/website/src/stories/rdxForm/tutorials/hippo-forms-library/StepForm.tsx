import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  CardBox,
  StepForm,
  StepFormControl,
  StepFormItem,
  hippoComponents,
} from '@alife/hippo-form-library';
import { formBuilder, FormLayout, LayoutType } from '@alife/rdx-form';
import { Button } from '@alife/hippo';

const baseForm = formBuilder({
  components: hippoComponents,
});
interface IModel {
  basic: {
    name: string;
    age: number;
    career: string;
    birthday: string;
    hobbies: string[];
  };
  articles: { title: string; desc: string }[];
  contact: {
    name: string;
    relation: string;
    phone: string;
  }[];
}
const CommonForms = baseForm<IModel>();
const { FormItem } = CommonForms;
const FormStepButtonCrol = () => {
  return (
    <StepFormControl>
      {({ pre, next, validate, maxStep, current }) => {
        return (
          <div style={{ marginLeft: 100 }}>
            <Button
              onClick={() => {
                pre();
              }}
            >
              上一步
            </Button>
            <Button
              type='primary'
              style={{ marginLeft: 12 }}
              onClick={() => {
                validate().then(({ isError }) => {
                  if (!isError) {
                    next();
                  }
                });
              }}
            >
              {current === maxStep ? '提交' : '下一步'}
            </Button>
          </div>
        );
      }}
    </StepFormControl>
  );
};

const FormStepButtonControlCenter = () => {
  return (
    <StepFormControl>
      {({ pre, next, validate, maxStep, current }) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              onClick={() => {
                pre();
              }}
            >
              上一步
            </Button>
            <Button
              type='primary'
              style={{ marginLeft: 12 }}
              onClick={() => {
                validate().then(({ isError }) => {
                  if (!isError) {
                    next();
                  }
                });
              }}
            >
              {current === maxStep ? '提交' : '下一步'}
            </Button>
          </div>
        );
      }}
    </StepFormControl>
  );
};
const basicForms = (
  <>
    <FormItem type='object' name='basic'>
      <FormItem require type='string' name='name' title='姓名'></FormItem>
      <FormItem type='number' name='age' title='年龄'></FormItem>
      <FormItem type='string' name='career' title='职业'></FormItem>
      <FormItem
        type='string'
        componentType={'date'}
        name='birthday'
        title='出生日期'
      ></FormItem>
      <FormItem type='string' name='hobbies' title='爱好'></FormItem>
    </FormItem>
  </>
);
const articleForms = (
  <FormItem
    type='array'
    componentType={'arrayTable'}
    defaultValue={[{}]}
    name='articles'
  >
    <FormItem type='object'>
      <FormItem type='string' name='title' title='书名'></FormItem>
      <FormItem
        type='string'
        componentType={'textArea'}
        name='desc'
        title='描述'
      ></FormItem>
    </FormItem>
  </FormItem>
);
const contactForms = (
  <CommonForms.FormItem
    type='array'
    name='contact'
    // title='紧急联系人'
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
          width: 100,
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
);
export function 水平() {
  return (
    <CommonForms.RdxFormRoot enabledStatePreview={true}>
      <CardBox>
        <StepForm>
          <StepForm.Item title='基本信息'>
            <FormLayout
              layoutType={LayoutType.Classic}
              labelCol={10}
              wrapCol={14}
            >
              {basicForms}
            </FormLayout>
            <FormStepButtonControlCenter />
          </StepForm.Item>
          <StepFormItem title='添加文章信息'>
            <FormLayout layoutType={LayoutType.Classic}>
              {articleForms}
            </FormLayout>
            <FormStepButtonControlCenter />
          </StepFormItem>
          <StepFormItem title='紧急联系人'>
            <FormLayout layoutType={LayoutType.Classic}>
              {contactForms}
            </FormLayout>
            <FormStepButtonControlCenter />
          </StepFormItem>
        </StepForm>
      </CardBox>
    </CommonForms.RdxFormRoot>
  );
}

export function 垂直() {
  return (
    <CommonForms.RdxFormRoot enabledStatePreview={true}>
      <CardBox>
        <StepForm direction='ver'>
          <StepForm.Item title='基本信息'>
            <FormLayout
              layoutType={LayoutType.Classic}
              labelWidth={100}
              wrapCol={14}
            >
              {basicForms}
            </FormLayout>
            <FormStepButtonCrol />
          </StepForm.Item>
          <StepFormItem title='添加文章信息'>
            <FormLayout layoutType={LayoutType.Classic}>
              {articleForms}
            </FormLayout>
            <FormStepButtonCrol />
          </StepFormItem>
          <StepFormItem title='紧急联系人'>
            <FormLayout layoutType={LayoutType.Classic}>
              {contactForms}
            </FormLayout>
            <FormStepButtonCrol />
          </StepFormItem>
        </StepForm>
      </CardBox>
    </CommonForms.RdxFormRoot>
  );
}
