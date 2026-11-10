/**
 * AppLayout.tsx
 *
 * Structural dark workspace layout container for Startup Toolkit.
 * Implements desaturated dark canvas theme (#12161f), sticky top Navbar,
 * collapsible left Sidebar (#181d27), and scrollable main content viewport.
 */

import * as React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import { ChevronStepperRibbon } from '@/components/navigation/ChevronStepperRibbon'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'
import { WifiOff, Wifi } from 'lucide-react'

interface AppLayoutProps {
  children?: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const { isOnline, wasOffline } = useNetworkStatus()

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30">
      {/* - Offline Network Recovery Alert Banner - */}
      {!isOnline && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 text-amber-400 text-xs font-semibold px-4 py-2 flex items-center justify-center space-x-2 animate-in fade-in">
          <WifiOff className="h-4 w-4 animate-pulse" />
          <span>
            Offline Mode: Connection lost. Working in offline mode; edits will sync when
            reconnected.
          </span>
        </div>
      )}

      {isOnline && wasOffline && (
        <div className="bg-emerald-500/15 border-b border-emerald-500/30 text-emerald-400 text-xs font-semibold px-4 py-2 flex items-center justify-center space-x-2 animate-in fade-in">
          <Wifi className="h-4 w-4" />
          <span>Connection Restored: Supabase cloud sync active.</span>
        </div>
      )}

      {/* - Top Navbar Header - */}
      <Navbar
        isSidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
      />

      {/* - Sidebar & Main Body Viewport - */}
      <div className="flex-1 flex overflow-hidden">
        {/* Workspace Sidebar Navigation */}
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((prev) => !prev)}
          mobileMenuOpen={mobileMenuOpen}
          onCloseMobileMenu={() => setMobileMenuOpen(false)}
        />

        {/* Scrollable Main Content Viewport Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-background flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            {/* Interlocking Chevron Stepper Ribbon */}
            <div className="bg-surface/80 border border-border/60 p-2.5 rounded-2xl backdrop-blur shadow-sm">
              <ChevronStepperRibbon />
            </div>

            {children ? children : <Outlet />}
          </div>

          {/* Workspace Footer Credit */}
          <footer className="pt-6 mt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>Startup Toolkit © {new Date().getFullYear()}</span>
            <p className="font-medium text-foreground/90">
              Built with precision by{' '}
              <a
                href="https://mariyamalikhokhar.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-sky-400 hover:text-sky-300 underline decoration-sky-400/40 underline-offset-4 transition-colors"
              >
                Mariyam Ali K.
              </a>
            </p>
          </footer>
        </main>
      </div>
    </div>
  )
}
