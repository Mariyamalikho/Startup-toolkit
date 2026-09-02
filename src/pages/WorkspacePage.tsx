import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProjectStore } from '@/store/projectStore'
import { WorkspaceHeader } from '@/components/workspace/WorkspaceHeader'
import { ChevronStepperRibbon } from '@/components/navigation/ChevronStepperRibbon'
import { EmpathyMapCanvas } from '@/components/workspace/EmpathyMapCanvas'
import { BusinessModelCanvas } from '@/components/workspace/BusinessModelCanvas'
import { Heart, Grid } from 'lucide-react'
import { EmptyError } from '@/components/ui/EmptyState'

export function WorkspacePage() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const { projects, activeProject, setActiveProject } = useProjectStore()
  const [activeTab, setActiveTab] = useState<'empathy' | 'canvas'>('empathy')

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

      {/* ── Interlocking Chevron Stage Stepper Ribbon & Tab Switcher ─ */}
      <div className="bg-[#181d27]/60 border border-border/40 p-3 rounded-2xl backdrop-blur shadow-sm space-y-3">
        <ChevronStepperRibbon />

        {/* Tab Buttons */}
        <div className="flex items-center space-x-2 border-t border-border/40 pt-3">
          <button
            type="button"
            onClick={() => setActiveTab('empathy')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
              activeTab === 'empathy'
                ? 'bg-sky-400 text-slate-950 shadow-md shadow-sky-500/20'
                : 'bg-[#1c222e] text-muted-foreground hover:text-white'
            }`}
          >
            <Heart className="h-3.5 w-3.5" />
            <span>Empathy Map</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('canvas')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
              activeTab === 'canvas'
                ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-[#1c222e] text-muted-foreground hover:text-white'
            }`}
          >
            <Grid className="h-3.5 w-3.5" />
            <span>Business Model Canvas (9-Box)</span>
          </button>
        </div>
      </div>

      {/* ── Active Methodology Canvas Tool ──────────────────────────── */}
      {activeTab === 'empathy' ? (
        <EmpathyMapCanvas project={project} />
      ) : (
        <BusinessModelCanvas project={project} />
      )}
    </div>
  )
}
