// import React from 'react';
// import Inspector from 'react-inspector';
// import { Loading } from '@alife/hippo';
// import { isBroswer } from '../../utils';

// export default function JsonView(props: { value: string; loading?: boolean }) {
//   const { value = '{}', loading } = props;
//   const reactJsonStyle = {
//     marginTop: 12,
//     borderRadius: 5,
//     padding: '6px',
//     height: 200,
//     overflow: 'auto',
//   };
//   return (
//     <Loading style={{ width: '100%' }} visible={loading === true}>
//       {isBroswer() ? (
//         <Inspector
//           // style={reactJsonStyle}
//           // theme='monokai'
//           data={JSON.parse(value)}
//         />
//       ) : (
//         <pre>{JSON.stringify(JSON.parse(value), null, 2)}</pre>
//       )}
//     </Loading>
//   );
// }
