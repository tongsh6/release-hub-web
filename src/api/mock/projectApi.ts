import type { PageResult, PageQuery, Id } from '@/types/crud'

// Mock types
export interface Project {
  id: string
  name: string
  status: 'active' | 'frozen'
  createdAt: string
  description?: string
}

// In-memory DB
const projects: Project[] = Array.from({ length: 25 }).map((_, i) => ({
  id: String(i + 1),
  name: `Project Demo ${i + 1}`,
  status: i % 3 === 0 ? 'frozen' : 'active',
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  description: `This is description for project ${i + 1}`
}))

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const projectApi = {
  async listProjects(query: PageQuery & { name?: string; status?: string }): Promise<PageResult<Project>> {
    await delay(500)
    let list = [...projects]

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

  async getProject(id: Id): Promise<Project> {
    await delay(300)
    const item = projects.find(p => p.id === String(id))
    if (!item) throw new Error('Project not found')
    return { ...item }
  },

  async createProject(payload: Omit<Project, 'id' | 'createdAt'>): Promise<Project> {
    await delay(800)
    const newProject: Project = {
      ...payload,
      id: String(projects.length + 1 + Math.floor(Math.random() * 1000)),
      createdAt: new Date().toISOString()
    }
    projects.unshift(newProject)
    return newProject
  },

  async updateProject(id: Id, payload: Partial<Project>): Promise<Project> {
    await delay(800)
    const index = projects.findIndex(p => p.id === String(id))
    if (index === -1) throw new Error('Project not found')
    
    const updated = { ...projects[index], ...payload } as Project
    projects[index] = updated
    return updated
  },

  async freezeProject(id: Id): Promise<void> {
    await delay(500)
    const index = projects.findIndex(p => p.id === String(id))
    if (index === -1) throw new Error('Project not found')
    
    const item = projects[index]
    if (item) {
      item.status = item.status === 'active' ? 'frozen' : 'active'
    }
  }
}
