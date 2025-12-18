import type { PageResult, PageQuery, Id } from '@/types/crud'

// Types
export interface ReleaseWindow {
  id: string
  name: string
  status: 'active' | 'frozen'
  createdAt: string
  description?: string
}

// Mock In-memory DB
let data: ReleaseWindow[] = Array.from({ length: 25 }).map((_, i) => ({
  id: String(i + 1),
  name: `ReleaseWindow Demo ${i + 1}`,
  status: i % 3 === 0 ? 'frozen' : 'active',
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  description: `This is description for ReleaseWindow ${i + 1}`
}))

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const releaseWindowApi = {
  async list(query: PageQuery & { name?: string; status?: string }): Promise<PageResult<ReleaseWindow>> {
    await delay(500)
    let list = [...data]

    if (query.name) {
      list = list.filter(p => p.name.toLowerCase().includes(query.name!.toLowerCase()))
    }
    if (query.status) {
      list = list.filter(p => p.status === query.status)
    }

    const start = (query.page - 1) * query.pageSize
    const end = start + query.pageSize
    const pageList = list.slice(start, end)

    return {
      list: pageList,
      total: list.length
    }
  },

  async get(id: Id): Promise<ReleaseWindow> {
    await delay(300)
    const item = data.find(p => p.id === String(id))
    if (!item) throw new Error('ReleaseWindow not found')
    return { ...item }
  },

  async create(payload: Omit<ReleaseWindow, 'id' | 'createdAt'>): Promise<ReleaseWindow> {
    await delay(800)
    const newItem: ReleaseWindow = {
      ...payload,
      id: String(data.length + 1 + Math.floor(Math.random() * 1000)),
      createdAt: new Date().toISOString()
    }
    data.unshift(newItem)
    return newItem
  },

  async update(id: Id, payload: Partial<ReleaseWindow>): Promise<ReleaseWindow> {
    await delay(800)
    const index = data.findIndex(p => p.id === String(id))
    if (index === -1) throw new Error('ReleaseWindow not found')
    
    const updated = { ...data[index], ...payload } as ReleaseWindow
    data[index] = updated
    return updated
  },

  async freeze(id: Id): Promise<void> {
    await delay(500)
    const index = data.findIndex(p => p.id === String(id))
    if (index === -1) throw new Error('ReleaseWindow not found')
    
    const item = data[index]
    if (item) {
      item.status = item.status === 'active' ? 'frozen' : 'active'
    }
  }
}
