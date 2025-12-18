import { get, post, put } from '@/api/http'
import { API_BASE, toQuery } from './_shared'
import type { PageQuery, PageResult, Status, BranchRuleScopeDTO, BranchRuleScopeReq } from '@/types/dto'

export type BranchRuleType = 'TEMPLATE' | 'REGEX'

export interface BranchRuleDTO {
  id: string
  name: string
  type: BranchRuleType
  pattern: string
  description?: string
  scope: BranchRuleScopeDTO
  status: Status
  updatedAt: string
}

export interface CreateBranchRuleReq {
  name: string
  type: BranchRuleType
  pattern: string
  description?: string
  scope: BranchRuleScopeReq
}

export interface UpdateBranchRuleReq {
  name?: string
  type?: BranchRuleType
  pattern?: string
  description?: string
  scope?: BranchRuleScopeReq
  status?: Status
}

export interface BranchRuleTestReq {
  ruleId?: string
  type?: BranchRuleType
  pattern?: string
  input: {
    branchName?: string
    params?: Record<string, any>
  }
}

export interface BranchRuleTestResp {
  ok: boolean
  rendered?: string
  errors?: string[]
}

const MODULE_PATH = `${API_BASE}/branch-rules`

export function pageBranchRules(query: PageQuery): Promise<PageResult<BranchRuleDTO>> {
  return get<PageResult<BranchRuleDTO>>(MODULE_PATH, { params: toQuery(query) })
}

export function createBranchRule(data: CreateBranchRuleReq): Promise<BranchRuleDTO> {
  return post<BranchRuleDTO>(MODULE_PATH, data)
}

export function updateBranchRule(id: string, data: UpdateBranchRuleReq): Promise<BranchRuleDTO> {
  return put<BranchRuleDTO>(`${MODULE_PATH}/${id}`, data)
}

export function enableBranchRule(id: string): Promise<void> {
  return post<void>(`${MODULE_PATH}/${id}/enable`)
}

export function disableBranchRule(id: string): Promise<void> {
  return post<void>(`${MODULE_PATH}/${id}/disable`)
}

export function testBranchRule(data: BranchRuleTestReq): Promise<BranchRuleTestResp> {
  return post<BranchRuleTestResp>(`${MODULE_PATH}/test`, data)
}
