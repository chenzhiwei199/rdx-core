// import React from 'react';
// import {
//   atom,
//   RdxContext,
//   useRdxState,
//   useRdxValueByDependencies,
// } from '@alife/rdx';
// import { NumberPicker } from '@alife/hippo';

// export default {
//   title: '简单例子/hooks用法',
//   parameters: {
//     info: { inline: true },
//   },
// };
// const TotalView = () => {
//   const [unit = 0, amount = 0] = useRdxValueByDependencies<[number, number]>({
//     deps: ['单价222', '数量222'],
//   });

//   return <span>{unit * amount}</span>;
// };
// const BaseView = ({ id }) => {
//   const [state, setState] = useRdxState(atom({
//     id: id,
//     defaultValue: 0,
//   }));
//   return (
//     <NumberPicker
//       value={state}
//       onChange={(v) => {
//         setState(v);
//       }}
//     />
//   );
// };

// export const 总价计算 = () => {
//   return (
//     <RdxContext>
//       <strong style={{ fontSize: 16 }}>
//         展示了rdx框架的基本用法，申明式的指定当前模块的id，和依赖模块的id，并且可以从view
//         和 reaction函数中获取到依赖的数据
//       </strong>
//       <br />
//       <strong>单价:</strong>
//       <BaseView id={'单价222'} />
//       <strong>数量:</strong>
//       <BaseView id={'数量222'} />
//       <strong>总价:</strong>
//       <TotalView />
//     </RdxContext>
//   );
// };
