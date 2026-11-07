/**
 * ProjectCard.tsx
 *
 * Grid View Card Component for Founder Projects.
 * Memoized with React.memo to prevent unnecessary re-renders when sibling state changes.
 */

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useProjectStore } from '@/store/projectStore'
import type { Project } from '@/types/database.types'
import { Layers, ArrowRight, Clock, Tag, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface ProjectCardProps {
  project: Project
  onEdit?: (project: Project) => void
  onDelete?: (project: Project) => void
}

export const ProjectCard = React.memo(function ProjectCard({
  project,
  onDelete,
}: ProjectCardProps) {
  const navigate = useNavigate()
  const { activeProject, setActiveProject } = useProjectStore()

  const isActive = activeProject?.id === project.id

  const handleOpenProject = (e: React.MouseEvent) => {
    e.stopPropagation()
    setActiveProject(project)
    navigate(`/workspace/${project.id}`)
  }

  const progress = project.progress || 0

  const formattedDate = React.useMemo(() => {
    if (!project.updated_at) return 'Recently modified'
    return new Date(project.updated_at).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }, [project.updated_at])

  return (
    <Card
      onClick={handleOpenProject}
      className={`group relative cursor-pointer transition-colors duration-150 bg-surface border p-5 rounded-xl flex flex-col justify-between space-y-4 ${
        isActive
          ? 'border-sky-400 ring-1 ring-sky-400/30'
          : 'border-border/60 hover:border-sky-400/50 hover:bg-surface-hover'
      }`}
    >
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            {isActive ? (
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-sky-400/10 border border-sky-400/30 text-sky-400 font-mono text-[10px] font-bold tracking-wider uppercase">
                <Layers className="h-3 w-3" />
                <span>Active Venture</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-mono text-[10px] font-semibold uppercase">
                <Tag className="h-2.5 w-2.5" />
                <span>{project.industry || 'Tech'}</span>
              </span>
            )}
          </div>

          <h3 className="text-base font-bold text-foreground group-hover:text-sky-400 transition-colors truncate">
            {project.title}
          </h3>
        </div>

        {/* Delete Trigger */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => {
              if (onDelete) onDelete(project)
            }}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Delete Venture"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Description Paragraph */}
      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
        {project.description ||
          'No description provided. Open workspace to configure venture details.'}
      </p>

      {/* Progress Bar & Footer Details */}
      <div className="space-y-3 pt-2 border-t border-border/40">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-muted-foreground">Canvas Progress</span>
            <span className="font-bold text-sky-400">{progress}%</span>
          </div>
          <div className="w-full h-1.5 rounded-sm bg-muted overflow-hidden">
            <div
              className="h-full bg-sky-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground">
          <div className="flex items-center space-x-1.5">
            <Clock className="h-3 w-3" />
            <span>{formattedDate}</span>
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleOpenProject}
            className="text-[11px] font-bold text-sky-400 hover:text-sky-300 hover:bg-sky-400/10 h-7 px-2.5 rounded-md"
          >
            <span>Open</span>
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </div>
    </Card>
  )
})
