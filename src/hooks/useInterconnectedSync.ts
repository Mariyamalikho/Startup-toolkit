/**
 * useInterconnectedSync.ts
 *
 * Custom hook providing interconnected data state synchronization across methodology tools:
 * AI Problem Generator <-> Empathy Map <-> Business Model Canvas <-> Pitch Deck <-> Experiments <-> Roadmap.
 * Ensures customer persona updates or value proposition changes in one tool flow into connected tools automatically.
 */

import type { Project } from '@/types/database.types'
import { useProjectStore } from '@/store/projectStore'

export interface InterconnectedData {
  customerPersona: string
  problemStatement: string
  valuePropositions: string[]
  keyMetrics: string[]
}

export function useInterconnectedSync(project: Project) {
  const { updateUserProject } = useProjectStore()

  // Extract shared interconnected insights across tool payloads
  const getInterconnectedData = (): InterconnectedData => {
    const bmc = project.canvas || {}

    const customerPersona =
      (bmc.customer_segments as any[])?.[0]?.content ||
      'Solo Technical Founders & Accelerator Teams'

    const problemStatement = project.description || 'High operational friction in manual founder workflows.'

    const valuePropositions = (bmc.value_propositions as any[])?.map((v) =>
      typeof v === 'string' ? v : v.content,
    ) || ['All-in-one methodology workspace', 'Real-time debounced cloud autosave']

    const keyMetrics = ['Conversion Rate >= 25%', 'Active Session Duration > 8 min']

    return {
      customerPersona,
      problemStatement,
      valuePropositions,
      keyMetrics,
    }
  }

  // Sync AI Co-Pilot Problem & Value Prop results across Empathy Map & BMC
  const syncAIGeneratorToCanvases = async (
    persona: string,
    problem: string,
    valueProps: string[],
  ) => {
    const existingEmpathy = project.empathy_map || {}
    const existingBMC = project.canvas || {}

    // Updated Empathy Map Payload
    const updatedEmpathy = {
      ...existingEmpathy,
      thinks_and_feels: [
        `Needs solution for: "${problem}"`,
        ...(existingEmpathy.thinks_and_feels || []),
      ],
      pains: [
        `Primary Pain Point: ${problem}`,
        ...(existingEmpathy.pains || []),
      ],
    }

    // Updated BMC Payload
    const updatedBMC = {
      ...existingBMC,
      customer_segments: [
        { id: `cs-ai-${Date.now()}`, content: persona, color: 'green' },
        ...((existingBMC.customer_segments as any[]) || []),
      ],
      value_propositions: [
        ...valueProps.map((vp, i) => ({
          id: `vp-ai-${Date.now()}-${i}`,
          content: vp,
          color: i % 2 === 0 ? 'green' : 'yellow',
        })),
        ...((existingBMC.value_propositions as any[]) || []),
      ],
    }

    await updateUserProject(project.id, {
      description: problem,
      empathy_map: updatedEmpathy,
      canvas: updatedBMC,
    })
  }

  return {
    interconnectedData: getInterconnectedData(),
    syncAIGeneratorToCanvases,
  }
}
