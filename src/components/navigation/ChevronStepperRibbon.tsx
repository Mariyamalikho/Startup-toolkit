/**
 * ChevronStepperRibbon.tsx
 *
 * 1:1 Pixel-Perfect Interlocking Chevron Stepper Ribbon for Startup Toolkit.
 * Renders stages: 1. IDEATION -> 2. EMPATHY MAP -> 3. BUSINESS MODEL CANVAS -> 4. PROTOTYPE -> 5. PITCH DECK
 * Features glowing cyan active borders (border-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.3)]),
 * interlocking chevron polygon styling, stage completion checkmarks, and route navigation triggers.
 */

import * as React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useProjectStore } from '@/store/projectStore'
import { Check, Lightbulb, Users, Grid, Layout, FileText } from 'lucide-react'

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

  const projectId = activeProject?.id || 'default'

  const stages: StageStep[] = [
    { id: 'ideation', number: 1, title: 'IDEATION', path: `/workspace/${projectId}`, icon: Lightbulb },
    { id: 'empathy', number: 2, title: 'EMPATHY MAP', path: '/empathy-map', icon: Users },
    { id: 'bmc', number: 3, title: 'BUSINESS MODEL CANVAS', path: '/business-model-canvas', icon: Grid },
    { id: 'prototype', number: 4, title: 'PROTOTYPE', path: '/prototype', icon: Layout },
    { id: 'pitch', number: 5, title: 'PITCH DECK', path: '/pitch-deck', icon: FileText },
  ]

  // Determine active stage based on current location route
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
    <nav aria-label="Startup Methodology Stepper Ribbon" className="w-full overflow-x-auto py-2 px-1 scrollbar-none">
      <div className="flex items-center min-w-max space-x-1.5 sm:space-x-2">
        {stages.map((stage, index) => {
          const isActive = activeStageId === stage.id
          const isCompleted = completedStages.includes(stage.id)
          const Icon = stage.icon

          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => handleStageClick(stage)}
              className={`group relative flex items-center h-10 px-4 transition-all duration-200 cursor-pointer select-none rounded-xl text-xs font-mono uppercase tracking-wider font-bold border ${
                isActive
                  ? 'bg-sky-400/15 border-sky-400 text-sky-300 shadow-[0_0_14px_rgba(56,189,248,0.35)] ring-1 ring-sky-400/50'
                  : isCompleted
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 hover:border-emerald-400'
                  : 'bg-[#1c222e] border-border/60 text-muted-foreground hover:text-white hover:border-sky-400/50 hover:bg-[#222938]'
              }`}
            >
              {/* Step Number & Icon */}
              <div className="flex items-center space-x-2">
                <span
                  className={`flex items-center justify-center h-5 w-5 rounded-md text-[11px] font-bold ${
                    isActive
                      ? 'bg-sky-400 text-slate-950 font-extrabold shadow-sm'
                      : isCompleted
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-muted/40 text-muted-foreground group-hover:text-foreground'
                  }`}
                >
                  {isCompleted ? <Check className="h-3 w-3 stroke-[3]" /> : stage.number}
                </span>

                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-sky-400' : isCompleted ? 'text-emerald-400' : 'text-muted-foreground group-hover:text-sky-300'}`} />

                <span className="whitespace-nowrap">{stage.title}</span>
              </div>

              {/* Interlocking Chevron Arrow Indicator between steps */}
              {index < stages.length - 1 && (
                <span className="ml-2 sm:ml-3 text-muted-foreground/30 font-serif font-light text-sm select-none">
                  ➔
                </span>
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
