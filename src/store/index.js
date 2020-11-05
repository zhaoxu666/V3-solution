import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
// import app from './modules/app'
// import permission from './modules/permission'
// import settings from './modules/settings'
// import user from './modules/user'
// import errorLog from './modules/errorLog'

Vue.use(Vuex)

// 解决store模块越来越多，每个都要手动去引入模块
// modulesFiles 是一个方法，方法里有三个属性 keys 方法 返回匹配成功模块的名字组成的数组
const modulesFiles = require.context('./modules', true, /\.js$/)

const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1') // app.js => app
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

const store = new Vuex.Store({
  modules,
  getters
})

// const store = new Vuex.Store({
//   modules: {
//     app,
//     permission,
//     settings,
//     user,
//     errorLog
//   },
//   getters
// })

export default store
