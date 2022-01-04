// import React from 'react';

// import '@alife/hippo/dist/hippo.css';
// import { useState } from 'react';
// import {
//   FormItem,
//   RdxFormContext,
//   Preview,
//   BaseType,
//   IModel,
//   IRdxFormItem,
//   FormRdxStateContext,
// } from '@alife/hippo-form-library';
// import { Button } from '@alife/hippo';
// export default {
//   title: 'rdx-form/表单组件',
//   parameters: {
//     info: { inline: true },
//   },
// };

// export const 基础表单 = () => {
//   return (
//     <div>
//       <RdxFormContext
//         state={{ A: 2 }}
//         onChange={(v) => {
//           console.log('v', v);
//         }}
//       >
//         <FormItem default={'1'} name='A' title='输入框' type={'string'} />
//         <FormItem
//           name='B'
//           title='下拉框'
//           type={'string'}
//           componentType={'select'}
//           componentProps={{
//             dataSource: [
//               { label: '测试1', value: '测试1' },
//               { label: '测试2', value: '测试2' },
//             ],
//           }}
//         />
//       </RdxFormContext>
//     </div>
//   );
// };

// export const 表单对象 = () => {
//   return (
//     <RdxFormContext>
//       <FormItem name='parent' title='parent' type={'object'}>
//         <FormItem name='child' title='111' type={'string'} />
//       </FormItem>
//     </RdxFormContext>
//   );
// };

// export const 多对象嵌套 = () => {
//   return (
//     <RdxFormContext>
//       <FormItem name='parent1' title='parent' type={'object'}>
//         <FormItem name='child-1' title='111' type={'string'} />
//         <FormItem name='parent2' title='parent' type={'object'}>
//           <FormItem name='child-2' title='111' type={'string'} />
//         </FormItem>
//       </FormItem>
//     </RdxFormContext>
//   );
// };

// export const 非受控例子 = () => {
//   const [state, setState] = useState();
//   return (
//     <RdxFormContext
//       initializeState={state}
//       onChange={(v) => {
//         setState(v);
//       }}
//     >
//       <FormItem name='parent1' title='parent' type={'object'}>
//         <FormItem name='child-1' title='111' type={'string'} />
//         <FormItem name='child-2' title='111' type={'string'} />
//         <FormItem name='parent2' title='parent' type={'object'}>
//           <FormItem name='child-3' title='111' type={'string'} />
//         </FormItem>
//       </FormItem>
//     </RdxFormContext>
//   );
// };

// export const 默认值配置 = () => {
//   return (
//     <RdxFormContext onChange={(value) => {}}>
//       <FormItem name='a' title='111' type={'string'} default={'haha'} />
//       <FormItem name='b' title='111' type={'string'} default={'hehe'} />
//     </RdxFormContext>
//   );
// };

// export const 受控例子 = () => {
//   const [state, setState] = useState({});
//   return (
//     <RdxFormContext
//       state={state}
//       onChange={(value) => {
//         setState(value);
//       }}
//     >
//       <Button
//         onClick={() => {
//           setState({
//             a: '11111',
//           });
//         }}
//       >
//         修改数据
//       </Button>
//       <FormItem name='a' title='111' type={'string'} default={'haha'} />
//     </RdxFormContext>
//   );
// };

// export const 联动例子 = () => {
//   const [state, setState] = useState({});
//   interface RootType {
//     a: string;
//     b: string;
//   }
//   return (
//     <RdxFormContext
//       state={state}
//       enabledTypescriptGenerte={true}
//       onChange={(value) => {
//         setState(value);
//       }}
//     >
//       <FormItem name='a' title='111' type={'string'} default={'haha'} />
//       <FormItem
//         name='b'
//         title='111'
//         type={'string'}
//         componentType={'select'}
//         componentProps={{ dataSource: [] }}
//         get={async ({ get, value }) => {
//           const depsValue = get('a');

//           let a = [];
//           for (let i = 0; i < 5; i++) {
//             a.push({
//               label: depsValue.value + '-' + i,
//               value: depsValue.value + '-' + i,
//             });
//           }
//           return {
//             ...value,
//             componentProps: {
//               dataSource: a,
//             },
//           };
//         }}
//       />
//     </RdxFormContext>
//   );
// };

// export const 展示隐藏 = () => {
//   interface RootObject {
//     a: string;
//     b: string;
//   }
//   return (
//     <RdxFormContext enabledTypescriptGenerte={true}>
//       <FormItem
//         name='a'
//         title='111'
//         type={'string'}
//         componentType={'radio'}
//         componentProps={{
//           dataSource: [
//             { label: '展示', value: 'show' },
//             { label: '隐藏', value: 'hidden' },
//           ],
//         }}
//       />
//       <FormItem
//         name='b'
//         visible={false}
//         title='111'
//         type={'string'}
//         get={({ get, value }) => {
//           const depsValue = get('a');
//           return {
//             ...value,
//             visible: depsValue.value === 'show',
//           };
//         }}
//       />
//     </RdxFormContext>
//   );
// };

