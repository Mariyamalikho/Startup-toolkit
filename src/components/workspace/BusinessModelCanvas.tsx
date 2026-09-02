/**
 * BusinessModelCanvas.tsx
 *
 * 1:1 Pixel-Perfect Interactive 9-Box Business Model Canvas for Startup Toolkit.
 * Alexander Osterwalder's strategic framework structuring Key Partners, Activities,
 * Resources, Value Propositions, Relationships, Channels, Customer Segments, Cost Structure,
 * and Revenue Streams with 3D post-it notes and automatic Supabase state persistence.
 */

import React, { useState } from 'react'
import { StickyNote, type NoteItem } from './StickyNote'
import {
  Users,
  Zap,
  Box,
  Gem,
  Heart,
  Radio,
  UserCheck,
  DollarSign,
  TrendingUp,
  Plus,
} from 'lucide-react'
import type { NoteColor, Project } from '@/types/database.types'
import { useProjectStore } from '@/store/projectStore'

export type BMCKey =
  | 'key_partners'
  | 'key_activities'
  | 'key_resources'
  | 'value_propositions'
  | 'customer_relationships'
  | 'channels'
  | 'customer_segments'
  | 'cost_structure'
  | 'revenue_streams'

interface BMCState {
  key_partners: NoteItem[]
  key_activities: NoteItem[]
  key_resources: NoteItem[]
  value_propositions: NoteItem[]
  customer_relationships: NoteItem[]
  channels: NoteItem[]
  customer_segments: NoteItem[]
  cost_structure: NoteItem[]
  revenue_streams: NoteItem[]
}

interface BusinessModelCanvasProps {
  project: Project
}

const DEFAULT_BMC_STATE: BMCState = {
  key_partners: [
    { id: 'kp-1', content: 'Cloud Infrastructure Providers (AWS / Supabase)', color: 'blue' },
    { id: 'kp-2', content: 'Startup Accelerators & Incubators', color: 'yellow' },
  ],
  key_activities: [
    { id: 'ka-1', content: 'Continuous product engineering & feature iteration', color: 'yellow' },
    { id: 'ka-2', content: 'Founder community building & content marketing', color: 'green' },
  ],
  key_resources: [
    { id: 'kr-1', content: 'Proprietary interactive methodology canvas algorithms', color: 'purple' },
    { id: 'kr-2', content: 'Experienced full-stack engineering team', color: 'blue' },
  ],
  value_propositions: [
    { id: 'vp-1', content: 'All-in-one methodology workspace for early-stage founders', color: 'green' },
    { id: 'vp-2', content: 'Automated 1000ms debounced cloud autosave', color: 'yellow' },
  ],
  customer_relationships: [
    { id: 'cr-1', content: 'Self-serve automated onboarding with inline guidance', color: 'pink' },
    { id: 'cr-2', content: 'Dedicated Discord community support channel', color: 'blue' },
  ],
  channels: [
    { id: 'ch-1', content: 'Organic Product Hunt launch & social build-in-public', color: 'purple' },
    { id: 'ch-2', content: 'SEO founder guides and startup toolkit templates', color: 'yellow' },
  ],
  customer_segments: [
    { id: 'cs-1', content: 'Solo Technical Founders & Indie Hackers', color: 'green' },
    { id: 'cs-2', content: 'Early-Stage Accelerator Cohort Teams', color: 'blue' },
  ],
  cost_structure: [
    { id: 'cst-1', content: 'Serverless backend database & hosting infrastructure', color: 'pink' },
    { id: 'cst-2', content: 'Domain registration & SSL certificate security', color: 'purple' },
  ],
  revenue_streams: [
    { id: 'rev-1', content: 'Freemium tier with 3 active venture workspaces', color: 'green' },
    { id: 'rev-2', content: 'Pro Founder Subscription ($19/mo per venture)', color: 'yellow' },
  ],
}

