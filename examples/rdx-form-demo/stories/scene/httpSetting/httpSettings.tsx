// import React, { FC } from 'react';
// import { RequestType, REQUEST_TYPE, IHttpSettingValue } from './types';
// import {
//   RdxFormContext,
//   RdxFormItem as UnDefinedRdxFormItem,
//   FormLayout,
//   XComponentType,
//   BaseType,
//   IRdxFormItem,
//   IRdxFormComputeGet,
//   useRdxFormGlboalState,
//   useRdxFormState,
// } from '@alife/hippo-form-library';
// import { atom, RdxContext, RdxState, useRdxState } from '@alife/rdx';
// import { Button, Notification } from '@alife/hippo';
// import { parseGetParams, mockResult, jsonParse } from './utils';
// import { fetchData } from './dataUtils';
// import JsonView from 'react-inspector';

// const RdxFormItem = <GBaseType extends BaseType>(
//   props: IRdxFormItem<HttpSettingState & { data: unknown }, GBaseType>
// ) => {
//   return <UnDefinedRdxFormItem {...props} />;
// };

// export interface IHttpSetting {
//   value: IHttpSettingValue;
//   onChange?: (value: IHttpSettingValue) => void;
// }

// export enum UrlParmasType {
//   Key = 'key',
//   Value = 'value',
// }

// export function createNewUrl(
//   url: string,
//   params: { key: string; value: string }[]
// ) {
//   const urlInstance = new URL(url);
//   const parmasString = params
//     .map((item) => `${item.key}=${item.value}`)
//     .join('&');
//   const pathname = urlInstance.pathname === '/' ? '' : urlInstance.pathname;
//   return `${urlInstance.origin}${pathname}${
//     parmasString ? '?' + parmasString : ''
//   }`;
// }
// export function updateUrl(
//   url: string,
//   key: string,
//   index: string,
//   value: string
// ) {
//   const params = parseGetParams(url);
//   if (parseInt(index) >= params.length) {
//     params.push({
//       key: '',
//       value: '',
//       [key]: value,
//     } as any);
//   } else {
//     params[index][key] = value;
//   }

//   return createNewUrl(url, params);
// }
// function Preview() {
//   const [v] = useRdxFormState<any>(atom({ id: 'data', defaultValue: '' }));
//   return (
//     <JsonView
//       data={v.value || { message: '???????????????????????????????????????' }}
//     ></JsonView>
//   );
// }
// function FetchComponent() {
//   const globalState = useRdxFormGlboalState();
//   const [state, setState] = useRdxState(
//     atom({
//       id: 'data',
//       virtual: true,
//       defaultValue: { value: null, visible: true, disabled: false },
//     })
//   );
//   return (
//     <Button
//       onClick={() => {
//         async function getData() {
//           const res = await fetchData({
//             defaultOptions: globalState.state,
//             isFormatter: false,
//           });
//           setState({
//             value: res,
//             visible: true,
//             disabled: false,
//           });
//         }
//         getData();
//       }}
//     >
//       ????????????
//     </Button>
//   );
// }

