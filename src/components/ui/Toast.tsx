/**
 * Toast.tsx
 *
 * React UI layer for the Toast notification system.
 * State is managed by the singleton `toastStore` — this file
 * is responsible only for rendering and animations.
 *
 * Public API:
 *   - <ToastProvider>   → mount once in main.tsx (already done)
 *   - useToast()        → { toast, dismiss, dismissAll, promise }
 */

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, XCircle, AlertTriangle, Info, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toastStore } from '@/store/toastStore'
import type { ToastItem, ToastInput, ToastVariant } from '@/store/toastStore'

// Re-export types for convenience
export type { ToastVariant, ToastItem }

// ─── useToast hook ────────────────────────────────────────────────────────────

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const toast = useCallback((input: ToastInput) => toastStore.add(input), [])

  const dismiss = useCallback((id: string) => toastStore.remove(id), [])

  const dismissAll = useCallback(() => toastStore.removeAll(), [])

  const promise = useCallback(
    <T,>(
      p: Promise<T>,
      messages: {
        loading: string
        success: string | ((data: T) => string)
        error: string | ((err: unknown) => string)
        description?: string
      },
    ) => toastStore.promise(p, messages),
    [],
  )

  return { toast, dismiss, dismissAll, promise }
}

// ─── ToastProvider ────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>(() => toastStore.getToasts())

  // Subscribe to the singleton store
  useEffect(() => {
    return toastStore.subscribe(setToasts)
  }, [])

  // Global Escape key → dismiss the most recent toast
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && toasts.length > 0) {
        toastStore.remove(toasts[0].id)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [toasts])

  return (
    <>
      {children}
      <ToastViewport toasts={toasts} />
    </>
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
  loading: {
    icon: <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin" />,
    bar: 'bg-muted-foreground',
    iconColor: 'text-muted-foreground',
  },
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ToastProgressBar({ duration, addedAt }: { duration: number; addedAt: number }) {
  const [width, setWidth] = useState(100)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (duration === 0) return

    const tick = () => {
      const elapsed = Date.now() - addedAt
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
      setWidth(remaining)
      if (remaining > 0) rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [duration, addedAt])

  if (duration === 0) return null

  return (
    <div className="absolute bottom-0 left-0 h-0.5 w-full bg-border overflow-hidden rounded-b-xl">
      <div
        className="h-full bg-muted-foreground/40 transition-none"
        style={{ width: `${width}%` }}
      />
    </div>
  )
}

// ─── Single Toast Item ────────────────────────────────────────────────────────

function ToastItem({ toast }: { toast: ToastItem }) {
  const { icon, bar, iconColor } = variantConfig[toast.variant]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 64, scale: 0.94 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 64, scale: 0.94 }}
      transition={{ type: 'spring', damping: 26, stiffness: 300 }}
      className="relative flex w-full items-start gap-3 overflow-hidden rounded-xl border border-border bg-surface shadow-lg p-4 pr-9 pb-5"
    >
      {/* Colored left accent bar */}
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
        onClick={() => toastStore.remove(toast.id)}
        aria-label="Dismiss notification"
        className="absolute right-2 top-2 rounded-md p-1 opacity-50 transition-opacity hover:opacity-100 hover:bg-muted"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      {/* Auto-dismiss progress bar */}
      <ToastProgressBar duration={toast.duration} addedAt={toast.addedAt} />
    </motion.div>
  )
}

// ─── Viewport ─────────────────────────────────────────────────────────────────

function ToastViewport({ toasts }: { toasts: ToastItem[] }) {
  return createPortal(
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-5 right-5 z-[100] flex w-80 flex-col gap-2 pointer-events-none"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} />
          </div>
        ))}
      </AnimatePresence>
    </div>,
    document.body,
  )
}
