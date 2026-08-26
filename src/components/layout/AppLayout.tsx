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

interface AppLayoutProps {
  children?: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  return (
    <div className="min-h-screen bg-[#12161f] text-foreground flex flex-col font-sans selection:bg-primary/30">
      {/* ── Top Navbar Header ─────────────────────────────────────────── */}
      <Navbar
        isSidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
      />

      {/* ── Sidebar & Main Body Viewport ─────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Workspace Sidebar Navigation */}
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((prev) => !prev)}
          mobileMenuOpen={mobileMenuOpen}
          onCloseMobileMenu={() => setMobileMenuOpen(false)}
        />

        {/* Scrollable Main Content Viewport Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#12161f] space-y-6">
          {/* Interlocking Chevron Stepper Ribbon */}
          <div className="bg-[#181d27]/60 border border-border/40 p-2.5 rounded-2xl backdrop-blur shadow-sm">
            <ChevronStepperRibbon />
          </div>

          {children ? children : <Outlet />}
        </main>
      </div>
    </div>
  )
}
