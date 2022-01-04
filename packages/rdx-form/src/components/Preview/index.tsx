import React, { useState } from 'react';
import { useGlobalVirtualStateUpdate, useRdxGlboalState } from '../../hooks';
import { computeState2FormState } from '../Forms/utils';
const DefaultJsonView = ({ data }) => {
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};
export default (props: { JsonView?: React.FC<{ data: any }> }) => {
  const [visible, setVisible] = useState(false);
  const { JsonView = DefaultJsonView } = props;
  const data = useRdxGlboalState();
  const virtualData = useGlobalVirtualStateUpdate()
  const newValue = computeState2FormState(data, virtualData)
  return (
    <div style={{ position: 'relative'}}>
      <div
        onClick={() => {
          setVisible(!visible);
        }}
        style={{
          background: 'blue',
          // position: 'fixed',
          // zIndex: 100,
          right: 30,
          display: 'flex',
          alignItems: 'center',
          color: 'white',
          justifyContent: 'center',
          // top: 50,
          borderRadius: '5%',
          width: 100,
          height: 32,
        }}
      >
        查看数据
      </div>
      { (
        <div
          style={{
            position: 'absolute',
            background: 'white',
            opacity: visible ? 1 :0,
            maxWidth: visible ? 400 : 0,
            maxHeight: visible ? 400 : 0,
            overflow: 'auto',
            zIndex: 100,
            boxShadow: '0 0 8px 0 rgba(153, 163, 179, 0.28)',
            borderRadius: 4,
            width: 400,
            height: 400,
            transition: 'all 0.5s',
            padding: 24,
          }}
        >
          <h3>表单输入数据</h3>
          <div style={{ overflow: 'auto' }}>
            <strong>状态数据</strong>
            <JsonView data={data} />
            <strong>衍生状态数据</strong>
            <JsonView data={newValue} />
          </div>
        </div>
      )}
    </div>
  );
};


export function Json2Ts() {
  // JsonToTS()
}
