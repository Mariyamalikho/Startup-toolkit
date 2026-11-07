/**
 * ProjectGrid.tsx
 *
 * Project Grid & List Container Component for Founder Workspace Dashboard.
 * Provides toggle buttons (LayoutGrid / List), client-side pagination controls,
 * and empty state fallbacks.
 */

import React from 'react'
import type { Project } from '@/types/database.types'
import { LayoutGrid, List, ChevronLeft, ChevronRight } from 'lucide-react'
import { ProjectCard } from './ProjectCard'
import { ProjectListItem } from './ProjectListItem'
import { EmptyProjects } from '@/components/ui/EmptyState'
import { SkeletonCard } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'

interface ProjectGridProps {
  projects: Project[]
  totalCount?: number
  currentPage?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  isLoading?: boolean
  onCreateProject?: () => void
  onEditProject?: (project: Project) => void
  onDeleteProject?: (project: Project) => void
}

export function ProjectGrid({
  projects,
  totalCount,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  isLoading,
  onCreateProject,
  onEditProject,
  onDeleteProject,
}: ProjectGridProps) {
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid')
  const displayTotal = totalCount ?? projects.length

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <EmptyProjects
        onCreateProject={() => {
          if (onCreateProject) onCreateProject()
        }}
      />
    )
  }

  return (
    <div className="space-y-4">
      {/* View Toggle Toolbar Header */}
      <div className="flex items-center justify-between border-b border-border/40 pb-3">
        <div className="flex items-center space-x-2">
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wider font-mono">
            Venture Projects ({displayTotal})
          </h2>
        </div>

        {/* View Mode Toggle Controls */}
        <div className="flex items-center space-x-1 bg-surface p-1 rounded-lg border border-border/60">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              viewMode === 'grid'
                ? 'bg-sky-400 text-slate-950 font-bold'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden sm:inline">Grid</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              viewMode === 'list'
                ? 'bg-sky-400 text-slate-950 font-bold'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
            }`}
            title="List View"
          >
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">List</span>
          </button>
        </div>
      </div>

      {/* Rendered View Content */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={onEditProject}
              onDelete={onDeleteProject}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <ProjectListItem
              key={project.id}
              project={project}
              onEdit={onEditProject}
              onDelete={onDeleteProject}
            />
          ))}
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-between pt-4 border-t border-border/40 text-xs text-muted-foreground">
          <span className="font-mono">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="h-8 px-3 text-xs"
            >
              <ChevronLeft className="h-3.5 w-3.5 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="h-8 px-3 text-xs"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
