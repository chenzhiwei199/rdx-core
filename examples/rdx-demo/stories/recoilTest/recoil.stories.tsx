// import React, { Suspense } from 'react';
// import {
//   selector as compute,
//   atom,
//   waitForAll,
//   RecoilRoot as RdxContext,
//   useRecoilValue as useRdxValue,
//   useRecoilState as useRdxState,
// } from 'recoil';

// const unit = atom({
//   key: 'unit',
//   default: 10,
// });
// const amount = atom({
//   key: 'amount',
//   default: 20,
// });
// const total = compute({
//   key: 'total',
//   get: ({ get }) => {
//     const total = get(unit) * get(amount);
//     return total;
//   },
//   set: ({ get, set }, newValue) => {
//     set(amount, newValue / get(amount));
//   },
// });
// const c = waitForAll([unit, amount])
// import axios from 'axios';
// import { Menu, Grid } from '@alife/hippo';
// const { Row, Col } = Grid;
// export default {
//   title: '简单例子/recoil',
//   parameters: {
//     info: { inline: true },
//   },
// };

// const province = atom({
//   key: 'province',
//   default: '',
// });

// const city = atom({
//   key: 'city',
//   default: '',
// });
// const administrativeData = compute<AdministrativeSource[]>({
//   key: 'administrativeData',
//   get: async () => {
//     const res = await axios.get(
//       'https://os.alipayobjects.com/rmsportal/ODDwqcDFTLAguOvWEolX.json'
//     );
//     return res.data;
//   },
// });
// const cityDataSource = compute({
//   key: 'cityDataSource',
//   get: ({ get }) => {
//     console.log('cityDataSource: ', get(administrativeData));
//     const findItem = get(administrativeData).find(
//       (item) => item.value === get(province)
//     );
//     if (findItem) {
//       return findItem.children || [];
//     } else {
//       return [];
//     }
//   },
// });
// const area = atom({
//   key: 'area',
//   default: '',
// });

// const areaDataSource = compute({
//   key: 'areaDataSource',
//   get: ({ get }) => {
//     // 过滤第一层
//     let findItem = (get(administrativeData) || []).find(
//       (item) => item.value === get(province)
//     );
//     console.log('findItem: ', findItem);
//     findItem = (findItem ? findItem.children || [] : []).find(
//       (item) => item.value === get(city)
//     );
//     if (findItem) {
//       return findItem.children || [];
//     } else {
//       return [];
//     }
//   },
// });

// const View = (props: {
//   atom: RdxState<string>;
//   compute: RdxState<AdministrativeSource[]>;
// }) => {
//   const { atom, compute } = props;
//   const [value, setValue] = useRdxState(atom);
//   const dataSource = useRdxValue(compute);
//   console.log('xxxxxdataSource: ', atom, dataSource);
//   return (
//     <Menu
//       onItemClick={(key) => {
//         setValue(key);
//       }}
//       selectMode={'single'}
//       selectedKeys={value}
//       style={{ width: 100 }}
//     >
//       {dataSource.map((item) => (
//         <Menu.Item key={item.value}>{item.label}</Menu.Item>
//       ))}
//     </Menu>
//   );
// };

// export const 联动Hooks例子 = () => {
//   return (
//     <RdxContext >
//       <Suspense fallback={<div>...</div>}>
//         <Row>
//           <Col>
//             <View atom={province} compute={administrativeData} />
//           </Col>
//           <Col>
//             <View atom={city} compute={cityDataSource} />
//           </Col>
//           <Col>
//             <View atom={area} compute={areaDataSource} />
//           </Col>
//         </Row>
//       </Suspense>
//     </RdxContext>
//   );
// };
// interface AdministrativeSource {
//   children: AdministrativeSource[];
//   value: string;
//   label: string;
// }
