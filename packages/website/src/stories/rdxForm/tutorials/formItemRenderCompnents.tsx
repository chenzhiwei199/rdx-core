import React from 'react';
import {
  BaseType,
  createLayout,
  IContentComponent,
  IFormComponentProps,
  IMessageComponent,
  formBuilder,
  Tooltip,
  FormItemRenderComponentsContext,
} from '@alife/rdx-form';
import styled from 'styled-components';

function ErrorComponent(props: IMessageComponent) {
  return (
    <div
      title={props.msg}
      style={{
        color: 'red',
        width: '100%',
        maxHeight: 32,
        maxWidth: 300,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    >
      {props.msg}
    </div>
  );
}
function DescComponent(props: IMessageComponent) {
  return <div style={{ color: '#999999' }}>{props.msg}</div>;
}
function WrapperComponent(props: IContentComponent) {
  const { type, children, id, layoutExtends } = props;
  const { containerStyle } = createLayout(layoutExtends.span);
  return (
    <FormItemWrapper
      data-id={id}
      useMargin={type !== BaseType.Object}
      style={containerStyle}
      className='rdx-form-item'
    >
      {children}
    </FormItemWrapper>
  );
}
function ContentComponent(props: IContentComponent) {
  const {
    children,
    title,
    showTitle = true,
    tips,
    layoutExtends,
    tipsPosition = 'after',
  } = props;
  console.log('tipsPosition: ', tipsPosition);
  const { contentStyle } = createLayout(
    layoutExtends.span,
    showTitle && !!title
  );
  return (
    <FormStyleItemContent
      style={contentStyle}
      className='rdx-form-item-content'
    >
      <span>
        {children}
        {tips && tipsPosition === 'after' && <Tips tips={tips} />}
      </span>

      <DescComponent msg={props.desc} />
      <ErrorComponent msg={props.errorMsg} />
      <ErrorComponent msg={(props.formErrorMsg || []).join(',')} />
    </FormStyleItemContent>
  );
}
function Tips(props: { tips: string }) {
  const { tips } = props;
  return (
    <Tooltip
      trigger={
        <span
          style={{
            verticalAlign: 'middle',
            paddingLeft: '6px',
          }}
        >
          <svg
            // t='1602216301118'
            // className='icon'
            viewBox='0 0 1024 1024'
            version='1.1'
            xmlns='http://www.w3.org/2000/svg'
            // p-id='1385'
            width='14'
            height='14'
          >
            <path
              d='M512 1024C229.069 1024 0 794.829 0 512S229.069 0 512 0c282.931 0 512 229.171 512 512s-229.069 512-512 512z m-0.034-93.12c231.073 0.066 418.98-187.942 418.913-418.914 0.067-230.904-187.84-418.912-418.913-418.912-231.005 0-418.912 187.907-418.912 418.912 0 231.073 187.907 418.98 418.912 418.913z m-46.511-651.607h93.09v93.09h-93.09v-93.09z m93.09 465.445h-93.09V465.455h93.09v279.263z'
              fill='#8a8a8a'
              p-id='1386'
            ></path>
          </svg>
        </span>
      }
    >
      <div dangerouslySetInnerHTML={{ __html: tips }}></div>
    </Tooltip>
  );
}
function TitleComponent(props: IContentComponent) {
  const {
    title,
    require,
    showTitle = true,
    tips,
    layoutExtends,
    tipsPosition = 'after',
  } = props;
  const { labelStyle } = createLayout(layoutExtends.span, showTitle && !!title);
  return (
    <>
      {title && showTitle && (
        <FormStyleItemLabel
          style={labelStyle}
          require={require}
          className='rdx-form-item-label'
        >
          {title}
          {tips && tipsPosition === 'before' && <Tips tips={tips} />}
        </FormStyleItemLabel>
      )}
    </>
  );
}

const FormStyleItemLabel = styled.div<{
  require: boolean;
}>`
  line-height: 28px;
  vertical-align: top;
  color: #666666;
  display: inline-block;
  text-align: right;
  padding-right: 12px;
  line-height: 28px;
  ::before {
    display: ${(props) => (props.require ? 'visible' : 'none')};
    content: '*';
    color: #ff3000;
    margin-right: 4px;
  }
`;
const FormStyleItemContent = styled.div<{
  col?: number;
}>`
  line-height: 28px;
`;
const FormItemWrapper = styled.div<{
  useMargin: boolean;
}>`
  // border: 1px dashed transparent;
  padding-bottom: ${(props) => {
    return props.useMargin ? 12 : 0;
  }}px;
`;

const Input = (props: IFormComponentProps<any>) => {
  const { value, onChange } = props;
  return (
    <input
      value={value}
      onChange={(event) => {
        onChange(event.target.value);
      }}
    ></input>
  );
};
const Select = (
  props: IFormComponentProps<{
    dataSource: { label: string; value: string }[];
  }>
) => {
  const { value, onChange, componentProps } = props;
  const { dataSource = [] } = componentProps;
  return (
    <select
      value={value}
      onChange={(event) => {
        onChange(event.target.value);
      }}
    >
      {dataSource.map((item) => (
        <option value={item.value}>{item.label}</option>
      ))}
    </select>
  );
};
// 通过注册组件，创建formBuilder
const formFn = formBuilder({
  components: {
    input: Input,
    select: Select,
  },
});
// 通过模型定义，创建带模型含义的表单
const AreaForms = formFn<{ province: string; city: number }>();
const { FormItem, RdxFormRoot } = AreaForms;

// 使用AreaForms构造你的业务输入表单
export const 定制表单渲染 = () => {
  return (
    <FormItemRenderComponentsContext.Provider
      value={{
        TitleComponent: TitleComponent,
        ContentComponent: ContentComponent,
        WrapperComponent: WrapperComponent,
      }}
    >
      <RdxFormRoot enabledStatePreview={true}>
        <FormItem
          name='province'
          title='省份'
          type='string'
          desc={'我是描述。。。'}
          tips={'我是提示'}
          componentType={'input'}
        ></FormItem>
        <FormItem
          name='city'
          title='城市'
          tips={'我是提示'}
          tipsPosition={'before'}
          type='string'
          componentType={'input'}
        ></FormItem>
      </RdxFormRoot>
    </FormItemRenderComponentsContext.Provider>
  );
};
