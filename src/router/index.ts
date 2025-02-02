import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Index',
    component: () => import('~/pages/index.vue'),
  },
  {
    path: '/hi/:name',
    name: 'Hi',
    component: () => import('~/pages/hi/[name].vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/adminLogin',
    name: 'AdminLogin',
    component: () => import('~/pages/adminLogin.vue'),
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('~/pages/admin.vue'),
    meta: { requiresAdmin: true },
  },
  {
    path: '/package',
    name: 'Package',
    component: () => import('~/pages/package.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('~/pages/dashboard.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('~/pages/about.vue'),
    meta: { requiresAuth: false },
  },
  // ... 其他路由
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const isAdminRoute = to.matched.some(record => record.meta.requiresAdmin)
  const isUserRoute = to.matched.some(record => record.meta.requiresAuth)
  const phone = localStorage.getItem('phone')

  // 检查是否需要管理员权限
  if (isAdminRoute) {
    const token = localStorage.getItem('token')
    if (!token) {
      next('/adminLogin')
      return
    }
  }

  // 检查是否需要普通登录权限
  if (isUserRoute) {
    if (!phone) {
      next('/')
      return
    }
  }

  next()
})

export default router
