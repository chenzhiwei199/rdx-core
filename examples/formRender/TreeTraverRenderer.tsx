// import React, { memo, useMemo } from 'react';
// import {
//   atom,
//   compute,
//   isLoading,
//   RdxState,
//   useRdxState,
//   useRdxValue,
// } from '@alife/rdx';
// import { FormItem } from '@alife/rdx-form';
// import { ILayout, useActiveStrict, widgetsSchema } from './model';
// import { ITreeTravseRenderer } from './TreeTravser';
// import { NodeContext } from './context/NodeContext';
// export const TreeTravseRenderer = memo(
//   (props: ITreeTravseRenderer<ILayout>) => {
//     const { node, children, path } = props;
//     const { uniqueId, parentUniqueId } = node;
//     const widgets = useRdxValue(widgetsSchema);
//     const active = useActiveStrict(uniqueId)
//     const formSettingAtom = useMemo(() => {
//       return active !== uniqueId  ?  atom({
//         id: uniqueId,
//         defaultValue: widgets[uniqueId],
//       }) : atom({
//         id: uniqueId + '-active',
//         defaultValue: new RdxState({ id: uniqueId})
//       });
//     }, [widgets, active]);
//     const [state, setState] = useRdxState(formSettingAtom);
//     const { componentType, componentProps, type, name, title } = state;
//     return (
//       <NodeContext.Provider
//         value={useMemo(() => {
//           return { path, stateAtom: formSettingAtom, uniqueId, parentUniqueId };
//         }, [node, widgets])}
//       >
//         <FormItem
//           componentProps={componentProps}
//           componentType={componentType}
//           type={type as any}
//           name={name}
//           title={title}
//         >
//           {children}
//         </FormItem>
//       </NodeContext.Provider>
//     );
//   },
//   (preProps, nextProps) => {
//     // 布局大小改变，不应该在这里校验
//     const checkAttribute = ['node', 'active'];

//     const isEqual = checkAttribute.every((key) => {
//       const isEqual =
//         nextProps[key] === undefined && preProps[key] === undefined
//           ? true
//           : preProps[key] === nextProps[key];
//       return isEqual;
//     });
//     const isPathEuqal =
//       (nextProps.path || []).join(',') === (preProps.path || []).join(',');
//     // console.log('isPathEuqal: ' + nextProps.path, isPathEuqal, isEqual, nextProps, preProps);
//     return isPathEuqal && isEqual;
//   }
// );
