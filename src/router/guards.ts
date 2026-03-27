import type { Router } from 'vue-router'
import { useUserStore } from '@/stores/user'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 白名单路由
const whiteList = ['/login', '/404']

export function setupRouterGuards(router: Router) {
  router.beforeEach((to, _from, next) => {
    NProgress.start()

    const userStore = useUserStore()
    const hasToken = userStore.token

    // 设置页面标题
    document.title = `${to.meta.title || '管理后台'} - Admin`

    if (hasToken) {
      if (to.path === '/login') {
        // 已登录，跳转到首页
        next({ path: '/' })
        NProgress.done()
      } else {
        next()
      }
    } else {
      // 未登录
      if (whiteList.includes(to.path)) {
        // 白名单路由，直接进入
        next()
      } else {
        // 跳转登录页
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  })

  router.afterEach(() => {
    NProgress.done()
  })
}
