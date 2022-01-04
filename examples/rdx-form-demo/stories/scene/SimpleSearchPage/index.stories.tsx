// import React, { useEffect, useRef } from 'react';
// import {
//   BaseType,
//   LabelTextAlign,
//   FormLayout,
//   RdxFormContext,
//   RdxNextFormItem,
//   LayoutType,
//   SearchList,
// } from '@alife/hippo-form-library';
// import {
//   atom,
//   useRdxState,
//   RdxContext,
//   pendingCompute,
//   useRdxStateLoader,
//   isLoading,
//   useRdxValueLoader,
//   compute,
// } from '@alife/rdx';
// import { Table } from '@alife/hippo';
// import {
//   AggregateType,
//   CancelToken,
//   getData,
//   getDimension,
//   Operator,
// } from '@alife/mock-core';

// export default {
//   title: '场景案例',
//   parameters: {
//     info: { inline: true },
//   },
// };
// const SearchAtom = atom({
//   id: 'search',
//   defaultValue: { 地区名称: '' },
// });

// const InputSearchList = () => {
//   const [value, setValue] = useRdxState(SearchAtom);
//   // 如何等待RdxFormCntext加载完成，之前应该是loading状态
//   // 1. markWatting
//   // 2. markFinish
//   // 3. resolve
//   return (
//     <RdxFormContext
//       initializeState={SearchAtom}
//       onChange={(value) => {
//         setValue(value);
//       }}
//     >
//       <FormLayout
//         labelTextAlign={LabelTextAlign.Right}
//         layoutType={LayoutType.Inline}
//       >
//         <RdxNextFormItem
//           type={BaseType.String}
//           title={'地区名称'}
//           name='地区名称'
//         ></RdxNextFormItem>
//       </FormLayout>
//     </RdxFormContext>
//   );
// };

// const SearchListSelect = () => {
//   const { setValue } = pendingCompute({ id: 'search' });
//   return (
//     <RdxFormContext
//       onChange={(value) => {
//         setValue(value);
//       }}
//     >
//       <FormLayout
//         labelTextAlign={LabelTextAlign.Right}
//         layoutType={LayoutType.Inline}
//       >
//         <RdxNextFormItem
//           name='地区名称'
//           type='string'
//           get={async ({ value, get }) => {
//             const data = await getDimension({
//               dimensions: '地区名称',
//             });
//             return {
//               ...(value as any),
//               componentProps: {
//                 dataSource: data.data,
//               },
//             };
//           }}
//           xComponent={'select'}
//           title={'地区名称'}
//         ></RdxNextFormItem>
//       </FormLayout>
//     </RdxFormContext>
//   );
// };

// const MultiSelectCascader = () => {
//   const dimensions = ['地区名称', '单据日期', '客户分类'];
//   const { setValue, setLoading } = pendingCompute({ id: 'search' });
//   return (
//     <RdxFormContext
//       onChange={(value) => {
//         setValue(value);
//       }}
//       onLoading={() => {
//         setLoading();
//       }}
//     >
//       <FormLayout
//         labelTextAlign={LabelTextAlign.Right}
//         layoutType={LayoutType.Inline}
//       >
//         {dimensions.map((item, index) => (
//           <RdxNextFormItem
//             name={item}
//             type='string'
//             get={async ({ value, get }) => {
//               const data = await getDimension({
//                 dimensions: item,
//                 filters: dimensions.slice(0, index).map((item, colIndex) => ({
//                   member: item,
//                   operator: Operator.contains,
//                   // @ts-ignore
//                   values: get(item).value,
//                 })),
//               });
//               return {
//                 ...(value as any),
//                 componentProps: {
//                   dataSource: data.data,
//                 },
//               };
//             }}

//             xComponent={'select'}
//             title={item}
//           ></RdxNextFormItem>
//         ))}
//       </FormLayout>
//     </RdxFormContext>
//   );
// };

// const SearchListCascader = () => {
//   const dimensions = ['地区名称', '单据日期', '客户分类'];
//   const { setValue } = pendingCompute({ id: 'search' });
//   return (
//     <SearchList
//       cols={[8]}
//       onSearch={(value) => {
//         setValue(value);
//       }}
//     >
//       {dimensions.map((item, index) => (
//         <RdxNextFormItem
//           name={item}
//           type='string'
//           get={async ({ value, get }) => {
//             const data = await getDimension({
//               dimensions: item,
//               filters: dimensions.slice(0, index).map((item, colIndex) => ({
//                 member: item,
//                 operator: Operator.contains,
//                 // @ts-ignore
//                 values: get(item).value,
//               })),
//             });
//             return {
//               ...(value as any),
//               componentProps: {
//                 dataSource: data.data,
//               },
//             };
//           }}
//           xComponent={'select'}
//           title={item}
//         ></RdxNextFormItem>
//       ))}
//     </SearchList>
//   );
// };

