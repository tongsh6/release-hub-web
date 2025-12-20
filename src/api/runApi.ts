import type { PageResult, PageQuery, Id } from '@/types/crud'

export interface Run {
  id: string
  type: string
  status: 'SUCCESS' | 'FAILED' | 'RUNNING' | 'MERGE_BLOCKED'
  startedAt: string
  endedAt: string
}

const data: Run[] = Array.from({ length: 25 }).map((_, i) => ({
  id: `run-${i + 1}`,
  type: i % 2 === 0 ? 'WINDOW_ORCHESTRATION' : 'SCAN',
  status: i % 5 === 0 ? 'FAILED' : (i % 7 === 0 ? 'MERGE_BLOCKED' : 'SUCCESS'),
  startedAt: new Date(Date.now() - i * 3600000).toISOString(),
  endedAt: new Date(Date.now() - i * 3600000 + 60000).toISOString()
}))

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const runApi = {
  async list(query: PageQuery & { windowKey?: string; repo?: string; iterationKey?: string; status?: string }): Promise<PageResult<Run>> {
    await delay(500)
    let list = [...data]
    if (query.status) {
      list = list.filter(item => item.status === query.status)
    }
    // other filters ignored for mock
    const start = (query.page - 1) * query.pageSize
    const end = start + query.pageSize
    return {
      list: list.slice(start, end),
      total: list.length
    }
  }
}
