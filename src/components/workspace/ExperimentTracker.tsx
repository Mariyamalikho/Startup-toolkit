/**
 * ExperimentTracker.tsx
 *
 * 1:1 Pixel-Perfect Lean Startup Validation Experiment Tracker for Startup Toolkit.
 * Allows founders to log hypotheses, define pass/fail metric criteria, track experiment status
 * (Draft, In Progress, Validated, Invalidated), record decisions (Persevere, Pivot, Iterate),
 * and automatically persist experiment data to Supabase.
 */

import React, { useState } from 'react'
import {
  FlaskConical,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Edit2,
  FileText,
  Target,
  ShieldCheck,
} from 'lucide-react'
import type { Project } from '@/types/database.types'
import { useProjectStore } from '@/store/projectStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalFooter } from '@/components/ui/Modal'

export type ExperimentStatus = 'draft' | 'in_progress' | 'validated' | 'invalidated'
export type ExperimentDecision = 'persevere' | 'pivot' | 'iterate'

export interface ExperimentItem {
  id: string
  title: string
  hypothesis: string
  metricCriterion: string
  status: ExperimentStatus
  decision?: ExperimentDecision
  learnings?: string
  createdAt: string
}

interface ExperimentTrackerProps {
  project: Project
}

const DEFAULT_EXPERIMENTS: ExperimentItem[] = [
  {
    id: 'exp-1',
    title: 'Landing Page Hero Value Prop Test',
    hypothesis: 'If we highlight 1000ms cloud autosave, then 25% of visitors will click "Get Started Free".',
    metricCriterion: 'Minimum 25% conversion rate on 200 unique landing visitors',
    status: 'validated',
    decision: 'persevere',
    learnings: 'Autosave feature positioning increased conversion rate by 31%.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'exp-2',
    title: 'Paid Search Customer Acquisition Test',
    hypothesis: 'If we spend $100 on Google Ads, then CAC will remain under $15 per active founder.',
    metricCriterion: 'CAC <= $15 per registered workspace user',
    status: 'invalidated',
    decision: 'pivot',
    learnings: 'CPC was too high ($4.50). Shift focus to organic Product Hunt and Twitter build-in-public.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'exp-3',
    title: 'Interactive 3D Post-it Note Usability',
    hypothesis: 'If founders can drag post-it notes across quadrants, workspace retention will increase by 40%.',
    metricCriterion: 'Average session duration > 8 minutes',
    status: 'in_progress',
    decision: 'iterate',
    learnings: 'Early feedback is positive; adding color pickers improved engagement.',
    createdAt: new Date().toISOString(),
  },
]

