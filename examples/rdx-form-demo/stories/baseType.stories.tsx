// import React from 'react';
// import {
//   RdxFormContext,
//   FormItem,
//   XComponentType,
//   BaseType,
// } from '@alife/hippo-form-library';
// export default {
//   title: '基础属性分类',
//   parameters: {
//     info: { inline: true },
//   },
// };

// export const 字符串类型 = () => {
//   return (
//     <RdxFormContext onChange={(value) => {}} enabledStatePreview={true}>
//       <FormItem name='A' title='输入框' type={'string'} />
//       <FormItem
//         name='B'
//         title='下拉框'
//         type={'string'}
//         componentType={'select'}
//         componentProps={{
//           dataSource: [
//             {
//               label: 'A',
//               value: 'A',
//             },
//             {
//               label: 'B',
//               value: 'B',
//             },
//           ],
//         }}
//       />
//       <FormItem
//         name='C'
//         title='输入框'
//         type={'string'}
//         componentType={'code'}
//       />
//       <FormItem
//         name='D'
//         title='输入框'
//         type={'string'}
//         componentType={'color'}
//       />
//       <FormItem
//         name='time'
//         title='时间输入框'
//         type={'string'}
//         componentType={'time'}
//       />
//     </RdxFormContext>
//   );
// };

// export const 布尔类型 = () => {
//   return (
//     <RdxFormContext onChange={(value) => {}}>
//       <FormItem name='A' title='开关' type={'boolean'} />
//       <FormItem
//         name='B'
//         title='复选框'
//         type={'boolean'}
//         componentType={XComponentType.Checkbox}
//       />
//     </RdxFormContext>
//   );
// };

// export const 数组 = () => {
//   return (
//     <RdxFormContext onChange={(value) => {}} enabledStatePreview={true}>
//       <FormItem name='A' title='表格数组' type={'array'}>
//         <FormItem type={BaseType.Object}>
//           <div style={{ display: 'flex' }}>
//             <FormItem
//               type='string'
//               title='字段1'
//               name='a'
//               default={'字段1'}
//             ></FormItem>
//             <FormItem
//               type='string'
//               title='字段2'
//               name='b'
//               default={'字段2'}
//             ></FormItem>
//           </div>
//         </FormItem>
//       </FormItem>
//       <FormItem
//         name='B'
//         title='表格数组'
//         type={'array'}
//         componentType={XComponentType.ArrayTable}
//       >
//         <FormItem type={BaseType.Object}>
//           <FormItem
//             type='string'
//             title='字段1'
//             name='a'
//             default={'字段1'}
//           ></FormItem>
//           <FormItem
//             type='string'
//             title='字段2'
//             name='b'
//             default={'字段2'}
//           ></FormItem>
//         </FormItem>
//       </FormItem>
//     </RdxFormContext>
//   );
// };
// export const JsonView = () => {
//   return (
//     <RdxFormContext onChange={(value) => {}}>
//       <FormItem
//         name='A'
//         title='输入框'
//         type={'string'}
//         componentType={'json'}
//         default={JSON.stringify({ a: 1, b: 2 })}
//       />
//     </RdxFormContext>
//   );
// };

// export const 树形数据配置 = () => {
//   return (
//     <RdxFormContext enabledStatePreview={true} onChange={(value) => {}}>
//       <FormItem
//         name='A'
//         title='输入框'
//         type={'array'}
//         componentType={XComponentType.Tree}
//       >
//         <FormItem
//           type={BaseType.Object}
//           default={() => {
//             return { id: Math.random(), a: 1, b: 2 };
//           }}
//         >
//           <FormItem type='string' title='字段1' name='id'></FormItem>
//           <FormItem type='string' title='字段1' name='a'></FormItem>
//           <FormItem type='string' title='字段2' name='b'></FormItem>
//         </FormItem>
//       </FormItem>
//     </RdxFormContext>
//   );
// };
