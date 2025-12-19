import { get } from './http'
import { mockUserApi } from './mock/auth'

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

const useMock = import.meta.env.VITE_USE_MOCK === 'true'

export const userApi = {
  // 获取当前用户信息
  me: () => {
    if (useMock) {
      return mockUserApi.me()
    }
    return get<UserMeResult>('/v1/me')
  }
}
