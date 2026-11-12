/**
 * PitchDeckPage.tsx
 *
 * Investor Pitch Deck Page for Startup Toolkit.
 * Compiles active venture canvas data into PitchDeckSlides presenter view.
 */

import { useNavigate } from 'react-router-dom'
import { useProjectStore } from '@/store/projectStore'
import { PitchDeckSlides } from '@/components/pitch/PitchDeckSlides'
import { ChevronStepperRibbon } from '@/components/navigation/ChevronStepperRibbon'
import { EmptyError } from '@/components/ui/EmptyState'
import { usePageMetadata } from '@/hooks/usePageMetadata'

export function PitchDeckPage() {
  const navigate = useNavigate()
  const { projects, activeProject } = useProjectStore()

  const project = activeProject || projects[0]

  usePageMetadata({
    title: project ? `${project.title} - Investor Pitch Deck` : 'Investor Pitch Deck',
    description: project
      ? `Generate, preview, and export 10-slide investor pitch decks directly from ${project.title} canvas data.`
      : 'Generate and export investor-ready pitch decks directly from lean canvas data.',
    canonicalPath: '/pitch-deck',
  })

  if (!project) {
    return (
      <EmptyError
        message="No active startup venture found. Select or create a venture from your dashboard."
        onRetry={() => navigate('/dashboard')}
      />
    )
  }

  return (
    <div className="space-y-6">
      <ChevronStepperRibbon />
      <PitchDeckSlides project={project} />
    </div>
  )
}
