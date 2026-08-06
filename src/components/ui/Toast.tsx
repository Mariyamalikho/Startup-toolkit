import React, { createContext, useCallback, useContext, useReducer } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number // ms, default 4000. Set 0 for persistent.
}

type ToastAction = { type: 'ADD'; toast: Toast } | { type: 'REMOVE'; id: string }

interface ToastContextType {
  toasts: Toast[]
  toast: (opts: Omit<Toast, 'id'>) => void
  dismiss: (id: string) => void
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

function toastReducer(state: Toast[], action: ToastAction): Toast[] {
  switch (action.type) {
    case 'ADD':
      // Cap at 5 toasts max
      return [action.toast, ...state].slice(0, 5)
    case 'REMOVE':
      return state.filter((t) => t.id !== action.id)
    default:
      return state
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextType | undefined>(undefined)

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, dispatch] = useReducer(toastReducer, [])

  const dismiss = useCallback((id: string) => {
    dispatch({ type: 'REMOVE', id })
  }, [])

  const toast = useCallback(
    (opts: Omit<Toast, 'id'>) => {
      const id = crypto.randomUUID()
      const duration = opts.duration ?? 4000
      dispatch({ type: 'ADD', toast: { ...opts, id } })
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration)
      }
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

// ─── Variant config ───────────────────────────────────────────────────────────

const variantConfig: Record<
  ToastVariant,
  { icon: React.ReactNode; bar: string; iconColor: string }
> = {
  success: {
    icon: <CheckCircle2 className="h-4 w-4 flex-shrink-0" />,
    bar: 'bg-emerald-500',
    iconColor: 'text-emerald-500',
  },
  error: {
    icon: <XCircle className="h-4 w-4 flex-shrink-0" />,
    bar: 'bg-red-500',
    iconColor: 'text-red-500',
  },
  warning: {
    icon: <AlertTriangle className="h-4 w-4 flex-shrink-0" />,
    bar: 'bg-amber-500',
    iconColor: 'text-amber-500',
  },
  info: {
    icon: <Info className="h-4 w-4 flex-shrink-0" />,
    bar: 'bg-blue-500',
    iconColor: 'text-blue-500',
  },
}

// ─── Single Toast Item ────────────────────────────────────────────────────────

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const variant = toast.variant ?? 'info'
  const { icon, bar, iconColor } = variantConfig[variant]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.95 }}
      transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      className={cn(
        'relative flex w-full items-start gap-3 overflow-hidden rounded-xl border border-border',
        'bg-surface shadow-lg p-4 pr-9',
      )}
    >
      {/* Colored left bar */}
      <span className={cn('absolute left-0 top-0 h-full w-1 rounded-l-xl', bar)} />

      {/* Icon */}
      <span className={cn('mt-0.5', iconColor)}>{icon}</span>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground leading-snug">{toast.title}</p>
        {toast.description && (
          <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
            {toast.description}
          </p>
        )}
      </div>

      {/* Dismiss button */}
      <button
        onClick={() => onDismiss(toast.id)}
        className="absolute right-2 top-2 rounded-md p-1 opacity-50 transition-opacity hover:opacity-100 hover:bg-muted"
      >
        <X className="h-3.5 w-3.5" />
        <span className="sr-only">Dismiss</span>
      </button>
    </motion.div>
  )
}

// ─── Viewport (the fixed container) ──────────────────────────────────────────

function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: Toast[]
  onDismiss: (id: string) => void
}) {
  return createPortal(
    <div className="fixed bottom-5 right-5 z-[100] flex w-80 flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onDismiss={onDismiss} />
          </div>
        ))}
      </AnimatePresence>
    </div>,
    document.body,
  )
}
