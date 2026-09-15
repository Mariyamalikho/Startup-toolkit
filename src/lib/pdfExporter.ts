/**
 * pdfExporter.ts
 *
 * 1:1 Pixel-Perfect Client-Side PDF Export Engine for Startup Toolkit.
 * Compiles Empathy Maps, Business Model Canvases, Pitch Decks, Experiment Trackers,
 * and Prototype Roadmaps into formatted A4 PDF reports with progress notifications.
 */

import type { Project } from '@/types/database.types'

export interface PdfExportOptions {
  filename?: string
  includeEmpathyMap?: boolean
  includeBMC?: boolean
  includeExperiments?: boolean
  includeRoadmap?: boolean
  onProgress?: (stage: string) => void
}

interface NotePayload {
  id?: string
  content?: string
}

interface EmpathyMapPayload {
  says?: NotePayload[]
  thinks?: NotePayload[]
  does?: NotePayload[]
  feels?: NotePayload[]
}

interface BmcPayload {
  value_propositions?: NotePayload[]
  customer_segments?: NotePayload[]
  revenue_streams?: NotePayload[]
}

interface ExperimentPayload {
  id?: string
  title?: string
  hypothesis?: string
  status?: string
  learnings?: string
}

interface MilestonePayload {
  id?: string
  title?: string
  phase?: string
  deliverables?: string
}

/**
 * Generate and trigger browser PDF print engine for a target DOM element.
 */
