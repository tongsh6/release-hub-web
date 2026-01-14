import { apiGet, apiPost, apiPut, apiDel, http } from '@/api/http'
import type { ApiPageResponse } from '@/api/repositoryApi'
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
    const params = {
      page: query.page,
      size: query.pageSize,
      name: query.name,
      status: query.status
    }
    const res = await http.get<ApiPageResponse<Project[]>>('/v1/projects/paged', { params })
    return {
      list: res.data.data,
      total: res.data.page.total
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
