import { createRouter, createWebHistory } from 'vue-router'
import { constantRoutes } from './routes'
import releaseWindowRoutes from './modules/release-window'
import projectRoutes from './modules/projects'
import branchRuleRoutes from './modules/branch-rules'
import versionPolicyRoutes from './modules/version-policies'
import versionOpsRoutes from './modules/version-ops'
import templateCrudRoutes from './modules/templateCrud'
import { registerGuards } from './guard'

// Combine module routes
const moduleRoutes = [
  ...releaseWindowRoutes,
  ...projectRoutes,
  ...branchRuleRoutes,
  ...versionPolicyRoutes,
  ...versionOpsRoutes,
  ...templateCrudRoutes
]

// Add module routes as children of MainLayout (which is at index 0 of constantRoutes)
// Note: We need to be careful not to mutate constantRoutes if it's used elsewhere,
// but for now we'll append to the children of the first route.
const mainLayoutRoute = constantRoutes.find(route => route.path === '/')
if (mainLayoutRoute && mainLayoutRoute.children) {
  mainLayoutRoute.children.push(...moduleRoutes)
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes
})

// Register global guards
registerGuards(router)

export default router
