import { post } from './http'

export interface LoginPayload {
  username: string
  password: string
  rememberMe?: boolean
}

export interface LoginResult {
  token: string
}

export const authApi = {
  // 登录
  login: (data: LoginPayload) => post<LoginResult>('/v1/auth/login', data)
}
