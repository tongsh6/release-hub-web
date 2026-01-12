import type { PageResult, PageQuery } from '@/types/crud'
import { apiGet, apiPost, apiPut, apiDel } from '@/api/http'

// 后端返回的原始数据结构
export interface IterationRaw {
  key: string
  description: string
  repoIds: string[]
  createdAt: string
  updatedAt: string
}

// 前端使用的数据结构
export interface Iteration {
  iterationKey: string
  description: string
  repoIds: string[]
  repoCount: number
  mountedWindows: string  // 暂时使用空字符串
  attachAt: string
  createdAt: string
  updatedAt: string
}

export interface CreateIterationRequest {
  iterationKey: string
  description?: string
  repoIds?: string[]
}

export interface UpdateIterationRequest {
  description?: string
  repoIds?: string[]
}

// 将后端数据转换为前端格式
function transformIteration(raw: IterationRaw): Iteration {
  return {
    iterationKey: raw.key,
    description: raw.description || '',
    repoIds: raw.repoIds || [],
    repoCount: raw.repoIds?.length || 0,
    mountedWindows: '',  // 后端暂未提供此字段
    attachAt: '',  // 后端暂未提供此字段
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt
  }
}

export const iterationApi = {
  async list(query: PageQuery & { keyword?: string }): Promise<PageResult<Iteration>> {
    const resp = await apiGet<IterationRaw[]>('/v1/iterations')
    
    let rawList: IterationRaw[] = []
    
    // 处理不同的响应格式
    if (Array.isArray(resp)) {
      rawList = resp
    } else if (resp && typeof resp === 'object') {
      // 如果是对象，可能是分页格式
      rawList = (resp as any).list || (resp as any).data || []
    }
    
    // 转换数据格式
    let list = rawList.map(transformIteration)
    
    // 客户端过滤
    if (query.keyword) {
      const keyword = query.keyword.toLowerCase()
      list = list.filter(item => 
        item.iterationKey.toLowerCase().includes(keyword) ||
        item.description?.toLowerCase().includes(keyword)
      )
    }
    
    return { 
      list, 
      total: list.length 
    }
  },

  async get(key: string): Promise<Iteration> {
    const resp = await apiGet<IterationRaw>(`/v1/iterations/${encodeURIComponent(key)}`)
    return transformIteration(resp)
  },

  async create(payload: CreateIterationRequest): Promise<Iteration> {
    const resp = await apiPost<IterationRaw>('/v1/iterations', payload)
    // 后端返回的是 ID 字符串，需要重新获取完整数据
    if (typeof resp === 'string') {
      return this.get(payload.iterationKey)
    }
    return transformIteration(resp)
  },

  async update(key: string, payload: UpdateIterationRequest): Promise<Iteration> {
    const resp = await apiPut<IterationRaw>(`/v1/iterations/${encodeURIComponent(key)}`, payload)
    return transformIteration(resp)
  },

  async delete(key: string): Promise<void> {
    await apiDel(`/v1/iterations/${encodeURIComponent(key)}`)
  },

  async addRepos(key: string, repoIds: string[]): Promise<Iteration> {
    const resp = await apiPost<IterationRaw>(`/v1/iterations/${encodeURIComponent(key)}/repos/add`, { repoIds })
    return transformIteration(resp)
  },

  async removeRepos(key: string, repoIds: string[]): Promise<Iteration> {
    const resp = await apiPost<IterationRaw>(`/v1/iterations/${encodeURIComponent(key)}/repos/remove`, { repoIds })
    return transformIteration(resp)
  },

  async listRepos(key: string): Promise<string[]> {
    const resp = await apiGet<string[]>(`/v1/iterations/${encodeURIComponent(key)}/repos`)
    return resp || []
  }
}
