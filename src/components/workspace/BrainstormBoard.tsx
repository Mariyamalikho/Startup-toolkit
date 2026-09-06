/**
 * BrainstormBoard.tsx
 *
 * 1:1 Pixel-Perfect Interactive Freeform Brainstorming Board for Startup Toolkit.
 * Allows founders to dump raw startup ideas, feature concepts, growth hacks, and risk notes
 * onto a freeform canvas using 3D post-it sticky notes with drag-and-drop, category filters,
 * and automatic cloud state persistence.
 */

import React, { useState } from 'react'
import { StickyNote, type NoteItem } from './StickyNote'
import { Lightbulb, Plus, Zap, Target, AlertTriangle } from 'lucide-react'
import type { NoteColor, Project } from '@/types/database.types'
import { useProjectStore } from '@/store/projectStore'
import { useDragAndDrop } from '@/hooks/useDragAndDrop'

export type CategoryTag = 'ideation' | 'features' | 'growth' | 'risks'

export interface BrainstormNoteItem extends NoteItem {
  category: CategoryTag
}

interface BrainstormBoardProps {
  project: Project
}

const DEFAULT_BRAINSTORM_NOTES: BrainstormNoteItem[] = [
  {
    id: 'bs-1',
    content: 'Build AI Co-Pilot prompt generator for 1-sentence problem statements.',
    color: 'yellow',
    category: 'ideation',
  },
  {
    id: 'bs-2',
    content: '1-click export of pitch deck slides to printable PDF format.',
    color: 'blue',
    category: 'features',
  },
  {
    id: 'bs-3',
    content: 'Launch build-in-public campaign on Twitter and LinkedIn.',
    color: 'green',
    category: 'growth',
  },
  {
    id: 'bs-4',
    content: 'Ensure 1000ms debounced autosave prevents data collisions.',
    color: 'pink',
    category: 'risks',
  },
  {
    id: 'bs-5',
    content: 'Integrate drag-and-drop sticky note positioning across canvas blocks.',
    color: 'purple',
    category: 'features',
  },
  {
    id: 'bs-6',
    content: 'Partner with startup accelerators for cohort onboarding.',
    color: 'green',
    category: 'growth',
  },
]

const CATEGORY_CONFIG: Record<
  CategoryTag,
  { label: string; icon: React.ReactNode; color: string; defaultNoteColor: NoteColor }
> = {
  ideation: {
    label: 'Ideation',
    icon: <Lightbulb className="h-3.5 w-3.5 text-amber-400" />,
    color: 'bg-amber-400/10 text-amber-300 border-amber-400/30',
    defaultNoteColor: 'yellow',
  },
  features: {
    label: 'Features',
    icon: <Zap className="h-3.5 w-3.5 text-sky-400" />,
    color: 'bg-sky-400/10 text-sky-300 border-sky-400/30',
    defaultNoteColor: 'blue',
  },
  growth: {
    label: 'Growth',
    icon: <Target className="h-3.5 w-3.5 text-emerald-400" />,
    color: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/30',
    defaultNoteColor: 'green',
  },
  risks: {
    label: 'Risks',
    icon: <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />,
    color: 'bg-rose-400/10 text-rose-300 border-rose-400/30',
    defaultNoteColor: 'pink',
  },
}

