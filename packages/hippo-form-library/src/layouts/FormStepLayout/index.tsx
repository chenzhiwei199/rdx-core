import React, { useContext, useState } from 'react';
import {
  CollectFormItems,
  IErrorMessage,
  useFormCollectContext,
  useValidator,
} from '@alife/rdx-form';
import { Step } from '@alife/hippo';
interface IStepFormControl {
  children: (
    props: {
      validate: () => Promise<IErrorMessage>;
    } & IStepFormContext
  ) => React.ReactNode;
}
export const StepFormControl = (props: IStepFormControl) => {
  const { children } = props;
  const context = useFormCollectContext();
  const validate = useValidator();
  return (
    <>
      {children({
        ...useContext(FormStepContext),
        validate: () => {
          return validate(Array.from(context.getAll().keys()) as any);
        },
      })}
    </>
  );
};
interface IStepForm {
  // 步骤方向
  direction?: 'ver' | 'hoz';
  // 步骤样式
  stepStyle?: React.CSSProperties
  children: React.ReactNode;
}
interface IStepFormItem   {
  // 标题
  title: string;
  // 描述
  content?: string
  // 图表
  icon?: string
  //StepItem渲染
  itemRenderer?: (index: number ,status: string) => React.ReactNode
  // 百分比
  percent?: number
  // 状态 wait
  status?: 'wait' | 'process' | 'finish'
  children: React.ReactNode;
}
interface IStepFormContext {
  current: number;
  setCurrent: (current: number) => void;
  pre: () => void;
  next: () => void;
  maxStep: number;
}
const FormStepContext = React.createContext<IStepFormContext>(null);

export const StepFormItem = (props: IStepFormItem) => {
  const { children } = props;
  return <div >{children}</div>;
};

const StepFormComponent = (props: IStepForm) => {
  const { children, direction = 'hoz', stepStyle = {}  } = props;
  const dataSource = React.Children.toArray(children).map((item) => ({
    title: (item as React.ReactElement).props.title,
  }));
  const [current, setCurrent] = useState(0);
  const step = (
    <Step current={current} direction={direction}>
      {dataSource.map((item, index) => (
        <Step.Item
          key={item.title}
          {...item}
          title={item.title}
        ></Step.Item>
      ))}
    </Step>
  );
  const child = React.Children.toArray(children)[current];
  const horzontal = (
    <div className='formstep'>
      <div className='formstep-items' style={{ height: 50, ...stepStyle }}>{step}</div>
      <div className='formstep-content'>{child}</div>
    </div>
  );
  const vertical = (
    <div className='formstep' style={{ display: 'flex' }}>
      <div className='formstep-steps' style={{ flexBasis: 200, ...stepStyle }}>{step}</div>
      <div className='formstep-content' style={{ flex: 1 }}>{child}</div>
    </div>
  );
  return (
    <CollectFormItems>
      <FormStepContext.Provider
        value={{
          current,
          setCurrent,
          maxStep: dataSource.length - 1,
          pre: () => {
            setCurrent((current) => current - 1);
          },
          next: () => {
            setCurrent((current) => current + 1);
          },
        }}
      >
        {direction === 'ver' ? vertical : horzontal}
      </FormStepContext.Provider>
    </CollectFormItems>
  );
};

StepFormComponent.Item = StepFormItem;
export const RdxStepForm = StepFormComponent;
