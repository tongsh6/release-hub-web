import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'branch-rules',
    name: 'BranchRules',
    component: () => import('@/views/branch-rule/BranchRuleList.vue'),
    meta: { title: 'Branch Rules', titleKey: 'menu.branchRules', requiresAuth: true, permission: 'branch-rule:read' }
  }
]

export default routes
