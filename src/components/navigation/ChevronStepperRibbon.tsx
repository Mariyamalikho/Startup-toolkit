/**
 * ChevronStepperRibbon.tsx
 *
 * The one place workspace stages are listed. Rendered at the top of the
 * workspace and pitch deck pages; the URL decides which stage is active.
 */

import { useLocation, useNavigate } from 'react-router-dom'
import { useProjectStore } from '@/store/projectStore'
import { STAGES, stageFromPath, type StageId } from '@/lib/stages'
import { cn } from '@/lib/utils'

interface ChevronStepperRibbonProps {
  /** Overrides the URL-derived stage, e.g. for static previews. */
  currentStageId?: StageId
  /** Renders a non-interactive preview (used on the landing page). */
  preview?: boolean
}

export function ChevronStepperRibbon({
  currentStageId,
  preview = false,
}: ChevronStepperRibbonProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { activeProject } = useProjectStore()

  const projectId = activeProject?.id || 'demo-proj-1'
  const activeId = currentStageId ?? stageFromPath(location.pathname)
  const activeIndex = STAGES.findIndex((s) => s.id === activeId)

  return (
    <nav aria-label="Workspace stages" className="w-full overflow-x-auto scrollbar-none">
      <ol className="flex min-w-max border-b border-border/60">
        {STAGES.map((stage, index) => {
          const isActive = stage.id === activeId
          const isDone = index < activeIndex
          const Icon = stage.icon

          return (
            <li key={stage.id}>
              <button
                type="button"
                disabled={preview}
                onClick={() => navigate(stage.path(projectId))}
                aria-current={isActive ? 'step' : undefined}
                className={cn(
                  '-mb-px flex items-center gap-2 h-10 px-4 border-b-2 text-xs font-semibold whitespace-nowrap transition-colors',
                  isActive
                    ? 'border-sky-400 text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground',
                  preview && 'cursor-default',
                )}
              >
                <span
                  className={cn(
                    'font-mono text-[11px]',
                    isActive
                      ? 'text-sky-400'
                      : isDone
                        ? 'text-emerald-400'
                        : 'text-muted-foreground/70',
                  )}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <Icon className="h-3.5 w-3.5" />
                <span>{stage.label}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
