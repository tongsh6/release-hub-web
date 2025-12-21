import type { PageResult, PageQuery } from '@/types/crud'
import { apiGet, apiPost } from '@/api/http'

export interface Iteration {
  iterationKey: string
  repoCount: number
  mountedWindows: number
  attachAt: string
}

export interface CreateIterationRequest {
  iterationKey: string
}

export const iterationApi = {
  async list(query: PageQuery & { keyword?: string }): Promise<PageResult<Iteration>> {
    const params = {
      page: query.page,
      pageSize: query.pageSize,
      keyword: query.keyword || ''
    }
    const resp = await apiGet<any>('/v1/iterations', { params })
    if (resp && Array.isArray(resp)) {
      return { list: resp as Iteration[], total: resp.length }
    }
    if (resp && typeof resp === 'object' && 'list' in resp && 'total' in resp) {
      return resp as PageResult<Iteration>
    }
    // Fallback: empty result
    return { list: [], total: 0 }
  },

  async get(key: string): Promise<Iteration> {
    return await apiGet<Iteration>(`/v1/iterations/${encodeURIComponent(key)}`)
  },

  async create(payload: CreateIterationRequest): Promise<Iteration> {
    return await apiPost<Iteration>('/v1/iterations', payload)
  }
}
