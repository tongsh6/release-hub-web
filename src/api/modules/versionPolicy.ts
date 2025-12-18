import http from '@/api/http'

export const getVersionPolicies = (params?: any) => {
  return http.get('/version-policies', { params })
}
