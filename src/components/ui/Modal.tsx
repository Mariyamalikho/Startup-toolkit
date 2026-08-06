import React, { createContext, useContext, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

// eslint-disable-next-line react-refresh/only-export-components
export function useModal() {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within a Modal')
  }
  return context
}

interface ModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

export function Modal({ open: controlledOpen, onOpenChange, children }: ModalProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  const setOpen = (newOpen: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }

  return <ModalContext.Provider value={{ open, setOpen }}>{children}</ModalContext.Provider>
}

export function ModalTrigger({
  children,
  asChild,
}: {
  children: React.ReactNode
  asChild?: boolean
}) {
  const { setOpen } = useModal()

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

export function ModalContent({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const { open, setOpen } = useModal()

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, setOpen])

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={cn(
                'relative w-full max-w-lg rounded-2xl bg-surface p-6 shadow-2xl border border-border pointer-events-auto',
                className,
              )}
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 rounded-full p-1 opacity-70 transition-opacity hover:opacity-100 hover:bg-muted"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  )
}

export function ModalHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 text-center sm:text-left mb-4', className)}
      {...props}
    />
  )
}

export function ModalFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6',
        className,
      )}
      {...props}
    />
  )
}

export function ModalTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
  )
}

export function ModalDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-muted-foreground', className)} {...props} />
}
