/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * projectService.ts
 *
 * Supabase API service wrapper for Projects.
 * Encapsulates PostgreSQL database CRUD queries with TTL response caching,
 * request deduplication, input sanitization, and payload compaction.
 */

import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Project, ProjectStatus } from '@/types/database.types'
import { withRetry } from '@/lib/retryHandler'
import { sanitizeText, compactAndSanitizePayload } from '@/lib/sanitize'

export interface CreateProjectInput {
  title: string
  description?: string
  industry?: string
  status?: ProjectStatus
}

export interface UpdateProjectInput {
  title?: string
  description?: string
  industry?: string
  status?: ProjectStatus
  progress?: number
  empathy_map?: Record<string, any>
  canvas?: Record<string, any>
  brainstorm_notes?: Record<string, any>[]
  experiments?: Record<string, any>[]
  milestones?: Record<string, any>[]
}

const CACHE_TTL_MS = 30_000
const PROJECT_COLUMNS =
  'id, user_id, title, description, industry, status, progress, empathy_map, canvas, brainstorm_notes, experiments, milestones, created_at, updated_at'

interface ProjectsCacheEntry {
  data: Project[]
  expiresAt: number
}

let projectsListCache: ProjectsCacheEntry | null = null
const projectByIdCache = new Map<string, { data: Project; expiresAt: number }>()
let inflightFetchList: Promise<Project[]> | null = null

function invalidateProjectCache(projectId?: string) {
  projectsListCache = null
  if (projectId) {
    projectByIdCache.delete(projectId)
  } else {
    projectByIdCache.clear()
  }
}

