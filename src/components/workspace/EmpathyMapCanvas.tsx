/**
 * EmpathyMapCanvas.tsx
 *
 * 1:1 Pixel-Perfect Interactive Empathy Map Canvas Tool for Startup Toolkit.
 * Features 4 core quadrant cards (Says, Thinks, Does, Feels), 2 bottom outcome cards
 * (Pains & Gains), 3D sticky note management, color presets, and autosave.
 */

import React, { useState } from 'react'
import { StickyNote, type NoteItem } from './StickyNote'
import { Plus, MessageSquare, Brain, Activity, Heart, AlertOctagon, Trophy } from 'lucide-react'
import type { NoteColor, Project } from '@/types/database.types'
import { useProjectStore } from '@/store/projectStore'
import { useDragAndDrop } from '@/hooks/useDragAndDrop'

export type QuadrantKey = 'says' | 'thinks' | 'does' | 'feels' | 'pains' | 'gains'

interface EmpathyMapState {
  says: NoteItem[]
  thinks: NoteItem[]
  does: NoteItem[]
  feels: NoteItem[]
  pains: NoteItem[]
  gains: NoteItem[]
}

interface EmpathyMapCanvasProps {
  project: Project
}

const DEFAULT_EMPATHY_STATE: EmpathyMapState = {
  says: [
    { id: 'say-1', content: 'Current solutions are too clunky and slow.', color: 'yellow' },
    { id: 'say-2', content: 'We need automated data syncing without code.', color: 'blue' },
  ],
  thinks: [
    { id: 'think-1', content: 'Am I spending too much budget on legacy tools?', color: 'purple' },
    { id: 'think-2', content: 'Will my team adopt this new workflow easily?', color: 'pink' },
  ],
  does: [
    { id: 'does-1', content: 'Manually exports CSV files every Friday afternoon.', color: 'green' },
    { id: 'does-2', content: 'Cross-checks spreadsheet data across 3 screens.', color: 'yellow' },
  ],
  feels: [
    { id: 'feel-1', content: 'Frustrated by repetitive administrative tasks.', color: 'pink' },
    { id: 'feel-2', content: 'Optimistic about modern AI productivity tools.', color: 'blue' },
  ],
  pains: [
    { id: 'pain-1', content: 'High error rate in manual spreadsheet entry.', color: 'pink' },
    { id: 'pain-2', content: 'Loss of momentum due to context switching.', color: 'purple' },
  ],
  gains: [
    { id: 'gain-1', content: 'Save 10+ hours per week on reporting.', color: 'green' },
    { id: 'gain-2', content: 'Real-time visibility for team stakeholders.', color: 'yellow' },
  ],
}

const QUADRANT_CONFIG: Record<
  QuadrantKey,
  { title: string; subtitle: string; icon: React.ReactNode; defaultColor: NoteColor; headerBg: string }
> = {
  says: {
    title: 'SAYS',
    subtitle: 'Quotes & explicit statements expressed by users',
    icon: <MessageSquare className="h-4 w-4 text-sky-400" />,
    defaultColor: 'yellow',
    headerBg: 'bg-sky-400/10 border-sky-400/30',
  },
  thinks: {
    title: 'THINKS',
    subtitle: 'Underlying thoughts, expectations & beliefs',
    icon: <Brain className="h-4 w-4 text-purple-400" />,
    defaultColor: 'purple',
    headerBg: 'bg-purple-400/10 border-purple-400/30',
  },
  does: {
    title: 'DOES',
    subtitle: 'Observed behaviors, actions & workarounds',
    icon: <Activity className="h-4 w-4 text-emerald-400" />,
    defaultColor: 'green',
    headerBg: 'bg-emerald-400/10 border-emerald-400/30',
  },
  feels: {
    title: 'FEELS',
    subtitle: 'Emotions, feelings, hopes & anxieties',
    icon: <Heart className="h-4 w-4 text-rose-400" />,
    defaultColor: 'pink',
    headerBg: 'bg-rose-400/10 border-rose-400/30',
  },
  pains: {
    title: 'PAINS & FRUSTRATIONS',
    subtitle: 'Obstacles, risks, fears & negative outcomes',
    icon: <AlertOctagon className="h-4 w-4 text-amber-400" />,
    defaultColor: 'pink',
    headerBg: 'bg-amber-400/10 border-amber-400/30',
  },
  gains: {
    title: 'GAINS & ASPIRATIONS',
    subtitle: 'Desired goals, benefits & positive outcomes',
    icon: <Trophy className="h-4 w-4 text-emerald-400" />,
    defaultColor: 'green',
    headerBg: 'bg-emerald-400/10 border-emerald-400/30',
  },
}

