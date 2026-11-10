/**
 * ToolNavigationFooter.tsx
 *
 * Previous / next controls at the bottom of each workspace tool.
 */

import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { STAGES, type StageId } from '@/lib/stages'

interface ToolNavigationFooterProps {
  activeStage: StageId
  projectId: string
}

export function ToolNavigationFooter({ activeStage, projectId }: ToolNavigationFooterProps) {
  const navigate = useNavigate()
  const index = STAGES.findIndex((s) => s.id === activeStage)
  const prev = index > 0 ? STAGES[index - 1] : null
  const next = index < STAGES.length - 1 ? STAGES[index + 1] : null

  return (
    <div className="flex items-center justify-between gap-3 pt-2">
      {prev ? (
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigate(prev.path(projectId))}
          className="h-9 px-3 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
          {prev.label}
        </Button>
      ) : (
        <span />
      )}

      {next && (
        <Button
          type="button"
          onClick={() => navigate(next.path(projectId))}
          className="h-9 px-4 text-xs font-bold bg-sky-400 text-slate-950 hover:bg-sky-300 rounded-lg"
        >
          {next.label}
          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  )
}
