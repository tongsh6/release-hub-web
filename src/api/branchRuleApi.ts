import { apiGet, apiPost, apiPut, apiDel } from '@/api/http'
import type { PageResult, PageQuery, Id } from '@/types/crud'

export interface BranchRule {
  id: string
  name: string
  pattern: string
  type: 'ALLOW' | 'BLOCK'
  createdAt?: string
  updatedAt?: string
}

export interface CreateBranchRuleReq {
  name: string
  pattern: string
  type: 'ALLOW' | 'BLOCK'
}

export interface UpdateBranchRuleReq {
  name: string
  pattern: string
  type: 'ALLOW' | 'BLOCK'
}

export const branchRuleApi = {
  async list(query: PageQuery & { name?: string }): Promise<PageResult<BranchRule>> {
    const res = await apiGet<BranchRule[]>('/v1/branch-rules')
    let list = Array.isArray(res) ? res : []

    // 客户端过滤
    if (query.name) {
      const keyword = query.name.toLowerCase()
      list = list.filter(item => item.name.toLowerCase().includes(keyword))
    }

    // 客户端分页
    const start = (query.page - 1) * query.pageSize
    const end = start + query.pageSize

    return {
      list: list.slice(start, end),
      total: list.length
    }
  },

  async get(id: Id): Promise<BranchRule> {
    return await apiGet<BranchRule>(`/v1/branch-rules/${id}`)
  },

  async create(req: CreateBranchRuleReq): Promise<BranchRule> {
    return await apiPost<BranchRule>('/v1/branch-rules', req)
  },

  async update(id: Id, req: UpdateBranchRuleReq): Promise<BranchRule> {
    return await apiPut<BranchRule>(`/v1/branch-rules/${id}`, req)
  },

  async remove(id: Id): Promise<void> {
    await apiDel<void>(`/v1/branch-rules/${id}`)
  },

  async check(branchName: string): Promise<{ branchName: string; compliant: boolean }> {
    return await apiGet<{ branchName: string; compliant: boolean }>(`/v1/branch-rules/check?branchName=${encodeURIComponent(branchName)}`)
  }
}
