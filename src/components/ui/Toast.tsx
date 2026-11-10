/**
 * Toast.tsx
 *
 * React UI layer for the Toast notification system.
 * State is managed by the singleton `toastStore`; this file
 * is responsible only for rendering and dismissal controls.
 */

import React, { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, XCircle, AlertTriangle, Info, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toastStore } from '@/store/toastStore'
import type { ToastItem, ToastInput, ToastVariant } from '@/store/toastStore'

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

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>(() => toastStore.getToasts())

  useEffect(() => {
    return toastStore.subscribe(setToasts)
  }, [])

  return (
    <>
      {children}
      <ToastViewport toasts={toasts} />
    </>
  )
}

const variantConfig: Record<ToastVariant, { icon: React.ReactNode; iconColor: string }> = {
  success: {
    icon: <CheckCircle2 className="h-4 w-4 flex-shrink-0" />,
    iconColor: 'text-emerald-400',
  },
  error: {
    icon: <XCircle className="h-4 w-4 flex-shrink-0" />,
    iconColor: 'text-red-400',
  },
  warning: {
    icon: <AlertTriangle className="h-4 w-4 flex-shrink-0" />,
    iconColor: 'text-amber-400',
  },
  info: {
    icon: <Info className="h-4 w-4 flex-shrink-0" />,
    iconColor: 'text-sky-400',
  },
  loading: {
    icon: <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin" />,
    iconColor: 'text-muted-foreground',
  },
}

function ToastCard({ toast }: { toast: ToastItem }) {
  const { icon, iconColor } = variantConfig[toast.variant]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.15 }}
      className="relative flex w-full items-start gap-3 rounded-lg border border-border/80 bg-surface shadow-lg p-3.5 pr-8"
    >
      <span className={cn('mt-0.5', iconColor)}>{icon}</span>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-foreground leading-snug">{toast.title}</p>
        {toast.description && (
          <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
            {toast.description}
          </p>
        )}
      </div>

      <button
        onClick={() => toastStore.remove(toast.id)}
        aria-label="Dismiss notification"
        className="absolute right-2 top-2 rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  )
}

function ToastViewport({ toasts }: { toasts: ToastItem[] }) {
  return createPortal(
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2 pointer-events-none"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastCard toast={t} />
          </div>
        ))}
      </AnimatePresence>
    </div>,
    document.body,
  )
}