const BMC_BLOCK_CONFIG: Record<
  BMCKey,
  { title: string; subtitle: string; icon: React.ReactNode; defaultColor: NoteColor; headerBg: string }
> = {
  key_partners: {
    title: 'Key Partners',
    subtitle: 'Suppliers, alliances & strategic partners',
    icon: <Users className="h-4 w-4 text-sky-400" />,
    defaultColor: 'blue',
    headerBg: 'bg-sky-400/10 border-sky-400/30',
  },
  key_activities: {
    title: 'Key Activities',
    subtitle: 'Crucial tasks required to deliver value',
    icon: <Zap className="h-4 w-4 text-amber-400" />,
    defaultColor: 'yellow',
    headerBg: 'bg-amber-400/10 border-amber-400/30',
  },
  key_resources: {
    title: 'Key Resources',
    subtitle: 'Physical, financial & intellectual assets',
    icon: <Box className="h-4 w-4 text-purple-400" />,
    defaultColor: 'purple',
    headerBg: 'bg-purple-400/10 border-purple-400/30',
  },
  value_propositions: {
    title: 'Value Propositions',
    subtitle: 'Core bundle of products & services creating value',
    icon: <Gem className="h-4 w-4 text-emerald-400" />,
    defaultColor: 'green',
    headerBg: 'bg-emerald-400/10 border-emerald-400/30',
  },
  customer_relationships: {
    title: 'Customer Relationships',
    subtitle: 'Relationship types established with customers',
    icon: <Heart className="h-4 w-4 text-rose-400" />,
    defaultColor: 'pink',
    headerBg: 'bg-rose-400/10 border-rose-400/30',
  },
  channels: {
    title: 'Channels',
    subtitle: 'Touchpoints delivering value to customers',
    icon: <Radio className="h-4 w-4 text-indigo-400" />,
    defaultColor: 'purple',
    headerBg: 'bg-indigo-400/10 border-indigo-400/30',
  },
  customer_segments: {
    title: 'Customer Segments',
    subtitle: 'Target user personas & niche markets',
    icon: <UserCheck className="h-4 w-4 text-sky-400" />,
    defaultColor: 'green',
    headerBg: 'bg-sky-400/10 border-sky-400/30',
  },
  cost_structure: {
    title: 'Cost Structure',
    subtitle: 'Major fixed & variable operating expenses',
    icon: <DollarSign className="h-4 w-4 text-rose-400" />,
    defaultColor: 'pink',
    headerBg: 'bg-rose-400/10 border-rose-400/30',
  },
  revenue_streams: {
    title: 'Revenue Streams',
    subtitle: 'Cash generated from customer transactions',
    icon: <TrendingUp className="h-4 w-4 text-emerald-400" />,
    defaultColor: 'yellow',
    headerBg: 'bg-emerald-400/10 border-emerald-400/30',
  },
}

