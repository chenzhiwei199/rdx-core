import * as esbuild from 'esbuild-wasm';

import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';
import { reactPlugin } from './plugins/reactPlugin';


const bundle = async (rawCode: string, versionMap = {
  '@alife/shuhe-widget-test': '0.0.1',
  'react': '16.14.0',
}) => {
  if(!(window as any).initializePromise) {
    (window as any).initializePromise = esbuild.initialize({
      worker: true,
      wasmURL: '//gw.alipayobjects.com/os/lib/esbuild-wasm/0.10.0/esbuild.wasm'
    })
  }
  return (window as any).initializePromise.then(async () => {
    
    try {
      const result = await esbuild.build({
        entryPoints: ['index.js'],
        bundle: true,
        write: false,
        format: 'esm',
        minify: false,
        treeShaking: 'ignore-annotations',
        plugins: [reactPlugin, unpkgPathPlugin(versionMap), fetchPlugin(rawCode)],
        define: {
          'process.env.NODE_ENV': '"development"',
          global: 'window'
        },
      });
      return {
        code: result.outputFiles[0].text,
        err: '',
      };
    } catch (err) {
      return {
        code: '',
        err: err.message,
      };
    }
  });

  

};

export default bundle;