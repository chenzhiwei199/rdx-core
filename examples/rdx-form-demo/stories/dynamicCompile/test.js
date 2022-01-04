import Widget from '@alife/shuhe-widget-test';
// import styled from 'styled-components';
import { Button } from '@alife/hippo';
import { RdxContext } from '@alife/rdx';
import { produce} from 'immer';
// import { Line } from '@antv/g2plot';
import { useEffect, useRef, useState } from 'react';
// const Card = styled.div`
//   padding: 12px;
//   background: black;
// `;
function ImmerTest() {
  const [data, setData] = useState({a : 1})
  return <div onClick={() => {
    setData(produce(data, (data) => {
      data.a =  data.a  +1
    }))
  }}>ImmerTest---{JSON.stringify(data)}</div>
}
// function G2ChartTest() {
//   const divRef = useRef()
//   useEffect(() => {
//     fetch(
//       'https://gw.alipayobjects.com/os/bmw-prod/1d565782-dde4-4bb6-8946-ea6a38ccf184.json'
//     )
//       .then((res) => res.json())
//       .then((data) => {
//         const line = new Line(divRef.current, {
//           data,
//           padding: 'auto',
//           xField: 'Date',
//           yField: 'scales',
//           xAxis: {
//             // type: 'timeCat',
//             tickCount: 5,
//           },
//         });

//         line.render();
//       });
//   }, []);
//   return <div ref={divRef}style={{ width: 300, height: 300}} ></div>
// }
export default () => {
  return (
    <div>
      <RdxContext>
        <Widget /> <Button>我是Hipp0按钮</Button>
        {/* <G2ChartTest /> */}
        <ImmerTest />
      </RdxContext>
    </div>
  );
};