// export const 数组对象 = () => {
//   return (
//     <RdxFormContext
//       onChange={(value) => {}}
//       enabledStatePreview={true}
//       enabledTypescriptGenerte={true}
//     >
//       <FormItem name='root' title='root' type={'object'}>
//         <FormItem name='arr' title='arr' type={'array'}>
//           <FormItem type={'object'}>
//             <FormItem name='item' title='string' type='string'></FormItem>
//             <FormItem name='itemObject' title='object' type='object'>
//               <FormItem
//                 name='itemObjectChild'
//                 title='string'
//                 type='string'
//               ></FormItem>
//             </FormItem>
//           </FormItem>
//         </FormItem>
//       </FormItem>
//     </RdxFormContext>
//   );
// };

// export const 字符串数组_ArrayTable = () => {
//   return (
//     <RdxFormContext
//       enabledStatePreview={true}
//       enabledTypescriptGenerte={true}
//       onChange={(value) => {}}
//     >
//       <FormItem
//         name='arr'
//         title='数组标题'
//         type={'array'}
//         componentType={'arrayTable'}
//       >
//         <FormItem title='请输入字符串' type={'string'}></FormItem>
//         {/* <div></div> */}
//       </FormItem>
//     </RdxFormContext>
//   );
// };

// export const 数组对象_ArrayTable = () => {
//   return (
//     <RdxFormContext enabledTypescriptGenerte={true} onChange={(value) => {}}>
//       <FormItem name='root' title='root' type={'object'}>
//         <FormItem
//           name='arr'
//           title='arr'
//           type={'array'}
//           componentType={'arrayTable'}
//         >
//           <FormItem type={'object'}>
//             <FormItem name='item' title='string' type='string'></FormItem>
//           </FormItem>
//         </FormItem>
//       </FormItem>
//     </RdxFormContext>
//   );
// };

// export const 字符串数组 = () => {
//   return (
//     <RdxFormContext onChange={(value) => {}}>
//       <FormItem name='arr' title='arr' type={'array'}>
//         <FormItem type='string'></FormItem>
//       </FormItem>
//     </RdxFormContext>
//   );
// };

// export const 字符串嵌套数组 = () => {
//   return (
//     <RdxFormContext onChange={(value) => {}} enabledTypescriptGenerte={true}>
//       <FormItem name='arr' title='嵌套数组' type={'array'}>
//         <FormItem name='arr' title='arr' type={'array'}>
//           <FormItem type='string'></FormItem>
//         </FormItem>
//       </FormItem>
//     </RdxFormContext>
//   );
// };

// export const 字符串多层嵌套数组 = () => {
//   return (
//     <RdxFormContext onChange={(value) => {}} enabledTypescriptGenerte={true}>
//       <FormItem name='arr' title='嵌套数组' type={'array'}>
//         <FormItem type={'object'}>
//           <FormItem name='arr2' title='嵌套的数组标题' type={'array'}>
//             <FormItem title={'字符串'} type='string'></FormItem>
//           </FormItem>
//         </FormItem>
//       </FormItem>
//     </RdxFormContext>
//   );
// };

// export const 强依赖关系 = () => {
//   interface RootObject {
//     total: number;
//     unit: number;
//     amount: number;
//   }
//   return (
//     <RdxFormContext onChange={(value) => {}} enabledTypescriptGenerte={true}>
//       {/* <DevVisualTableTool /> */}

//       <FormItem
//         default={100}
//         title='单价'
//         name='unit'
//         type='number'
//       ></FormItem>
//       <FormItem
//         default={50}
//         title='数量'
//         name='amount'
//         type={BaseType.Number}
//       ></FormItem>
//       <FormItem<RootObject>
//         set={({ get, set, value }, newValue) => {
//           const amount = get('total');
//           const unit = get('unit');
//           set('amount', {
//             ...amount,
//             value: newValue.value / unit.value,
//           });
//         }}
//         get={({ get, value }) => {
//           const amount = get('amount');
//           console.log('33333 amount: ', amount);
//           const unit = get('unit');
//           console.log('33333 unit: ', unit);
//           return {
//             ...value,
//             value: amount.value * unit.value,
//           };
//         }}
//         title='总价'
//         name='total'
//         type='number'
//       ></FormItem>
//       {/* <DevVisualGraphTool /> */}
//     </RdxFormContext>
//   );
// };

// export const 基础表单_校验 = () => {
//   return (
//     <RdxFormContext>
//       <FormItem require name='A' title='输入框2' type={'string'} />
//       <FormItem
//         name='B'
//         title='下拉框'
//         type={'string'}
//         componentProps={{
//           dataSource: [{ label: '测试1', value: '测试2' }],
//         }}
//         componentType={'select'}
//       />
//     </RdxFormContext>
//   );
// };
