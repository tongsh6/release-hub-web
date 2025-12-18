import { get } from './http'

export interface UserProfile {
  id: string
  username: string
  displayName: string
}

export interface UserMeResult {
  id: string
  username: string
  displayName: string
  permissions: string[]
}

export const userApi = {
  // 获取当前用户信息
  me: () => get<UserMeResult>('/v1/me')
}
