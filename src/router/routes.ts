import type { RouteRecordRaw } from 'vue-router'
import projectRoutes from './modules/projects'
import releaseWindowRoutes from './modules/release-window'
import branchRuleRoutes from './modules/branch-rules'
import versionPolicyRoutes from './modules/version-policies'
import versionOpsRoutes from './modules/version-ops'

export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/home/HomeView.vue'),
        meta: { title: 'Home', requiresAuth: true }
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/Dashboard.vue'),
        meta: { title: 'Dashboard', titleKey: 'menu.dashboard', requiresAuth: true, permission: 'dashboard:read' }
      },
      ...projectRoutes,
      ...releaseWindowRoutes,
      ...branchRuleRoutes,
      ...versionPolicyRoutes,
      ...versionOpsRoutes
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/LoginView.vue'),
    meta: { title: 'Login', titleKey: 'menu.login', hidden: true, public: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/system/NotFound.vue'),
    meta: { title: 'Not Found', hidden: true, public: true }
  }
]
