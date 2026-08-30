/**
 * useProjectFilter.ts
 *
 * Custom React hook for client-side searching, industry filtering,
 * status filtering, and multi-criteria sorting of founder projects.
 */

import { useState, useMemo, useCallback } from 'react'
import type { Project, ProjectStatus } from '@/types/database.types'

export type SortOption = 'newest' | 'oldest' | 'title' | 'progress'
export type StatusFilter = 'all' | ProjectStatus

export interface UseProjectFilterOptions {
  initialSearch?: string
  initialIndustry?: string
  initialStatus?: StatusFilter
  initialSortBy?: SortOption
}

export function useProjectFilter(
  projects: Project[],
  options: UseProjectFilterOptions = {},
) {
  const [searchQuery, setSearchQuery] = useState(options.initialSearch || '')
  const [selectedIndustry, setSelectedIndustry] = useState(options.initialIndustry || 'all')
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>(options.initialStatus || 'all')
  const [sortBy, setSortBy] = useState<SortOption>(options.initialSortBy || 'newest')

  // Extract unique industry list from projects collection
  const industries = useMemo(() => {
    const set = new Set<string>()
    projects.forEach((p) => {
      if (p.industry) set.add(p.industry)
    })
    return Array.from(set).sort()
  }, [projects])

  // Filter and sort projects based on active criteria
  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        // Search query matching (title or description)
        const matchesQuery =
          !searchQuery.trim() ||
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))

        // Industry matching
        const matchesIndustry =
          selectedIndustry === 'all' ||
          (p.industry && p.industry.toLowerCase() === selectedIndustry.toLowerCase())

        // Status matching
        const matchesStatus =
          selectedStatus === 'all' || (p.status && p.status === selectedStatus)

        return matchesQuery && matchesIndustry && matchesStatus
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime()
        }
        if (sortBy === 'oldest') {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title)
        }
        if (sortBy === 'progress') {
          return (b.progress || 0) - (a.progress || 0)
        }
        return 0
      })
  }, [projects, searchQuery, selectedIndustry, selectedStatus, sortBy])

  const resetFilters = useCallback(() => {
    setSearchQuery('')
    setSelectedIndustry('all')
    setSelectedStatus('all')
    setSortBy('newest')
  }, [])

  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery.trim() !== '' ||
      selectedIndustry !== 'all' ||
      selectedStatus !== 'all' ||
      sortBy !== 'newest'
    )
  }, [searchQuery, selectedIndustry, selectedStatus, sortBy])

  return {
    filteredProjects,
    searchQuery,
    setSearchQuery,
    selectedIndustry,
    setSelectedIndustry,
    selectedStatus,
    setSelectedStatus,
    sortBy,
    setSortBy,
    industries,
    resetFilters,
    hasActiveFilters,
  }
}
