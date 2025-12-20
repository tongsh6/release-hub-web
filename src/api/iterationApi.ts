import type { PageResult, PageQuery, Id } from '@/types/crud'

// Types
export interface Iteration {
  iterationKey: string
  repoCount: number
  mountedWindows: number
  attachAt: string
}

// Mock In-memory DB
const data: Iteration[] = Array.from({ length: 25 }).map((_, i) => ({
  iterationKey: `it-2025-${String(i + 1).padStart(2, '0')}-01`,
  repoCount: Math.floor(Math.random() * 10),
  mountedWindows: Math.floor(Math.random() * 5),
  attachAt: new Date(Date.now() - i * 86400000).toISOString()
}))

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const iterationApi = {
  async list(query: PageQuery & { keyword?: string }): Promise<PageResult<Iteration>> {
    await delay(500)
    let list = [...data]

    if (query.keyword) {
      list = list.filter(p => p.iterationKey.toLowerCase().includes(query.keyword!.toLowerCase()))
    }

    const start = (query.page - 1) * query.pageSize
    const end = start + query.pageSize
    const pageList = list.slice(start, end)

    return {
      list: pageList,
      total: list.length
    }
  },

  async get(key: string): Promise<Iteration> {
    await delay(300)
    const item = data.find(p => p.iterationKey === key)
    if (!item) throw new Error('Iteration not found')
    return { ...item }
  }
}
