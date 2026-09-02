/**
 * StickyNote.tsx
 *
 * 1:1 Pixel-Perfect 3D Post-it Sticky Note Component for Startup Toolkit.
 * Supports realistic tilt rotations, inline content editing, color theme selection
 * (yellow, blue, green, pink, purple), and deletion triggers.
 */

import { useState } from 'react'
import { Trash2, Palette, Check } from 'lucide-react'
import type { NoteColor } from '@/types/database.types'

export interface NoteItem {
  id: string
  content: string
  color: NoteColor
  author?: string
}

interface StickyNoteProps {
  note: NoteItem
  rotationDeg?: number
  onChangeContent?: (id: string, content: string) => void
  onChangeColor?: (id: string, color: NoteColor) => void
  onDelete?: (id: string) => void
}

const COLOR_CLASSES: Record<NoteColor, { bg: string; text: string; border: string; dot: string }> = {
  yellow: {
    bg: 'bg-[#fef08a]',
    text: 'text-slate-900',
    border: 'border-amber-300',
    dot: 'bg-amber-400',
  },
  blue: {
    bg: 'bg-[#bae6fd]',
    text: 'text-slate-900',
    border: 'border-sky-300',
    dot: 'bg-sky-400',
  },
  green: {
    bg: 'bg-[#bbf7d0]',
    text: 'text-slate-900',
    border: 'border-emerald-300',
    dot: 'bg-emerald-400',
  },
  pink: {
    bg: 'bg-[#fbcfe8]',
    text: 'text-slate-900',
    border: 'border-rose-300',
    dot: 'bg-rose-400',
  },
  purple: {
    bg: 'bg-[#e9d5ff]',
    text: 'text-slate-900',
    border: 'border-purple-300',
    dot: 'bg-purple-400',
  },
}

export function StickyNote({
  note,
  rotationDeg = -1,
  onChangeContent,
  onChangeColor,
  onDelete,
}: StickyNoteProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showPalette, setShowPalette] = useState(false)
  const [content, setContent] = useState(note.content)

  const theme = COLOR_CLASSES[note.color] || COLOR_CLASSES.yellow

  const handleBlur = () => {
    setIsEditing(false)
    if (content !== note.content && onChangeContent) {
      onChangeContent(note.id, content)
    }
  }

  return (
    <div
      style={{ transform: `rotate(${rotationDeg}deg)` }}
      className={`group relative p-3.5 rounded-xl border shadow-lg transition-all duration-200 ${theme.bg} ${theme.text} ${theme.border} space-y-2 hover:shadow-xl hover:scale-[1.02] hover:z-10`}
    >
      {/* Note Header Toolbar */}
      <div className="flex items-center justify-between opacity-80 group-hover:opacity-100 transition-opacity pb-1 border-b border-black/10">
        <span className="text-[10px] font-bold uppercase tracking-wider font-mono opacity-60">
          Note
        </span>

        <div className="flex items-center space-x-1">
          {/* Color Palette Toggle */}
          <button
            type="button"
            onClick={() => setShowPalette(!showPalette)}
            className="p-1 rounded hover:bg-black/10 transition-colors"
            title="Change Color"
          >
            <Palette className="h-3 w-3" />
          </button>

          {/* Delete Button */}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(note.id)}
              className="p-1 rounded hover:bg-black/10 text-red-700 transition-colors"
              title="Delete Note"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Color Selector Popover */}
      {showPalette && (
        <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900 text-white shadow-xl space-x-1.5 z-20">
          {(['yellow', 'blue', 'green', 'pink', 'purple'] as NoteColor[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                onChangeColor && onChangeColor(note.id, c)
                setShowPalette(false)
              }}
              className={`h-4 w-4 rounded-full ${COLOR_CLASSES[c].dot} flex items-center justify-center transition-transform hover:scale-125`}
            >
              {note.color === c && <Check className="h-2.5 w-2.5 text-slate-950 stroke-[3]" />}
            </button>
          ))}
        </div>
      )}

      {/* Editable Text Area */}
      {isEditing ? (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleBlur}
          autoFocus
          rows={3}
          className="w-full bg-transparent text-xs font-medium focus:outline-none resize-none leading-relaxed"
        />
      ) : (
        <p
          onClick={() => setIsEditing(true)}
          className="text-xs font-medium leading-relaxed cursor-text min-h-[48px] whitespace-pre-wrap"
        >
          {content || 'Click to type note insights...'}
        </p>
      )}
    </div>
  )
}
