export const reactPlugin = {
  name: 'react',
  setup(build) {
    build.onResolve({filter: /^(react|react-dom|mobx|mobx-react|@alife\/hippo)$/}, args => {
      return {
        path: args.path,
        namespace: 'react-ns'
      }
    })
    build.onLoad({filter: /^react$/, namespace: 'react-ns'}, () => {
      return {
        contents: 'module.exports = React'
      }
    })
    build.onLoad({filter: /^react-dom$/, namespace: 'react-ns'}, () => {
      return {
        contents: 'module.exports = ReactDOM'
      }
    })
    build.onLoad({filter: /^mobx$/, namespace: 'react-ns'}, () => {
      return {
        contents: 'module.exports = mobx'
      }
    })
    build.onLoad({filter: /^mobx-react$/, namespace: 'react-ns'}, () => {
      return {
        contents: 'module.exports = mobxReact'
      }
    })
    build.onLoad({filter: /^\@alife\/hippo$/, namespace: 'react-ns'}, () => {
      return {
        contents: 'module.exports = Hippo'
      }
    })
  }
}