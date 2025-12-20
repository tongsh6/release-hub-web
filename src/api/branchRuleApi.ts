import type { PageResult, PageQuery, Id } from '@/types/crud'

export interface BranchRule {
  id: string
  name: string
  pattern: string
  type: 'Allow' | 'Block'
}

const data: BranchRule[] = [
  { id: '1', name: 'Feature Branches', pattern: 'feature/*', type: 'Allow' },
  { id: '2', name: 'Hotfix Branches', pattern: 'hotfix/*', type: 'Allow' },
  { id: '3', name: 'Release Branches', pattern: 'release/*', type: 'Allow' },
  { id: '4', name: 'Main Protection', pattern: 'main', type: 'Block' }
]

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const branchRuleApi = {
  async list(query: PageQuery & { name?: string }): Promise<PageResult<BranchRule>> {
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
