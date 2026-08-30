/**
 * ProjectListItem.tsx
 *
 * 1:1 Pixel-Perfect List View Row Item Component for Founder Projects.
 * Compact table row representation with active venture status, industry badge,
 * last modified timestamp, progress percentage bar, and direct action triggers.
 */

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useProjectStore } from '@/store/projectStore'
import type { Project } from '@/types/database.types'
import { Layers, ArrowRight, Clock, Tag, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface ProjectListItemProps {
  project: Project
  onEdit?: (project: Project) => void
  onDelete?: (project: Project) => void
}

export function ProjectListItem({ project, onEdit }: ProjectListItemProps) {
  const navigate = useNavigate()
  const { activeProject, setActiveProject } = useProjectStore()

  const isActive = activeProject?.id === project.id

  const handleOpenProject = (e: React.MouseEvent) => {
    e.stopPropagation()
    setActiveProject(project)
    navigate(`/workspace/${project.id}`)
  }

  const formattedDate = React.useMemo(() => {
    if (!project.updated_at) return 'Recently'
    return new Date(project.updated_at).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }, [project.updated_at])

  return (
    <div
      onClick={handleOpenProject}
      className={`group cursor-pointer p-4 rounded-xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        isActive
          ? 'bg-sky-400/10 border-sky-400/70 text-white shadow-md'
          : 'bg-[#181d27] border-border/60 hover:bg-[#1c222e] hover:border-sky-400/40'
      }`}
    >
      {/* Title & Active Badge */}
      <div className="flex items-center space-x-3 min-w-0 flex-1">
        <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
          isActive ? 'bg-sky-400 text-slate-950 font-bold' : 'bg-muted/40 text-muted-foreground'
        }`}>
          <Layers className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors truncate">
              {project.title}
            </h4>
            {isActive && (
              <span className="px-2 py-0.5 rounded-full bg-sky-400/20 text-sky-300 font-mono text-[10px] font-bold uppercase">
                Active
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {project.description || 'No description set'}
          </p>
        </div>
      </div>

      {/* Industry & Date Badge */}
      <div className="flex items-center space-x-6 text-xs text-muted-foreground shrink-0">
        <span className="hidden md:inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-[#12161f] border border-border/40 font-mono text-[11px]">
          <Tag className="h-3 w-3 text-sky-400" />
          <span>{project.industry || 'Tech'}</span>
        </span>

        <div className="flex items-center space-x-1 text-slate-400">
          <Clock className="h-3.5 w-3.5 text-slate-500" />
          <span className="font-mono text-[11px]">{formattedDate}</span>
        </div>

        <Button
          size="sm"
          onClick={handleOpenProject}
          className="bg-sky-400 text-slate-950 hover:bg-sky-300 font-bold text-xs h-8 px-3 rounded-lg"
        >
          <span>Open</span>
          <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </Button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onEdit && onEdit(project)
          }}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-white hover:bg-muted/40"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
