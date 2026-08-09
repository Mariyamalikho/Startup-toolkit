/**
 * Skeleton.tsx
 *
 * Loading skeleton components with CSS pulse animation.
 * Use these to replace content while data is being fetched,
 * preventing layout shift and improving perceived performance.
 *
 * Components:
 *   - <Skeleton />           → base building block (any shape)
 *   - <SkeletonText />       → paragraph lines
 *   - <SkeletonAvatar />     → circular avatar placeholder
 *   - <SkeletonCard />       → full project card placeholder
 *   - <SkeletonDashboard />  → full dashboard grid placeholder
 */

import { cn } from '@/lib/utils'

// ─── Base Skeleton ────────────────────────────────────────────────────────────

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Additional Tailwind classes for width, height, shape, etc. */
  className?: string
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Loading…"
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  )
}

// ─── Text Lines Skeleton ──────────────────────────────────────────────────────

interface SkeletonTextProps {
  /** Number of lines to render. Defaults to 3. */
  lines?: number
  className?: string
}

export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return (
    <div className={cn('space-y-2', className)} role="status" aria-label="Loading text…">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          // Last line is shorter to look natural
          className={cn('h-4', i === lines - 1 ? 'w-3/4' : 'w-full')}
        />
      ))}
    </div>
  )
}

// ─── Avatar Skeleton ──────────────────────────────────────────────────────────

interface SkeletonAvatarProps {
  /** Size in Tailwind units. Defaults to 10 (40px). */
  size?: number
  className?: string
}

export function SkeletonAvatar({ size = 10, className }: SkeletonAvatarProps) {
  return (
    <Skeleton
      aria-label="Loading avatar…"
      style={{ width: `${size * 4}px`, height: `${size * 4}px` }}
      className={cn('rounded-full flex-shrink-0', className)}
    />
  )
}

// ─── Project Card Skeleton ────────────────────────────────────────────────────

interface SkeletonCardProps {
  className?: string
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div
      role="status"
      aria-label="Loading project card…"
      className={cn(
        'rounded-2xl border border-border bg-surface p-5 space-y-4 shadow-sm',
        className,
      )}
    >
      {/* Header row: avatar + title */}
      <div className="flex items-center gap-3">
        <SkeletonAvatar size={9} />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>

      {/* Body text */}
      <SkeletonText lines={2} />

      {/* Footer row: badge + button */}
      <div className="flex items-center justify-between pt-1">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  )
}

// ─── Dashboard Grid Skeleton ──────────────────────────────────────────────────

interface SkeletonDashboardProps {
  /** Number of card skeletons to show. Defaults to 6. */
  count?: number
  className?: string
}

export function SkeletonDashboard({ count = 6, className }: SkeletonDashboardProps) {
  return (
    <div role="status" aria-label="Loading dashboard…" className={cn('space-y-6', className)}>
      {/* Top bar: search + button */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 flex-1 rounded-lg" />
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>

      {/* Card grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  )
}

// ─── Empathy Map Skeleton ─────────────────────────────────────────────────────
// Used while the Empathy Map tool is loading project data.

export function SkeletonEmpathyMap({ className }: { className?: string }) {
  return (
    <div role="status" aria-label="Loading empathy map…" className={cn('space-y-3', className)}>
      {/* Title */}
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-72 mb-4" />

      {/* 2x2 quadrant grid */}
      <div className="grid grid-cols-2 gap-3">
        {['Think & Feel', 'See', 'Hear', 'Say & Do'].map((label) => (
          <div key={label} className="rounded-xl border border-border bg-surface p-4 space-y-2">
            <Skeleton className="h-4 w-20" />
            <SkeletonText lines={3} />
          </div>
        ))}
      </div>

      {/* Pain / Gain row */}
      <div className="grid grid-cols-2 gap-3 mt-3">
        {['Pains', 'Gains'].map((label) => (
          <div key={label} className="rounded-xl border border-border bg-surface p-4 space-y-2">
            <Skeleton className="h-4 w-16" />
            <SkeletonText lines={2} />
          </div>
        ))}
      </div>
    </div>
  )
}
