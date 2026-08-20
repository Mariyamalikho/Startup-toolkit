/**
 * useAutosave.ts
 *
 * Custom React hook for debounced automatic database saving.
 * Monitors a data payload for changes, waits for a specified delay (default 1000ms)
 * after typing stops, and executes an async `onSave` handler.
 *
 * Provides real-time status feedback ('idle' | 'saving' | 'saved' | 'error')
 * and a `saveNow()` trigger for manual instant saves.
 */

import { useState, useEffect, useRef, useCallback } from 'react'

export type AutosaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export interface UseAutosaveOptions<T> {
  data: T
  onSave: (data: T) => Promise<void> | void
  delay?: number
  enabled?: boolean
}

export interface UseAutosaveReturn {
  status: AutosaveStatus
  isSaving: boolean
  error: string | null
  lastSavedAt: Date | null
  saveNow: () => Promise<void>
}

export function useAutosave<T>({
  data,
  onSave,
  delay = 1000,
  enabled = true,
}: UseAutosaveOptions<T>): UseAutosaveReturn {
  const [status, setStatus] = useState<AutosaveStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)

  const isInitialMount = useRef(true)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const savedDataRef = useRef<T>(data)
  const latestDataRef = useRef<T>(data)
  const onSaveRef = useRef(onSave)

  // Keep refs updated to prevent stale closures inside timers
  latestDataRef.current = data
  onSaveRef.current = onSave

  const executeSave = useCallback(async (dataToSave: T) => {
    setStatus('saving')
    setError(null)

    try {
      await onSaveRef.current(dataToSave)
      savedDataRef.current = dataToSave
      setStatus('saved')
      setLastSavedAt(new Date())
    } catch (err: any) {
      console.error('[useAutosave] Save failed:', err)
      setError(err?.message || 'Failed to save changes.')
      setStatus('error')
    }
  }, [])

  const saveNow = useCallback(async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    await executeSave(latestDataRef.current)
  }, [executeSave])

  useEffect(() => {
    // Skip triggering save on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false
      savedDataRef.current = data
      return
    }

    if (!enabled) return

    // If data hasn't changed from last saved data, do nothing
    if (JSON.stringify(data) === JSON.stringify(savedDataRef.current)) {
      return
    }

    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    // Schedule debounced save
    timerRef.current = setTimeout(() => {
      executeSave(data)
    }, delay)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [data, delay, enabled, executeSave])

  return {
    status,
    isSaving: status === 'saving',
    error,
    lastSavedAt,
    saveNow,
  }
}
