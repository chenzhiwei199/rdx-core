import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as esbuild from 'esbuild-wasm';
import { useEffect } from 'react';
import bundle from './bundle';
import * as Hippo from '@alife/hippo';
import Editor from '@monaco-editor/react';
import _ from 'lodash';
import source from '!!raw-loader!./test.js';
import { ErrorBoundary } from './ErrorBoundary';

(window as any).React = React;
(window as any).Hippo = Hippo;
(window as any).ReactDOM = ReactDOM;
export default {
  title: 'ESbuild/test',
  parameters: {
    info: { inline: true },
  },
};

console.log('React.version: outer ', React.version);
// 'react-dnd': 'ReactDnD',
//           '@antv/g2plot': 'G2Plot',
//           'styled-components': 'styled',
//           echarts: 'echarts',
//           immer: 'immer',
//           'react-dnd-html5-backend': 'ReactDnDHTML5Backend',
// let code = `
// import Widget from '@alife/shuhe-widget-test';
// import styled from 'styled-components';
// import {Button} from '@alife/hippo';
// import * as Rdx from '@alife/rdx';
// const Card = styled.div\`
// padding: 12px;
// background: black;
// \`
// export default () => {
//   return <Card>
//     <Rdx.RdxContext> <Widget /> <Button>我是Hipp0按钮</Button></Rdx.RdxContext>
//   </Card>
// };
// `;
export function Test() {
  const [Cmp, setCmp] = React.useState(null);
  const [code, setCode] = React.useState(source);
  useEffect(() => {
    const text = bundle(code);
    text.then(async ({ code }) => {
      const encodedJs = encodeURIComponent(code);
      const dataUri = 'data:text/javascript;charset=utf-8,' + encodedJs;
      const a = await import(/* webpackIgnore: true */ dataUri);
      console.log('a: ', a.default);
      setCmp(a);
      // console.log('code: ', code);
      // const fn = new Function(`
      // `)
      // const a = eval(code)
      // console.log('a: ', a);
    });
  }, [code]);
  return (
    <div id='root' style={{ display: 'flex' }}>
      <Editor
        width={500}
        height={'100vh'}
        defaultLanguage={'typescript'}
        defaultValue={code}
        onChange={_.debounce((code) => {
          setCode(code);
        }, 1000)}
      ></Editor>
      <ErrorBoundary>{Cmp && Cmp.default && <Cmp.default />}</ErrorBoundary>
    </div>
  );
}
