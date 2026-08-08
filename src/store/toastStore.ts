/**
 * toastStore.ts
 *
 * A framework-agnostic singleton store for toast state.
 * Separates business logic from the React UI layer so the toast
 * system can be triggered from anywhere — hooks, utilities, or
 * async service calls — without needing React context directly.
 *
 * Usage (outside React):
 *   import { toastStore } from '@/store/toastStore'
 *   toastStore.add({ variant: 'success', title: 'Done!' })
 *
 * Usage (inside React):
 *   Use the `useToast()` hook from '@/components/ui/Toast' instead.
 */

export type ToastVariant = 'success' | 'error' | 'warning' | 'info' | 'loading'

export interface ToastItem {
  id: string
  title: string
  description?: string
  variant: ToastVariant
  /** Duration in ms. 0 = persistent. Defaults to 4000. */
  duration: number
  /** Internal: timestamp when the toast was added, used for progress bar. */
  addedAt: number
}

export type ToastInput = Omit<ToastItem, 'id' | 'addedAt' | 'duration'> & {
  duration?: number
}

type Listener = (toasts: ToastItem[]) => void

// ─── Singleton Store ──────────────────────────────────────────────────────────

class ToastStore {
  private _toasts: ToastItem[] = []
  private _listeners: Set<Listener> = new Set()
  private _timers: Map<string, ReturnType<typeof setTimeout>> = new Map()
  private static readonly MAX_TOASTS = 5

  // Subscribe to state changes (used by ToastProvider)
  subscribe(listener: Listener): () => void {
    this._listeners.add(listener)
    return () => this._listeners.delete(listener)
  }

  private _notify() {
    this._listeners.forEach((l) => l([...this._toasts]))
  }

  getToasts(): ToastItem[] {
    return [...this._toasts]
  }

  /** Add a toast and return its generated ID. */
  add(input: ToastInput): string {
    const id = crypto.randomUUID()
    const duration = input.duration ?? (input.variant === 'loading' ? 0 : 4000)
    const toast: ToastItem = { ...input, id, duration, addedAt: Date.now() }

    // Cap at MAX_TOASTS
    this._toasts = [toast, ...this._toasts].slice(0, ToastStore.MAX_TOASTS)
    this._notify()

    if (duration > 0) {
      const timer = setTimeout(() => this.remove(id), duration)
      this._timers.set(id, timer)
    }

    return id
  }

  /** Remove a specific toast by ID. */
  remove(id: string) {
    const timer = this._timers.get(id)
    if (timer) {
      clearTimeout(timer)
      this._timers.delete(id)
    }
    this._toasts = this._toasts.filter((t) => t.id !== id)
    this._notify()
  }

  /** Update an existing toast (used by promise helper). */
  update(id: string, patch: Partial<Omit<ToastItem, 'id'>>) {
    this._toasts = this._toasts.map((t) =>
      t.id === id ? { ...t, ...patch, addedAt: Date.now() } : t,
    )
    this._notify()

    // If updating duration, reset the timer
    if (patch.duration !== undefined && patch.duration > 0) {
      const existing = this._timers.get(id)
      if (existing) clearTimeout(existing)
      const timer = setTimeout(() => this.remove(id), patch.duration)
      this._timers.set(id, timer)
    }
  }

  /** Dismiss all toasts at once. */
  removeAll() {
    this._timers.forEach((timer) => clearTimeout(timer))
    this._timers.clear()
    this._toasts = []
    this._notify()
  }

  /**
   * Promise helper: shows a loading toast while `promise` is pending,
   * then automatically transitions to success or error.
   *
   * @example
   * toastStore.promise(saveProject(), {
   *   loading: 'Saving project…',
   *   success: 'Project saved!',
   *   error: 'Failed to save project.',
   * })
   */
  promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((err: unknown) => string)
      description?: string
    },
  ): Promise<T> {
    const id = this.add({
      variant: 'loading',
      title: messages.loading,
      description: messages.description,
      duration: 0, // Persistent until resolved
    })

    promise
      .then((data) => {
        const title =
          typeof messages.success === 'function' ? messages.success(data) : messages.success
        this.update(id, { variant: 'success', title, duration: 4000 })
      })
      .catch((err) => {
        const title = typeof messages.error === 'function' ? messages.error(err) : messages.error
        this.update(id, { variant: 'error', title, duration: 5000 })
      })

    return promise
  }
}

export const toastStore = new ToastStore()
