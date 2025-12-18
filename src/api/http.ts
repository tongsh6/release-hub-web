// src/api/http.ts
import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import type { ApiResponse } from '@/types/dto'

const TOKEN_KEY = 'RH_TOKEN'

export class ApiError extends Error {
  public readonly code: string
  public readonly traceId?: string
  public readonly httpStatus?: number
  public readonly details?: unknown

  constructor(args: { code: string; message: string; traceId?: string; httpStatus?: number; details?: unknown }) {
    super(args.message)
    this.name = 'ApiError'
    this.code = args.code
    this.traceId = args.traceId
    this.httpStatus = args.httpStatus
    this.details = args.details
  }
}

function isApiResponse<T = unknown>(v: unknown): v is ApiResponse<T> {
  if (!v || typeof v !== 'object') return false
  const obj = v as any
  return typeof obj.code === 'string' && typeof obj.message === 'string' && 'data' in obj
}

function getBaseURL(): string {
  const env = import.meta.env as any
  return (env?.VITE_API_BASE_URL as string) || 'http://localhost:8080'
}

export const http: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 20_000,
  headers: { 'Content-Type': 'application/json' }
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers = config.headers ?? {}
    ;(config.headers as any).Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (resp: AxiosResponse) => {
    const body = resp.data
    if (isApiResponse(body) && body.code !== '0') {
      throw new ApiError({
        code: body.code,
        message: body.message || '业务异常',
        traceId: body.traceId,
        httpStatus: resp.status,
        details: body.data
      })
    }
    return resp
  },
  async (err: AxiosError) => {
    const status = err.response?.status
    const data = err.response?.data

    // 遇到 401 → userStore.logout() → router.replace
    if (status === 401) {
      // 如果是登录接口本身的 401，不进行全局跳转，交给业务层处理
      if (err.config?.url?.includes('/auth/login')) {
        return Promise.reject(
          new ApiError({
            code: 'AUTH_FAILED',
            message: 'Incorrect username or password',
            httpStatus: status,
            details: data
          })
        )
      }

      // 动态导入避免循环依赖
      const { useUserStore } = await import('@/stores/user')
      const userStore = useUserStore()
      userStore.logout()
      
      const { default: router } = await import('@/router')
      const currentPath = router.currentRoute.value.fullPath
      // 避免在登录页重复跳转
      if (!currentPath.includes('/login')) {
        router.replace({ path: '/login', query: { redirect: currentPath } })
      }
    }

    if (isApiResponse(data)) {
      return Promise.reject(
        new ApiError({
          code: data.code || 'HTTP_ERROR',
          message: data.message || '请求失败',
          traceId: data.traceId,
          httpStatus: status,
          details: data.data
        })
      )
    }

    return Promise.reject(
      new ApiError({
        code: 'NETWORK_ERROR',
        message: err.message || '网络异常',
        httpStatus: status,
        details: data
      })
    )
  }
)

export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  const resp = await http.request(config)
  const body = resp.data
  if (isApiResponse<T>(body)) return body.data
  return body as T
}

export function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return request<T>({ ...(config || {}), url, method: 'GET' })
}
export function post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  return request<T>({ ...(config || {}), url, method: 'POST', data })
}

export function put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  return request<T>({ ...(config || {}), url, method: 'PUT', data })
}

export function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return request<T>({ ...(config || {}), url, method: 'DELETE' })
}

export default {
  get,
  post,
  put,
  del,
  request
}
