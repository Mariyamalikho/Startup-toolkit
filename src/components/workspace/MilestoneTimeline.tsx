/**
 * MilestoneTimeline.tsx
 *
 * 1:1 Pixel-Perfect Interactive Prototype Roadmap & Milestone Timeline for Startup Toolkit.
 * Renders a Gantt-style timeline visualization across product engineering phases (Discovery,
 * Prototype, Alpha, Beta, Launch) with status tracking, progress indicators, modal editing,
 * and automatic persistence to Supabase.
 */

import React, { useState } from 'react'
import {
  Flag,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  Edit2,
  Trash2,
  PlayCircle,
} from 'lucide-react'
import type { Project } from '@/types/database.types'
import { useProjectStore } from '@/store/projectStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalFooter } from '@/components/ui/Modal'

export type MilestonePhase = 'discovery' | 'prototype' | 'alpha' | 'beta' | 'launch'
export type MilestoneStatus = 'planned' | 'in_progress' | 'completed' | 'delayed'

export interface MilestoneItem {
  id: string
  title: string
  phase: MilestonePhase
  status: MilestoneStatus
  startMonth: number // 1 to 6
  durationMonths: number // 1 to 6
  owner: string
  deliverables: string
  createdAt: string
}

interface MilestoneTimelineProps {
  project: Project
}

const PHASE_COLORS: Record<
  MilestonePhase,
  { bg: string; text: string; border: string; bar: string }
> = {
  discovery: {
    bg: 'bg-sky-500/10',
    text: 'text-sky-400',
    border: 'border-sky-500/30',
    bar: 'bg-sky-500',
  },
  prototype: {
    bg: 'bg-teal-500/10',
    text: 'text-teal-400',
    border: 'border-teal-500/30',
    bar: 'bg-teal-500',
  },
  alpha: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    bar: 'bg-amber-500',
  },
  beta: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    bar: 'bg-blue-500',
  },
  launch: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    bar: 'bg-emerald-500',
  },
}

const DEFAULT_MILESTONES: MilestoneItem[] = [
  {
    id: 'm-1',
    title: 'Customer Problem Validation & Empathy Interviews',
    phase: 'discovery',
    status: 'completed',
    startMonth: 1,
    durationMonths: 1,
    owner: 'Founder Team',
    deliverables: '20 user interview transcripts, validated problem statement.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'm-2',
    title: 'Interactive Low-Fi Prototype & Design Tokens',
    phase: 'prototype',
    status: 'completed',
    startMonth: 2,
    durationMonths: 1,
    owner: 'Product Designer',
    deliverables: 'Figma UI wireframes & Tailwind CSS component library.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'm-3',
    title: 'Alpha Build: Supabase Auth & Project Autosave',
    phase: 'alpha',
    status: 'in_progress',
    startMonth: 3,
    durationMonths: 2,
    owner: 'Lead Engineer',
    deliverables: 'Live database sync, Zustand state store, debounced autosave.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'm-4',
    title: 'Beta Release & Founder Closed Feedback Cohort',
    phase: 'beta',
    status: 'planned',
    startMonth: 4,
    durationMonths: 2,
    owner: 'Growth Lead',
    deliverables: '50 active startup founders testing empathy maps & BMC.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'm-5',
    title: 'Public Launch on Product Hunt & Press Outreach',
    phase: 'launch',
    status: 'planned',
    startMonth: 6,
    durationMonths: 1,
    owner: 'Marketing Team',
    deliverables: 'Product Hunt top #1 product launch, demo video, press kit.',
    createdAt: new Date().toISOString(),
  },
]

const MONTH_LABELS = ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6']

