/**
 * AIGeneratorModal.tsx
 *
 * AI Co-Pilot Startup Problem & Value Proposition Generator Modal for Startup Toolkit.
 * Generates investor-grade 1-sentence problem statements and structured value props
 * with instant insertion into active founder methodology workspaces.
 */

import { useState } from 'react'
import { Zap, Bot, Copy, Check, Plus, RefreshCw, Lightbulb, ArrowRight } from 'lucide-react'
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
import { Button } from '@/components/ui/Button'
import { LoadingButton } from '@/components/ui/Spinner'
import type { Project } from '@/types/database.types'
import { useProjectStore } from '@/store/projectStore'

interface AIGeneratorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project?: Project
}

const AI_PRESETS: Record<
  string,
  { problem: string; valueProps: string[]; targetAudience: string }
> = {
  SaaS: {
    targetAudience: 'B2B SaaS Teams & Operations Leaders',
    problem:
      'For B2B Operations teams who struggle with fragmented data silos and manual reporting, our automated platform unifies cross-tool metrics into real-time dashboards unlike legacy spreadsheets.',
    valueProps: [
      'Automated 1-click integrations across 50+ SaaS tools',
      'Real-time executive reporting saving 15+ hours per week',
      'Zero-code setup requiring no dedicated engineering support',
    ],
  },
  AI: {
    targetAudience: 'Software Engineers & Product Managers',
    problem:
      'For AI Developers who waste hours tweaking prompts and evaluating LLM outputs manually, our LLM evaluation suite provides automated benchmark testing unlike ad-hoc testing scripts.',
    valueProps: [
      'Automated LLM prompt regression & accuracy benchmarking',
      'Sub-100ms latency evaluation pipeline for production models',
      'Enterprise-grade privacy with local self-hosted deployments',
    ],
  },
  Sustainability: {
    targetAudience: 'Corporate ESG Directors & Supply Chain Managers',
    problem:
      'For ESG Managers who struggle to track Scope 3 carbon emissions across global suppliers, our supply chain intelligence engine delivers audited carbon footprint reports unlike static annual audits.',
    valueProps: [
      'Automated Scope 1, 2, and 3 emission calculation engine',
      'Supplier compliance portal with real-time audit trails',
      'Exportable GHG Protocol & CSRD compliance reports',
    ],
  },
  Fintech: {
    targetAudience: 'Startup Founders & CFOs',
    problem:
      'For Startup CFOs who struggle to manage multi-currency cash flow and runway forecasts, our financial planning platform delivers predictive runway analytics unlike static financial models.',
    valueProps: [
      'Automated bank feed synchronization with AI transaction tagging',
      'Scenario planning engine for hiring and fundraising milestones',
      'Instant board-deck financial chart exports',
    ],
  },
}

