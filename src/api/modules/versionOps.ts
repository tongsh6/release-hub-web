import { apiGet, apiPost } from '@/api/http'
import { API_BASE, toQuery } from './_shared'
import type { BuildTool, PageQuery, PageResult, RunStatus, YesNo } from '@/types/dto'

// DTO Definitions
export interface VersionScanReq {
  target: {
    projectId?: string
    subProjectId?: string
    repoUrl?: string
  }
  branchName: string
  buildTool: BuildTool
  policyId: string
  scanRootPath?: string
  pomPath?: string
}

export interface MavenModuleVersionDTO {
  moduleName: string
  groupId?: string
  artifactId?: string
  pomPath: string
  currentVersion: string
  suggestedVersion: string
  updatable: boolean
  reason?: string
}

export interface MavenScanResultDTO {
  modules: MavenModuleVersionDTO[]
  warnings?: string[]
}

export interface VersionScanResp {
  runId: string
  status: RunStatus
  result?: MavenScanResultDTO
}

export interface VersionUpdateReq {
  runId?: string
  target?: {
    projectId?: string
    subProjectId?: string
    repoUrl?: string
  }
  branchName?: string
  policyId?: string
  commitMode: 'NO_COMMIT' | 'COMMIT'
  commitMessage?: string
  modules?: Array<{
    pomPath: string
    newVersion: string
  }>
}

export interface VersionUpdateResp {
  runId: string
  status: RunStatus
}

export interface RunListFilter {
  projectId?: string
  subProjectId?: string
  branchName?: string
  status?: RunStatus
  from?: string
  to?: string
}

export interface VersionRunSummaryDTO {
  runId: string
  type: 'SCAN' | 'UPDATE'
  status: RunStatus
  projectName?: string
  repoUrl?: string
  branchName: string
  policyName?: string
  startedAt: string
  finishedAt?: string
}

export interface VersionRunDetailDTO extends VersionRunSummaryDTO {
  request: any
  result?: any
  error?: {
    message: string
    stack?: string
  }
}

export interface RunLogsResp {
  runId: string
  lines: string[]
}

const MODULE_PATH = `${API_BASE}/version-ops`

export function scan(data: VersionScanReq): Promise<VersionScanResp> {
  return apiPost<VersionScanResp>(`${MODULE_PATH}/scan`, data)
}

export function update(data: VersionUpdateReq): Promise<VersionUpdateResp> {
  return apiPost<VersionUpdateResp>(`${MODULE_PATH}/update`, data)
}

export function pageRuns(query: PageQuery & RunListFilter): Promise<PageResult<VersionRunSummaryDTO>> {
  return apiGet<PageResult<VersionRunSummaryDTO>>(`${MODULE_PATH}/runs`, { params: toQuery(query) })
}

export function getRunDetail(runId: string): Promise<VersionRunDetailDTO> {
  return apiGet<VersionRunDetailDTO>(`${MODULE_PATH}/runs/${runId}`)
}

export function getRunLogs(runId: string): Promise<RunLogsResp> {
  return apiGet<RunLogsResp>(`${MODULE_PATH}/runs/${runId}/logs`)
}
