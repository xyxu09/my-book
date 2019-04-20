import Vue from 'vue'
import Books from './Books.vue'

const app = new Vue(Books)
app.$mount()

// 该写法已经不能实现 需要在同级目录下新建一个main.json文件配置
// export default {
//   config: {
//     'enablePullDownRefresh': true,
//     backgroundTextStyle: 'dark'
//   }
// }