export function AIGeneratorModal({ open, onOpenChange, project }: AIGeneratorModalProps) {
  const { updateUserProject } = useProjectStore()

  const [industry, setIndustry] = useState(project?.industry || 'SaaS')
  const [targetAudience, setTargetAudience] = useState(
    AI_PRESETS[project?.industry || 'SaaS']?.targetAudience || 'Early-Stage Startup Founders',
  )
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [inserted, setInserted] = useState(false)

  const activePreset = AI_PRESETS[industry] || AI_PRESETS.SaaS
  const [generatedProblem, setGeneratedProblem] = useState(activePreset.problem)
  const [generatedValueProps, setGeneratedValueProps] = useState(activePreset.valueProps)

  const handleGenerate = () => {
    setIsGenerating(true)
    setInserted(false)
    setTimeout(() => {
      const preset = AI_PRESETS[industry] || AI_PRESETS.SaaS
      setGeneratedProblem(
        `For ${targetAudience || preset.targetAudience} who struggle with high operational friction, ${
          project?.title || 'our venture'
        } delivers automated methodology workflows unlike manual tools.`,
      )
      setGeneratedValueProps(preset.valueProps)
      setIsGenerating(false)
    }, 600)
  }

  const handleCopy = () => {
    const fullText = `PROBLEM STATEMENT:\n${generatedProblem}\n\nVALUE PROPOSITIONS:\n${generatedValueProps
      .map((vp, i) => `${i + 1}. ${vp}`)
      .join('\n')}`

    navigator.clipboard.writeText(fullText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleInsert = async () => {
    if (!project) return
    setInserted(true)

    // Insert into project description / canvas
    await updateUserProject(project.id, {
      description: generatedProblem,
    })

    setTimeout(() => {
      setInserted(false)
      onOpenChange(false)
    }, 1200)
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-2xl bg-[#181d27] border-border/60 p-6 rounded-2xl shadow-2xl space-y-6">
        <ModalHeader className="space-y-2">
          <div className="flex items-center space-x-2 text-sky-400">
            <div className="h-8 w-8 rounded-xl bg-sky-400/10 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Zap className="h-4 w-4 fill-sky-400/20" />
            </div>
            <span className="font-mono text-xs font-bold uppercase tracking-wider">AI Venture Co-Pilot</span>
          </div>

          <ModalTitle className="text-xl font-bold text-white">
            Problem & Value Prop Generator
          </ModalTitle>
          <ModalDescription className="text-xs text-muted-foreground">
            Formulate crisp, investor-ready problem statements and value propositions tailored to your industry sector.
          </ModalDescription>
        </ModalHeader>

        {/* Form Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#12161f] p-4 rounded-xl border border-border/40">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-200">Industry Sector</Label>
            <select
              value={industry}
              onChange={(e) => {
                setIndustry(e.target.value)
                const preset = AI_PRESETS[e.target.value]
                if (preset) {
                  setTargetAudience(preset.targetAudience)
                  setGeneratedProblem(preset.problem)
                  setGeneratedValueProps(preset.valueProps)
                }
              }}
              className="w-full h-10 bg-[#1c222e] border border-border/60 text-xs font-semibold text-foreground px-3 rounded-xl focus:outline-none focus:border-sky-400 cursor-pointer"
            >
              <option value="SaaS">SaaS / B2B</option>
              <option value="AI">AI / Developer Tools</option>
              <option value="Sustainability">Sustainability / ESG</option>
              <option value="Fintech">Fintech / Financial Planning</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-200">Target Customer Persona</Label>
            <Input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="bg-[#1c222e] border-border/60 text-xs focus:border-sky-400"
            />
          </div>
        </div>

        {/* Generated Output Preview */}
        <div className="space-y-4">
          {/* Problem Statement Card */}
          <div className="p-4 rounded-xl bg-[#1c222e] border border-sky-400/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="h-3.5 w-3.5" />
                1-Sentence Problem Formula
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">Mad-Libs Standard</span>
            </div>
            <p className="text-xs text-white leading-relaxed font-medium">
              "{generatedProblem}"
            </p>
          </div>

          {/* Value Propositions Card */}
          <div className="p-4 rounded-xl bg-[#1c222e] border border-emerald-400/30 space-y-2">
            <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Bot className="h-3.5 w-3.5" />
              Core Value Propositions
            </span>

            <ul className="space-y-2 pt-1">
              {generatedValueProps.map((vp, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-xs text-slate-200">
                  <ArrowRight className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{vp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <ModalFooter className="pt-4 border-t border-border/40 flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="text-xs font-semibold border-border/60"
          >
            <RefreshCw className={`mr-1.5 h-3.5 w-3.5 text-sky-400 ${isGenerating ? 'animate-spin' : ''}`} />
            Regenerate
          </Button>

          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCopy}
              className="text-xs font-semibold border-border/60"
            >
              {copied ? (
                <>
                  <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-400" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="mr-1.5 h-3.5 w-3.5" />
                  Copy Text
                </>
              )}
            </Button>

            {project && (
              <LoadingButton
                type="button"
                isLoading={inserted}
                onClick={handleInsert}
                className="bg-sky-400 text-slate-950 hover:bg-sky-300 font-bold text-xs px-5 shadow-md shadow-sky-500/20"
              >
                <Plus className="mr-1.5 h-3.5 w-3.5 stroke-[3]" />
                {inserted ? 'Inserted to Workspace' : 'Insert to Canvas'}
              </LoadingButton>
            )}
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
