// import { Button } from '@alife/hippo';
// import { DragFrame } from '@alife/shuhe-dnd-layout';
// import React from 'react';
// import { v1 as uuid} from 'uuid';
// import { ISingleWidgetState } from './model';
// export enum WidgetType {
//   Layout = 'Layout',
//   Widget = 'Widget',
// }
// interface IWidget {
//   // 组件名称
//   title: string;
//   // 图标
//   icon?: string;
//   type: string;
//   schema?: (() => ISingleWidgetState) | ISingleWidgetState;
// }
// const widgets: IWidget[] = [
//   {
//     title: '输入框',
//     schema: {
//       type: 'string',
//     },
//   },
//   {
//     title: '下拉框',
//     schema: {
//       type: 'string',
//       componentType: 'select',
//     },
//   },
//   {
//     title: '开关',
//     schema: {
//       type: 'boolean',
//     },
//   },
//   {
//     title: '日期',
//     schema: {
//       type: 'string',
//       componentType: 'time',
//     },
//   },
//   {
//     title: '单选框',
//     schema: {
//       type: 'boolean',
//       componentType: 'radio',
//     },
//   },
// ].map((item) => ({
//   ...item,
//   type: WidgetType.Widget,
//   schema: { ...item.schema, title: '未命名' },
// }));
// function generateBlockSchema(cols: number[]) {
//   return {
//     type: 'layout',
//     componentType: 'row',
//     properties: cols.reduce((root, item) => {
//       root[uuid()] = {
//         type: 'layout',
//         componentType: 'col',
//         componentProps: {
//           span: item,
//         },
//         properties: {},
//       };
//       return root;
//     }, {}),
//   };
// }
// const grids: IWidget[] = [
//   {
//     title: '单行',
//     cols: [24],
//     type: WidgetType.Layout,
//     icon: 'https://img.alicdn.com/tfs/TB1f4m_12b2gK0jSZK9XXaEgFXa-248-98.png',
//   },
//   {
//     title: '对半',
//     cols: [12, 12],
//     type: WidgetType.Layout,
//     icon: 'https://img.alicdn.com/tfs/TB1KImZn7cx_u4jSZFlXXXnUFXa-248-98.png',
//   },
//   {
//     title: '左16右8',
//     cols: [16, 8],
//     type: WidgetType.Layout,
//     icon: 'https://img.alicdn.com/tfs/TB1CIDwrBBh1e4jSZFhXXcC9VXa-248-98.png',
//   },
//   {
//     title: '左8右16',
//     cols: [8, 16],
//     type: WidgetType.Layout,
//     icon: 'https://img.alicdn.com/tfs/TB1dzbj14v1gK0jSZFFXXb0sXXa-248-98.png',
//   },
//   {
//     title: '888',
//     cols: [8, 8, 8],
//     type: WidgetType.Layout,
//     icon: 'https://img.alicdn.com/tfs/TB1E2Ye1Yr1gK0jSZFDXXb9yVXa-248-98.png',
//   },
//   {
//     title: '6666',
//     cols: [6, 6, 6, 6],
//     type: WidgetType.Layout,
//     icon: 'https://img.alicdn.com/tfs/TB1O3Hwm0Tfau8jSZFwXXX1mVXa-248-98.png',
//   },
// ].map((item) => {
//   const { cols, ...rest } = item;
//   return {
//     ...rest,
//     schema: generateBlockSchema(cols),
//   };
// });

// const gridLayouts = [
//   {
//     title: '网格布局',
//     type: WidgetType.Layout,
//     icon: 'https://img.alicdn.com/tfs/TB1nXrv1VT7gK0jSZFpXXaTkpXa-118-66.png',
//     schema: () => {

//       return {
//         type: 'layout',
//         componentType: 'grid',
//         componentProps: {},
//         properties: new Array().fill(3).reduce((root, item) => {
//           root[uuid()] = {
//             type: 'layout',
//             componentType: 'grid-item',
//             componentProps: {
//             },
//             properties: {},
//           };
//           return root;
//         }, {}),
//       }
//     }
//   },
// ];
// // https://img.alicdn.com/tfs/TB1nXrv1VT7gK0jSZFpXXaTkpXa-118-66.png

// const List = (props: { title: string; dataSource: IWidget[] }) => {
//   const { title, dataSource } = props;
//   return (
//     <div style={{ marginBottom: 12 }}>
//       <h2>{title}</h2>
//       <ul style={{ display: 'flex', flexWrap: 'wrap' }}>
//         {dataSource.map((widget) => (
//           <DragFrame
//             dragType={widget.type}
//             getData={() => {
//               const id = uuid();
//               return {
//                 type: 'nestAtom',
//                 uniqueId: id,
//                 ...(typeof widget.schema === 'function'
//                   ? widget.schema()
//                   : widget.schema),
//               };
//             }}
//           >
//             <li
//               style={{
//                 marginTop: 12,
//                 marginRight: 12,
//                 padding: 12,
//                 border: '1px solid lightgrey',
//               }}
//             >
//               {widget.icon ? (
//                 <img
//                   style={{ width: '80px', height: '40px' }}
//                   src={widget.icon}
//                 />
//               ) : (
//                 widget.title
//               )}
//               {/* <div>
//                 <pre>{JSON.stringify(widget.schema, null, 2)}</pre>
//               </div> */}
//             </li>
//           </DragFrame>
//         ))}
//       </ul>
//     </div>
//   );
// };
// export default () => {
//   return (
//     <div>
//       <List title='组件列表' dataSource={widgets}></List>
//       <List title='布局列表' dataSource={grids}></List>
//       <List title='网格布局' dataSource={gridLayouts}></List>
//     </div>
//   );
// };
