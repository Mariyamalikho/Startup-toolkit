/**
 * ProjectCard.tsx
 *
 * 1:1 Pixel-Perfect Grid View Card Component for Founder Projects.
 * Features desaturated dark theme (#181d27), active venture indicator badge,
 * stage progress bar, industry tag, last modified timestamp, and action triggers.
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

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const navigate = useNavigate()
  const { activeProject, setActiveProject } = useProjectStore()

  const isActive = activeProject?.id === project.id

  const handleOpenProject = (e: React.MouseEvent) => {
    e.stopPropagation()
    setActiveProject(project)
    navigate(`/workspace/${project.id}`)
  }

  const progress = project.progress || 25

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
      className={`group relative cursor-pointer transition-all duration-200 bg-[#181d27] border p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:shadow-xl ${
        isActive
          ? 'border-sky-400/80 shadow-[0_0_16px_rgba(56,189,248,0.2)] ring-1 ring-sky-400/40'
          : 'border-border/60 hover:border-sky-400/40 hover:bg-[#1c222e]'
      }`}
    >
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            {isActive ? (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-sky-400/10 border border-sky-400/30 text-sky-400 font-mono text-[10px] font-bold tracking-wider uppercase">
                <Layers className="h-3 w-3" />
                <span>Active Venture</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-muted/30 text-muted-foreground font-mono text-[10px] font-semibold uppercase">
                <Tag className="h-2.5 w-2.5" />
                <span>{project.industry || 'Tech'}</span>
              </span>
            )}
          </div>

          <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors truncate">
            {project.title}
          </h3>
        </div>

        {/* Delete Trigger */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => onDelete && onDelete(project)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Delete Venture"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Description Paragraph */}
      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
        {project.description || 'No description provided. Click to open workspace and add methodology details.'}
      </p>

      {/* Progress Bar & Footer Details */}
      <div className="space-y-3 pt-2 border-t border-border/40">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-muted-foreground">Canvas Progress</span>
            <span className="font-bold text-sky-400">{progress}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#12161f] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground">
          <div className="flex items-center space-x-1.5">
            <Clock className="h-3 w-3 text-slate-500" />
            <span>{formattedDate}</span>
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleOpenProject}
            className="text-[11px] font-bold text-sky-400 hover:text-sky-300 hover:bg-sky-400/10 h-7 px-2.5 rounded-lg group/btn"
          >
            <span>Open</span>
            <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