// const SearchListCascaderForm = (props: { children }) => {
//   const dimensions = ['地区名称', '单据日期', '客户分类'];
//   const [value, setValue] = useRdxState(SearchAtom);
//   return (
//     <RdxFormContext
//       initializeState={SearchAtom}
//       onChange={(value) => {
//         setValue(value);
//       }}
//     >
//       <FormLayout
//         labelTextAlign={LabelTextAlign.Right}
//         layoutType={LayoutType.Inline}
//       >
//         {dimensions.map((item, index) => (
//           <RdxNextFormItem
//             name={item}
//             type='string'
//             get={async ({ value, get }) => {
//               const data = await getDimension({
//                 dimensions: item,
//                 filters: dimensions.slice(0, index).map((item, colIndex) => ({
//                   member: item,
//                   operator: Operator.contains,
//                   // @ts-ignore
//                   values: get(item).value,
//                 })),
//               });
//               return {
//                 ...(value as any),
//                 componentProps: {
//                   dataSource: data.data,
//                 },
//               };
//             }}
//             xComponent={'select'}
//             title={item}
//           ></RdxNextFormItem>
//         ))}
//       </FormLayout>
//       {props.children}
//     </RdxFormContext>
//   );
// };

// const dimensions = ['地区名称', '单据日期', '客户分类'];
// const tableCompute = compute({
//   id: 'table',
//   get: async ({ get }) => {
//     const searchData = get(SearchAtom);
//     const fetchData = await getData({
//       dimensions: dimensions,
//       measures: [{ key: '税费', aggregateType: AggregateType.Sum }],
//       filters: dimensions
//         .filter((item) => searchData[item])
//         .map((item) => ({
//           member: item,
//           operator: Operator.contains,
//           values: searchData[item],
//         })),
//     });
//     return fetchData.data;
//   },
// })
// const TableView = () => {

//   const value = useRdxValueLoader(tableCompute);
//   return (
//     <Table dataSource={value.content} loading={isLoading(value.status)}>
//       {dimensions.map((item) => (
//         <Table.Column title={item} dataIndex={item}></Table.Column>
//       ))}
//       <Table.Column title='税费' dataIndex='税费'></Table.Column>
//     </Table>
//   );
// };

// const tableCompute2 = compute({
//   id: 'table',
//   get: async ({ get, callbackMapWhenConflict }) => {
//     const fetchData = await getData({
//       dimensions: dimensions,
//       measures: [{ key: '税费', aggregateType: AggregateType.Sum }],
//       filters: dimensions
//         .filter((item) => (get(item) as any).value)
//         .map((item) => ({
//           member: item,
//           operator: Operator.contains,
//           values: (get(item) as any).value,
//         })),
//     });
//     return { ...get(tableCompute2), value: fetchData.data };
//   },
// })
// const FormTableView = () => {
//   const dimensions = ['地区名称', '单据日期', '客户分类'];
//   const [value, setValue] = useRdxStateLoader(tableCompute2);
//   return (
//     <Table
//       dataSource={context.loading ? [] : value.value}
//       loading={isLoading(value)}
//     >
//       {dimensions.map((item) => (
//         <Table.Column title={item} dataIndex={item}></Table.Column>
//       ))}
//       <Table.Column title='税费' dataIndex='税费'></Table.Column>
//     </Table>
//   );
// };
// export const 模糊搜索列表 = () => {
//   return (
//     <RdxContext>
//       <InputSearchList />
//       <TableView />
//     </RdxContext>
//   );
// };

// export const 下拉筛选搜索列表 = () => {
//   return (
//     <RdxContext>
//       <SearchListSelect />
//       <TableView />
//     </RdxContext>
//   );
// };

// export const 级联搜索列表 = () => {
//   return (
//     <RdxContext>
//       <MultiSelectCascader></MultiSelectCascader>
//       <TableView />
//     </RdxContext>
//   );
// };
// export const 带查询按钮的级联搜索列表 = () => {
//   return (
//     <RdxContext>
//       <SearchListCascader></SearchListCascader>
//       <TableView />
//     </RdxContext>
//   );
// };
// export const 表单内级联搜索列表 = () => {
//   return (
//     <SearchListCascaderForm>
//       <FormTableView />
//     </SearchListCascaderForm>
//   );
// };
