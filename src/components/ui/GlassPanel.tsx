import * as React from 'react'
import { cn } from '@/lib/utils'

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'heavy' | 'light'
}

const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border shadow-lg backdrop-blur-md',
          {
            'bg-white/40 border-white/20': variant === 'default',
            'bg-white/70 border-white/40': variant === 'heavy',
            'bg-white/10 border-white/10': variant === 'light',
          },
          className,
        )}
        {...props}
      />
    )
  },
)
GlassPanel.displayName = 'GlassPanel'

export { GlassPanel }
