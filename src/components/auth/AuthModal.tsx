/**
 * AuthModal.tsx
 *
 * Reusable Auth Modal overlay wrapping the AuthForm inside our
 * portal-based Modal container.
 */

import { Modal, ModalTrigger, ModalContent } from '@/components/ui/Modal'
import { AuthForm } from '@/components/auth/AuthForm'
import type { AuthMode } from '@/components/auth/AuthForm'
import { Shield } from 'lucide-react'

interface AuthModalProps {
  trigger?: React.ReactNode
  initialMode?: AuthMode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function AuthModal({ trigger, initialMode = 'login', isOpen, onOpenChange }: AuthModalProps) {
  return (
    <Modal open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <ModalTrigger>{trigger}</ModalTrigger>}
      <ModalContent className="max-w-md">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="rounded-2xl bg-primary/10 p-3 mb-3 text-primary">
            <Shield className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Startup Toolkit</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Access your startup workspaces, tools, and saved canvases.
          </p>
        </div>

        <AuthForm initialMode={initialMode} onSuccess={() => onOpenChange?.(false)} />
      </ModalContent>
    </Modal>
  )
}
