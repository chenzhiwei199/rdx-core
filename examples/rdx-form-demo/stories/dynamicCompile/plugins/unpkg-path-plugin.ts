import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localForage from 'localforage';
const pkgCache = localForage.createInstance({
  name: 'pkgCache',
});


export const unpkgPathPlugin = (versionMap: Record<string, string>) => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {

      // handle root entry file of 'index.js'
      build.onResolve({ filter: /(^index\.js$)/ }, () => {
        console.log('unpkg-path-plugin  root entry ');
        return { path: 'index.js', namespace: 'a' };
      });

      // handle relative paths in a module
      build.onResolve({ filter: /^\.+\// }, (args: any) => {
        return {
          namespace: 'a',
          path: new URL(args.path , 'https://unpkg.alibaba-inc.com' + args.resolveDir + '/').href,
        };
      });

      // handle main file of a module
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        let path = args.path
        // https://unpkg.alibaba-inc.com/@alife/shuhe-widget-test@0.0.1
        // 处理外部组件
        const nameAndVersion = args.resolveDir.split('/').filter(item => item.includes('@'))
        if(versionMap[path]) {
          path = `${path}@${versionMap[args.path]}`;
        } else if(nameAndVersion.length > 0 ) {
          let url = `https://unpkg.alibaba-inc.com/${  nameAndVersion.join('/')}/package.json`
          // 防止package.json重复请求w    
          const cache = await pkgCache.getItem<any>(url)
          if(cache ) {
            if(cache.canFindPack) {
              path = `${path}@${cache.dependencies[args.path]}`
            } else {
              return {
                namespace: 'a',
                path: `https://unpkg.alibaba-inc.com/${path }`,
                pluginData: {
                  valid: false
                }
              }
            }
            
          } else {
            const { data: packData } = await axios.get(url);
            const canFindPack = packData && packData.dependencies && packData.dependencies[args.path];
            if(canFindPack) {
              path = `${path}@${packData.dependencies[args.path]}`
            } 
            pkgCache.setItem(url, {
              dependencies: packData.dependencies,
              canFindPack
            })
            if(!canFindPack) {
              return {
                namespace: 'a',
                path: `https://unpkg.alibaba-inc.com/${path }`,
                pluginData: {
                  valid: false
                }
              };
            }
            
          }
          
          
        }
        
        console.log('unpkgPathPlugin main file  path', path);
        return {
          namespace: 'a',
          path: `https://unpkg.alibaba-inc.com/${path }`,
          pluginData: {
            valid: true
          }
        };
      });
 
    },
  };
};