/**
 * projectService.ts
 *
 * Supabase API service wrapper for Projects.
 * Encapsulates PostgreSQL database CRUD queries for user projects.
 * Provides fallback mock handling when credentials are unconfigured.
 */

import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Project, ProjectStatus } from '@/types/database.types'

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
}

// Fallback mock dataset for unconfigured environment
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
    title: 'HealthTrack AI',
    description: 'Predictive patient monitoring platform for remote health clinics.',
    industry: 'HealthTech',
    status: 'active',
    progress: 30,
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const projectService = {
  /**
   * Fetch all projects belonging to the current user.
   */
  async fetchProjects(): Promise<Project[]> {
    if (!isSupabaseConfigured) {
      return new Promise((resolve) => setTimeout(() => resolve([...mockProjects]), 400))
    }

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('[projectService.fetchProjects] Error:', error)
      throw new Error(error.message)
    }

    return (data as Project[]) ?? []
  },

  /**
   * Fetch a single project by ID.
   */
  async getProjectById(id: string): Promise<Project | null> {
    if (!isSupabaseConfigured) {
      const match = mockProjects.find((p) => p.id === id) ?? null
      return new Promise((resolve) => setTimeout(() => resolve(match), 300))
    }

    const { data, error } = await supabase.from('projects').select('*').eq('id', id).single()

    if (error) {
      if (error.code === 'PGRST116') return null // Single row query zero results
      console.error('[projectService.getProjectById] Error:', error)
      throw new Error(error.message)
    }

    return data as Project
  },

  /**
   * Create a new project for the authenticated user.
   */
  async createProject(input: CreateProjectInput): Promise<Project> {
    if (!isSupabaseConfigured) {
      const newMock: Project = {
        id: `mock-${Date.now().toString().slice(-5)}`,
        user_id: 'demo-user-id',
        title: input.title || 'New Startup Idea',
        description: input.description,
        industry: input.industry || 'General',
        status: input.status || 'active',
        progress: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      mockProjects = [newMock, ...mockProjects]
      return new Promise((resolve) => setTimeout(() => resolve(newMock), 500))
    }

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
        title: input.title,
        description: input.description,
        industry: input.industry,
        status: input.status || 'active',
        progress: 0,
      })
      .select()
      .single()

    if (error) {
      console.error('[projectService.createProject] Error:', error)
      throw new Error(error.message)
    }

    return data as Project
  },

  /**
   * Update an existing project record.
   */
  async updateProject(id: string, patch: UpdateProjectInput): Promise<Project> {
    if (!isSupabaseConfigured) {
      mockProjects = mockProjects.map((p) =>
        p.id === id ? { ...p, ...patch, updated_at: new Date().toISOString() } : p,
      )
      const updated = mockProjects.find((p) => p.id === id)!
      return new Promise((resolve) => setTimeout(() => resolve(updated), 400))
    }

    const { data, error } = await supabase
      .from('projects')
      .update({
        ...patch,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[projectService.updateProject] Error:', error)
      throw new Error(error.message)
    }

    return data as Project
  },

  /**
   * Delete a project by ID.
   */
  async deleteProject(id: string): Promise<void> {
    if (!isSupabaseConfigured) {
      mockProjects = mockProjects.filter((p) => p.id !== id)
      return new Promise((resolve) => setTimeout(() => resolve(), 300))
    }

    const { error } = await supabase.from('projects').delete().eq('id', id)

    if (error) {
      console.error('[projectService.deleteProject] Error:', error)
      throw new Error(error.message)
    }
  },
}
