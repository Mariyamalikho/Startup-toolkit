/**
 * DeleteProjectDialog.tsx
 *
 * Confirmation Dialog component for deleting a startup venture project.
 * Prompts user confirmation, triggers Supabase deleteUserProject, and handles loading.
 */

import { useState } from 'react'
import { useProjectStore } from '@/store/projectStore'
import type { Project } from '@/types/database.types'
import { Dialog, DialogContent } from '@/components/ui/Dialog'

interface DeleteProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Project | null
}

export function DeleteProjectDialog({
  open,
  onOpenChange,
  project,
}: DeleteProjectDialogProps) {
  const { deleteUserProject, loading } = useProjectStore()
  const [isDeleting, setIsDeleting] = useState(false)

  if (!project) return null

  const handleDelete = async () => {
    setIsDeleting(true)
    const success = await deleteUserProject(project.id)
    setIsDeleting(false)
    if (success) {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title="Delete Startup Venture"
        description={`Are you sure you want to delete "${project.title}"? All associated empathy maps, business model canvas notes, and pitch decks will be permanently removed.`}
        variant="destructive"
        confirmLabel="Delete Venture"
        cancelLabel="Cancel"
        onConfirm={handleDelete}
        isLoading={isDeleting || loading}
      />
    </Dialog>
  )
}
