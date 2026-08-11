/**
 * EmptyState.tsx
 *
 * Generic empty state components for use throughout the app.
 * Shown when a list, search result, or tool has no data yet.
 *
 * Components:
 *   - <EmptyState />         → base flexible component
 *   - <EmptyProjects />      → no projects on dashboard
 *   - <EmptySearchResults /> → search returned nothing
 *   - <EmptyTool />          → tool canvas with no data yet
 *   - <EmptyError />         → something went wrong state
 */

import type { LucideIcon } from 'lucide-react'
import { FolderOpen, SearchX, FileQuestion, AlertCircle, PlusCircle, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

// ─── Base EmptyState ──────────────────────────────────────────────────────────

export interface EmptyStateAction {
  label: string
  onClick: () => void
  variant?: 'default' | 'outline' | 'ghost'
  icon?: LucideIcon
}

interface EmptyStateProps {
  /** Lucide icon component to display */
  icon?: LucideIcon
  /** Main heading */
  title: string
  /** Supporting description */
  description?: string
  /** Primary and optional secondary action */
  actions?: EmptyStateAction[]
  /** Size of the empty state (compact for inline, default for full sections) */
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeConfig = {
  sm: {
    wrapper: 'py-8 px-4',
    icon: 'h-8 w-8',
    iconWrapper: 'mb-3 rounded-xl p-2.5',
    title: 'text-base font-semibold',
    description: 'text-xs mt-1',
    actions: 'mt-4 gap-2',
  },
  md: {
    wrapper: 'py-12 px-6',
    icon: 'h-10 w-10',
    iconWrapper: 'mb-4 rounded-2xl p-3',
    title: 'text-lg font-semibold',
    description: 'text-sm mt-1.5',
    actions: 'mt-6 gap-3',
  },
  lg: {
    wrapper: 'py-20 px-8',
    icon: 'h-12 w-12',
    iconWrapper: 'mb-5 rounded-2xl p-4',
    title: 'text-xl font-semibold',
    description: 'text-sm mt-2',
    actions: 'mt-8 gap-3',
  },
}

export function EmptyState({
  icon: Icon = FileQuestion,
  title,
  description,
  actions = [],
  size = 'md',
  className,
}: EmptyStateProps) {
  const s = sizeConfig[size]

  return (
    <div
      className={cn('flex flex-col items-center justify-center text-center', s.wrapper, className)}
    >
      {/* Icon */}
      <div className={cn('bg-muted text-muted-foreground', s.iconWrapper)}>
        <Icon className={s.icon} strokeWidth={1.5} />
      </div>

      {/* Text */}
      <h3 className={cn('text-foreground', s.title)}>{title}</h3>
      {description && (
        <p className={cn('text-muted-foreground max-w-sm leading-relaxed', s.description)}>
          {description}
        </p>
      )}

      {/* Actions */}
      {actions.length > 0 && (
        <div className={cn('flex flex-wrap items-center justify-center', s.actions)}>
          {actions.map((action) => {
            const ActionIcon = action.icon
            return (
              <Button
                key={action.label}
                variant={action.variant ?? 'default'}
                size="sm"
                onClick={action.onClick}
              >
                {ActionIcon && <ActionIcon className="mr-1.5 h-4 w-4" />}
                {action.label}
              </Button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Pre-built variants ────────────────────────────────────────────────────────

/** Shown on the Dashboard when the user has no projects yet. */
export function EmptyProjects({
  onCreateProject,
  className,
}: {
  onCreateProject: () => void
  className?: string
}) {
  return (
    <EmptyState
      icon={FolderOpen}
      title="No projects yet"
      description="Start your entrepreneurship journey. Create your first innovation project and begin building your startup idea."
      actions={[
        {
          label: 'Create Project',
          onClick: onCreateProject,
          icon: PlusCircle,
        },
      ]}
      size="lg"
      className={className}
    />
  )
}

/** Shown when a search query returns zero results. */
export function EmptySearchResults({
  query,
  onClear,
  className,
}: {
  query: string
  onClear: () => void
  className?: string
}) {
  return (
    <EmptyState
      icon={SearchX}
      title="No results found"
      description={`We couldn't find any projects matching "${query}". Try a different search term or clear the filter.`}
      actions={[
        {
          label: 'Clear search',
          onClick: onClear,
          variant: 'outline',
        },
      ]}
      size="md"
      className={className}
    />
  )
}

/** Shown inside a methodology tool (Empathy Map, BMC, etc.) before any data is entered. */
export function EmptyTool({
  toolName,
  hint,
  size = 'sm',
  className,
}: {
  toolName: string
  hint?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  return (
    <EmptyState
      icon={FileQuestion}
      title={`${toolName} is empty`}
      description={
        hint ??
        'Start filling in the sections to build your canvas. Your progress is saved automatically.'
      }
      size={size}
      className={className}
    />
  )
}

/** Shown when a data fetch or action fails. */
export function EmptyError({
  message,
  onRetry,
  className,
}: {
  message?: string
  onRetry?: () => void
  className?: string
}) {
  return (
    <EmptyState
      icon={AlertCircle}
      title="Something went wrong"
      description={
        message ?? 'We encountered an unexpected error. Please try again or refresh the page.'
      }
      actions={
        onRetry
          ? [
              {
                label: 'Try again',
                onClick: onRetry,
                variant: 'outline',
                icon: RefreshCw,
              },
            ]
          : []
      }
      size="md"
      className={className}
    />
  )
}
