import * as esbuild from 'esbuild-wasm';
import localForage from 'localforage';
import axios from 'axios';

const fileCache = localForage.createInstance({
  name: 'filecache',
});

export const fetchPlugin = (inputCode: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      // load index.js file
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        console.log('inputCode: ', inputCode);
        return {
          loader: 'jsx',
          contents: inputCode,
        };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log('fetch-plugin onLoad', args);
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );

        if (cachedResult) {
          return cachedResult;
        }
      });

      // load css files
      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        console.log('fetch-plugin css onLoad', args);
        const { data, request } = await axios.get(args.path);

        const escaped = data
          .replace(/\n/g, '')
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");

        const contents = `
            const style = document.createElement('style');
            style.innerText = '${escaped}';
            document.head.appendChild(style);
          `;

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        await fileCache.setItem(args.path, result);

        return result;
      });

      // load javascript / jsx files
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log('fetch-plugin onLoad js', args);
        if (!args.path || (args.pluginData &&args.pluginData.valid === false)) {
          const result: esbuild.OnLoadResult = {
            loader: 'jsx',
            contents: ``,
            // pack: packData
          } as any;
          return result;
        } else {
          try {
            const { data, request } = await axios.get(args.path);
            // const { data: packData } = await axios.get(`${args.path}/package.json`);
            // console.log('packData: ', packData);
            const result: esbuild.OnLoadResult = {
              loader: 'jsx',
              contents: data,
              resolveDir: new URL('./', request.responseURL).pathname,
              // pack: packData
            } as any;
            console.log('fetch-plugin onLoad js', args, result);
            await fileCache.setItem(args.path, result);

            return result;
          } catch (error) {
            console.warn(error);
            const result: esbuild.OnLoadResult = {
              loader: 'jsx',
              contents: ``,
              // pack: packData
            } as any;
            return result;
          }
        }
      });
    },
  };
};
