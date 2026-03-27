import { createRouter, createWebHistory } from 'vue-router'
import { setupRouterGuards } from './guards'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 设置路由守卫
setupRouterGuards(router)

export default router
