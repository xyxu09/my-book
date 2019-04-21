import Vue from 'vue'
import VueRouter from 'vue-router'
import createRoute from './route.js'

const router = new VueRouter({
  router: createRoute(),
  // 滚动行为
  scrollBehavior (to, from, savedPosition) {
    return {x: 0, y: 0}
  }
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 鉴权 权限判断
  next()
})

// 加载模块失败 重新刷新页面
router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g
  const isChunkLoadFailed = error.message.match(pattern)
  if (isChunkLoadFailed) {
    router.go(0)
  }
})

// 全局后置钩子
router.afterEach((to, form) => {
  // console.log('全局后置钩子')
})

Vue.use(VueRouter)
export default router

/*
完整的导航解析流程
  1.导航被触发
  2.在失活的组建里调用离开守卫
  3.全局的beforeEach守卫
  4.在重用的组建调用beforeRouteUpdate
  5.在路由配置中调用beforeEnter
  6.解析异步路由组件
  7.在被激活的组件调用beforeRouterEnter
  8.全局的beforeResolve
  9.导航被确认
  10.调用全局的afterEach
  11.触发Dom更新
  12.用创建好的vm调用beofereRouterEnter传给next的回调
*/
