import type { ElementType } from 'react'
import { Lightbulb, Users, Grid, FlaskConical, Calendar, FileText } from 'lucide-react'

export type StageId = 'brainstorm' | 'empathy' | 'canvas' | 'experiments' | 'roadmap' | 'pitch'
export type WorkspaceTab = Exclude<StageId, 'pitch'>

export interface Stage {
  id: StageId
  label: string
  icon: ElementType
  path: (projectId: string) => string
}

export const STAGES: Stage[] = [
  { id: 'brainstorm', label: 'Ideation', icon: Lightbulb, path: (id) => `/workspace/${id}` },
  { id: 'empathy', label: 'Empathy Map', icon: Users, path: () => '/empathy-map' },
  { id: 'canvas', label: 'Business Model', icon: Grid, path: () => '/business-model-canvas' },
  { id: 'experiments', label: 'Experiments', icon: FlaskConical, path: () => '/experiments' },
  { id: 'roadmap', label: 'Roadmap', icon: Calendar, path: () => '/prototype' },
  { id: 'pitch', label: 'Pitch Deck', icon: FileText, path: () => '/pitch-deck' },
]

export function stageFromPath(pathname: string): StageId {
  if (pathname === '/empathy-map') return 'empathy'
  if (pathname === '/business-model-canvas') return 'canvas'
  if (pathname === '/experiments') return 'experiments'
  if (pathname === '/prototype') return 'roadmap'
  if (pathname === '/pitch-deck') return 'pitch'
  return 'brainstorm'
}

export function isStagePath(pathname: string): boolean {
  return (
    pathname.startsWith('/workspace/') ||
    [
      '/empathy-map',
      '/business-model-canvas',
      '/experiments',
      '/prototype',
      '/pitch-deck',
    ].includes(pathname)
  )
}