export function BrainstormBoard({ project }: BrainstormBoardProps) {
  const { updateUserProject } = useProjectStore()
  const { activeDropzone, handleDragStart, handleDragOver, handleDragLeave, handleDrop, handleDragEnd } =
    useDragAndDrop()

  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [notes, setNotes] = useState<BrainstormNoteItem[]>(() => {
    if (project.brainstorm_notes && Array.isArray(project.brainstorm_notes)) {
      return project.brainstorm_notes as BrainstormNoteItem[]
    }
    return DEFAULT_BRAINSTORM_NOTES
  })

  const saveNotes = (newNotes: BrainstormNoteItem[]) => {
    setNotes(newNotes)
    updateUserProject(project.id, {
      brainstorm_notes: newNotes,
    })
  }

  const handleAddNote = (category: CategoryTag = 'ideation') => {
    const config = CATEGORY_CONFIG[category]
    const newNote: BrainstormNoteItem = {
      id: `bs-${Date.now()}`,
      content: '',
      color: config.defaultNoteColor,
      category,
    }
    saveNotes([...notes, newNote])
  }

  const handleContentChange = (id: string, content: string) => {
    const updated = notes.map((n) => (n.id === id ? { ...n, content } : n))
    saveNotes(updated)
  }

  const handleColorChange = (id: string, color: NoteColor) => {
    const updated = notes.map((n) => (n.id === id ? { ...n, color } : n))
    saveNotes(updated)
  }

  const handleDeleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id)
    saveNotes(updated)
  }

  const handleMoveNote = (id: string, _from: string, targetCategory: string) => {
    if (!targetCategory || targetCategory === 'all') return
    const updated = notes.map((n) =>
      n.id === id ? { ...n, category: targetCategory as CategoryTag } : n,
    )
    saveNotes(updated)
  }

  const filteredNotes = React.useMemo(() => {
    if (selectedCategory === 'all') return notes
    return notes.filter((n) => n.category === selectedCategory)
  }, [notes, selectedCategory])

  return (
    <div className="space-y-6">
      {/* Top Banner & Category Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#181d27]/70 border border-border/40 p-4 rounded-2xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Freeform Brainstorming Board</span>
            <span className="text-[10px] font-mono font-bold uppercase bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full">
              Ideation Sandbox
            </span>
          </h2>
          <p className="text-xs text-muted-foreground pt-0.5">
            Organize raw ideas, feature backlogs, growth channels, and risk factors with 3D post-it notes.
          </p>
        </div>

        {/* Category Pills & Add Action */}
        <div className="flex flex-wrap items-center gap-2">
          {/* All Category Pill */}
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === 'all'
                ? 'bg-sky-400 text-slate-950 shadow-sm'
                : 'bg-[#1c222e] text-muted-foreground hover:text-white border border-border/60'
            }`}
          >
            All Notes ({notes.length})
          </button>

          {(['ideation', 'features', 'growth', 'risks'] as CategoryTag[]).map((cat) => {
            const config = CATEGORY_CONFIG[cat]
            const count = notes.filter((n) => n.category === cat).length

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center space-x-1.5 transition-all ${
                  selectedCategory === cat
                    ? 'bg-sky-400 text-slate-950 border-sky-400 shadow-sm'
                    : `bg-[#1c222e] ${config.color}`
                }`}
              >
                {config.icon}
                <span className="capitalize">{config.label} ({count})</span>
              </button>
            )
          })}

          <button
            type="button"
            onClick={() => handleAddNote(selectedCategory === 'all' ? 'ideation' : (selectedCategory as CategoryTag))}
            className="px-3 py-1.5 rounded-xl bg-sky-400 text-slate-950 hover:bg-sky-300 font-extrabold text-xs flex items-center space-x-1 shadow-md shadow-sky-500/20"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>Add Idea</span>
          </button>
        </div>
      </div>

      {/* Freeform Board Dropzone Container */}
      <div
        onDragOver={(e) => handleDragOver(e, selectedCategory === 'all' ? 'ideation' : selectedCategory)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, selectedCategory === 'all' ? 'ideation' : selectedCategory, handleMoveNote)}
        className={`bg-[#181d27] border rounded-3xl p-6 min-h-[420px] transition-all duration-200 ${
          activeDropzone
            ? 'border-sky-400 bg-sky-400/10 shadow-[0_0_24px_rgba(56,189,248,0.25)] ring-2 ring-sky-400/40'
            : 'border-border/60'
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-start">
          {filteredNotes.map((note, idx) => (
            <StickyNote
              key={note.id}
              note={note}
              containerId={note.category}
              rotationDeg={idx % 3 === 0 ? -1.5 : idx % 2 === 0 ? 1.5 : -0.5}
              onChangeContent={(id, content) => handleContentChange(id, content)}
              onChangeColor={(id, color) => handleColorChange(id, color)}
              onDelete={(id) => handleDeleteNote(id)}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            />
          ))}

          {filteredNotes.length === 0 && (
            <div className="col-span-full border-2 border-dashed border-border/40 rounded-2xl p-12 text-center text-muted-foreground text-xs space-y-3">
              <p className="text-sm font-semibold text-slate-300">No brainstorming notes in this category yet.</p>
              <button
                type="button"
                onClick={() => handleAddNote(selectedCategory === 'all' ? 'ideation' : (selectedCategory as CategoryTag))}
                className="px-4 py-2 rounded-xl bg-sky-400/10 border border-sky-400/30 text-sky-400 font-bold hover:bg-sky-400/20 transition-colors"
              >
                + Add your first sticky note
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