// const InfoWrapper = ({ title = '??????', children }) => {
//   return (
//     <div
//       style={{
//         marginBottom: 12,
//         border: '1px dashed lightgrey',
//         position: 'relative',
//         width: '100%',
//         height: '100%',
//         padding: 12,
//       }}
//     >
//       <div
//         style={{
//           position: 'absolute',
//           background: 'white',
//           left: 20,
//           top: -10,
//           padding: 4,
//         }}
//       >
//         {title}
//       </div>
//       {children}
//     </div>
//   );
// };
// const RequestInfo = () => {
//   const compute = ({ get, set, id }, newValue) => {
//     const ids = id.split('.');
//     const currentIndex = ids[ids.length - 2];
//     const currentKey = ids[ids.length - 1];
//     const urlInstance = get('requestInfo.url');
//     const newUrl = updateUrl(
//       urlInstance.value,
//       currentKey,
//       currentIndex,
//       newValue.value
//     );
//     set('requestInfo.url', {
//       ...urlInstance,
//       value: newUrl,
//     });
//   };
//   const get: IRdxFormComputeGet<any, HttpSettingState & { data: unknown }> = ({
//     id,
//     get,
//   }) => {
//     const ids = id.split('.');
//     const currentIndex = ids[ids.length - 2];
//     const currentKey = ids[ids.length - 1];
//     // @ts-ignore
//     const value = parseGetParams(get('requestInfo.url').value);
//     return {
//       value: value[currentIndex][currentKey],
//       visible: true,
//       disabled: false,
//     };
//   };
//   return (
//     <InfoWrapper title='????????????'>
//       <RdxFormItem name='requestInfo' type={BaseType.Object}>
//         <div style={{ display: 'flex' }}>
//           <RdxFormItem
//             name='requestType'
//             type={BaseType.String}
//             componentProps={{
//               dataSource: REQUEST_TYPE.map((item) => ({
//                 label: item,
//                 value: item,
//               })),
//             }}
//             default={REQUEST_TYPE[0]}
//             componentType={XComponentType.Select}
//           ></RdxFormItem>
//           <RdxFormItem
//             name='url'
//             type={BaseType.String}
//             rules={[
//               async (value) => {
//                 try {
//                   new URL(value);
//                   return;
//                 } catch (error) {
//                   return '?????????????????????';
//                 }
//               },
//             ]}
//             componentProps={{ style: { width: 320 } }}
//           />
//           <FetchComponent />
//         </div>

//         <RdxFormItem
//           name='params'
//           title='????????????'
//           virtual={true}
//           componentType={XComponentType.ArrayTable}
//           type={BaseType.Array}
//           get={({ get, value }) => {
//             const url = get('requestInfo.url').value;
//             try {
//               new URL(url);
//               return {
//                 ...value,
//                 visible: true,
//                 value: parseGetParams(url),
//               };
//             } catch (error) {
//               return {
//                 ...value,
//                 visible: false,
//               };
//             }
//           }}
//           set={({ id, get, set }, newValue) => {
//             const urlObj = get('requestInfo.url');
//             try {
//               // @ts-ignore
//               set('requestInfo.url', {
//                 ...urlObj,
//                 value: createNewUrl(urlObj.value, newValue.value),
//               });
//             } catch (error) {
//               Notification.help({
//                 content: JSON.stringify(error.toString()),
//               });
//             }
//           }}
//         >
//           <RdxFormItem
//             type={BaseType.Object}
//             default={{ key: '1', value: '2' }}
//           >
//             <RdxFormItem
//               get={get}
//               set={compute}
//               title='key'
//               name='key'
//               type={BaseType.String}
//             ></RdxFormItem>
//             <RdxFormItem
//               set={compute}
//               get={get}
//               title='value'
//               name='value'
//               type={BaseType.String}
//             ></RdxFormItem>
//           </RdxFormItem>
//         </RdxFormItem>
//         <RdxFormItem
//           name='body'
//           visible={false}
//           type={BaseType.String}
//           default={'{}'}
//           rules={[
//             async (value) => {
//               try {
//                 jsonParse(value);
//                 return;
//               } catch (error) {
//                 return 'json?????????';
//               }
//             },
//           ]}
//           componentType={XComponentType.JsonEditor}
//           get={async ({ value, get }) => {
//             const requestType = get('requestInfo.requestType').value;
//             return {
//               ...value,
//               visible: requestType === RequestType.POST,
//             };
//           }}
//         ></RdxFormItem>
//       </RdxFormItem>
//     </InfoWrapper>
//   );
// };

// export default function HttpSetting(props: IHttpSetting) {
//   const { value, onChange } = props;

