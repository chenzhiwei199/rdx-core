// import React from 'react';
// import { TreeTravse } from './TreeTravser';
// import {
//   AnyLayoutPreview,
//   AnyLayoutEditor,
//   registEditor,
// } from '@alife/shuhe-dnd-layout';
// import {
//   atom,
//   useRdxSetter,
//   useRdxState,
//   useRdxStateBindingCallback,
// } from '@alife/rdx';
// import { TreeTravseRenderer } from './TreeTraverRenderer';
// import { produce } from 'immer';
// import { useNodeContext } from './context/NodeContext';
// import { layoutSchema } from './model';
// // registPreview();
// registEditor();
// function toMap(data = []) {
//   let m = new Map();
//   data.forEach((item) => {
//     m.set(item.uniqueId, item);
//   });
//   return m;
// }
// export default (props) => {
//   const { children } = props
//   const { dataSource } = children.props;
//   const childrenMap = toMap(dataSource);
//   const load = useRdxStateBindingCallback();
//   const { stateAtom, path, uniqueId } = useNodeContext();
//   const setLayoutSchemaState = useRdxSetter(layoutSchema);
//   const [state, setState] = useRdxState(stateAtom);
//   return (
//     <AnyLayoutEditor
//       onLayoutChange={(layout   ) => {
//         setState(
//           produce(state, (state) => {
//             // 1. 更新布局
//             state.componentProps = {
//               ...state.componentProps,
//               layout: layout,
//             };
//             // 新增组件会有哪些属性呢？组件类型 | 字段属性类型

//             // 2. 如果有新增，那需要增加属性
//             // if (useActionData.type === UserActionType.Add) {
//             //   const { id, type, widget } = useActionData.data as any;
//             //   load(
//             //     atom({
//             //       id,
//             //       defaultValue: widget,
//             //     })
//             //   );
//             //   // 修改layout  找到节点的位置，增加一个节点
//             //   setLayoutSchemaState((layoutSchemaState) => produce(layoutSchemaState, (layoutSchemaState) => {
//             //     layoutSchemaState.insert(path, { uniqueId: id, parentUniqueId:uniqueId })
//             //   }))
//             //   // // 动态构造compute

//             // }
//           })
//         );
//         // !这里更改的粒度太粗了
//         // 1. 新增
//         // 2. 删除
//         // console.log('useActionData: ', useActionData);
//       }}
//       layout={state.componentProps.layout}

//       AtomRenderer={({ node }) => {
//         node.id;
//         // 这里要找到对应的子节点来进行渲染
//         return (
//           <TreeTravse
//             TreeTravseRenderer={TreeTravseRenderer as any}
//             dataSource={[childrenMap.get(node.id)]}
//           ></TreeTravse>
//         );
//       }}
//     />
//   );
// };
