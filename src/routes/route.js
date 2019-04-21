// imoort xxx from 'xxx.js'
// 三个参数: 要搜索的文件夹目录 是否搜索子目录 正则匹配
const moudulesContext = require.concontext('./modules', true, /Route\.js$/)

const chunks = moudulesContext.keys()
  .reduce((modules, key) => {
    modules[key.replace(/(^\.\/)|(\.js$)/g, '')] = moudulesContext(key).default
    return modules
  })
const moudleNames = Object.keys(chunks)

export default () => moudleNames.reduce((routes, moduleName) => {
  routes = routes.concat(chunks[moduleName])
  return routes
}, [])
