/**
 * database.types.ts
 *
 * TypeScript definitions matching the PostgreSQL database schema.
 * Defines types for Profile, Project, EmpathyMap, BusinessModelCanvas,
 * and BrainstormNote records and JSON payloads.
 */

export type ProjectStatus = 'active' | 'archived' | 'completed'

export type NoteColor = 'yellow' | 'blue' | 'green' | 'pink' | 'purple'

export interface Profile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  theme_preference?: 'light' | 'dark' | 'system'
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  user_id: string
  title: string
  description?: string
  industry?: string
  status: ProjectStatus
  progress: number // 0 - 100
  empathy_map?: Record<string, any>
  canvas?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface EmpathyMap {
  id: string
  project_id: string
  user_id: string
  thinks_and_feels: string[]
  sees: string[]
  hears: string[]
  says_and_does: string[]
  pains: string[]
  gains: string[]
  updated_at: string
}

export interface BusinessModelCanvas {
  id: string
  project_id: string
  user_id: string
  key_partners: string[]
  key_activities: string[]
  key_resources: string[]
  value_propositions: string[]
  customer_relationships: string[]
  channels: string[]
  customer_segments: string[]
  cost_structure: string[]
  revenue_streams: string[]
  updated_at: string
}

export interface BrainstormNote {
  id: string
  project_id: string
  user_id: string
  content: string
  color: NoteColor
  position_x: number
  position_y: number
  created_at: string
  updated_at: string
}
