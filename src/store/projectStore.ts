/**
 * projectStore.ts
 *
 * Global state store for Startup Toolkit projects built with Zustand.
 * Manages active project selection, project collections, loading states,
 * and async sync actions with Supabase via projectService.
 */

import { create } from 'zustand'
import type { Project } from '@/types/database.types'
import { projectService, type CreateProjectInput, type UpdateProjectInput } from '@/services/projectService'
import { toastStore } from '@/store/toastStore'

interface ProjectState {
  projects: Project[]
  activeProject: Project | null
  loading: boolean
  error: string | null

  // Synchronous State Mutations
  setProjects: (projects: Project[]) => void
  setActiveProject: (project: Project | null) => void
  addProject: (project: Project) => void
  updateProject: (id: string, patch: Partial<Omit<Project, 'id'>>) => void
  deleteProject: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void

  // Async Database Sync Actions (Supabase + projectService)
  fetchUserProjects: () => Promise<Project[]>
  createNewProject: (input: CreateProjectInput) => Promise<Project | null>
  updateUserProject: (id: string, patch: UpdateProjectInput) => Promise<Project | null>
  deleteUserProject: (id: string) => Promise<boolean>
}

const initialProjects: Project[] = [
  {
    id: 'demo-proj-1',
    user_id: 'demo-user',
    title: 'EcoPack Innovation',
    description: 'Biodegradable packaging startup for local food delivery services.',
    industry: 'Sustainability',
    status: 'active',
    progress: 45,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-proj-2',
    user_id: 'demo-user',
    title: 'DevPulse AI',
    description: 'Automated code quality and pull request review assistant for startup teams.',
    industry: 'Developer Tools',
    status: 'active',
    progress: 80,
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: initialProjects,
  activeProject: initialProjects[0],
  loading: false,
  error: null,

  setProjects: (projects) => set({ projects }),

  setActiveProject: (activeProject) => set({ activeProject }),

  addProject: (newProject) =>
    set((state) => ({
      projects: [newProject, ...state.projects],
      activeProject: newProject,
    })),

  updateProject: (id, patch) =>
    set((state) => {
      const updatedProjects = state.projects.map((p) =>
        p.id === id ? { ...p, ...patch, updated_at: new Date().toISOString() } : p,
      )
      const updatedActive =
        state.activeProject?.id === id
          ? { ...state.activeProject, ...patch, updated_at: new Date().toISOString() }
          : state.activeProject

      return {
        projects: updatedProjects,
        activeProject: updatedActive as Project | null,
      }
    }),

  deleteProject: (id) =>
    set((state) => {
      const filtered = state.projects.filter((p) => p.id !== id)
      const nextActive =
        state.activeProject?.id === id ? (filtered.length > 0 ? filtered[0] : null) : state.activeProject
      return {
        projects: filtered,
        activeProject: nextActive,
      }
    }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  reset: () =>
    set({
      projects: initialProjects,
      activeProject: initialProjects[0],
      loading: false,
      error: null,
    }),

  // ─── Async Database Actions ────────────────────────────────────────────────

  fetchUserProjects: async () => {
    set({ loading: true, error: null })
    try {
      const fetchedProjects = await projectService.fetchProjects()
      set({
        projects: fetchedProjects,
        activeProject: fetchedProjects.length > 0 ? fetchedProjects[0] : null,
        loading: false,
      })
      return fetchedProjects
    } catch (err: any) {
      const errMsg = err?.message || 'Failed to fetch projects from database.'
      set({ error: errMsg, loading: false })
      toastStore.add({
        variant: 'error',
        title: 'Database Fetch Error',
        description: errMsg,
      })
      return []
    }
  },

  createNewProject: async (input: CreateProjectInput) => {
    set({ loading: true, error: null })
    try {
      const created = await projectService.createProject(input)
      set((state) => ({
        projects: [created, ...state.projects],
        activeProject: created,
        loading: false,
      }))
      toastStore.add({
        variant: 'success',
        title: 'Project Created',
        description: `Successfully initialized "${created.title}".`,
      })
      return created
    } catch (err: any) {
      const errMsg = err?.message || 'Failed to create new project.'
      set({ error: errMsg, loading: false })
      toastStore.add({
        variant: 'error',
        title: 'Project Creation Failed',
        description: errMsg,
      })
      return null
    }
  },

  updateUserProject: async (id: string, patch: UpdateProjectInput) => {
    // Optimistic local update
    const previousProjects = get().projects
    const previousActive = get().activeProject

    get().updateProject(id, patch)

    try {
      const updated = await projectService.updateProject(id, patch)
      set({ error: null })
      return updated
    } catch (err: any) {
      // Rollback on error
      set({ projects: previousProjects, activeProject: previousActive, error: err?.message })
      toastStore.add({
        variant: 'error',
        title: 'Update Sync Error',
        description: err?.message || 'Could not save changes to database.',
      })
      return null
    }
  },

  deleteUserProject: async (id: string) => {
    const previousProjects = get().projects
    const previousActive = get().activeProject

    get().deleteProject(id)

    try {
      await projectService.deleteProject(id)
      toastStore.add({
        variant: 'info',
        title: 'Project Deleted',
        description: 'Project was removed from your workspace.',
      })
      return true
    } catch (err: any) {
      // Rollback on error
      set({ projects: previousProjects, activeProject: previousActive, error: err?.message })
      toastStore.add({
        variant: 'error',
        title: 'Deletion Failed',
        description: err?.message || 'Could not delete project from database.',
      })
      return false
    }
  },
}))
