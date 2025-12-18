import { get, post, put } from '@/api/http'
import type { ApiResponse } from '@/types/dto'
import type { Status, BuildTool } from '@/types/dto'

export interface ProjectDTO {
  id: string
  name: string
  code?: string
  description?: string
  status: Status
  createdAt: string
  updatedAt: string
}

export interface RepoBindingDTO {
  repoUrl: string
  defaultBranch?: string
  buildTool: BuildTool
  scanRootPath: string
  pomPath?: string
  updatedAt: string
}

export interface ProjectTreeNode {
  id: string
  type: 'PROJECT' | 'SUB_PROJECT'
  name: string
  code?: string
  status: Status
  parentId?: string
  children?: ProjectTreeNode[]
  repo?: RepoBindingDTO
}

export interface CreateProjectReq {
  name: string
  code?: string
  description?: string
}

export interface UpdateProjectReq {
  name?: string
  code?: string
  description?: string
  status?: Status
}

export interface CreateSubProjectReq {
  name: string
  code?: string
  description?: string
}

export interface UpdateSubProjectReq {
  name?: string
  code?: string
  description?: string
  status?: Status
}

export interface UpsertRepoBindingReq {
  repoUrl: string
  defaultBranch?: string
  buildTool: BuildTool
  scanRootPath?: string
  pomPath?: string
}

const BASE = '/v1'

export function getProjectTree(): Promise<ProjectTreeNode[]> {
  return get(`${BASE}/projects/tree`)
}

export function createProject(req: CreateProjectReq): Promise<ProjectDTO> {
  return post(`${BASE}/projects`, req)
}

export function updateProject(projectId: string, req: UpdateProjectReq): Promise<ProjectDTO> {
  return put(`${BASE}/projects/${projectId}`, req)
}

export function createSubProject(projectId: string, req: CreateSubProjectReq): Promise<ProjectDTO> {
  return post(`${BASE}/projects/${projectId}/sub-projects`, req)
}

export function updateSubProject(subProjectId: string, req: UpdateSubProjectReq): Promise<ProjectDTO> {
  return put(`${BASE}/sub-projects/${subProjectId}`, req)
}

export function upsertRepoBinding(subProjectId: string, req: UpsertRepoBindingReq): Promise<RepoBindingDTO> {
  return put(`${BASE}/sub-projects/${subProjectId}/repo-binding`, req)
}
