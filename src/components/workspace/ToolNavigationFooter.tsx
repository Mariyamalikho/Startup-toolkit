/**
 * ToolNavigationFooter.tsx
 *
 * 1:1 Pixel-Perfect Methodology Tool Navigation Footer for Startup Toolkit.
 * Renders previous/next stepper controls, active stage indicators, and seamless linear
 * workflow navigation across methodology tools (Brainstorm, Empathy Map, BMC 9-Box,
 * Experiment Tracker, Prototype Roadmap).
 */

import React from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  Heart,
  Grid,
  FlaskConical,
  Calendar,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

export type WorkspaceTabKey = 'brainstorm' | 'empathy' | 'canvas' | 'experiments' | 'roadmap'

interface ToolStepConfig {
  key: WorkspaceTabKey
  label: string
  icon: React.ReactNode
  color: string
  stepNumber: number
}

const TOOL_STEPS: ToolStepConfig[] = [
  {
    key: 'brainstorm',
    label: 'Brainstorming Board',
    icon: <Lightbulb className="h-3.5 w-3.5 text-amber-400" />,
    color: 'text-amber-400',
    stepNumber: 1,
  },
  {
    key: 'empathy',
    label: 'Empathy Map',
    icon: <Heart className="h-3.5 w-3.5 text-sky-400" />,
    color: 'text-sky-400',
    stepNumber: 2,
  },
  {
    key: 'canvas',
    label: 'Business Model Canvas',
    icon: <Grid className="h-3.5 w-3.5 text-emerald-400" />,
    color: 'text-emerald-400',
    stepNumber: 3,
  },
  {
    key: 'experiments',
    label: 'Experiment Tracker',
    icon: <FlaskConical className="h-3.5 w-3.5 text-purple-400" />,
    color: 'text-purple-400',
    stepNumber: 4,
  },
  {
    key: 'roadmap',
    label: 'Prototype Roadmap',
    icon: <Calendar className="h-3.5 w-3.5 text-indigo-400" />,
    color: 'text-indigo-400',
    stepNumber: 5,
  },
]

interface ToolNavigationFooterProps {
  activeTab: WorkspaceTabKey
  onSelectTab: (tab: WorkspaceTabKey) => void
}

export function ToolNavigationFooter({ activeTab, onSelectTab }: ToolNavigationFooterProps) {
  const currentIndex = TOOL_STEPS.findIndex((s) => s.key === activeTab)
  const currentStep = TOOL_STEPS[currentIndex] || TOOL_STEPS[0]

  const prevStep = currentIndex > 0 ? TOOL_STEPS[currentIndex - 1] : null
  const nextStep = currentIndex < TOOL_STEPS.length - 1 ? TOOL_STEPS[currentIndex + 1] : null

  return (
    <div className="bg-[#181d27] border border-border/60 p-4 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Left Stepper Info & Progress */}
      <div className="flex items-center space-x-3">
        <div className="h-9 w-9 rounded-xl bg-[#12161f] border border-border/40 flex items-center justify-center font-mono font-bold text-xs text-sky-400">
          {currentStep.stepNumber}/5
        </div>

        <div className="space-y-0.5">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              {currentStep.icon}
              <span>{currentStep.label}</span>
            </span>
            <span className="text-[10px] font-mono font-bold uppercase bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded-full">
              Stage {currentStep.stepNumber} Active
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            {nextStep
              ? `Next stage: ${nextStep.label}`
              : 'Final methodology stage reached. Ready to export PDF report!'}
          </p>
        </div>
      </div>

      {/* Middle Stage Dots Indicator */}
      <div className="hidden lg:flex items-center space-x-2 bg-[#12161f] border border-border/40 px-3 py-1.5 rounded-xl">
        {TOOL_STEPS.map((step) => {
          const isActive = step.key === activeTab
          const isCompleted = step.stepNumber < currentStep.stepNumber

          return (
            <button
              key={step.key}
              type="button"
              onClick={() => onSelectTab(step.key)}
              className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                isActive
                  ? 'bg-sky-400/20 text-sky-300 border border-sky-400/40 shadow-sm'
                  : isCompleted
                  ? 'text-emerald-400 hover:bg-muted/20'
                  : 'text-muted-foreground hover:text-slate-200 hover:bg-muted/20'
              }`}
              title={step.label}
            >
              {isCompleted ? (
                <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
              ) : (
                <span className="h-2 w-2 rounded-full bg-slate-600 shrink-0" />
              )}
              <span className="truncate max-w-[90px]">{step.label}</span>
            </button>
          )
        })}
      </div>

      {/* Right Stepper Action Buttons */}
      <div className="flex items-center space-x-3 shrink-0">
        <Button
          type="button"
          variant="outline"
          disabled={!prevStep}
          onClick={() => prevStep && onSelectTab(prevStep.key)}
          className="text-xs font-bold border-border/60 h-10 px-4 disabled:opacity-40"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Previous Tool
        </Button>

        <Button
          type="button"
          disabled={!nextStep}
          onClick={() => nextStep && onSelectTab(nextStep.key)}
          className="bg-sky-400 text-slate-950 hover:bg-sky-300 font-extrabold text-xs h-10 px-5 shadow-md shadow-sky-500/20 disabled:opacity-40"
        >
          <span>Next Tool</span>
          <ArrowRight className="ml-1.5 h-4 w-4 stroke-[3]" />
        </Button>
      </div>
    </div>
  )
}
