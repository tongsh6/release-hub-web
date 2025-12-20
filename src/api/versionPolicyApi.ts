import type { PageResult, PageQuery, Id } from '@/types/crud'

export interface VersionPolicy {
  id: string
  name: string
  strategy: string
}

const data: VersionPolicy[] = [
  { id: '1', name: 'Semantic Versioning', strategy: 'Major.Minor.Patch' },
  { id: '2', name: 'Date Based', strategy: 'YYYY.MM.DD' },
  { id: '3', name: 'Custom Policy', strategy: 'Custom Script' }
]

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const versionPolicyApi = {
  async list(query: PageQuery & { name?: string }): Promise<PageResult<VersionPolicy>> {
    await delay(500)
    let list = [...data]
    if (query.name) {
      list = list.filter(item => item.name.toLowerCase().includes(query.name!.toLowerCase()))
    }
    const start = (query.page - 1) * query.pageSize
    const end = start + query.pageSize
    return {
      list: list.slice(start, end),
      total: list.length
    }
  }
}
