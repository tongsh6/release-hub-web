import type { PageResult, PageQuery, Id } from '@/types/crud'

export interface Repository {
  repo: string
  projectId: number
  defaultBranch: string
  writable: boolean
}

const data: Repository[] = Array.from({ length: 20 }).map((_, i) => ({
  repo: `org/repo-${i + 1}`,
  projectId: 100 + i,
  defaultBranch: 'main',
  writable: i % 3 !== 0
}))

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const repositoryApi = {
  async list(query: PageQuery & { keyword?: string }): Promise<PageResult<Repository>> {
    await delay(500)
    let list = [...data]
    if (query.keyword) {
      list = list.filter(item => item.repo.toLowerCase().includes(query.keyword!.toLowerCase()))
    }
    const start = (query.page - 1) * query.pageSize
    const end = start + query.pageSize
    return {
      list: list.slice(start, end),
      total: list.length
    }
  }
}
