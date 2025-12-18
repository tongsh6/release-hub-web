import { get, post, put } from '@/api/http'
import type { PageQuery, PageResult, ReleaseWindowStatus } from '@/types/dto'

const BASE = '/v1'

export interface ReleaseWindowSummaryDTO {
  id: string
  name: string
  code?: string
  projectId: string
  projectName?: string
  startAt: string
  endAt: string
  status: ReleaseWindowStatus
  owner?: string
  updatedAt: string
}

export interface ReleaseWindowDetailDTO extends ReleaseWindowSummaryDTO {
  description?: string
  freezeReason?: string
  publishedAt?: string
  publishedBy?: string
  changeHistory?: ReleaseWindowChangeDTO[]
}

export interface ReleaseWindowChangeDTO {
  id: string
  at: string
  by: string
  type: 'CREATE' | 'UPDATE' | 'FREEZE' | 'UNFREEZE' | 'PUBLISH'
  summary: string
  diff?: Record<string, { from?: any; to?: any }>
}

export interface ReleaseWindowListFilter {
  projectId?: string
  status?: ReleaseWindowStatus
  keyword?: string
  startFrom?: string
  startTo?: string
}

export interface CreateReleaseWindowReq {
  name: string
  code?: string
  projectId: string
  startAt: string
  endAt: string
  description?: string
  owner?: string
}

export interface UpdateReleaseWindowReq {
  name?: string
  code?: string
  startAt?: string
  endAt?: string
  description?: string
  owner?: string
}

export interface FreezeReleaseWindowReq {
  reason: string
}

export interface UnfreezeReleaseWindowReq {
  reason?: string
}

export interface PublishReleaseWindowReq {
  note?: string
}

function toQuery(params: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = {}
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return
    out[k] = v
  })
  return out
}

export function pageReleaseWindows(query: PageQuery, filter?: ReleaseWindowListFilter): Promise<PageResult<ReleaseWindowSummaryDTO>> {
  return get(`${BASE}/release-windows`, { params: toQuery({ ...query, ...(filter || {}) }) })
}

export function getReleaseWindow(id: string): Promise<ReleaseWindowDetailDTO> {
  return get(`${BASE}/release-windows/${id}`)
}

export function createReleaseWindow(req: CreateReleaseWindowReq): Promise<ReleaseWindowDetailDTO> {
  return post(`${BASE}/release-windows`, req)
}

export function updateReleaseWindow(id: string, req: UpdateReleaseWindowReq): Promise<ReleaseWindowDetailDTO> {
  return put(`${BASE}/release-windows/${id}`, req)
}

export function freezeReleaseWindow(id: string, req: FreezeReleaseWindowReq): Promise<void> {
  return post(`${BASE}/release-windows/${id}/freeze`, req)
}

export function unfreezeReleaseWindow(id: string, req: UnfreezeReleaseWindowReq = {}): Promise<void> {
  return post(`${BASE}/release-windows/${id}/unfreeze`, req)
}

export function publishReleaseWindow(id: string, req: PublishReleaseWindowReq = {}): Promise<void> {
  return post(`${BASE}/release-windows/${id}/publish`, req)
}

export function listReleaseWindowChanges(id: string): Promise<ReleaseWindowChangeDTO[]> {
  return get(`${BASE}/release-windows/${id}/changes`)
}