export function BusinessModelCanvas({ project }: BusinessModelCanvasProps) {
  const { updateUserProject } = useProjectStore()

  const [bmcData, setBmcData] = useState<BMCState>(() => {
    if (project.canvas && typeof project.canvas === 'object') {
      return { ...DEFAULT_BMC_STATE, ...project.canvas }
    }
    return DEFAULT_BMC_STATE
  })

  const saveBMC = (newState: BMCState) => {
    setBmcData(newState)
    updateUserProject(project.id, {
      canvas: newState,
    })
  }

  const handleAddNote = (key: BMCKey) => {
    const config = BMC_BLOCK_CONFIG[key]
    const newNote: NoteItem = {
      id: `${key}-${Date.now()}`,
      content: '',
      color: config.defaultColor,
    }

    const updated = {
      ...bmcData,
      [key]: [...bmcData[key], newNote],
    }
    saveBMC(updated)
  }

  const handleContentChange = (key: BMCKey, id: string, content: string) => {
    const updated = {
      ...bmcData,
      [key]: bmcData[key].map((n) => (n.id === id ? { ...n, content } : n)),
    }
    saveBMC(updated)
  }

  const handleColorChange = (key: BMCKey, id: string, color: NoteColor) => {
    const updated = {
      ...bmcData,
      [key]: bmcData[key].map((n) => (n.id === id ? { ...n, color } : n)),
    }
    saveBMC(updated)
  }

  const handleDeleteNote = (key: BMCKey, id: string) => {
    const updated = {
      ...bmcData,
      [key]: bmcData[key].filter((n) => n.id !== id),
    }
    saveBMC(updated)
  }

  const renderBlock = (key: BMCKey, extraClasses = '') => {
    const config = BMC_BLOCK_CONFIG[key]
    const notes = bmcData[key] || []

    return (
      <div
        className={`bg-[#181d27] border border-border/60 rounded-2xl p-4 shadow-lg space-y-3 flex flex-col justify-between min-h-[220px] ${extraClasses}`}
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
            <div className="flex items-center space-x-2">
              <div className={`h-7 w-7 rounded-lg border flex items-center justify-center ${config.headerBg}`}>
                {config.icon}
              </div>
              <div>
                <h3 className="text-xs font-bold text-white tracking-wide">{config.title}</h3>
                <p className="text-[10px] text-muted-foreground line-clamp-1">{config.subtitle}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleAddNote(key)}
              className="p-1 rounded-lg bg-sky-400/10 text-sky-400 hover:bg-sky-400/20 text-[11px] font-bold flex items-center space-x-1 transition-colors shrink-0"
              title="Add Note"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Notes Container */}
        <div className="space-y-2 py-1 flex-1 items-start">
          {notes.map((note, idx) => (
            <StickyNote
              key={note.id}
              note={note}
              rotationDeg={idx % 2 === 0 ? -1 : 1}
              onChangeContent={(id, content) => handleContentChange(key, id, content)}
              onChangeColor={(id, color) => handleColorChange(key, id, color)}
              onDelete={(id) => handleDeleteNote(key, id)}
            />
          ))}

          {notes.length === 0 && (
            <div
              onClick={() => handleAddNote(key)}
              className="border border-dashed border-border/40 rounded-xl p-4 text-center text-muted-foreground text-[11px] cursor-pointer hover:border-sky-400/40 hover:text-sky-300 transition-colors"
            >
              + Add {config.title} note
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex items-center justify-between bg-[#181d27]/70 border border-border/40 p-4 rounded-2xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Business Model Canvas (9-Box Grid)</span>
            <span className="text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
              Strategic Blueprint
            </span>
          </h2>
          <p className="text-xs text-muted-foreground pt-0.5">
            Osterwalder&apos;s 9 building blocks mapping your value proposition, infrastructure, customers, and finances.
          </p>
        </div>
      </div>

      {/* 9-Box Grid Layout */}
      <div className="space-y-4">
        {/* Top 7 Blocks in 5 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Column 1: Key Partners */}
          {renderBlock('key_partners')}

          {/* Column 2: Key Activities & Key Resources stacked */}
          <div className="space-y-4 flex flex-col justify-between">
            {renderBlock('key_activities')}
            {renderBlock('key_resources')}
          </div>

          {/* Column 3: Value Propositions (Tall center block) */}
          {renderBlock('value_propositions', 'md:col-span-1')}

          {/* Column 4: Customer Relationships & Channels stacked */}
          <div className="space-y-4 flex flex-col justify-between">
            {renderBlock('customer_relationships')}
            {renderBlock('channels')}
          </div>

          {/* Column 5: Customer Segments */}
          {renderBlock('customer_segments')}
        </div>

        {/* Bottom Row: Cost Structure & Revenue Streams (2 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderBlock('cost_structure')}
          {renderBlock('revenue_streams')}
        </div>
      </div>
    </div>
  )
}
