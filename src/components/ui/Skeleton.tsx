/**
 * Skeleton.tsx
 *
 * Structural loading placeholders and segmented progress indicators.
 * Designed to match exact component geometry and prevent layout shift.
 */

import React from 'react'
import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('rounded-sm bg-slate-800/70', className)}
      {...props}
    />
  )
}

/**
 * Slim 2px top viewport loading bar for route transitions.
 */
export function TopLoadingBar() {
  return (
    <div
      role="progressbar"
      aria-label="Loading page"
      className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-slate-900 overflow-hidden"
    >
      <div className="h-full w-2/5 bg-sky-400 transition-all duration-300" />
    </div>
  )
}

/**
 * Discrete 5-stage methodology progress indicator (Ideation, Empathy, BMC, Prototype, Pitch).
 */
export function StageProgressSegments({
  progress,
  className,
}: {
  progress: number
  className?: string
}) {
  const clamped = Math.max(0, Math.min(100, progress || 0))
  const completedStages = clamped === 0 ? 0 : Math.max(1, Math.round((clamped / 100) * 5))

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('grid grid-cols-5 gap-1 w-full', className)}
    >
      {[0, 1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className={cn(
            'h-1.5 rounded-[2px] transition-colors duration-200',
            index < completedStages ? 'bg-sky-400' : 'bg-slate-800',
          )}
        />
      ))}
    </div>
  )
}

interface SkeletonTextProps {
  lines?: number
  className?: string
}

export function SkeletonText({ lines = 2, className }: SkeletonTextProps) {
  return (
    <div className={cn('space-y-2', className)} role="status" aria-label="Loading text">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn('h-3', i === lines - 1 ? 'w-3/5' : 'w-full')} />
      ))}
    </div>
  )
}

interface SkeletonAvatarProps {
  size?: number
  className?: string
}

export function SkeletonAvatar({ size = 9, className }: SkeletonAvatarProps) {
  return (
    <Skeleton
      aria-label="Loading icon"
      style={{ width: `${size * 4}px`, height: `${size * 4}px` }}
      className={cn('rounded-lg flex-shrink-0', className)}
    />
  )
}

interface SkeletonCardProps {
  className?: string
}

/**
 * Matches the exact geometry of ProjectCard (category tag, title, 2-line description,
 * 5-segment stage progress bar, and footer metadata).
 */
export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div
      role="status"
      aria-label="Loading venture card"
      className={cn(
        'rounded-xl border border-border/60 bg-surface p-5 flex flex-col justify-between space-y-4',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-20 rounded-md" />
          <Skeleton className="h-5 w-3/4 rounded-sm" />
        </div>
        <Skeleton className="h-6 w-6 rounded-md" />
      </div>

      <SkeletonText lines={2} />

      <div className="space-y-3 pt-2 border-t border-border/40">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-10" />
          </div>
          <div className="grid grid-cols-5 gap-1">
            {[0, 1, 2, 3, 4].map((idx) => (
              <Skeleton key={idx} className="h-1.5 rounded-[2px]" />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-7 w-16 rounded-md" />
        </div>
      </div>
    </div>
  )
}

interface SkeletonDashboardProps {
  count?: number
  className?: string
}

export function SkeletonDashboard({ count = 6, className }: SkeletonDashboardProps) {
  return (
    <div role="status" aria-label="Loading dashboard" className={cn('space-y-6', className)}>
      <TopLoadingBar />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  )
}

export function SkeletonWorkspace({ className }: { className?: string }) {
  return (
    <div role="status" aria-label="Loading workspace" className={cn('space-y-6', className)}>
      <TopLoadingBar />

      {/* Workspace Header Placeholder */}
      <div className="bg-surface border border-border/60 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border/40 pb-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-36 rounded-md" />
            <Skeleton className="h-6 w-64 rounded-sm" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-32 rounded-lg" />
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-3.5 w-80" />
          <div className="w-48 grid grid-cols-5 gap-1">
            {[0, 1, 2, 3, 4].map((idx) => (
              <Skeleton key={idx} className="h-1.5 rounded-[2px]" />
            ))}
          </div>
        </div>
      </div>

      {/* Canvas Grid Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[0, 1, 2, 3].map((idx) => (
          <div key={idx} className="rounded-xl border border-border/60 bg-surface p-5 space-y-3">
            <Skeleton className="h-4 w-32" />
            <SkeletonText lines={3} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function SkeletonEmpathyMap({ className }: { className?: string }) {
  return <SkeletonWorkspace className={className} />
}
