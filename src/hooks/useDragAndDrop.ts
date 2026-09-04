/**
 * useDragAndDrop.ts
 *
 * Custom React hook for HTML5 drag-and-drop reordering and positioning
 * of sticky note insights across canvas blocks and quadrants.
 */

import { useState, useCallback } from 'react'

export interface DraggedItemPayload {
  id: string
  sourceContainer: string
}

export function useDragAndDrop() {
  const [draggedItem, setDraggedItem] = useState<DraggedItemPayload | null>(null)
  const [activeDropzone, setActiveDropzone] = useState<string | null>(null)

  const handleDragStart = useCallback(
    (e: React.DragEvent, id: string, sourceContainer: string) => {
      const payload: DraggedItemPayload = { id, sourceContainer }
      setDraggedItem(payload)
      e.dataTransfer.setData('text/plain', JSON.stringify(payload))
      e.dataTransfer.effectAllowed = 'move'
    },
    [],
  )

  const handleDragOver = useCallback((e: React.DragEvent, containerId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setActiveDropzone(containerId)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setActiveDropzone(null)
  }, [])

  const handleDrop = useCallback(
    (
      e: React.DragEvent,
      targetContainer: string,
      onMove: (id: string, fromContainer: string, toContainer: string) => void,
    ) => {
      e.preventDefault()
      setActiveDropzone(null)

      try {
        const rawData = e.dataTransfer.getData('text/plain')
        const payload: DraggedItemPayload = rawData
          ? JSON.parse(rawData)
          : draggedItem

        if (payload && payload.id) {
          onMove(payload.id, payload.sourceContainer, targetContainer)
        }
      } catch (err) {
        if (draggedItem) {
          onMove(draggedItem.id, draggedItem.sourceContainer, targetContainer)
        }
      } finally {
        setDraggedItem(null)
      }
    },
    [draggedItem],
  )

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null)
    setActiveDropzone(null)
  }, [])

  return {
    draggedItem,
    activeDropzone,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    isDragging: !!draggedItem,
  }
}
