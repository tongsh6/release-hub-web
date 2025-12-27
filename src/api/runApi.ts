import { http, apiPost } from '@/api/http'
import type { PageResult, PageQuery, Id } from '@/types/crud'
import type { ApiPageResponse } from '@/api/repositoryApi'

export interface Run {
  id: string
  runType: string
  status: string
  startedAt: string
  finishedAt: string
  operator: string
}

export interface RunDetail extends Run {
  items: RunItem[]
}

export interface RunItem {
  windowKey: string
  repo: string
  iterationKey: string
  plannedOrder: number
  executedOrder: number
  finalResult: string
  steps: RunStep[]
}

export interface RunStep {
  actionType: string
  result: string
  startedAt: string
  finishedAt: string
  message: string
}

export const runApi = {
  async list(query: PageQuery & { windowKey?: string; repo?: string; iterationKey?: string; status?: string }): Promise<PageResult<Run>> {
    const params = {
      page: query.page - 1,
      size: query.pageSize,
      windowKey: query.windowKey,
      repo: query.repo,
      iterationKey: query.iterationKey,
      status: query.status
    }
    const res = await http.get<ApiPageResponse<Run[]>>('/v1/runs/paged', { params })
    return {
      list: res.data.data,
      total: res.data.page.total
    }
  },

  async getRunById(id: Id): Promise<RunDetail> {
    const res = await http.get<RunDetail>(`/v1/runs/${id}/export.json`)
    return res.data
  },

  async retry(id: Id, items: string[], operator: string): Promise<string> {
    const res = await http.post<string>(`/v1/runs/${id}/retry`, { items, operator })
    return res.data
  }
}
