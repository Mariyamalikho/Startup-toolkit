/**
 * ChevronStepperRibbon.tsx
 *
 * Methodology Stepper Ribbon for Startup Toolkit.
 * Renders stages: 1. IDEATION -> 2. EMPATHY MAP -> 3. BUSINESS MODEL CANVAS -> 4. PROTOTYPE -> 5. PITCH DECK
 */

import * as React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useProjectStore } from '@/store/projectStore'
import { Check, Lightbulb, Users, Grid, Layout, FileText, ChevronRight } from 'lucide-react'

export interface StageStep {
  id: string
  number: number
  title: string
  path: string
  icon: React.ElementType
}

interface ChevronStepperRibbonProps {
  currentStageId?: string
  onStageChange?: (stageId: string) => void
  completedStages?: string[]
}

export function ChevronStepperRibbon({
  currentStageId,
  onStageChange,
  completedStages = [],
}: ChevronStepperRibbonProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { activeProject } = useProjectStore()

  const projectId = activeProject?.id || 'demo-proj-1'

  const stages: StageStep[] = [
    {
      id: 'ideation',
      number: 1,
      title: 'IDEATION',
      path: `/workspace/${projectId}`,
      icon: Lightbulb,
    },
    { id: 'empathy', number: 2, title: 'EMPATHY MAP', path: '/empathy-map', icon: Users },
    {
      id: 'bmc',
      number: 3,
      title: 'BUSINESS MODEL CANVAS',
      path: '/business-model-canvas',
      icon: Grid,
    },
    { id: 'prototype', number: 4, title: 'PROTOTYPE', path: '/prototype', icon: Layout },
    { id: 'pitch', number: 5, title: 'PITCH DECK', path: '/pitch-deck', icon: FileText },
  ]

  const getActiveStageId = () => {
    if (currentStageId) return currentStageId
    if (location.pathname.startsWith('/workspace')) return 'ideation'
    if (location.pathname === '/empathy-map') return 'empathy'
    if (location.pathname === '/business-model-canvas') return 'bmc'
    if (location.pathname === '/prototype') return 'prototype'
    if (location.pathname === '/pitch-deck') return 'pitch'
    return 'ideation'
  }

  const activeStageId = getActiveStageId()

  const handleStageClick = (stage: StageStep) => {
    if (onStageChange) onStageChange(stage.id)
    navigate(stage.path)
  }

  return (
    <nav
      aria-label="Startup Methodology Stepper Ribbon"
      className="w-full overflow-x-auto py-1.5 px-1 scrollbar-none"
    >
      <div className="flex items-center min-w-max space-x-1.5 sm:space-x-2">
        {stages.map((stage, index) => {
          const isActive = activeStageId === stage.id
          const isCompleted = completedStages.includes(stage.id)
          const Icon = stage.icon

          return (
            <React.Fragment key={stage.id}>
              <button
                type="button"
                onClick={() => handleStageClick(stage)}
                className={`group relative flex items-center h-9 px-3.5 transition-colors duration-150 cursor-pointer select-none rounded-lg text-xs font-mono uppercase tracking-wider font-bold border ${
                  isActive
                    ? 'bg-sky-400/15 border-sky-400 text-sky-300'
                    : isCompleted
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 hover:border-emerald-400'
                      : 'bg-[#1c222e] border-border/60 text-muted-foreground hover:text-white hover:border-sky-400/50 hover:bg-[#222938]'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span
                    className={`flex items-center justify-center h-5 w-5 rounded text-[11px] font-bold ${
                      isActive
                        ? 'bg-sky-400 text-slate-950 font-extrabold'
                        : isCompleted
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-muted/40 text-muted-foreground group-hover:text-foreground'
                    }`}
                  >
                    {isCompleted ? <Check className="h-3 w-3 stroke-[3]" /> : stage.number}
                  </span>

                  <Icon
                    className={`h-3.5 w-3.5 ${
                      isActive
                        ? 'text-sky-400'
                        : isCompleted
                          ? 'text-emerald-400'
                          : 'text-muted-foreground group-hover:text-sky-300'
                    }`}
                  />

                  <span className="whitespace-nowrap">{stage.title}</span>
                </div>
              </button>

              {index < stages.length - 1 && (
                <ChevronRight className="h-3.5 w-3.5 text-slate-600 shrink-0" />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </nav>
  )
}
