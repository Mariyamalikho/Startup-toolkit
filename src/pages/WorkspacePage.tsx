import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useProjectStore } from '@/store/projectStore'
import { WorkspaceHeader } from '@/components/workspace/WorkspaceHeader'
import { ChevronStepperRibbon } from '@/components/navigation/ChevronStepperRibbon'
import { EmpathyMapCanvas } from '@/components/workspace/EmpathyMapCanvas'
import { BusinessModelCanvas } from '@/components/workspace/BusinessModelCanvas'
import { BrainstormBoard } from '@/components/workspace/BrainstormBoard'
import { ExperimentTracker } from '@/components/workspace/ExperimentTracker'
import { MilestoneTimeline } from '@/components/workspace/MilestoneTimeline'
import { PrintableReportModal } from '@/components/export/PrintableReportModal'
import { ToolNavigationFooter } from '@/components/workspace/ToolNavigationFooter'
import { EmptyError } from '@/components/ui/EmptyState'
import { stageFromPath } from '@/lib/stages'

export function WorkspacePage() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { projects, activeProject, setActiveProject } = useProjectStore()
  const [isPrintReportOpen, setIsPrintReportOpen] = useState(false)

  // The URL is the single source of truth for the active tool.
  const activeStage = stageFromPath(location.pathname)

  const project = React.useMemo(() => {
    if (!projectId) return activeProject || projects[0]
    return projects.find((p) => p.id === projectId) || activeProject || projects[0]
  }, [projectId, projects, activeProject])

  useEffect(() => {
    if (project && activeProject?.id !== project.id) {
      setActiveProject(project)
    }
  }, [project, activeProject, setActiveProject])

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
      <WorkspaceHeader
        project={project}
        onExport={() => setIsPrintReportOpen(true)}
        onShare={() => alert(`Share link: ${window.location.href}`)}
      />

      <PrintableReportModal
        open={isPrintReportOpen}
        onOpenChange={setIsPrintReportOpen}
        project={project}
      />

      <ChevronStepperRibbon />

      {activeStage === 'empathy' ? (
        <EmpathyMapCanvas project={project} />
      ) : activeStage === 'canvas' ? (
        <BusinessModelCanvas project={project} />
      ) : activeStage === 'experiments' ? (
        <ExperimentTracker project={project} />
      ) : activeStage === 'roadmap' ? (
        <MilestoneTimeline project={project} />
      ) : (
        <BrainstormBoard project={project} />
      )}

      <ToolNavigationFooter activeStage={activeStage} projectId={project.id} />
    </div>
  )
}
