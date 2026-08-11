/**
 * ErrorBoundary.tsx
 *
 * Global React Error Boundary — catches unhandled render errors in the
 * component tree and displays a graceful fallback UI instead of a
 * white screen crash.
 *
 * React Error Boundaries MUST be class components (React limitation).
 * This file exports:
 *   - ErrorBoundary          → class component (the actual boundary)
 *   - ErrorFallback          → the UI shown when an error is caught
 *   - withErrorBoundary()    → HOC for wrapping individual subtrees
 *   - useErrorBoundary()     → hook to programmatically trigger the boundary
 */

import React from 'react'
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  /** Custom fallback UI. Receives error details. */
  fallback?: (props: ErrorFallbackProps) => React.ReactNode
  /** Called when an error is caught — use for logging to Sentry etc. */
  onError?: (error: Error, info: React.ErrorInfo) => void
  /** If true, shows a compact inline error instead of full-page */
  inline?: boolean
}

export interface ErrorFallbackProps {
  error: Error | null
  errorInfo: React.ErrorInfo | null
  resetError: () => void
  inline?: boolean
}

// ─── ErrorFallback UI ─────────────────────────────────────────────────────────

export function ErrorFallback({ error, errorInfo, resetError, inline }: ErrorFallbackProps) {
  const [showDetails, setShowDetails] = React.useState(false)

  if (inline) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 p-4">
        <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-red-700 dark:text-red-400">
            {error?.message ?? 'An unexpected error occurred'}
          </p>
          <button
            onClick={resetError}
            className="mt-1 text-xs text-red-600 dark:text-red-400 underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-8 shadow-xl space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="rounded-2xl bg-red-100 dark:bg-red-900/30 p-4">
            <AlertTriangle className="h-10 w-10 text-red-500" strokeWidth={1.5} />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center space-y-2">
          <h1 className="text-xl font-semibold text-foreground">Something went wrong</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            An unexpected error occurred in the application. Your work has been preserved — click
            "Try again" to reload this section.
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="rounded-lg bg-muted px-4 py-3">
            <p className="text-sm font-mono text-foreground break-all">{error.message}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={resetError} className="flex-1" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => window.location.assign('/')}
          >
            <Home className="mr-2 h-4 w-4" />
            Go home
          </Button>
        </div>

        {/* Collapsible stack trace (dev helper) */}
        {import.meta.env.DEV && errorInfo && (
          <div className="space-y-2">
            <button
              onClick={() => setShowDetails((v) => !v)}
              className="flex w-full items-center justify-between rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground hover:bg-muted transition-colors"
            >
              <span>Stack trace (dev only)</span>
              {showDetails ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </button>
            {showDetails && (
              <pre className="overflow-auto rounded-lg bg-muted p-3 text-[10px] leading-relaxed text-muted-foreground max-h-48">
                {errorInfo.componentStack}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── ErrorBoundary Class ──────────────────────────────────────────────────────

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.setState({ errorInfo: info })
    this.props.onError?.(error, info)

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary] Caught error:', error)
      console.error('[ErrorBoundary] Component stack:', info.componentStack)
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      const fallbackProps: ErrorFallbackProps = {
        error: this.state.error,
        errorInfo: this.state.errorInfo,
        resetError: this.resetError,
        inline: this.props.inline,
      }

      if (this.props.fallback) {
        return this.props.fallback(fallbackProps)
      }

      return <ErrorFallback {...fallbackProps} />
    }

    return this.props.children
  }
}

// ─── Higher-Order Component ───────────────────────────────────────────────────

// eslint-disable-next-line react-refresh/only-export-components
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<ErrorBoundaryProps, 'children'>,
) {
  const displayName = Component.displayName ?? Component.name ?? 'Component'

  function WrappedComponent(props: P) {
    return (
      <ErrorBoundary {...options}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }

  WrappedComponent.displayName = `withErrorBoundary(${displayName})`
  return WrappedComponent
}

// ─── useErrorBoundary hook ────────────────────────────────────────────────────
// Lets any functional component programmatically throw into the nearest boundary.

// eslint-disable-next-line react-refresh/only-export-components
export function useErrorBoundary() {
  const [, setState] = React.useState<unknown>()

  const throwError = React.useCallback((error: unknown) => {
    setState(() => {
      throw error
    })
  }, [])

  return { throwError }
}

// ─── Inline ErrorBoundary ─────────────────────────────────────────────────────
// Convenience export for wrapping individual sections.

export function InlineErrorBoundary({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <ErrorBoundary
      inline
      fallback={(props) => (
        <div className={cn(className)}>
          <ErrorFallback {...props} inline />
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  )
}