//   return (
//     <RdxContext>
//       <div>
//         <h4>??????????????? </h4>
//         <div>1. ?????????????????????????????????????????????????????????????????????????????????</div>
//         <div>
//           ??????. ???????????????????????????????????????type?????????????????????get?????????????????????
//         </div>
//         <div>2. ??????get????????????????????????????????????????????????????????????????????????</div>
//         <div>??????. ??????????????????????????????</div>
//         <div>3. get???????????????????????????????????????????????????????????????????????????</div>
//         <div>??????. ??????????????????????????????</div>
//         <div>
//           4. ???????????????????????????get??????????????????????????????????????????????????????????????????
//         </div>
//         <div>??????. ????????????</div>
//         <div>5. ????????????????????????????????????????????????????????????</div>
//         <div>??????. ????????????</div>
//         <div>6. ?????????????????????ts??????</div>
//       </div>
//       <RdxFormContext
//         state={value}
//         onChange={onChange}
//         typescriptGenerateOptions={{ rootName: 'HttpSettingState' }}
//         enabledStatePreview={true}
//         enabledTypescriptGenerte={true}
//       >
//         <RequestInfo></RequestInfo>
//         <InfoWrapper title='??????????????????'>
//           <RdxFormItem name={'requestProcess'} type={BaseType.Object}>
//             <FormLayout labelCol={8}>
//               <RdxFormItem
//                 name={'useParamsTransform'}
//                 title='????????????'
//                 desc='?????????????????????(pageIndex, pageSize, sort)?????????'
//                 componentType={XComponentType.Checkbox}
//                 type={BaseType.Boolean}
//               ></RdxFormItem>
//             </FormLayout>
//           </RdxFormItem>
//         </InfoWrapper>
//         <InfoWrapper title='??????????????????'>
//           <RdxFormItem name={'resultProcess'} type={BaseType.Object}>
//             <FormLayout>
//               <RdxFormItem
//                 name={'useFilter'}
//                 componentType={XComponentType.Checkbox}
//                 title='???????????????'
//                 default={false}
//                 type={BaseType.Boolean}
//               ></RdxFormItem>
//               <RdxFormItem
//                 get={({ get }) => {
//                   const useFilterInstance = get('resultProcess.useFilter');
//                   return {
//                     ...value,
//                     visible: !useFilterInstance.value,
//                   };
//                 }}
//                 default={'data'}
//                 name={'dataField'}
//                 title='??????????????????'
//                 type={BaseType.String}
//               ></RdxFormItem>
//               <RdxFormItem
//                 name={'filter'}
//                 visible={false}
//                 get={({ get, value }) => {
//                   const data = get('data').value;
//                   const useFilter = get('resultProcess.useFilter').value;
//                   const requestType = get('requestInfo.requestType');
//                   const urlInstance = get('requestInfo.url');
//                   const body = get('requestInfo.body');

//                   const baseValue = {
//                     ...value,
//                     visible: useFilter === true,
//                   };
//                   try {
//                     const result = mockResult(
//                       data,
//                       value.value,
//                       requestType as any,
//                       urlInstance.value,
//                       body.value
//                     );
//                     return {
//                       ...baseValue,
//                       componentProps: {
//                         ...value.componentProps,
//                         src: result,
//                       },
//                     };
//                   } catch (error) {
//                     return baseValue;
//                   }
//                 }}
//                 componentProps={{
//                   isDialog: true,
//                   // trigger: <Button type='primary'>????????????????????????</Button>,
//                 }}
//                 title='???????????????'
//                 type={'string'}
//                 componentType={'code'}
//               ></RdxFormItem>
//             </FormLayout>
//           </RdxFormItem>
//         </InfoWrapper>
//         <InfoWrapper title='????????????'>
//           <Preview />
//         </InfoWrapper>
//       </RdxFormContext>
//     </RdxContext>
//   );
// }

// interface HttpSettingState {
//   requestInfo: RequestInfo;
//   requestProcess: RequestProcess;
//   resultProcess: ResultProcess;
// }
// interface ResultProcess {
//   useFilter: boolean;
//   dataField: string;
//   filter: string;
// }
// interface RequestProcess {
//   useParamsTransform: boolean;
// }
// interface RequestInfo {
//   requestType: string;
//   url: string;
//   body: string;
// }
