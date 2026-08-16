/**
 * projectStore.ts
 *
 * Global state store for Startup Toolkit projects built with Zustand.
 * Manages active project selection, project collections, loading states,
 * and client-side CRUD operations.
 */

import { create } from 'zustand'
import type { Project } from '@/types/database.types'

interface ProjectState {
  projects: Project[]
  activeProject: Project | null
  loading: boolean
  error: string | null

  // Actions
  setProjects: (projects: Project[]) => void
  setActiveProject: (project: Project | null) => void
  addProject: (project: Project) => void
  updateProject: (id: string, patch: Partial<Omit<Project, 'id'>>) => void
  deleteProject: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
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

export const useProjectStore = create<ProjectState>((set) => ({
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
}))
