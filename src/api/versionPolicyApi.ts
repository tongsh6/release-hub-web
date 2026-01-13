import { http } from '@/api/http'
import type { PageResult, PageQuery } from '@/types/crud'
import type { ApiResponse } from '@/types/dto'

export interface VersionPolicy {
  id: string
  name: string
  scheme: string
  bumpRule: string
  createdAt?: string
  updatedAt?: string
}

// 用于前端展示的策略类型
export interface VersionPolicyDisplay {
  id: string
  name: string
  strategy: string  // 组合 scheme + bumpRule 用于展示
  scheme: string
  bumpRule: string
  createdAt?: string
  updatedAt?: string
}

// 将后端数据转换为前端展示格式
function toDisplay(policy: VersionPolicy): VersionPolicyDisplay {
  // 生成策略描述
  let strategy = policy.scheme
  if (policy.bumpRule && policy.bumpRule !== 'NONE') {
    strategy += ` (${policy.bumpRule})`
  }
  
  return {
    id: policy.id,
    name: policy.name,
    strategy,
    scheme: policy.scheme,
    bumpRule: policy.bumpRule,
    createdAt: policy.createdAt,
    updatedAt: policy.updatedAt
  }
}

export const versionPolicyApi = {
  /**
   * 获取版本策略列表
   * @param query 查询参数（支持客户端分页和过滤）
   */
  async list(query: PageQuery & { name?: string }): Promise<PageResult<VersionPolicyDisplay>> {
    const res = await http.get<ApiResponse<VersionPolicy[]>>('/v1/version-policies')
    
    let list = (res.data.data || []).map(toDisplay)
    
    // 客户端过滤
    if (query.name) {
      const keyword = query.name.toLowerCase()
      list = list.filter(item => 
        item.name.toLowerCase().includes(keyword) ||
        item.strategy.toLowerCase().includes(keyword)
      )
    }
    
    // 客户端分页
    const start = (query.page - 1) * query.pageSize
    const end = start + query.pageSize
    
    return {
      list: list.slice(start, end),
      total: list.length
    }
  },

  /**
   * 获取版本策略详情
   * @param id 版本策略 ID
   */
  async get(id: string): Promise<VersionPolicyDisplay> {
    const res = await http.get<ApiResponse<VersionPolicy>>(`/v1/version-policies/${id}`)
    return toDisplay(res.data.data)
  },

  /**
   * 获取所有版本策略（不分页，用于下拉选择）
   */
  async listAll(): Promise<VersionPolicyDisplay[]> {
    const res = await http.get<ApiResponse<VersionPolicy[]>>('/v1/version-policies')
    return (res.data.data || []).map(toDisplay)
  }
}
