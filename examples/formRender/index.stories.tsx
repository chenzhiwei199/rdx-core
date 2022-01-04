// import {
//   RdxFormContext,
//   setup,
//   RenderContext,
//   ContentComponent,
//   TitleComponent,
//   IContentComponent,
//   createLayout,
//   BaseType,
//   registryRdxFormComponents,
//   RdxNextFormItem,
// } from '@alife/hippo-form-library';
// import styled from 'styled-components';
// import {
//   atom,
//   RdxContext,
//   RdxState,
//   useRdxGlboalState,
//   useRdxSetter,
//   useRdxState,
//   useRdxValue,
// } from '@alife/rdx';
// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import { TreeTravse } from './TreeTravser';
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import NestLayout from './NestLayout';
// import WidgetList, { WidgetType } from './WidgetList';
// import JsonView from 'react-inspector';
// import {
//   activeAtom,
//   layoutSchema,
//   parseSchema,
//   testJson,
//   toSchema,
//   widgetsSchema,
// } from './model';
// import { TreeTravseRenderer } from './TreeTraverRenderer';
// import TreeSolver from './TreeSolver';
// import {
//   ColLayoutEditor,
//   FloorLayout,
//   PageEditor,
//   RowLayoutEditor,
// } from './components';
// import { useDropZone } from './commonComponents/DropZone';
// import { createInsertFunc, InsertType } from './utils/layoutUtils';
// import { useNodeContext } from './context/NodeContext';
// import GridLayout from './components/Grid/edit';
// import GridItemLayout from './components/GridItem/edit';
// export default {
//   title: '表单渲染器',
//   parameters: {
//     info: { inline: true },
//   },
// };
// setup();

// registryRdxFormComponents({
//   grid: GridLayout,
//   'grid-item': GridItemLayout,
//   page: PageEditor,
//   row: RowLayoutEditor,
//   col: ColLayoutEditor,
//   floorLayout: FloorLayout,
// });

// const EditDiv = styled.div<{
//   useMargin: boolean;
// }>`
//   border: 1px dashed transparent;
//   padding-bottom: ${(props) => {
//     return props.useMargin ? 12 : 0;
//   }}px;
//   &:hover {
//     border: 1px dashed #23a3ff77;
//   }
// `;
// enum DropLineType {
//   Top = 'top',
//   Bottom = 'bottom',
// }
// function WrapperComponentEdit(props: IContentComponent) {
//   const { type, children } = props;
//   const { containerStyle } = createLayout();
//   const [dropLine, setDropLine] = useState<DropLineType>(null);
//   const insert = createInsertFunc();
//   const { uniqueId } = useNodeContext();
//   const [active, setActive] = useRdxState(activeAtom, {
//     shouldUpdate: (state) => {
//       if (state === uniqueId) {
//         return true;
//       } else if (active) {
//         return true;
//       } else {
//         return false;
//       }
//     },
//   });
//   const isCurrentActive = active === uniqueId;
//   const [collectProps, ref] = useDropZone({
//     accept: WidgetType.Widget,
//     onDrop: (options) => {
//       insert(
//         options.data,
//         dropLine === DropLineType.Top
//           ? InsertType.InsertBefore
//           : InsertType.InsertAfter
//       );
//       setDropLine(null);
//     },
//     onHover: ({ dropBoundingRect, mouseClientOffset }) => {
//       const { top, left, bottom, right } = dropBoundingRect;
//       // 计算容器的宽高
//       const height = bottom - top;
//       const width = right - left;
//       // 当前移动的点
//       const { x, y } = {
//         x: mouseClientOffset.x - left,
//         y: mouseClientOffset.y - top,
//       };
//       const ration = y / height;
//       // 安全保护， 防止onHover和onLeave不断互相触发
//       if (ration < 0.1 || ration > 0.9) {
//         return;
//       }
//       const dropLinePosition =
//         ration > 0.5 ? DropLineType.Bottom : DropLineType.Top;
//       if (dropLinePosition === dropLine) {
//         return;
//       } else {
//         // console.log('dropLinePosition: ', dropLinePosition, dropLine);
//         setDropLine(dropLinePosition);
//       }
//       console.log('onhover dropLine: ', dropLine);
//     },
//     onLeave: () => {
//       console.log('dropLine: ', dropLine);
//       if (dropLine !== null) {
//         // console.log('onLeave');
//         setDropLine(null);
//       }
//     },
//   });
//   const position = {} as any;
//   if (dropLine === DropLineType.Top) {
//     position.top = 0;
//   } else {
//     position.bottom = 0;
//   }

//   return (
//     <EditDiv
//       ref={ref}
//       onClick={() => {
//         setActive(uniqueId);
//       }}
//       useMargin={type !== BaseType.Object}
//       style={{ ...containerStyle, position: 'relative' }}
//       className='rdx-form-item'
//     >
//       {children}
//       {isCurrentActive && (
//         <div
//           style={{
//             pointerEvents: 'none',
//             position: 'absolute',
//             width: '100%',
//             height: '100%',
//             border: '1px solid #23a3ff',
//           }}
//         ></div>
//       )}
//       {dropLine && (
//         <div
//           style={{
//             pointerEvents: 'none',
//             position: 'absolute',
//             width: '100%',
//             height: 2,
//             background: '#23a3ff',
//             ...position,
//           }}
//         ></div>
//       )}
//     </EditDiv>
//   );
// }

