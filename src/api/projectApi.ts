import { apiGet, apiPost, apiPut, apiDel } from '@/api/http'
import type { PageResult, PageQuery, Id } from '@/types/crud'

export interface Project {
  id: string
  name: string
  description: string | null
  status: 'ACTIVE' | 'ARCHIVED'
  createdAt: string
  updatedAt: string
}

export interface CreateProjectReq {
  name: string
  description?: string
}

export interface UpdateProjectReq {
  name: string
  description?: string
}

export const projectApi = {
  async list(query: PageQuery & { name?: string; status?: string }): Promise<PageResult<Project>> {
    const res = await apiGet<Project[]>('/v1/projects')
    let list = Array.isArray(res) ? res : []

    // 客户端过滤
    if (query.name) {
      const keyword = query.name.toLowerCase()
      list = list.filter(item => item.name.toLowerCase().includes(keyword))
    }
    if (query.status) {
      list = list.filter(item => item.status === query.status)
    }

    // 客户端分页
    const start = (query.page - 1) * query.pageSize
    const end = start + query.pageSize

    return {
      list: list.slice(start, end),
      total: list.length
    }
  },

  async get(id: Id): Promise<Project> {
    return await apiGet<Project>(`/v1/projects/${id}`)
  },

  async create(req: CreateProjectReq): Promise<Project> {
    return await apiPost<Project>('/v1/projects', req)
  },

  async update(id: Id, req: UpdateProjectReq): Promise<Project> {
    return await apiPut<Project>(`/v1/projects/${id}`, req)
  },

  async archive(id: Id): Promise<void> {
    await apiPost<void>(`/v1/projects/${id}/archive`, {})
  },

  async remove(id: Id): Promise<void> {
    await apiDel<void>(`/v1/projects/${id}`)
  }
}
