/**
 * WorkspaceHeader.tsx
 *
 * 1:1 Pixel-Perfect Workspace Header Banner Component for Startup Toolkit.
 * Displays active venture title, industry badge, last autosaved status,
 * methodology progress percentage bar, and quick export/share action triggers.
 */

import React, { useState } from 'react'
import { type Project } from '@/types/database.types'
import {
  Layers,
  Tag,
  CheckCircle2,
  Share2,
  Download,
  Settings,
  ArrowLeft,
  TrendingUp,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Link } from 'react-router-dom'
import { AIGeneratorModal } from '@/components/tools/AIGeneratorModal'

interface WorkspaceHeaderProps {
  project: Project
  onExport?: () => void
  onShare?: () => void
  onSettings?: () => void
}

export function WorkspaceHeader({
  project,
  onExport,
  onShare,
  onSettings,
}: WorkspaceHeaderProps) {
  const [aiModalOpen, setAiModalOpen] = useState(false)
  const progress = project.progress || 35

  const formattedDate = React.useMemo(() => {
    if (!project.updated_at) return 'Just now'
    return new Date(project.updated_at).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }, [project.updated_at])

  return (
    <div className="bg-[#181d27] border border-border/60 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Top Navigation & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        {/* Left Title & Status */}
        <div className="flex items-start space-x-3 min-w-0 flex-1">
          <Link to="/dashboard">
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-2.5 border-border/60 text-muted-foreground hover:text-white shrink-0"
              title="Back to Dashboard"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>

          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-sky-400/10 border border-sky-400/30 text-sky-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                <Layers className="h-3 w-3" />
                <span>Active Venture Workspace</span>
              </span>

              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-[#12161f] border border-border/40 text-muted-foreground font-mono text-[10px]">
                <Tag className="h-2.5 w-2.5 text-sky-400" />
                <span>{project.industry || 'Tech'}</span>
              </span>

              <div className="inline-flex items-center space-x-1 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">
                <CheckCircle2 className="h-3 w-3" />
                <span>Autosaved at {formattedDate}</span>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight truncate">
              {project.title}
            </h1>
          </div>
        </div>

        {/* Right Action Triggers */}
        <div className="flex items-center space-x-2 shrink-0">
          <Button
            size="sm"
            onClick={() => setAiModalOpen(true)}
            className="h-9 px-3.5 text-xs font-extrabold bg-sky-400 text-slate-950 hover:bg-sky-300 shadow-md shadow-sky-500/20"
          >
            <Zap className="mr-1.5 h-3.5 w-3.5 fill-slate-950" />
            AI Co-Pilot
          </Button>

          {onShare && (
            <Button
              variant="outline"
              size="sm"
              onClick={onShare}
              className="h-9 px-3 text-xs font-semibold border-border/60 hover:bg-muted/20"
            >
              <Share2 className="mr-1.5 h-3.5 w-3.5" />
              Share
            </Button>
          )}

          {onExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="h-9 px-3 text-xs font-semibold border-border/60 hover:bg-muted/20"
            >
              <Download className="mr-1.5 h-3.5 w-3.5 text-sky-400" />
              Export Pitch
            </Button>
          )}

          {onSettings && (
            <Button
              variant="outline"
              size="sm"
              onClick={onSettings}
              className="h-9 w-9 p-0 border-border/60 hover:bg-muted/20 text-muted-foreground hover:text-white"
              title="Venture Settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* AI Generator Modal Trigger */}
      <AIGeneratorModal
        open={aiModalOpen}
        onOpenChange={setAiModalOpen}
        project={project}
      />

      {/* Description & Progress Bar Footer */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <p className="text-muted-foreground line-clamp-1 flex-1">
          {project.description || 'No description set. Edit venture details in settings to add founder goals.'}
        </p>

        {/* Methodology Progress Bar */}
        <div className="flex items-center space-x-3 sm:w-72 shrink-0">
          <div className="flex items-center space-x-1.5 text-muted-foreground font-mono text-[11px] shrink-0">
            <TrendingUp className="h-3.5 w-3.5 text-sky-400" />
            <span>Score:</span>
            <span className="font-bold text-sky-400">{progress}%</span>
          </div>

          <div className="flex-1 h-2 rounded-full bg-[#12161f] overflow-hidden border border-border/40">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
