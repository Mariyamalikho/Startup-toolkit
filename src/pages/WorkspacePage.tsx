import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProjectStore } from '@/store/projectStore'
import { WorkspaceHeader } from '@/components/workspace/WorkspaceHeader'
import { ChevronStepperRibbon } from '@/components/navigation/ChevronStepperRibbon'
import { EmpathyMapCanvas } from '@/components/workspace/EmpathyMapCanvas'
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

      {/* ── Interactive Empathy Map Canvas ──────────────────────────── */}
      <EmpathyMapCanvas project={project} />
    </div>
  )
}
