import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'projects',
    name: 'Projects',
    component: () => import('@/views/project/ProjectTree.vue'),
    meta: { title: 'Projects', titleKey: 'menu.projects', requiresAuth: true, permission: 'project:read', hidden: true, order: 110 }
  }
]

export default routes
