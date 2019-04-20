// 根据context 动态引入依赖
// see: https://doc.webpack-china.org/guides/dependency-management/#require-context

const modulesContext = require.context('./modules', false, /\.js$/)

const chunks = modulesContext.keys().reduce((modules, key) => {
  modules[key.replace(/(^\.\/)|(\.js$)/g, '')] = modulesContext(key).default
  return modules
}, {})

const moduleNames = Object.keys(chunks)

export default (handleRequest, API) => moduleNames.reduce((modules, moduleName) => {
  modules[moduleName] = chunks[moduleName](handleRequest, API)
  return modules
}, {})