// function usePrevious<T>(value: T) {
//   const ref = useRef<T[]>([]);
//   const lastValue = ref.current[ref.current.length - 1];
//   useEffect(() => {
//     console.log(ref.current, value);
//     if (lastValue !== value) {
//       ref.current.push(value);
//       ref.current.length > 3 && ref.current.shift();
//     }
//   });
//   return ref.current[ref.current.length - 1];
// }

// function useCurrent<T>(v: T) {
//   const ref = useRef(v);
//   useMemo(() => {
//     ref.current = v;
//   }, [v]);
//   return ref;
// }
// function DesignerMonitor() {
//   const active = useRdxValue(activeAtom);
//   const state = useRdxValue(
//     new RdxState({
//       id: active + '-active',
//     })
//   );
//   const set = useRdxSetter(
//     new RdxState({
//       id: active,
//     })
//   );
//   const recordState = useCurrent(state);
//   useEffect(() => {
//     return () => {
//       set(recordState.current);
//     };
//   }, []);
//   return (
//     <div>
//       <JsonView data={state}></JsonView>
//     </div>
//   );
// }
// function DesignerForBasic() {
//   const active = useRdxValue(activeAtom);
//   const setActiveState = useRdxSetter(
//     atom({
//       id: active + '-active',
//       defaultValue: new RdxState({
//         id: active,
//       }),
//     })
//   );
//   return (
//     <div key={active}>
//       <RdxFormContext
//         initializeState={useRdxValue(new RdxState({ id: active }))}
//         onChange={(state) => {
//           setActiveState(state);
//         }}
//       >
//         <RdxNextFormItem
//           title='title'
//           type='string'
//           name='title'
//         ></RdxNextFormItem>
//         <RdxNextFormItem
//           title='tips'
//           type='string'
//           name='tips'
//         ></RdxNextFormItem>
//         <RdxNextFormItem
//           title='desc'
//           type='string'
//           xComponent='select'
//           name='desc'
//         ></RdxNextFormItem>
//       </RdxFormContext>
//       <DesignerMonitor />
//     </div>
//   );
// }
// function Designer() {
//   const active = useRdxValue(activeAtom);
//   // const preActive = usePrevious(active)
//   if (!active) {
//     return <div>未选中节点</div>;
//   }

//   return (
//     <div>
//       <h2>基础属性</h2>
//       {active}
//       {<DesignerForBasic />}
//     </div>
//   );
// }
// function Canvse() {
//   const layout = useRdxValue(layoutSchema);
//   const setLayout = useRdxSetter(layoutSchema);
//   const setWidgets = useRdxSetter(widgetsSchema);
//   useEffect(() => {
//     const { layout, widgets } = parseSchema(testJson);
//     setLayout(new TreeSolver(layout));
//     setWidgets(widgets);
//   }, []);
//   return (
//     <RdxFormContext JsonView={JsonView} enabledStatePreview={true}>
//       <h2>画布</h2>
//       <div style={{ padding: 12 }}>
//         <RenderContext.Provider
//           value={{
//             ContentComponent,
//             TitleComponent,
//             WrapperComponent: WrapperComponentEdit,
//           }}
//         >
//           <TreeTravse
//             dataSource={layout.getLayout()}
//             TreeTravseRenderer={TreeTravseRenderer}
//           ></TreeTravse>
//         </RenderContext.Provider>
//       </div>
//     </RdxFormContext>
//   );
// }
// export function StatePreview() {
//   const state = useRdxGlboalState();
//   return (
//     <div>
//       <h2>Rdx状态</h2>
//       <JsonView data={state} />
//       <h2>Rdx to Schema </h2>
//       <JsonView
//         data={toSchema({
//           layout: state.layoutSchema && state.layoutSchema.getLayout(),
//           widgets: state,
//         })}
//       />
//     </div>
//   );
// }
// export function LayoutPreview() {
//   const layoutCore = useRdxValue(layoutSchema);
//   return (
//     <div>
//       <pre>{JSON.stringify(layoutCore.getLayout(), null, 2)}</pre>
//     </div>
//   );
// }
// export function Renderer() {
//   return (
//     <RdxContext>
//       <DndProvider backend={HTML5Backend}>
//         <div style={{ display: 'flex' }}>
//           <div style={{ flex: '0 0 250px' }}>
//             <WidgetList />
//           </div>
//           <div style={{ flex: 1 }}>
//             <Canvse />
//           </div>

//           <div style={{ flex: '0 0 350px', overflow: 'hidden' }}>
//             <Designer />
//           </div>
//         </div>
//       </DndProvider>
//       <StatePreview />
//     </RdxContext>
//   );
// }
