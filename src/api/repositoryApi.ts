import { http, apiGet, apiPost } from '@/api/http'
import type { PageResult, PageQuery, Id } from '@/types/crud'
import type { ApiResponse } from '@/types/dto'

export interface Repository {
  id: string
  projectId: string
  gitlabProjectId: number
  name: string
  cloneUrl: string
  defaultBranch: string
  monoRepo: boolean
  branchCount: number
  activeBranchCount: number
  nonCompliantBranchCount: number
  mrCount: number
  openMrCount: number
  mergedMrCount: number
  closedMrCount: number
  lastSyncAt: string
  createdAt: string
  updatedAt: string
}

export interface GateSummary {
  protectedBranch: boolean
  approvalRequired: boolean
  pipelineGate: boolean
  permissionDenied: boolean
}

export interface BranchSummary {
  totalBranches: number
  activeBranches: number
  nonCompliantBranches: number
  activeMrs: number
  mergedMrs: number
  closedMrs: number
}

export interface CreateRepoReq {
  projectId: string
  gitlabProjectId: number
  name: string
  cloneUrl: string
  defaultBranch: string
  monoRepo: boolean
}

export interface UpdateRepoReq {
  gitlabProjectId: number
  name: string
  cloneUrl: string
  defaultBranch: string
  monoRepo: boolean
}

export interface ApiPageResponse<T> {
  code: string
  message: string
  data: T
  page: {
    page: number
    size: number
    total: number
  }
}

export const repositoryApi = {
  async list(query: PageQuery & { keyword?: string; projectId?: string; gitlabProjectId?: number | string }): Promise<PageResult<Repository>> {
    const params = {
      page: query.page - 1,
      size: query.pageSize,
      keyword: query.keyword,
      projectId: query.projectId,
      gitlabProjectId: query.gitlabProjectId
    }
    const res = await http.get<ApiPageResponse<Repository[]>>('/v1/repositories/paged', { params })
    return {
      list: res.data.data,
      total: res.data.page.total
    }
  },

  async get(id: Id): Promise<Repository> {
    const res = await http.get<ApiResponse<Repository>>(`/v1/repositories/${id}`)
    return res.data.data
  },

  async create(data: CreateRepoReq): Promise<Repository> {
    const res = await http.post<ApiResponse<Repository>>('/v1/repositories', data)
    return res.data.data
  },

  async update(id: Id, data: UpdateRepoReq): Promise<Repository> {
    const res = await http.put<ApiResponse<Repository>>(`/v1/repositories/${id}`, data)
    return res.data.data
  },

  async getGateSummary(id: Id): Promise<GateSummary> {
    const res = await http.get<ApiResponse<GateSummary>>(`/v1/repositories/${id}/gate-summary`)
    return res.data.data
  },

  async getBranchSummary(id: Id): Promise<BranchSummary> {
    const res = await http.get<ApiResponse<BranchSummary>>(`/v1/repositories/${id}/branch-summary`)
    return res.data.data
  },

  async sync(id: Id): Promise<boolean> {
    const res = await http.post<ApiResponse<boolean>>(`/v1/repositories/${id}/sync`)
    return res.data.data
  }
}
