import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false // 生产环境下关闭提示

const app = new Vue(App)
app.$mount()
