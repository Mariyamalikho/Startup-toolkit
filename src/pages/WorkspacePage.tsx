/**
 * WorkspacePage.tsx
 *
 * Central methodology workspace page for Startup Toolkit.
 * Integrates WorkspaceHeader, ChevronStepperRibbon stage navigator,
 * and interactive canvas quadrant tools.
 */

import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProjectStore } from '@/store/projectStore'
import { WorkspaceHeader } from '@/components/workspace/WorkspaceHeader'
import { ChevronStepperRibbon } from '@/components/navigation/ChevronStepperRibbon'
import { Kanban, Lightbulb, CheckCircle2 } from 'lucide-react'
import { EmptyError } from '@/components/ui/EmptyState'

export function WorkspacePage() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const { projects, activeProject, setActiveProject } = useProjectStore()

  // Find project by param or fallback to active project
  const project = React.useMemo(() => {
    if (!projectId) return activeProject || projects[0]
    return projects.find((p) => p.id === projectId) || activeProject || projects[0]
  }, [projectId, projects, activeProject])

  useEffect(() => {
    if (project && activeProject?.id !== project.id) {
      setActiveProject(project)
    }
  }, [project, activeProject])

  if (!project) {
    return (
      <EmptyError
        message="Workspace venture not found. Select a venture from your dashboard."
        onRetry={() => navigate('/dashboard')}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* ── Active Workspace Header Banner ──────────────────────────── */}
      <WorkspaceHeader
        project={project}
        onExport={() => navigate('/pitch-deck')}
        onShare={() => alert(`Share link: ${window.location.href}`)}
      />

      {/* ── Interlocking Chevron Stage Stepper Ribbon ───────────────── */}
      <div className="bg-[#181d27]/60 border border-border/40 p-2.5 rounded-2xl backdrop-blur shadow-sm">
        <ChevronStepperRibbon />
      </div>

      {/* ── Workspace Quadrant Canvases ─────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quadrant 1: Problem Statement */}
        <div className="p-6 rounded-2xl bg-[#181d27] border border-border/40 space-y-4">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <span className="font-mono text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              1. Problem & Customer Friction
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Autosaving
            </span>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Identify the primary pain points, high friction moments, and inefficient workflows your target customers face today.
          </p>

          <textarea
            placeholder="Type key customer friction points here..."
            defaultValue={project.description || ''}
            rows={4}
            className="w-full bg-[#1c222e] border border-border/60 rounded-xl p-3 text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-sky-400 resize-none"
          />
        </div>

        {/* Quadrant 2: Value Proposition & Solution */}
        <div className="p-6 rounded-2xl bg-[#181d27] border border-border/40 space-y-4">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <span className="font-mono text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
              <Kanban className="h-4 w-4" />
              2. Value Proposition & Solution
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Autosaving
            </span>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Define your unique solution, unfair advantages, and primary value prop features that solve customer pain points.
          </p>

          <textarea
            placeholder="Type solution features and value proposition here..."
            rows={4}
            className="w-full bg-[#1c222e] border border-border/60 rounded-xl p-3 text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-sky-400 resize-none"
          />
        </div>
      </div>
    </div>
  )
}