export function EmpathyMapCanvas({ project }: EmpathyMapCanvasProps) {
  const { updateUserProject } = useProjectStore()
  const {
    activeDropzone,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
  } = useDragAndDrop()

  // Initialize empathy state from project object or fallback to defaults
  const [empathyData, setEmpathyData] = useState<EmpathyMapState>(() => {
    if (project.empathy_map && typeof project.empathy_map === 'object') {
      return { ...DEFAULT_EMPATHY_STATE, ...project.empathy_map }
    }
    return DEFAULT_EMPATHY_STATE
  })

  const saveEmpathyMap = (newState: EmpathyMapState) => {
    setEmpathyData(newState)
    updateUserProject(project.id, {
      empathy_map: newState,
    })
  }

  const handleMoveNote = (id: string, from: string, to: string) => {
    if (from === to) return
    const fromKey = from as QuadrantKey
    const toKey = to as QuadrantKey

    const itemToMove = empathyData[fromKey]?.find((n) => n.id === id)
    if (!itemToMove) return

    const updated = {
      ...empathyData,
      [fromKey]: empathyData[fromKey].filter((n) => n.id !== id),
      [toKey]: [...empathyData[toKey], itemToMove],
    }
    saveEmpathyMap(updated)
  }

  const handleAddNote = (quadrant: QuadrantKey) => {
    const config = QUADRANT_CONFIG[quadrant]
    const newNote: NoteItem = {
      id: `${quadrant}-${Date.now()}`,
      content: '',
      color: config.defaultColor,
    }

    const updated = {
      ...empathyData,
      [quadrant]: [...empathyData[quadrant], newNote],
    }
    saveEmpathyMap(updated)
  }

  const handleContentChange = (quadrant: QuadrantKey, id: string, content: string) => {
    const updated = {
      ...empathyData,
      [quadrant]: empathyData[quadrant].map((n) => (n.id === id ? { ...n, content } : n)),
    }
    saveEmpathyMap(updated)
  }

  const handleColorChange = (quadrant: QuadrantKey, id: string, color: NoteColor) => {
    const updated = {
      ...empathyData,
      [quadrant]: empathyData[quadrant].map((n) => (n.id === id ? { ...n, color } : n)),
    }
    saveEmpathyMap(updated)
  }

  const handleDeleteNote = (quadrant: QuadrantKey, id: string) => {
    const updated = {
      ...empathyData,
      [quadrant]: empathyData[quadrant].filter((n) => n.id !== id),
    }
    saveEmpathyMap(updated)
  }

  const renderQuadrant = (key: QuadrantKey) => {
    const config = QUADRANT_CONFIG[key]
    const notes = empathyData[key] || []
    const isOver = activeDropzone === key

    return (
      <div
        onDragOver={(e) => handleDragOver(e, key)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, key, handleMoveNote)}
        className={`bg-[#181d27] border rounded-2xl p-5 shadow-lg space-y-4 flex flex-col justify-between min-h-[280px] transition-all duration-200 ${
          isOver
            ? 'border-sky-400 bg-sky-400/10 shadow-[0_0_20px_rgba(56,189,248,0.25)] ring-2 ring-sky-400/40 scale-[1.01]'
            : 'border-border/60'
        }`}
      >
        {/* Quadrant Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <div className="flex items-center space-x-2">
              <div className={`h-8 w-8 rounded-xl border flex items-center justify-center ${config.headerBg}`}>
                {config.icon}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">{config.title}</h3>
                <p className="text-[11px] text-muted-foreground">{config.subtitle}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleAddNote(key)}
              className="px-2.5 py-1 rounded-xl bg-sky-400/10 border border-sky-400/30 text-sky-400 hover:bg-sky-400/20 text-xs font-bold flex items-center space-x-1 transition-colors"
              title="Add Sticky Note"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Note</span>
            </button>
          </div>
        </div>

        {/* Sticky Notes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2 flex-1 items-start">
          {notes.map((note, idx) => (
            <StickyNote
              key={note.id}
              note={note}
              containerId={key}
              rotationDeg={idx % 2 === 0 ? -1.5 : 1.5}
              onChangeContent={(id, content) => handleContentChange(key, id, content)}
              onChangeColor={(id, color) => handleColorChange(key, id, color)}
              onDelete={(id) => handleDeleteNote(key, id)}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            />
          ))}

          {notes.length === 0 && (
            <div className="col-span-full border-2 border-dashed border-border/40 rounded-xl p-6 text-center text-muted-foreground text-xs space-y-2">
              <p>No research insights added to this section yet.</p>
              <button
                type="button"
                onClick={() => handleAddNote(key)}
                className="text-sky-400 font-bold hover:underline"
              >
                + Add first sticky note
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Description Banner */}
      <div className="flex items-center justify-between bg-[#181d27]/70 border border-border/40 p-4 rounded-2xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Empathy Map Canvas</span>
            <span className="text-[10px] font-mono font-bold uppercase bg-sky-400/20 text-sky-300 px-2 py-0.5 rounded-full">
              User Research Phase
            </span>
          </h2>
          <p className="text-xs text-muted-foreground pt-0.5">
            Capture qualitative user research insights across 4 key human behaviors to uncover unmet customer needs.
          </p>
        </div>
      </div>

      {/* 4 Core Behavior Quadrants */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderQuadrant('says')}
        {renderQuadrant('thinks')}
        {renderQuadrant('does')}
        {renderQuadrant('feels')}
      </div>

      {/* Bottom 2 Outcome Quadrants (Pains & Gains) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {renderQuadrant('pains')}
        {renderQuadrant('gains')}
      </div>
    </div>
  )
}
