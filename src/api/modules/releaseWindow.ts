import { get, post, put } from '@/api/http'
import type { PageQuery, PageResult } from '@/types/dto'

const BASE = '/v1'

// --- DTOs (Matched with Backend) ---

export type ReleaseWindowStatus = 'DRAFT' | 'INIT' | 'OPEN' | 'FROZEN' | 'CLOSED' | 'PUBLISHED'

export interface ReleaseWindowView {
  id: string
  windowKey: string
  name: string
  status: ReleaseWindowStatus
  createdAt: string
  updatedAt: string
  startAt?: string
  endAt?: string
  frozen: boolean
  publishedAt?: string
}

// Re-export for compatibility with some UI components using 'ReleaseWindow' name
export type ReleaseWindow = ReleaseWindowView

export interface CreateReleaseWindowReq {
  windowKey: string
  name: string
}

export interface ConfigureReleaseWindowReq {
  startAt: string
  endAt: string
}

export interface PublishReleaseWindowReq {
  // empty
}

export interface FreezeReleaseWindowReq {
  // empty
}

// --- API Functions ---

export function list(query: PageQuery): Promise<ReleaseWindowView[]> {
  // The backend currently returns List<ReleaseWindowView> directly, not PageResult
  // If it supports pagination later, we might need to adjust.
  // For now, assuming it returns array based on schema.d.ts: ApiResponseListReleaseWindowView
  return get<ReleaseWindowView[]>(`${BASE}/release-windows`)
}

export function getById(id: string): Promise<ReleaseWindowView> {
  return get<ReleaseWindowView>(`${BASE}/release-windows/${id}`)
}

export function create(req: CreateReleaseWindowReq): Promise<ReleaseWindowView> {
  return post<ReleaseWindowView>(`${BASE}/release-windows`, req)
}

// Note: Backend uses PUT /release-windows/{id}/window for configuration (startAt, endAt)
export function configure(id: string, req: ConfigureReleaseWindowReq): Promise<ReleaseWindowView> {
  return put<ReleaseWindowView>(`${BASE}/release-windows/${id}/window`, req)
}

export function freeze(id: string): Promise<ReleaseWindowView> {
  return post<ReleaseWindowView>(`${BASE}/release-windows/${id}/freeze`, {})
}

export function unfreeze(id: string): Promise<ReleaseWindowView> {
  return post<ReleaseWindowView>(`${BASE}/release-windows/${id}/unfreeze`, {})
}

export function publish(id: string): Promise<ReleaseWindowView> {
  return post<ReleaseWindowView>(`${BASE}/release-windows/${id}/publish`, {})
}

export function closeWindow(id: string): Promise<ReleaseWindowView> {
  return post<ReleaseWindowView>(`${BASE}/release-windows/${id}/close`, {})
}

// Alias for compatibility if needed, or prefer using explicit names above
export const releaseWindowApi = {
  list,
  get: getById,
  create,
  configure,
  freeze,
  unfreeze,
  publish,
  close: closeWindow
}

