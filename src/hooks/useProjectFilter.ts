/**
 * useProjectFilter.ts
 *
 * Custom React hook for client-side searching with 250ms input debouncing,
 * industry filtering, status filtering, multi-criteria sorting, and pagination.
 */

import { useState, useEffect, useMemo, useCallback } from 'react'
import type { Project, ProjectStatus } from '@/types/database.types'

export type SortOption = 'newest' | 'oldest' | 'title' | 'progress'
export type StatusFilter = 'all' | ProjectStatus

export interface UseProjectFilterOptions {
  initialSearch?: string
  initialIndustry?: string
  initialStatus?: StatusFilter
  initialSortBy?: SortOption
  pageSize?: number
}

export function useProjectFilter(projects: Project[], options: UseProjectFilterOptions = {}) {
  const pageSize = options.pageSize || 6
  const [searchQuery, setSearchQuery] = useState(options.initialSearch || '')
  const [debouncedQuery, setDebouncedQuery] = useState(options.initialSearch || '')
  const [selectedIndustry, setSelectedIndustry] = useState(options.initialIndustry || 'all')
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>(options.initialStatus || 'all')
  const [sortBy, setSortBy] = useState<SortOption>(options.initialSortBy || 'newest')
  const [currentPage, setCurrentPage] = useState(1)

  // Debounce search query by 250ms to avoid re-filtering on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
      setCurrentPage(1)
    }, 250)
    return () => clearTimeout(timer)
  }, [searchQuery])

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
    const normalizedQuery = debouncedQuery.trim().toLowerCase()

    return projects
      .filter((p) => {
        const matchesQuery =
          !normalizedQuery ||
          p.title.toLowerCase().includes(normalizedQuery) ||
          (p.description && p.description.toLowerCase().includes(normalizedQuery))

        const matchesIndustry =
          selectedIndustry === 'all' ||
          (p.industry && p.industry.toLowerCase() === selectedIndustry.toLowerCase())

        const matchesStatus = selectedStatus === 'all' || (p.status && p.status === selectedStatus)

        return matchesQuery && matchesIndustry && matchesStatus
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return (
            new Date(b.updated_at || b.created_at).getTime() -
            new Date(a.updated_at || a.created_at).getTime()
          )
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
  }, [projects, debouncedQuery, selectedIndustry, selectedStatus, sortBy])

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / pageSize))
  const safePage = Math.min(currentPage, totalPages)

  const paginatedProjects = useMemo(() => {
    const startIndex = (safePage - 1) * pageSize
    return filteredProjects.slice(startIndex, startIndex + pageSize)
  }, [filteredProjects, safePage, pageSize])

  const resetFilters = useCallback(() => {
    setSearchQuery('')
    setDebouncedQuery('')
    setSelectedIndustry('all')
    setSelectedStatus('all')
    setSortBy('newest')
    setCurrentPage(1)
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
    paginatedProjects,
    searchQuery,
    setSearchQuery,
    selectedIndustry,
    setSelectedIndustry: (val: string) => {
      setSelectedIndustry(val)
      setCurrentPage(1)
    },
    selectedStatus,
    setSelectedStatus: (val: StatusFilter) => {
      setSelectedStatus(val)
      setCurrentPage(1)
    },
    sortBy,
    setSortBy,
    currentPage: safePage,
    totalPages,
    setCurrentPage,
    industries,
    resetFilters,
    hasActiveFilters,
  }
}
