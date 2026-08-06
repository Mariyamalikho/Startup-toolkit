import React, { createContext, useContext, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, Info, Trash2, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

// ─── Types ───────────────────────────────────────────────────────────────────

type DialogVariant = 'default' | 'destructive' | 'warning' | 'success'

interface DialogContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

// ─── Context ──────────────────────────────────────────────────────────────────

const DialogContext = createContext<DialogContextType | undefined>(undefined)

// eslint-disable-next-line react-refresh/only-export-components
export function useDialog() {
  const ctx = useContext(DialogContext)
  if (!ctx) throw new Error('useDialog must be used within a Dialog')
  return ctx
}

// ─── Root ─────────────────────────────────────────────────────────────────────

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

export function Dialog({ open: controlledOpen, onOpenChange, children }: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  const setOpen = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next)
    onOpenChange?.(next)
  }

  return <DialogContext.Provider value={{ open, setOpen }}>{children}</DialogContext.Provider>
}

// ─── Trigger ──────────────────────────────────────────────────────────────────

export function DialogTrigger({
  children,
  asChild,
}: {
  children: React.ReactNode
  asChild?: boolean
}) {
  const { setOpen } = useDialog()

  if (asChild && React.isValidElement(children)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const child = children as React.ReactElement<any>
    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent) => {
        child.props.onClick?.(e)
        setOpen(true)
      },
    })
  }

  return <span onClick={() => setOpen(true)}>{children}</span>
}

// ─── Icon map ─────────────────────────────────────────────────────────────────

const variantConfig: Record<
  DialogVariant,
  { icon: React.ReactNode; iconBg: string; iconColor: string }
> = {
  default: {
    icon: <Info className="h-5 w-5" />,
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  destructive: {
    icon: <Trash2 className="h-5 w-5" />,
    iconBg: 'bg-red-100 dark:bg-red-900/30',
    iconColor: 'text-red-600 dark:text-red-400',
  },
  warning: {
    icon: <AlertTriangle className="h-5 w-5" />,
    iconBg: 'bg-amber-100 dark:bg-amber-900/30',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  success: {
    icon: <CheckCircle2 className="h-5 w-5" />,
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
}

// ─── Content ──────────────────────────────────────────────────────────────────

interface DialogContentProps {
  title: string
  description?: string
  variant?: DialogVariant
  confirmLabel?: string
  cancelLabel?: string
  onConfirm?: () => void
  onCancel?: () => void
  isLoading?: boolean
  className?: string
}

export function DialogContent({
  title,
  description,
  variant = 'default',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isLoading = false,
  className,
}: DialogContentProps) {
  const { open, setOpen } = useDialog()
  const { icon, iconBg, iconColor } = variantConfig[variant]

  const handleCancel = () => {
    setOpen(false)
    onCancel?.()
  }

  const handleConfirm = () => {
    onConfirm?.()
    if (!isLoading) setOpen(false)
  }

  // Close on Escape
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) handleCancel()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="dialog-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancel}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Panel */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              key="dialog-panel"
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 12 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className={cn(
                'relative w-full max-w-md rounded-2xl bg-surface border border-border p-6 shadow-2xl pointer-events-auto',
                className,
              )}
            >
              {/* Icon + Title */}
              <div className="flex items-start gap-4">
                <div className={cn('flex-shrink-0 rounded-xl p-2.5', iconBg)}>
                  <span className={iconColor}>{icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-semibold text-foreground leading-snug">{title}</h2>
                  {description && (
                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                      {description}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={handleCancel} disabled={isLoading}>
                  {cancelLabel}
                </Button>
                <Button
                  variant={variant === 'destructive' ? 'destructive' : 'default'}
                  size="sm"
                  onClick={handleConfirm}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing…' : confirmLabel}
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  )
}
