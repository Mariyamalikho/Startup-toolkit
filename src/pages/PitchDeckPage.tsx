/**
 * PitchDeckPage.tsx
 *
 * Investor Pitch Deck Page for Startup Toolkit.
 * Compiles active venture canvas data into PitchDeckSlides presenter view.
 */

import { useNavigate } from 'react-router-dom'
import { useProjectStore } from '@/store/projectStore'
import { PitchDeckSlides } from '@/components/pitch/PitchDeckSlides'
import { EmptyError } from '@/components/ui/EmptyState'

export function PitchDeckPage() {
  const navigate = useNavigate()
  const { projects, activeProject } = useProjectStore()

  const project = activeProject || projects[0]

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
      <PitchDeckSlides project={project} />
    </div>
  )
}