export function MilestoneTimeline({ project }: MilestoneTimelineProps) {
  const { updateUserProject } = useProjectStore()

  const [milestones, setMilestones] = useState<MilestoneItem[]>(() => {
    if (project.milestones && Array.isArray(project.milestones)) {
      return project.milestones as MilestoneItem[]
    }
    return DEFAULT_MILESTONES
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MilestoneItem | null>(null)

  // Form state
  const [title, setTitle] = useState('')
  const [phase, setPhase] = useState<MilestonePhase>('prototype')
  const [status, setStatus] = useState<MilestoneStatus>('planned')
  const [startMonth, setStartMonth] = useState<number>(1)
  const [durationMonths, setDurationMonths] = useState<number>(1)
  const [owner, setOwner] = useState('')
  const [deliverables, setDeliverables] = useState('')

  const saveMilestones = (newList: MilestoneItem[]) => {
    setMilestones(newList)
    updateUserProject(project.id, {
      milestones: newList,
    })
  }

  const handleOpenCreateModal = () => {
    setEditingItem(null)
    setTitle('')
    setPhase('prototype')
    setStatus('planned')
    setStartMonth(1)
    setDurationMonths(1)
    setOwner('Product Lead')
    setDeliverables('')
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (item: MilestoneItem) => {
    setEditingItem(item)
    setTitle(item.title)
    setPhase(item.phase)
    setStatus(item.status)
    setStartMonth(item.startMonth)
    setDurationMonths(item.durationMonths)
    setOwner(item.owner)
    setDeliverables(item.deliverables)
    setIsModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    if (editingItem) {
      const updated = milestones.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              title: title.trim(),
              phase,
              status,
              startMonth,
              durationMonths,
              owner: owner.trim(),
              deliverables: deliverables.trim(),
            }
          : item,
      )
      saveMilestones(updated)
    } else {
      const newItem: MilestoneItem = {
        id: `m-${Date.now()}`,
        title: title.trim(),
        phase,
        status,
        startMonth,
        durationMonths,
        owner: owner.trim(),
        deliverables: deliverables.trim(),
        createdAt: new Date().toISOString(),
      }
      saveMilestones([...milestones, newItem])
    }

    setIsModalOpen(false)
  }

  const handleDelete = (id: string) => {
    const updated = milestones.filter((item) => item.id !== id)
    saveMilestones(updated)
  }

  const completedCount = milestones.filter((m) => m.status === 'completed').length
  const inProgressCount = milestones.filter((m) => m.status === 'in_progress').length
  const completionPercentage =
    milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface border border-border p-4 rounded-2xl">
        <div>
          <p className="text-xs text-muted-foreground">
            Track product engineering milestones from discovery through prototype, alpha, beta, and
            public launch.
          </p>
        </div>

        <Button
          onClick={handleOpenCreateModal}
          className="bg-indigo-500 text-white hover:bg-indigo-400 font-extrabold text-xs px-4 h-10 shadow-md shadow-indigo-500/20"
        >
          <Plus className="mr-1.5 h-4 w-4 stroke-[3]" />
          Add Milestone
        </Button>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-border space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground">Total Milestones</span>
          <div className="text-2xl font-extrabold text-foreground font-mono">
            {milestones.length}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-emerald-500/30 space-y-1">
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            Completed
          </span>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
            {completedCount}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-sky-500/30 space-y-1">
          <span className="text-[11px] font-semibold text-sky-600 dark:text-sky-400">
            In Progress
          </span>
          <div className="text-2xl font-extrabold text-sky-600 dark:text-sky-400 font-mono">
            {inProgressCount}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-indigo-500/30 space-y-1">
          <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
            Overall Progress
          </span>
          <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
            {completionPercentage}%
          </div>
        </div>
      </div>

      {/* Gantt Timeline View */}
      <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm space-y-4 overflow-x-auto">
        <div className="min-w-[700px] space-y-4">
          {/* Gantt Header Columns */}
          <div className="grid grid-cols-12 gap-2 text-xs font-mono font-bold text-muted-foreground border-b border-border pb-3">
            <div className="col-span-5 flex items-center gap-1.5">
              <Flag className="h-3.5 w-3.5 text-sky-500 dark:text-sky-400" />
              <span>Milestone & Deliverable</span>
            </div>
            <div className="col-span-7 grid grid-cols-6 text-center">
              {MONTH_LABELS.map((m) => (
                <div key={m} className="border-l border-border/40 py-1 text-[11px]">
                  {m}
                </div>
              ))}
            </div>
          </div>

          {/* Gantt Rows */}
          <div className="space-y-3">
            {milestones.map((item) => {
              const phaseStyle = PHASE_COLORS[item.phase] || PHASE_COLORS.prototype

              // Calculate start col and span width for 6-month grid
              const startCol = Math.max(1, Math.min(6, item.startMonth))
              const span = Math.max(1, Math.min(6 - startCol + 1, item.durationMonths))

              return (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-2 items-center p-3 rounded-xl bg-muted/40 border border-border hover:border-sky-400/40 transition-all group"
                >
                  {/* Left Metadata Info */}
                  <div className="col-span-5 space-y-1 pr-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-foreground leading-tight group-hover:text-sky-500 dark:group-hover:text-sky-300 transition-colors">
                        {item.title}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                      {/* Phase Badge */}
                      <span
                        className={`px-2 py-0.5 rounded-full font-mono font-bold uppercase border ${phaseStyle.bg} ${phaseStyle.text} ${phaseStyle.border}`}
                      >
                        {item.phase}
                      </span>

                      {/* Status Badge */}
                      {item.status === 'completed' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                          <CheckCircle2 className="h-3 w-3" />
                          Done
                        </span>
                      )}
                      {item.status === 'in_progress' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-400/10 text-sky-400 border border-sky-400/30 font-bold">
                          <Clock className="h-3 w-3 animate-spin" />
                          Active
                        </span>
                      )}
                      {item.status === 'planned' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/30 font-semibold">
                          <PlayCircle className="h-3 w-3" />
                          Planned
                        </span>
                      )}
                      {item.status === 'delayed' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold">
                          <AlertTriangle className="h-3 w-3" />
                          Delayed
                        </span>
                      )}

                      {/* Owner */}
                      <span className="text-muted-foreground flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {item.owner}
                      </span>
                    </div>
                  </div>

                  {/* Right Gantt Bar Chart Column (6 Month Columns) */}
                  <div className="col-span-7 grid grid-cols-6 items-center relative h-10">
                    {/* Background Grid Lines */}
                    {MONTH_LABELS.map((_, i) => (
                      <div key={i} className="h-full border-l border-border/20" />
                    ))}

                    {/* Milestone Gantt Bar */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 h-7 rounded-lg shadow-md flex items-center justify-between px-2 text-[10px] font-bold text-white overflow-hidden transition-all"
                      style={{
                        left: `${((startCol - 1) / 6) * 100}%`,
                        width: `${(span / 6) * 100}%`,
                      }}
                    >
                      <div className={`absolute inset-0 ${phaseStyle.bar} opacity-90`} />
                      <span className="relative z-10 truncate font-mono">
                        {item.deliverables || item.title}
                      </span>

                      <div className="relative z-10 flex items-center space-x-1 shrink-0 bg-black/40 px-1.5 py-0.5 rounded">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(item)}
                          className="hover:text-sky-300"
                          title="Edit Milestone"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="hover:text-rose-400"
                          title="Delete Milestone"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            {milestones.length === 0 && (
              <div className="border-2 border-dashed border-border/40 rounded-2xl p-12 text-center text-muted-foreground text-xs space-y-3">
                <p className="text-sm font-semibold text-slate-300">
                  No prototype milestones configured yet.
                </p>
                <Button
                  onClick={handleOpenCreateModal}
                  className="bg-indigo-500 text-white text-xs font-bold"
                >
                  + Add First Milestone
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Milestone Modal */}
      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalContent className="max-w-lg bg-surface border-border p-6 rounded-2xl shadow-2xl space-y-6">
          <ModalHeader className="space-y-1">
            <ModalTitle className="text-xl font-bold text-foreground">
              {editingItem ? 'Edit Roadmap Milestone' : 'Add New Milestone'}
            </ModalTitle>
          </ModalHeader>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Milestone Title *</label>
              <Input
                type="text"
                placeholder="e.g. Closed Beta Testing & Feedback"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-background border-border text-foreground text-xs focus:border-indigo-400"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Phase</label>
                <select
                  value={phase}
                  onChange={(e) => setPhase(e.target.value as MilestonePhase)}
                  className="w-full h-10 bg-background border border-border text-xs font-semibold text-foreground px-3 rounded-xl focus:outline-none focus:border-indigo-400 cursor-pointer"
                >
                  <option value="discovery" className="bg-surface text-foreground">
                    Discovery
                  </option>
                  <option value="prototype" className="bg-surface text-foreground">
                    Prototype
                  </option>
                  <option value="alpha" className="bg-surface text-foreground">
                    Alpha
                  </option>
                  <option value="beta" className="bg-surface text-foreground">
                    Beta
                  </option>
                  <option value="launch" className="bg-surface text-foreground">
                    Launch
                  </option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as MilestoneStatus)}
                  className="w-full h-10 bg-background border border-border text-xs font-semibold text-foreground px-3 rounded-xl focus:outline-none focus:border-indigo-400 cursor-pointer"
                >
                  <option value="planned" className="bg-surface text-foreground">
                    Planned
                  </option>
                  <option value="in_progress" className="bg-surface text-foreground">
                    In Progress
                  </option>
                  <option value="completed" className="bg-surface text-foreground">
                    Completed
                  </option>
                  <option value="delayed" className="bg-surface text-foreground">
                    Delayed
                  </option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Start Month (1-6)</label>
                <Input
                  type="number"
                  min={1}
                  max={6}
                  value={startMonth}
                  onChange={(e) => setStartMonth(parseInt(e.target.value) || 1)}
                  className="bg-background border-border text-foreground text-xs focus:border-indigo-400"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Duration (Months)</label>
                <Input
                  type="number"
                  min={1}
                  max={6}
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(parseInt(e.target.value) || 1)}
                  className="bg-background border-border text-foreground text-xs focus:border-indigo-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Owner / Lead Responsible</label>
              <Input
                type="text"
                placeholder="e.g. Lead Engineer or Founder"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="bg-background border-border text-foreground text-xs focus:border-indigo-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Key Deliverables & Output</label>
              <Textarea
                placeholder="Describe key artifacts, code, or target metric outputs..."
                value={deliverables}
                onChange={(e) => setDeliverables(e.target.value)}
                rows={2}
                className="bg-background border-border text-foreground text-xs focus:border-indigo-400 resize-none"
              />
            </div>

            <ModalFooter className="pt-4 border-t border-border flex items-center justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="text-xs font-semibold border-border"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="bg-indigo-500 text-white hover:bg-indigo-400 font-bold text-xs px-6 shadow-md shadow-indigo-500/20"
              >
                Save Milestone
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  )
}
