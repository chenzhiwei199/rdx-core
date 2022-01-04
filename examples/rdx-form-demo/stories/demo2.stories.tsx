import { Button } from '@alife/hippo';
import React, { useContext } from 'react';
import { atom, RecoilRoot, useRecoilState } from 'recoil';
import { unstable_batchedUpdates } from 'react-dom';
export default {
  title: 'demo2',
  parameters: {
    info: { inline: true },
  },
};

const Ctx = React.createContext({});
const a = atom({
  key: '1',
  default: 1,
});
const AC = () => {
  console.log('render AC');
  return (
    <div>
      AC
      <Ctx.Provider value={null}>
        <ACChildren />
      </Ctx.Provider>
    </div>
  );
};
const BC = () => {
  console.log('render BC');
  return <div>BC</div>;
};
const ACChildren = () => {
  console.log('render ACChildren');
  const v = useContext(Ctx)
  console.log('v: ', v);
return <div> ACChildren<ACCChildren /></div>;
};
const ACCChildren = () => {
  console.log('render ACCChildren');
  return <div>ACCChildren<ACCCChildren /></div>;
};
const ACCCChildren = () => {
  console.log('render ACCCChildren');
  return <div>ACCCChildren</div>;
};
const B = () => {
  const [state, setState] = useRecoilState(a);
  return (
    <Button
      onClick={() => {
        setState((state) => state + 1);
        setState((state) => state + 1);
        setState((state) => state + 1);
      }}
    >
      22 ---- {state}
    </Button>
  );
};

export function testDoubleClick() {
  return (
    <RecoilRoot>
      <B />
      <AC />
      <BC />
    </RecoilRoot>
  );
}
