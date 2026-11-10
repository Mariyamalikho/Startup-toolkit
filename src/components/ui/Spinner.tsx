/**
 * Spinner.tsx
 *
 * Minimal loading indicators and button loading wrapper.
 */

import React from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { Button, type ButtonProps } from '@/components/ui/Button'
import { TopLoadingBar } from '@/components/ui/Skeleton'

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type SpinnerVariant = 'default' | 'primary' | 'muted' | 'white'

interface SpinnerProps {
  size?: SpinnerSize
  variant?: SpinnerVariant
  className?: string
  label?: string
}

const sizeMap: Record<SpinnerSize, string> = {
  xs: 'h-3 w-3',
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
  xl: 'h-6 w-6',
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
  label = 'Loading',
}: SpinnerProps) {
  return (
    <Loader2
      role="status"
      aria-label={label}
      className={cn('animate-spin flex-shrink-0', sizeMap[size], variantMap[variant], className)}
    />
  )
}

interface LoadingDotsProps {
  className?: string
  variant?: SpinnerVariant
}

export function LoadingDots({ className, variant = 'muted' }: LoadingDotsProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        'inline-flex items-center gap-1 font-mono text-xs',
        variantMap[variant],
        className,
      )}
    >
      <span>...</span>
    </span>
  )
}

interface LoadingOverlayProps {
  visible?: boolean
  message?: string
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
      aria-label={message ?? 'Loading'}
      className={cn(
        'flex flex-col items-center justify-center gap-2.5 bg-background z-50',
        fullscreen ? 'fixed inset-0' : 'absolute inset-0 rounded-inherit',
        className,
      )}
    >
      <TopLoadingBar />
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/60 bg-surface text-xs font-mono text-muted-foreground">
        <Spinner size="sm" variant="default" />
        <span>{message || 'Loading workspace...'}</span>
      </div>
    </div>
  )
}

interface InlineLoaderProps {
  message?: string
  size?: SpinnerSize
  className?: string
}

export function InlineLoader({
  message = 'Loading...',
  size = 'sm',
  className,
}: InlineLoaderProps) {
  return (
    <span
      role="status"
      aria-label={message}
      className={cn(
        'inline-flex items-center gap-2 text-muted-foreground font-mono text-xs',
        className,
      )}
    >
      <Spinner size={size} variant="muted" />
      <span>{message}</span>
    </span>
  )
}

interface LoadingButtonProps extends ButtonProps {
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
  variant,
  size,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled || isLoading}
      aria-disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={cn('gap-2', className)}
      {...props}
    >
      {isLoading && <Spinner size="sm" variant={variant === 'default' ? 'white' : 'default'} />}
      {isLoading && loadingText ? loadingText : children}
    </Button>
  )
}