export function ExperimentTracker({ project }: ExperimentTrackerProps) {
  const { updateUserProject } = useProjectStore()

  const [experiments, setExperiments] = useState<ExperimentItem[]>(() => {
    if (project.experiments && Array.isArray(project.experiments)) {
      return project.experiments as ExperimentItem[]
    }
    return DEFAULT_EXPERIMENTS
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ExperimentItem | null>(null)

  // Form states
  const [title, setTitle] = useState('')
  const [hypothesis, setHypothesis] = useState('')
  const [metricCriterion, setMetricCriterion] = useState('')
  const [status, setStatus] = useState<ExperimentStatus>('draft')
  const [decision, setDecision] = useState<ExperimentDecision>('persevere')
  const [learnings, setLearnings] = useState('')

  const saveExperiments = (newList: ExperimentItem[]) => {
    setExperiments(newList)
    updateUserProject(project.id, {
      experiments: newList,
    })
  }

  const handleOpenCreateModal = () => {
    setEditingItem(null)
    setTitle('')
    setHypothesis('')
    setMetricCriterion('')
    setStatus('draft')
    setDecision('persevere')
    setLearnings('')
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (item: ExperimentItem) => {
    setEditingItem(item)
    setTitle(item.title)
    setHypothesis(item.hypothesis)
    setMetricCriterion(item.metricCriterion)
    setStatus(item.status)
    setDecision(item.decision || 'persevere')
    setLearnings(item.learnings || '')
    setIsModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !hypothesis.trim()) return

    if (editingItem) {
      const updated = experiments.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              title: title.trim(),
              hypothesis: hypothesis.trim(),
              metricCriterion: metricCriterion.trim(),
              status,
              decision,
              learnings: learnings.trim(),
            }
          : item,
      )
      saveExperiments(updated)
    } else {
      const newItem: ExperimentItem = {
        id: `exp-${Date.now()}`,
        title: title.trim(),
        hypothesis: hypothesis.trim(),
        metricCriterion: metricCriterion.trim(),
        status,
        decision,
        learnings: learnings.trim(),
        createdAt: new Date().toISOString(),
      }
      saveExperiments([newItem, ...experiments])
    }

    setIsModalOpen(false)
  }

  const handleDelete = (id: string) => {
    const updated = experiments.filter((item) => item.id !== id)
    saveExperiments(updated)
  }

  const validatedCount = experiments.filter((e) => e.status === 'validated').length
  const invalidatedCount = experiments.filter((e) => e.status === 'invalidated').length
  const totalCompleted = validatedCount + invalidatedCount
  const validationRate = totalCompleted > 0 ? Math.round((validatedCount / totalCompleted) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Top Summary Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#181d27]/70 border border-border/40 p-4 rounded-2xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Lean Validation Experiment Tracker</span>
            <span className="text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
              Hypothesis Testing
            </span>
          </h2>
          <p className="text-xs text-muted-foreground pt-0.5">
            Test business model assumptions with real data before building full product features.
          </p>
        </div>

        <Button
          onClick={handleOpenCreateModal}
          className="bg-sky-400 text-slate-950 hover:bg-sky-300 font-extrabold text-xs px-4 h-10 shadow-md shadow-sky-500/20"
        >
          <Plus className="mr-1.5 h-4 w-4 stroke-[3]" />
          New Experiment
        </Button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#181d27] border border-border/40 space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground">Total Experiments</span>
          <div className="text-2xl font-extrabold text-white font-mono">{experiments.length}</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#181d27] border border-emerald-500/30 space-y-1">
          <span className="text-[11px] font-semibold text-emerald-400">Validated</span>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">{validatedCount}</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#181d27] border border-rose-500/30 space-y-1">
          <span className="text-[11px] font-semibold text-rose-400">Invalidated</span>
          <div className="text-2xl font-extrabold text-rose-400 font-mono">{invalidatedCount}</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#181d27] border border-sky-400/30 space-y-1">
          <span className="text-[11px] font-semibold text-sky-400">Validation Rate</span>
          <div className="text-2xl font-extrabold text-sky-400 font-mono">{validationRate}%</div>
        </div>
      </div>

      {/* Experiment Cards List */}
      <div className="space-y-4">
        {experiments.map((exp) => (
          <div
            key={exp.id}
            className="p-5 rounded-2xl bg-[#181d27] border border-border/60 shadow-lg space-y-3 hover:border-sky-400/40 transition-all"
          >
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-3">
              <div className="flex items-center space-x-2">
                <FlaskConical className="h-4 w-4 text-sky-400" />
                <h3 className="text-sm font-bold text-white">{exp.title}</h3>
              </div>

              <div className="flex items-center space-x-2">
                {/* Status Badge */}
                {exp.status === 'validated' && (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Validated</span>
                  </span>
                )}
                {exp.status === 'invalidated' && (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] font-bold">
                    <XCircle className="h-3 w-3" />
                    <span>Invalidated</span>
                  </span>
                )}
                {exp.status === 'in_progress' && (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-sky-400/10 border border-sky-400/30 text-sky-400 text-[11px] font-bold">
                    <Clock className="h-3 w-3 animate-spin" />
                    <span>In Progress</span>
                  </span>
                )}
                {exp.status === 'draft' && (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-muted/30 text-muted-foreground text-[11px] font-semibold">
                    <span>Draft</span>
                  </span>
                )}

                {/* Decision Badge */}
                {exp.decision && (
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-mono text-[10px] font-bold uppercase">
                    {exp.decision}
                  </span>
                )}

                {/* Actions */}
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(exp)}
                  className="p-1 rounded-lg text-muted-foreground hover:text-white hover:bg-muted/30 transition-colors"
                  title="Edit Experiment"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(exp.id)}
                  className="p-1 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Delete Experiment"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Hypothesis & Criteria Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[11px] font-mono font-bold text-slate-400 flex items-center gap-1">
                  <FileText className="h-3 w-3 text-sky-400" />
                  Hypothesis Statement:
                </span>
                <p className="text-slate-200 leading-relaxed bg-[#12161f] p-3 rounded-xl border border-border/40 font-medium">
                  "{exp.hypothesis}"
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono font-bold text-slate-400 flex items-center gap-1">
                  <Target className="h-3 w-3 text-amber-400" />
                  Success Metric Criterion:
                </span>
                <p className="text-slate-200 leading-relaxed bg-[#12161f] p-3 rounded-xl border border-border/40 font-medium">
                  {exp.metricCriterion || 'No metric criterion specified.'}
                </p>
              </div>
            </div>

            {/* Learnings Note */}
            {exp.learnings && (
              <div className="pt-1 text-xs text-muted-foreground flex items-center gap-1.5 border-t border-border/20">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span><strong className="text-slate-200">Learnings:</strong> {exp.learnings}</span>
              </div>
            )}
          </div>
        ))}

        {experiments.length === 0 && (
          <div className="border-2 border-dashed border-border/40 rounded-2xl p-12 text-center text-muted-foreground text-xs space-y-3">
            <p className="text-sm font-semibold text-slate-300">No validation experiments logged yet.</p>
            <Button
              onClick={handleOpenCreateModal}
              className="bg-sky-400 text-slate-950 font-bold text-xs"
            >
              + Create First Experiment
            </Button>
          </div>
        )}
      </div>

      {/* Create / Edit Experiment Modal */}
      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalContent className="max-w-lg bg-[#181d27] border-border/60 p-6 rounded-2xl shadow-2xl space-y-6">
          <ModalHeader className="space-y-1">
            <ModalTitle className="text-xl font-bold text-white">
              {editingItem ? 'Edit Experiment' : 'New Validation Experiment'}
            </ModalTitle>
          </ModalHeader>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200">Experiment Title *</label>
              <Input
                type="text"
                placeholder="e.g. Hero Copy Conversion Rate Test"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-[#1c222e] border-border/60 text-xs focus:border-sky-400"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200">Hypothesis Statement *</label>
              <Textarea
                placeholder="If we build X, then Y% of users will do Z..."
                value={hypothesis}
                onChange={(e) => setHypothesis(e.target.value)}
                rows={3}
                className="bg-[#1c222e] border-border/60 text-xs focus:border-sky-400 resize-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200">Success Metric Criterion</label>
              <Input
                type="text"
                placeholder="e.g. Conversion rate >= 20% on 100 trials"
                value={metricCriterion}
                onChange={(e) => setMetricCriterion(e.target.value)}
                className="bg-[#1c222e] border-border/60 text-xs focus:border-sky-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ExperimentStatus)}
                  className="w-full h-10 bg-[#1c222e] border border-border/60 text-xs font-semibold text-foreground px-3 rounded-xl focus:outline-none cursor-pointer"
                >
                  <option value="draft">Draft</option>
                  <option value="in_progress">In Progress</option>
                  <option value="validated">Validated</option>
                  <option value="invalidated">Invalidated</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200">Decision Outcome</label>
                <select
                  value={decision}
                  onChange={(e) => setDecision(e.target.value as ExperimentDecision)}
                  className="w-full h-10 bg-[#1c222e] border border-border/60 text-xs font-semibold text-foreground px-3 rounded-xl focus:outline-none cursor-pointer"
                >
                  <option value="persevere">Persevere</option>
                  <option value="pivot">Pivot</option>
                  <option value="iterate">Iterate</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200">Key Learnings (Optional)</label>
              <Textarea
                placeholder="Document key customer feedback or quantitative results..."
                value={learnings}
                onChange={(e) => setLearnings(e.target.value)}
                rows={2}
                className="bg-[#1c222e] border-border/60 text-xs focus:border-sky-400 resize-none"
              />
            </div>

            <ModalFooter className="pt-4 border-t border-border/40 flex items-center justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="text-xs font-semibold border-border/60"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="bg-sky-400 text-slate-950 hover:bg-sky-300 font-bold text-xs px-6 shadow-md shadow-sky-500/20"
              >
                Save Experiment
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  )
}
