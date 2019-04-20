import Vue from 'vue'
import App from './App'
import {request} from './utils/request.js'
// import { Toast, Progress, Rate } from 'vant'
// 挂载在原型上 可以使用this.$request来调用
Vue.prototype.$request = request
// Vue.prototype.Toast = Toast
// Vue.use(Toast)
// Vue.use(Progress)
// Vue.use(Rate)

Vue.config.productionTip = false // 生产环境下关闭提示

const app = new Vue(App)
app.$mount()