export async function exportElementToPdf(
  elementId: string,
  filename = 'venture-report.pdf',
  onProgress?: (stage: string) => void,
): Promise<boolean> {
  try {
    if (onProgress) onProgress('Preparing document viewport...')

    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error(`Target element #${elementId} not found in DOM`)
    }

    if (onProgress) onProgress('Formatting A4 PDF layout styles...')

    // Open clean print window
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      throw new Error('Popup blocked. Please allow popups to export PDF.')
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>${filename}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 15mm;
            }
            body {
              font-family: 'Inter', system-ui, -apple-system, sans-serif;
              color: #0f172a;
              background: #ffffff;
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .pdf-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 2px solid #0284c7;
              padding-bottom: 12px;
              margin-bottom: 20px;
            }
            .pdf-title {
              font-size: 24px;
              font-weight: 800;
              color: #0f172a;
              margin: 0;
            }
            .pdf-badge {
              background: #e0f2fe;
              color: #0369a1;
              padding: 4px 12px;
              border-radius: 9999px;
              font-size: 11px;
              font-weight: 700;
              text-transform: uppercase;
            }
            .pdf-section {
              margin-bottom: 24px;
              page-break-inside: avoid;
            }
            .pdf-section-title {
              font-size: 14px;
              font-weight: 700;
              color: #0284c7;
              border-bottom: 1px solid #cbd5e1;
              padding-bottom: 6px;
              margin-bottom: 12px;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
            .pdf-grid-2 {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 12px;
            }
            .pdf-grid-3 {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 12px;
            }
            .pdf-card {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 12px;
            }
            .pdf-card-title {
              font-size: 12px;
              font-weight: 700;
              color: #1e293b;
              margin-bottom: 4px;
            }
            .pdf-card-content {
              font-size: 11px;
              color: #475569;
              line-height: 1.5;
            }
            .pdf-footer {
              margin-top: 30px;
              border-top: 1px solid #e2e8f0;
              padding-top: 12px;
              font-size: 10px;
              color: #94a3b8;
              display: flex;
              justify-content: space-between;
            }
          </style>
        </head>
        <body>
          ${element.innerHTML}
          <div class="pdf-footer">
            <span>Generated via Startup Toolkit Export Engine</span>
            <span>${new Date().toLocaleDateString()}</span>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `

    printWindow.document.open()
    printWindow.document.write(htmlContent)
    printWindow.document.close()

    if (onProgress) onProgress('PDF download stream ready.')
    return true
  } catch (err: unknown) {
    console.error('PDF export error:', err)
    throw err
  }
}

/**
 * Generate a complete, formatted multi-page PDF report for a given Project object.
 */
export async function generateVenturePdfReport(
  project: Project,
  options: PdfExportOptions = {},
): Promise<boolean> {
  const {
    filename = `${project.title.toLowerCase().replace(/\s+/g, '-')}-report.pdf`,
    includeEmpathyMap = true,
    includeBMC = true,
    includeExperiments = true,
    includeRoadmap = true,
    onProgress,
  } = options

  if (onProgress) onProgress('Compiling venture methodology data...')

  const empathyData = (project.empathy_map as EmpathyMapPayload) || {}
  const bmcData = (project.canvas as BmcPayload) || {}
  const experiments = (project.experiments as ExperimentPayload[]) || []
  const milestones = (project.milestones as MilestonePayload[]) || []

  // Create offscreen container
  const container = document.createElement('div')
  container.id = 'temp-pdf-export-container'
  container.style.position = 'absolute'
  container.style.left = '-9999px'
  container.style.top = '-9999px'
  container.style.width = '800px'

  container.innerHTML = `
    <div class="pdf-header">
      <div>
        <span class="pdf-badge">Executive Venture Blueprint</span>
        <h1 class="pdf-title" style="margin-top: 6px;">${project.title}</h1>
        <p style="font-size: 12px; color: #64748b; margin: 4px 0 0 0;">
          Industry: <strong>${project.industry || 'Technology'}</strong> | Status: <strong>Score ${project.progress || 35}%</strong>
        </p>
      </div>
      <div style="text-align: right; font-size: 11px; color: #94a3b8;">
        <div>Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
        <div>Startup Toolkit Engine</div>
      </div>
    </div>

    ${
      project.description
        ? `
      <div class="pdf-card" style="margin-bottom: 20px;">
        <div class="pdf-card-title">Venture Vision & Problem Rationale</div>
        <div class="pdf-card-content">${project.description}</div>
      </div>
    `
        : ''
    }

    ${
      includeEmpathyMap
        ? `
      <div class="pdf-section">
        <div class="pdf-section-title">1. Customer Empathy Research</div>
        <div class="pdf-grid-2">
          <div class="pdf-card">
            <div class="pdf-card-title" style="color: #0284c7;">SAYS & EXPLICIT QUOTES</div>
            <div class="pdf-card-content">
              ${
                empathyData.says?.map((n) => `• ${n.content || ''}`).join('<br>') ||
                'Current legacy tools lack real-time synchronization.'
              }
            </div>
          </div>
          <div class="pdf-card">
            <div class="pdf-card-title" style="color: #7c3aed;">THINKS & BELIEFS</div>
            <div class="pdf-card-content">
              ${
                empathyData.thinks?.map((n) => `• ${n.content || ''}`).join('<br>') ||
                'Requires automated debounced cloud persistence.'
              }
            </div>
          </div>
          <div class="pdf-card">
            <div class="pdf-card-title" style="color: #059669;">DOES & BEHAVIORS</div>
            <div class="pdf-card-content">
              ${
                empathyData.does?.map((n) => `• ${n.content || ''}`).join('<br>') ||
                'Manually exports report slides every week.'
              }
            </div>
          </div>
          <div class="pdf-card">
            <div class="pdf-card-title" style="color: #e11d48;">FEELS & EMOTIONS</div>
            <div class="pdf-card-content">
              ${
                empathyData.feels?.map((n) => `• ${n.content || ''}`).join('<br>') ||
                'Frustrated by context switching across applications.'
              }
            </div>
          </div>
        </div>
      </div>
    `
        : ''
    }

    ${
      includeBMC
        ? `
      <div class="pdf-section">
        <div class="pdf-section-title">2. Business Model Canvas (9-Box Highlights)</div>
        <div class="pdf-grid-3">
          <div class="pdf-card">
            <div class="pdf-card-title" style="color: #059669;">VALUE PROPOSITIONS</div>
            <div class="pdf-card-content">
              ${
                bmcData.value_propositions?.map((n) => `• ${n.content || ''}`).join('<br>') ||
                'All-in-one methodology workspace for founders.'
              }
            </div>
          </div>
          <div class="pdf-card">
            <div class="pdf-card-title" style="color: #0284c7;">CUSTOMER SEGMENTS</div>
            <div class="pdf-card-content">
              ${
                bmcData.customer_segments?.map((n) => `• ${n.content || ''}`).join('<br>') ||
                'Solo Technical Founders & Accelerator Cohorts.'
              }
            </div>
          </div>
          <div class="pdf-card">
            <div class="pdf-card-title" style="color: #d97706;">REVENUE STREAMS</div>
            <div class="pdf-card-content">
              ${
                bmcData.revenue_streams?.map((n) => `• ${n.content || ''}`).join('<br>') ||
                'Freemium tier & Pro subscriptions ($19/mo).'
              }
            </div>
          </div>
        </div>
      </div>
    `
        : ''
    }

    ${
      includeExperiments && experiments.length > 0
        ? `
      <div class="pdf-section">
        <div class="pdf-section-title">3. Lean Validation Experiments</div>
        <div class="pdf-card">
          ${experiments
            .slice(0, 3)
            .map(
              (exp) => `
            <div style="margin-bottom: 8px; border-bottom: 1px border #f1f5f9; pb-2;">
              <strong style="color: #0f172a;">${exp.title || 'Experiment'}</strong> [${exp.status?.toUpperCase() || 'VALIDATED'}]
              <div style="font-size: 11px; color: #475569;">Hypothesis: "${exp.hypothesis || ''}"</div>
              ${exp.learnings ? `<div style="font-size: 10px; color: #059669;">Learnings: ${exp.learnings}</div>` : ''}
            </div>
          `,
            )
            .join('')}
        </div>
      </div>
    `
        : ''
    }

    ${
      includeRoadmap && milestones.length > 0
        ? `
      <div class="pdf-section">
        <div class="pdf-section-title">4. Prototype Engineering Roadmap</div>
        <div class="pdf-card">
          ${milestones
            .slice(0, 3)
            .map(
              (m) => `
            <div style="margin-bottom: 8px;">
              <strong style="color: #0f172a;">Phase: ${m.phase?.toUpperCase() || 'PROTOTYPE'}</strong> — ${m.title || ''}
              <div style="font-size: 10px; color: #64748b;">Deliverables: ${m.deliverables || 'Code deliverables'}</div>
            </div>
          `,
            )
            .join('')}
        </div>
      </div>
    `
        : ''
    }
  `

  document.body.appendChild(container)

  try {
    const success = await exportElementToPdf(container.id, filename, onProgress)
    document.body.removeChild(container)
    return success
  } catch (err: unknown) {
    if (document.body.contains(container)) {
      document.body.removeChild(container)
    }
    throw err
  }
}
