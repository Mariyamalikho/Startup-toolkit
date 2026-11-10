import React, { useState, useMemo } from 'react'
import { useProjectStore } from '@/store/projectStore'
import { useProjectFilter, type SortOption, type StatusFilter } from '@/hooks/useProjectFilter'
import type { Project } from '@/types/database.types'
import {
  Rocket,
  Plus,
  Search,
  Filter,
  Layers,
  CheckCircle2,
  TrendingUp,
  ArrowUpDown,
  RotateCcw,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ProjectGrid } from '@/components/dashboard/ProjectGrid'
import { CreateProjectModal } from '@/components/dashboard/CreateProjectModal'
import { DeleteProjectDialog } from '@/components/dashboard/DeleteProjectDialog'

export function DashboardPage() {
  const { projects, activeProject, loading, fetchUserProjects } = useProjectStore()

  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)

  React.useEffect(() => {
    fetchUserProjects()
  }, [fetchUserProjects])

  const {
    filteredProjects,
    paginatedProjects,
    searchQuery,
    setSearchQuery,
    selectedIndustry,
    setSelectedIndustry,
    selectedStatus,
    setSelectedStatus,
    sortBy,
    setSortBy,
    currentPage,
    totalPages,
    setCurrentPage,
    industries,
    resetFilters,
    hasActiveFilters,
  } = useProjectFilter(projects)

  const averageProgress = useMemo(() => {
    if (projects.length === 0) return 0
    const sum = projects.reduce((acc, p) => acc + (p.progress || 0), 0)
    return Math.round(sum / projects.length)
  }, [projects])

  const activeCount = useMemo(
    () => projects.filter((p) => p.status === 'active').length,
    [projects],
  )

  const completedCount = useMemo(
    () => projects.filter((p) => p.status === 'completed' || (p.progress || 0) >= 100).length,
    [projects],
  )

  const handleOpenDelete = (project: Project) => {
    setProjectToDelete(project)
    setDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-8">
      {/* Top Banner Header & Primary CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div className="space-y-1">
          <p className="font-mono text-xs uppercase tracking-widest text-sky-400 font-semibold">
            Founder Workspace Overview
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Startup Ventures Dashboard
          </h1>
          <p className="text-xs text-muted-foreground">
            Pick a venture to keep working, or start a new one.
          </p>
        </div>

        <Button
          onClick={() => setCreateModalOpen(true)}
          className="bg-sky-400 text-slate-950 hover:bg-sky-300 font-bold px-5 h-10 text-xs rounded-lg"
        >
          <Plus className="mr-2 h-4 w-4 stroke-[2.5]" />
          New Startup Venture
        </Button>
      </div>

      {/* Summary Stat Cards Grid (Computed from real state) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-surface border border-border/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Total Ventures</span>
            <Rocket className="h-4 w-4 text-sky-400" />
          </div>
          <div className="text-2xl font-extrabold text-foreground font-mono">{projects.length}</div>
          <p className="text-[11px] text-muted-foreground">{activeCount} active in workspace</p>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-border/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Selected Venture</span>
            <Layers className="h-4 w-4 text-sky-400" />
          </div>
          <div className="text-base font-extrabold text-foreground truncate font-mono">
            {activeProject?.title || 'None selected'}
          </div>
          <p className="text-[11px] text-sky-400 font-semibold truncate">
            {activeProject?.industry || 'General'}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-border/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Average Completion</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-foreground font-mono">
            {averageProgress}%
          </div>
          <p className="text-[11px] text-muted-foreground">Across {projects.length} ventures</p>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-border/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Validated Ventures</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-foreground font-mono">{completedCount}</div>
          <p className="text-[11px] text-muted-foreground">Completed methodology cycles</p>
        </div>
      </div>

      {/* Search & Filter Controls Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface p-3.5 rounded-xl border border-border/60">
        <div className="flex items-center space-x-2 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search ventures by title or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 text-xs bg-background border-border/60 focus:border-sky-400"
            />
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="px-3 h-10 rounded-lg bg-sky-400/10 border border-sky-400/30 text-sky-400 hover:bg-sky-400/20 text-xs font-semibold flex items-center space-x-1.5 transition-colors shrink-0"
              title="Reset Filters"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end">
          {/* Status Tabs */}
          <div className="flex items-center space-x-1 bg-background p-1 rounded-lg border border-border/60">
            {(['all', 'active', 'archived'] as StatusFilter[]).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold capitalize transition-all ${
                  selectedStatus === st
                    ? 'bg-sky-400 text-slate-950'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Industry Dropdown */}
          <div className="flex items-center space-x-1.5 bg-background border border-border/60 px-2.5 rounded-lg">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="h-10 bg-transparent text-xs font-semibold text-foreground focus:outline-none cursor-pointer pr-1"
            >
              <option value="all" className="bg-surface">
                All Industries
              </option>
              {industries.map((ind) => (
                <option key={ind} value={ind} className="bg-surface">
                  {ind}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-1.5 bg-background border border-border/60 px-2.5 rounded-lg">
            <ArrowUpDown className="h-3.5 w-3.5 text-sky-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="h-10 bg-transparent text-xs font-semibold text-foreground focus:outline-none cursor-pointer pr-1"
            >
              <option value="newest" className="bg-surface">
                Sort: Newest
              </option>
              <option value="oldest" className="bg-surface">
                Sort: Oldest
              </option>
              <option value="title" className="bg-surface">
                Sort: Title (A-Z)
              </option>
              <option value="progress" className="bg-surface">
                Sort: Progress
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Project Grid & List View Toggle Component */}
      <ProjectGrid
        projects={paginatedProjects}
        totalCount={filteredProjects.length}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        isLoading={loading}
        onCreateProject={() => setCreateModalOpen(true)}
        onDeleteProject={handleOpenDelete}
      />

      {/* Create Project Modal */}
      <CreateProjectModal open={createModalOpen} onOpenChange={setCreateModalOpen} />

      {/* Delete Project Dialog */}
      <DeleteProjectDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        project={projectToDelete}
      />
    </div>
  )
}
