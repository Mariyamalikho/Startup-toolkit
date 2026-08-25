/**
 * AppLayout.tsx
 *
 * Structural dark workspace layout container for Startup Toolkit.
 * Implements desaturated dark canvas theme (#12161f), sticky top Navbar,
 * collapsible left Sidebar (#181d27), and scrollable main content viewport.
 */

import * as React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useProjectStore } from '@/store/projectStore'
import { Navbar } from './Navbar'
import {
  LayoutDashboard,
  Kanban,
  FileText,
  Settings,
  Layers,
} from 'lucide-react'

interface AppLayoutProps {
  children?: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const { activeProject } = useProjectStore()
  const location = useLocation()

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Ideation & Canvas', icon: Kanban, path: `/workspace/${activeProject?.id || 'default'}` },
    { label: 'Pitch Deck', icon: FileText, path: '/pitch-deck' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ]

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
        {/* Left Sidebar */}
        <aside
          className={`bg-[#181d27] border-r border-border/40 transition-all duration-300 flex flex-col justify-between ${
            sidebarOpen ? 'w-60' : 'w-16'
          } hidden md:flex`}
        >
          <div className="p-3 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path)
              const Icon = item.icon
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-sky-400/10 text-sky-400 border border-sky-400/30 shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
                  }`}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              )
            })}
          </div>

          {/* Sidebar Active Workspace Badge */}
          {sidebarOpen && activeProject && (
            <div className="p-4 m-3 rounded-xl border border-border/40 bg-[#1c222e] space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-sky-400 flex items-center gap-1">
                <Layers className="h-3 w-3" />
                Active Venture
              </span>
              <p className="text-xs font-bold text-white truncate">{activeProject.title}</p>
              <p className="text-[10px] text-muted-foreground">{activeProject.industry || 'Tech'}</p>
            </div>
          )}
        </aside>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden pt-16">
            <div className="bg-[#181d27] border-b border-border/40 p-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 p-3 rounded-xl text-sm font-semibold text-foreground hover:bg-muted/30"
                  >
                    <Icon className="h-5 w-5 text-sky-400" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Scrollable Main Content Viewport Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#12161f]">
          {children ? children : <Outlet />}
        </main>
      </div>
    </div>
  )
}
