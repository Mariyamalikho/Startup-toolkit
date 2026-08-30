/**
 * ProjectGrid.tsx
 *
 * Project Grid & List Container Component for Founder Workspace Dashboard.
 * Provides toggle buttons (LayoutGrid / List), search/filter state handling,
 * and empty state fallbacks.
 */

import React from 'react'
import type { Project } from '@/types/database.types'
import { LayoutGrid, List } from 'lucide-react'
import { ProjectCard } from './ProjectCard'
import { ProjectListItem } from './ProjectListItem'
import { EmptyProjects } from '@/components/ui/EmptyState'

interface ProjectGridProps {
  projects: Project[]
  isLoading?: boolean
  onCreateProject?: () => void
  onEditProject?: (project: Project) => void
  onDeleteProject?: (project: Project) => void
}

export function ProjectGrid({
  projects,
  isLoading,
  onCreateProject,
  onEditProject,
  onDeleteProject,
}: ProjectGridProps) {
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid')

  if (projects.length === 0 && !isLoading) {
    return <EmptyProjects onCreateProject={() => onCreateProject && onCreateProject()} />
  }

  return (
    <div className="space-y-4">
      {/* View Toggle Toolbar Header */}
      <div className="flex items-center justify-between border-b border-border/40 pb-3">
        <div className="flex items-center space-x-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Venture Projects ({projects.length})
          </h2>
        </div>

        {/* View Mode Toggle Controls */}
        <div className="flex items-center space-x-1.5 bg-[#181d27] p-1 rounded-xl border border-border/60">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              viewMode === 'grid'
                ? 'bg-sky-400 text-slate-950 shadow-sm font-bold'
                : 'text-muted-foreground hover:text-white hover:bg-muted/20'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden sm:inline">Grid</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              viewMode === 'list'
                ? 'bg-sky-400 text-slate-950 shadow-sm font-bold'
                : 'text-muted-foreground hover:text-white hover:bg-muted/20'
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
    </div>
  )
}