// Fallback dataset for unconfigured local mode
let mockProjects: Project[] = [
  {
    id: 'mock-proj-1',
    user_id: 'demo-user-id',
    title: 'SolarFlow Systems',
    description: 'Smart micro-grid energy management software for commercial buildings.',
    industry: 'CleanTech',
    status: 'active',
    progress: 60,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mock-proj-2',
    user_id: 'demo-user-id',
    title: 'HealthTrack Operations',
    description: 'Predictive patient monitoring platform for regional outpatient clinics.',
    industry: 'HealthTech',
    status: 'active',
    progress: 30,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const projectService = {
  /**
   * Fetch all projects belonging to the current user with TTL caching and request deduplication.
   */
  async fetchProjects(forceRefresh = false): Promise<Project[]> {
    const now = Date.now()
    if (!forceRefresh && projectsListCache && projectsListCache.expiresAt > now) {
      return projectsListCache.data
    }

    if (!isSupabaseConfigured) {
      const copy = [...mockProjects]
      projectsListCache = { data: copy, expiresAt: now + CACHE_TTL_MS }
      for (const proj of copy) {
        projectByIdCache.set(proj.id, { data: proj, expiresAt: now + CACHE_TTL_MS })
      }
      return copy
    }

    if (inflightFetchList) {
      return inflightFetchList
    }

    inflightFetchList = withRetry(async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(PROJECT_COLUMNS)
        .order('updated_at', { ascending: false })
        .limit(100)

      if (error) {
        console.error('[projectService.fetchProjects] Error:', error)
        throw new Error(error.message)
      }

      const list = (data as Project[]) ?? []
      const expiry = Date.now() + CACHE_TTL_MS
      projectsListCache = { data: list, expiresAt: expiry }
      for (const proj of list) {
        projectByIdCache.set(proj.id, { data: proj, expiresAt: expiry })
      }
      return list
    }).finally(() => {
      inflightFetchList = null
    })

    return inflightFetchList
  },

  /**
   * Fetch a single project by ID, checking the in-memory cache first to avoid N+1 queries.
   */
  async getProjectById(id: string): Promise<Project | null> {
    const cleanId = sanitizeText(id, 64)
    if (!cleanId) return null

    const now = Date.now()
    const cached = projectByIdCache.get(cleanId)
    if (cached && cached.expiresAt > now) {
      return cached.data
    }

    if (!isSupabaseConfigured) {
      const match = mockProjects.find((p) => p.id === cleanId) ?? null
      if (match) {
        projectByIdCache.set(cleanId, { data: match, expiresAt: now + CACHE_TTL_MS })
      }
      return match
    }

    return withRetry(async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(PROJECT_COLUMNS)
        .eq('id', cleanId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') return null
        console.error('[projectService.getProjectById] Error:', error)
        throw new Error(error.message)
      }

      const proj = data as Project
      projectByIdCache.set(cleanId, { data: proj, expiresAt: Date.now() + CACHE_TTL_MS })
      return proj
    })
  },

  /**
   * Create a new project for the authenticated user with sanitized inputs.
   */
  async createProject(input: CreateProjectInput): Promise<Project> {
    const sanitizedTitle = sanitizeText(input.title, 160) || 'Untitled Venture'
    const sanitizedDescription = input.description
      ? sanitizeText(input.description, 2000)
      : undefined
    const sanitizedIndustry = sanitizeText(input.industry, 80) || 'General'
    const status: ProjectStatus =
      input.status && ['active', 'archived', 'completed'].includes(input.status)
        ? input.status
        : 'active'

    if (!isSupabaseConfigured) {
      const newMock: Project = {
        id: `mock-${Date.now().toString().slice(-5)}`,
        user_id: 'demo-user-id',
        title: sanitizedTitle,
        description: sanitizedDescription,
        industry: sanitizedIndustry,
        status,
        progress: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      mockProjects = [newMock, ...mockProjects]
      invalidateProjectCache()
      return newMock
    }

    return withRetry(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('User must be authenticated to create a project.')
      }

      const { data, error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          title: sanitizedTitle,
          description: sanitizedDescription,
          industry: sanitizedIndustry,
          status,
          progress: 0,
        })
        .select(PROJECT_COLUMNS)
        .single()

      if (error) {
        console.error('[projectService.createProject] Error:', error)
        throw new Error(error.message)
      }

      const created = data as Project
      invalidateProjectCache()
      projectByIdCache.set(created.id, { data: created, expiresAt: Date.now() + CACHE_TTL_MS })
      return created
    })
  },

  /**
   * Update an existing project record with payload compaction and sanitization.
   */
  async updateProject(id: string, patch: UpdateProjectInput): Promise<Project> {
    const cleanId = sanitizeText(id, 64)
    if (!cleanId) {
      throw new Error('Invalid project identifier.')
    }

    const sanitizedPatch = compactAndSanitizePayload(
      patch as Record<string, unknown>,
    ) as UpdateProjectInput
    if (typeof sanitizedPatch.progress === 'number') {
      sanitizedPatch.progress = Math.max(0, Math.min(100, Math.round(sanitizedPatch.progress)))
    }

    if (!isSupabaseConfigured) {
      mockProjects = mockProjects.map((p) =>
        p.id === cleanId ? { ...p, ...sanitizedPatch, updated_at: new Date().toISOString() } : p,
      )
      const updated = mockProjects.find((p) => p.id === cleanId)!
      invalidateProjectCache(cleanId)
      return updated
    }

    return withRetry(async () => {
      const { data, error } = await supabase
        .from('projects')
        .update({
          ...sanitizedPatch,
          updated_at: new Date().toISOString(),
        })
        .eq('id', cleanId)
        .select(PROJECT_COLUMNS)
        .single()

      if (error) {
        console.error('[projectService.updateProject] Error:', error)
        throw new Error(error.message)
      }

      const updated = data as Project
      invalidateProjectCache(cleanId)
      projectByIdCache.set(cleanId, { data: updated, expiresAt: Date.now() + CACHE_TTL_MS })
      return updated
    })
  },

  /**
   * Delete a project by ID and invalidate cache entries.
   */
  async deleteProject(id: string): Promise<void> {
    const cleanId = sanitizeText(id, 64)
    if (!cleanId) return

    if (!isSupabaseConfigured) {
      mockProjects = mockProjects.filter((p) => p.id !== cleanId)
      invalidateProjectCache(cleanId)
      return
    }

    return withRetry(async () => {
      const { error } = await supabase.from('projects').delete().eq('id', cleanId)

      if (error) {
        console.error('[projectService.deleteProject] Error:', error)
        throw new Error(error.message)
      }

      invalidateProjectCache(cleanId)
    })
  },
}
