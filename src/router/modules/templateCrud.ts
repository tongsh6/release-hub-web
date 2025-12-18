import type { RouteRecordRaw } from 'vue-router'

const templateCrudRoutes: RouteRecordRaw[] = [
  {
    path: 'templates/crud/project',
    name: 'TemplateProjectList',
    component: () => import('@/views/_templates/crud/project/ProjectList.vue'),
    meta: { title: 'Template: Project List', requiresAuth: true }
  },
  {
    path: 'templates/crud/project/detail/:id?',
    name: 'TemplateProjectDetail',
    component: () => import('@/views/_templates/crud/project/ProjectDetail.vue'),
    meta: { title: 'Template: Project Detail', requiresAuth: true, hidden: true }
  }
]

export default templateCrudRoutes
