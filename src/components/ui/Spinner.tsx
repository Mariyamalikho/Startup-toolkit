/**
 * Spinner.tsx
 *
 * Reusable spinner and inline loading state components.
 * Built with pure CSS animations (no Framer Motion overhead)
 * for maximum performance on low-end devices.
 *
 * Components:
 *   - <Spinner />         → standalone animated spinner
 *   - <LoadingDots />     → three bouncing dots (for text contexts)
 *   - <LoadingOverlay />  → full-area overlay with centered spinner
 *   - <LoadingButton />   → button that shows spinner when loading
 *   - <InlineLoader />    → icon + text inline loader (e.g. "Saving…")
 */

import React from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

// ─── Spinner ──────────────────────────────────────────────────────────────────

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type SpinnerVariant = 'default' | 'primary' | 'muted' | 'white'

interface SpinnerProps {
  size?: SpinnerSize
  variant?: SpinnerVariant
  className?: string
  label?: string // aria-label text
}

const sizeMap: Record<SpinnerSize, string> = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-7 w-7',
  xl: 'h-10 w-10',
}

const variantMap: Record<SpinnerVariant, string> = {
  default: 'text-foreground',
  primary: 'text-primary',
  muted: 'text-muted-foreground',
  white: 'text-white',
}

export function Spinner({
  size = 'md',
  variant = 'muted',
  className,
  label = 'Loading…',
}: SpinnerProps) {
  return (
    <Loader2
      role="status"
      aria-label={label}
      className={cn('animate-spin flex-shrink-0', sizeMap[size], variantMap[variant], className)}
    />
  )
}

// ─── Loading Dots ─────────────────────────────────────────────────────────────

interface LoadingDotsProps {
  className?: string
  variant?: SpinnerVariant
}

export function LoadingDots({ className, variant = 'muted' }: LoadingDotsProps) {
  return (
    <span
      role="status"
      aria-label="Loading…"
      className={cn('inline-flex items-center gap-1', variantMap[variant], className)}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-current animate-bounce"
          style={{ animationDelay: `${i * 150}ms`, animationDuration: '0.8s' }}
        />
      ))}
      <span className="sr-only">Loading…</span>
    </span>
  )
}

// ─── Loading Overlay ──────────────────────────────────────────────────────────

interface LoadingOverlayProps {
  /** Show/hide the overlay */
  visible?: boolean
  /** Optional message below the spinner */
  message?: string
  /** Whether the overlay covers the full viewport or just its parent (parent must be relative) */
  fullscreen?: boolean
  className?: string
}

export function LoadingOverlay({
  visible = true,
  message,
  fullscreen = false,
  className,
}: LoadingOverlayProps) {
  if (!visible) return null

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={message ?? 'Loading…'}
      className={cn(
        'flex flex-col items-center justify-center gap-3',
        'bg-background/80 backdrop-blur-sm z-50',
        fullscreen ? 'fixed inset-0' : 'absolute inset-0 rounded-inherit',
        className,
      )}
    >
      <Spinner size="lg" variant="default" />
      {message && (
        <p className="text-sm text-muted-foreground font-medium animate-pulse">{message}</p>
      )}
    </div>
  )
}

// ─── Inline Loader ────────────────────────────────────────────────────────────
// Use inside a card or section to show a subtle "Saving…" state.

interface InlineLoaderProps {
  message?: string
  size?: SpinnerSize
  className?: string
}

export function InlineLoader({ message = 'Loading…', size = 'sm', className }: InlineLoaderProps) {
  return (
    <span
      role="status"
      aria-label={message}
      className={cn('inline-flex items-center gap-2 text-muted-foreground', className)}
    >
      <Spinner size={size} variant="muted" />
      <span className="text-sm">{message}</span>
    </span>
  )
}

// ─── Loading Button (wrapper) ─────────────────────────────────────────────────
// A utility wrapper that adds a spinner to any button-like element when loading.

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  loadingText?: string
  children: React.ReactNode
  className?: string
}

export function LoadingButton({
  isLoading = false,
  loadingText,
  children,
  className,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      aria-disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2',
        'text-sm font-medium transition-all',
        'bg-primary text-primary-foreground',
        'hover:opacity-90 active:scale-[0.98]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      )}
    >
      {isLoading && <Spinner size="sm" variant="white" />}
      {isLoading && loadingText ? loadingText : children}
    </button>
  )
}
