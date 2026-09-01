/**
 * CreateProjectModal.tsx
 *
 * Modal Dialog component for creating a new startup venture project.
 * Connects directly to Supabase createNewProject API with form validation,
 * industry selection, and loading state.
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProjectStore } from '@/store/projectStore'
import { Rocket, Layers, Tag, FileText } from 'lucide-react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { LoadingButton } from '@/components/ui/Spinner'

interface CreateProjectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const INDUSTRY_PRESETS = [
  'SaaS / B2B',
  'AI / Machine Learning',
  'Sustainability',
  'Developer Tools',
  'E-Commerce',
  'Fintech',
  'Healthtech',
  'Edtech',
]

export function CreateProjectModal({ open, onOpenChange }: CreateProjectModalProps) {
  const navigate = useNavigate()
  const { createNewProject, loading } = useProjectStore()

  const [title, setTitle] = useState('')
  const [industry, setIndustry] = useState(INDUSTRY_PRESETS[0])
  const [customIndustry, setCustomIndustry] = useState('')
  const [description, setDescription] = useState('')
  const [validationError, setValidationError] = useState('')

  const handleClose = () => {
    setTitle('')
    setIndustry(INDUSTRY_PRESETS[0])
    setCustomIndustry('')
    setDescription('')
    setValidationError('')
    onOpenChange(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      setValidationError('Project title is required.')
      return
    }

    setValidationError('')
    const selectedInd = industry === 'Other' ? customIndustry.trim() || 'Tech' : industry

    const newProject = await createNewProject({
      title: title.trim(),
      industry: selectedInd,
      description: description.trim() || undefined,
    })

    if (newProject) {
      handleClose()
      navigate(`/workspace/${newProject.id}`)
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-lg bg-[#181d27] border-border/60 p-6 rounded-2xl shadow-2xl space-y-6">
        <ModalHeader className="space-y-2">
          <div className="flex items-center space-x-2 text-sky-400">
            <div className="h-8 w-8 rounded-xl bg-sky-400/10 border border-sky-400/30 flex items-center justify-center">
              <Rocket className="h-4 w-4" />
            </div>
            <span className="font-mono text-xs font-bold uppercase tracking-wider">New Venture</span>
          </div>

          <ModalTitle className="text-xl font-bold text-white">
            Create Startup Venture
          </ModalTitle>
          <ModalDescription className="text-xs text-muted-foreground">
            Initialize a new methodology workspace with empathy mapping, business model canvas, and pitch deck.
          </ModalDescription>
        </ModalHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Field */}
          <div className="space-y-1.5">
            <Label htmlFor="project-title" className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-sky-400" />
              Project Title *
            </Label>
            <Input
              id="project-title"
              type="text"
              placeholder="e.g. EcoPack Innovation"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (validationError) setValidationError('')
              }}
              className="bg-[#1c222e] border-border/60 text-xs focus:border-sky-400"
              autoFocus
            />
            {validationError && (
              <p className="text-[11px] font-semibold text-red-400">{validationError}</p>
            )}
          </div>

          {/* Industry Preset Select */}
          <div className="space-y-1.5">
            <Label htmlFor="project-industry" className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-indigo-400" />
              Industry Sector
            </Label>
            <select
              id="project-industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full h-10 bg-[#1c222e] border border-border/60 text-xs font-semibold text-foreground px-3 rounded-xl focus:outline-none focus:border-sky-400 cursor-pointer"
            >
              {INDUSTRY_PRESETS.map((ind) => (
                <option key={ind} value={ind} className="bg-[#1c222e]">
                  {ind}
                </option>
              ))}
              <option value="Other" className="bg-[#1c222e]">Other (Custom)</option>
            </select>
          </div>

          {/* Custom Industry Input if 'Other' */}
          {industry === 'Other' && (
            <div className="space-y-1.5 pt-1">
              <Input
                type="text"
                placeholder="Specify custom industry..."
                value={customIndustry}
                onChange={(e) => setCustomIndustry(e.target.value)}
                className="bg-[#1c222e] border-border/60 text-xs focus:border-sky-400"
              />
            </div>
          )}

          {/* Description Textarea */}
          <div className="space-y-1.5">
            <Label htmlFor="project-description" className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-purple-400" />
              Short Description (Optional)
            </Label>
            <Textarea
              id="project-description"
              placeholder="Briefly describe the core problem or value proposition..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="bg-[#1c222e] border-border/60 text-xs focus:border-sky-400 resize-none"
            />
          </div>

          <ModalFooter className="pt-4 border-t border-border/40 flex items-center justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="text-xs font-semibold border-border/60"
            >
              Cancel
            </Button>

            <LoadingButton
              type="submit"
              isLoading={loading}
              className="bg-sky-400 text-slate-950 hover:bg-sky-300 font-bold text-xs px-6 shadow-md shadow-sky-500/20"
            >
              Create Venture
            </LoadingButton>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
