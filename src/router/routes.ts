import type { RouteRecordRaw } from 'vue-router'

// 布局组件
const DefaultLayout = () => import('@/layouts/DefaultLayout.vue')
const BlankLayout = () => import('@/layouts/BlankLayout.vue')

// 静态路由（无需权限）
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: BlankLayout,
    children: [
      {
        path: '',
        name: 'Login',
        component: () => import('@/views/login/index.vue'),
        meta: { title: '登录', hidden: true },
      },
    ],
  },
  {
    path: '/404',
    component: () => import('@/views/error/404.vue'),
    meta: { title: '404', hidden: true },
  },
]

// 动态路由（需要权限）
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    component: DefaultLayout,
    redirect: '/dashboard/index',
    meta: { title: '仪表盘', icon: 'Odometer' },
    children: [
      {
        path: 'index',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '仪表盘', icon: 'Odometer' },
      },
    ],
  },
  {
    path: '/system',
    component: DefaultLayout,
    redirect: '/system/user',
    meta: { title: '系统管理', icon: 'Setting' },
    children: [
      {
        path: 'user',
        name: 'UserManage',
        component: () => import('@/views/system/user/index.vue'),
        meta: { title: '用户管理', icon: 'User' },
      },
      {
        path: 'role',
        name: 'RoleManage',
        component: () => import('@/views/system/role/index.vue'),
        meta: { title: '角色管理', icon: 'UserFilled' },
      },
    ],
  },
  // 三级菜单示例
  {
    path: '/multi-level',
    component: DefaultLayout,
    redirect: '/multi-level/level1/level2-1',
    meta: { title: '多级菜单', icon: 'Menu' },
    children: [
      {
        path: 'level1',
        meta: { title: '一级菜单', icon: 'Folder' },
        children: [
          {
            path: 'level2-1',
            name: 'Level2_1',
            component: () => import('@/views/multi-level/level2-1.vue'),
            meta: { title: '二级菜单-1', icon: 'Document' },
          },
          {
            path: 'level2-2',
            meta: { title: '二级菜单-2', icon: 'Folder' },
            children: [
              {
                path: 'level3-1',
                name: 'Level3_1',
                component: () => import('@/views/multi-level/level3-1.vue'),
                meta: { title: '三级菜单-1', icon: 'Document' },
              },
              {
                path: 'level3-2',
                name: 'Level3_2',
                component: () => import('@/views/multi-level/level3-2.vue'),
                meta: { title: '三级菜单-2', icon: 'Document' },
              },
            ],
          },
        ],
      },
      {
        path: 'level1-2',
        meta: { title: '一级菜单-2', icon: 'Folder' },
        children: [
          {
            path: 'level2-3',
            name: 'Level2_3',
            component: () => import('@/views/multi-level/level2-3.vue'),
            meta: { title: '二级菜单-3', icon: 'Document' },
          },
        ],
      },
    ],
  },
  // 404 兜底
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    meta: { hidden: true },
  },
]

// 所有路由
export const routes: RouteRecordRaw[] = [...constantRoutes, ...asyncRoutes]
