/**
 * PrintableReportModal.tsx
 *
 * 1:1 Pixel-Perfect Printable Executive PDF Summary Exporter for Startup Toolkit.
 * Compiles Empathy Map, 9-Box Business Model Canvas, Pitch Deck insights, Validation Experiments,
 * and Prototype Roadmap Milestones into a formatted executive PDF report ready for print/download.
 */

import { useState } from 'react'
import {
  Printer,
  Download,
  FileText,
  CheckSquare,
  Square,
  FlaskConical,
  Grid,
  Heart,
  Calendar,
} from 'lucide-react'
import type { Project } from '@/types/database.types'
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalFooter } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { generateVenturePdfReport } from '@/lib/pdfExporter'
import { useToast } from '@/components/ui/Toast'

interface PrintableReportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Project
}

export function PrintableReportModal({ open, onOpenChange, project }: PrintableReportModalProps) {
  const { toast } = useToast()
  const [includeEmpathyMap, setIncludeEmpathyMap] = useState(true)
  const [includeBMC, setIncludeBMC] = useState(true)
  const [includeExperiments, setIncludeExperiments] = useState(true)
  const [includeRoadmap, setIncludeRoadmap] = useState(true)
  const [isExporting, setIsExporting] = useState(false)

  const handlePrint = async () => {
    setIsExporting(true)
    try {
      toast({
        title: 'Generating PDF Report',
        description: 'Compiling venture canvases and methodology sections into PDF...',
        variant: 'info',
      })

      await generateVenturePdfReport(project, {
        includeEmpathyMap,
        includeBMC,
        includeExperiments,
        includeRoadmap,
        onProgress: (stage) => {
          console.log('PDF Progress:', stage)
        },
      })

      toast({
        title: 'PDF Report Ready',
        description: 'Venture executive PDF document stream initiated successfully.',
        variant: 'success',
      })
    } catch (err: unknown) {
      toast({
        title: 'Export Failed',
        description: (err as Error).message || 'Failed to generate PDF document.',
        variant: 'error',
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleDownloadHTML = () => {
    const reportHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${project.title} - Executive Venture Report</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
            h1 { color: #0f172a; border-bottom: 2px solid #0284c7; padding-bottom: 8px; }
            h2 { color: #0284c7; margin-top: 24px; }
            .badge { display: inline-block; background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 9999px; font-size: 12px; font-weight: bold; }
            .box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 12px; margin-bottom: 16px; }
            .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
            ul { margin: 0; padding-left: 20px; }
          </style>
        </head>
        <body>
          <span class="badge">Executive Startup Toolkit Report</span>
          <h1>${project.title}</h1>
          <p><strong>Industry:</strong> ${project.industry || 'General'}</p>
          <p><strong>Description:</strong> ${project.description || 'No description provided.'}</p>
          <hr />
          <p><em>Generated on ${new Date().toLocaleDateString()} from Startup Toolkit Workspace.</em></p>
        </body>
      </html>
    `
    const blob = new Blob([reportHtml], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${project.title.toLowerCase().replace(/\s+/g, '-')}-executive-report.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Parse structured data payloads
  const empathyData =
    (project.empathy_map as {
      thinks?: { content?: string }[]
      pains?: { content?: string }[]
    }) || {}
  const bmcData =
    (project.canvas as {
      value_propositions?: { content?: string }[]
      customer_segments?: { content?: string }[]
      revenue_streams?: { content?: string }[]
    }) || {}
  const experiments = (project.experiments as Record<string, unknown>[]) || []
  const milestones = (project.milestones as Record<string, unknown>[]) || []

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-3xl bg-[#181d27] border-border/60 p-6 rounded-2xl shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <ModalHeader className="border-b border-border/40 pb-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-sky-400" />
            <ModalTitle className="text-xl font-extrabold text-white">
              Export Printable Executive PDF Report
            </ModalTitle>
          </div>
          <p className="text-xs text-muted-foreground pt-1">
            Compile venture insights, Empathy Maps, Business Model Canvases, Experiments, and
            Roadmaps into a clean A4 PDF report.
          </p>
        </ModalHeader>

        {/* Section Selectors */}
        <div className="space-y-3 bg-[#131720] p-4 rounded-xl border border-border/40">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Include Report Sections:
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              type="button"
              onClick={() => setIncludeEmpathyMap(!includeEmpathyMap)}
              className="flex items-center space-x-2 text-xs text-slate-200 hover:text-white"
            >
              {includeEmpathyMap ? (
                <CheckSquare className="h-4 w-4 text-sky-400 shrink-0" />
              ) : (
                <Square className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3 text-rose-400" /> Empathy Map
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIncludeBMC(!includeBMC)}
              className="flex items-center space-x-2 text-xs text-slate-200 hover:text-white"
            >
              {includeBMC ? (
                <CheckSquare className="h-4 w-4 text-sky-400 shrink-0" />
              ) : (
                <Square className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
              <span className="flex items-center gap-1">
                <Grid className="h-3 w-3 text-emerald-400" /> 9-Box BMC
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIncludeExperiments(!includeExperiments)}
              className="flex items-center space-x-2 text-xs text-slate-200 hover:text-white"
            >
              {includeExperiments ? (
                <CheckSquare className="h-4 w-4 text-sky-400 shrink-0" />
              ) : (
                <Square className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
              <span className="flex items-center gap-1">
                <FlaskConical className="h-3 w-3 text-purple-400" /> Experiments
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIncludeRoadmap(!includeRoadmap)}
              className="flex items-center space-x-2 text-xs text-slate-200 hover:text-white"
            >
              {includeRoadmap ? (
                <CheckSquare className="h-4 w-4 text-sky-400 shrink-0" />
              ) : (
                <Square className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-amber-400" /> Roadmap
              </span>
            </button>
          </div>
        </div>

        {/* Live Document Preview Box */}
        <div
          id="printable-report-area"
          className="bg-[#12161f] border border-border/40 p-6 rounded-xl space-y-6 text-xs text-slate-200"
        >
          {/* Document Header */}
          <div className="border-b border-border/40 pb-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full">
                Executive Venture Report
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white">{project.title}</h2>
            <p className="text-muted-foreground">
              {project.description || 'No detailed description set for this venture.'}
            </p>
          </div>

          {/* Section: Empathy Map Summary */}
          {includeEmpathyMap && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-border/20 pb-1">
                <Heart className="h-3.5 w-3.5" /> Customer Empathy Profile
              </h3>
              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div className="bg-[#181d27] p-3 rounded-lg border border-border/40">
                  <strong className="text-slate-200 block mb-1">Thinks & Feels</strong>
                  <p className="text-muted-foreground">
                    {empathyData.thinks?.[0]?.content ||
                      'Desires rapid execution & reliable autosave.'}
                  </p>
                </div>
                <div className="bg-[#181d27] p-3 rounded-lg border border-border/40">
                  <strong className="text-slate-200 block mb-1">Pains & Friction</strong>
                  <p className="text-muted-foreground">
                    {empathyData.pains?.[0]?.content ||
                      'Fragmented tools & manual document creation.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section: BMC 9-Box Summary */}
          {includeBMC && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-border/20 pb-1">
                <Grid className="h-3.5 w-3.5" /> Business Model Highlights
              </h3>
              <div className="grid grid-cols-3 gap-3 text-[11px]">
                <div className="bg-[#181d27] p-3 rounded-lg border border-border/40">
                  <strong className="text-slate-200 block mb-1">Value Propositions</strong>
                  <p className="text-muted-foreground">
                    {bmcData.value_propositions?.[0]?.content ||
                      'All-in-one methodology workspace for founders.'}
                  </p>
                </div>
                <div className="bg-[#181d27] p-3 rounded-lg border border-border/40">
                  <strong className="text-slate-200 block mb-1">Customer Segments</strong>
                  <p className="text-muted-foreground">
                    {bmcData.customer_segments?.[0]?.content ||
                      'Solo Technical Founders & Accelerator Cohorts.'}
                  </p>
                </div>
                <div className="bg-[#181d27] p-3 rounded-lg border border-border/40">
                  <strong className="text-slate-200 block mb-1">Revenue Streams</strong>
                  <p className="text-muted-foreground">
                    {bmcData.revenue_streams?.[0]?.content ||
                      'Freemium workspace & $19/mo Pro subscriptions.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section: Validation Experiments */}
          {includeExperiments && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-border/20 pb-1">
                <FlaskConical className="h-3.5 w-3.5" /> Lean Validation Experiments (
                {experiments.length})
              </h3>
              <div className="space-y-2 text-[11px]">
                {experiments.slice(0, 2).map((exp: Record<string, unknown>, idx: number) => (
                  <div
                    key={idx}
                    className="bg-[#181d27] p-3 rounded-lg border border-border/40 flex justify-between items-center"
                  >
                    <div>
                      <strong className="text-slate-200">
                        {(exp.title as string) || 'Experiment'}
                      </strong>
                      <p className="text-muted-foreground text-[10px]">
                        {(exp.hypothesis as string) || ''}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase bg-emerald-500/10 text-emerald-300">
                      {(exp.status as string) || 'Validated'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Prototype Milestones */}
          {includeRoadmap && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-border/20 pb-1">
                <Calendar className="h-3.5 w-3.5" /> Roadmap & Milestones ({milestones.length})
              </h3>
              <div className="space-y-2 text-[11px]">
                {milestones.slice(0, 2).map((m: Record<string, unknown>, idx: number) => (
                  <div
                    key={idx}
                    className="bg-[#181d27] p-3 rounded-lg border border-border/40 flex justify-between items-center"
                  >
                    <div>
                      <strong className="text-slate-200">
                        {(m.title as string) || 'Milestone'}
                      </strong>
                      <p className="text-muted-foreground text-[10px]">
                        {(m.deliverables as string) || ''}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase bg-sky-500/10 text-sky-300">
                      {(m.phase as string) || 'Prototype'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons Footer */}
        <ModalFooter className="pt-4 border-t border-border/40 flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleDownloadHTML}
            className="text-xs font-semibold border-border/60"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" /> Save as HTML
          </Button>

          <div className="flex items-center space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="text-xs font-semibold border-border/60"
            >
              Cancel
            </Button>

            <Button
              type="button"
              disabled={isExporting}
              onClick={handlePrint}
              className="bg-sky-400 text-slate-950 hover:bg-sky-300 font-bold text-xs px-6 shadow-md shadow-sky-500/20 disabled:opacity-40"
            >
              <Printer className="mr-1.5 h-4 w-4" />{' '}
              {isExporting ? 'Generating PDF...' : 'Print / Save as PDF'}
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
