/**
 * Sidebar.tsx
 *
 * Expandable/collapsible workspace sidebar navigation component for Startup Toolkit.
 * Features desaturated dark theme (#181d27), smooth width transitions, active route badges,
 * active venture status summary card, and responsive mobile overlay menu support.
 */

import { Link, useLocation } from 'react-router-dom'
import { useProjectStore } from '@/store/projectStore'
import {
  LayoutDashboard,
  Kanban,
  Users,
  Grid,
  FileText,
  Settings,
  Layers,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react'

export interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  mobileMenuOpen?: boolean
  onCloseMobileMenu?: () => void
}

export function Sidebar({
  isOpen,
  onToggle,
  mobileMenuOpen,
  onCloseMobileMenu,
}: SidebarProps) {
  const location = useLocation()
  const { activeProject } = useProjectStore()

  const projectId = activeProject?.id || 'default'

  const navigationItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Ideation Canvas', icon: Kanban, path: `/workspace/${projectId}` },
    { label: 'Empathy Map', icon: Users, path: '/empathy-map' },
    { label: 'Business Model Canvas', icon: Grid, path: '/business-model-canvas' },
    { label: 'Pitch Deck', icon: FileText, path: '/pitch-deck' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ]

  return (
    <>
      {/* ── Desktop Sidebar Container ───────────────────────────────── */}
      <aside
        className={`bg-[#181d27] border-r border-border/40 transition-all duration-300 flex flex-col justify-between select-none ${
          isOpen ? 'w-64' : 'w-16'
        } hidden md:flex`}
      >
        <div className="p-3 space-y-4">
          {/* Navigation Links Group */}
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path.startsWith('/workspace') && location.pathname.startsWith('/workspace'))
              const Icon = item.icon

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative group ${
                    isActive
                      ? 'bg-sky-400/10 text-sky-400 border border-sky-400/30 shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
                  }`}
                  title={!isOpen ? item.label : undefined}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-sky-400' : 'text-muted-foreground group-hover:text-foreground'}`} />
                  {isOpen && <span className="truncate">{item.label}</span>}

                  {/* Tooltip hint when sidebar is collapsed */}
                  {!isOpen && (
                    <div className="absolute left-14 z-50 hidden group-hover:block bg-[#1c222e] text-white text-[11px] font-medium px-2.5 py-1 rounded-md border border-border/60 shadow-xl whitespace-nowrap pointer-events-none">
                      {item.label}
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Bottom Section: Active Venture Summary Card & Toggle Button */}
        <div className="p-3 space-y-3 border-t border-border/40">
          {/* Active Venture Summary Card (when sidebar is open) */}
          {isOpen && activeProject && (
            <div className="p-3.5 rounded-xl border border-border/40 bg-[#1c222e] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-sky-400 flex items-center gap-1">
                  <Layers className="h-3 w-3" />
                  Active Venture
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">{activeProject.progress}%</span>
              </div>

              <div>
                <p className="text-xs font-bold text-white truncate">{activeProject.title}</p>
                <p className="text-[10px] text-muted-foreground truncate">{activeProject.industry || 'Tech & SaaS'}</p>
              </div>

              {/* Progress bar line */}
              <div className="w-full h-1.5 rounded-full bg-muted/30 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${activeProject.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Sidebar Collapse Toggle Button */}
          <button
            type="button"
            onClick={onToggle}
            className="w-full flex items-center justify-center p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/20 border border-transparent hover:border-border/40 transition-colors text-xs font-medium"
            title={isOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            {isOpen ? (
              <div className="flex items-center space-x-2">
                <ChevronLeft className="h-4 w-4 text-sky-400" />
                <span className="text-xs">Collapse Sidebar</span>
              </div>
            ) : (
              <ChevronRight className="h-4 w-4 text-sky-400" />
            )}
          </button>
        </div>
      </aside>

      {/* ── Mobile Navigation Drawer Overlay ────────────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md md:hidden pt-16 flex flex-col">
          <div className="bg-[#181d27] border-b border-border/40 p-4 space-y-2 flex-1">
            <div className="pb-3 mb-2 border-b border-border/40 flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-sky-400" />
                Workspace Navigation
              </span>
            </div>

            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path
              const Icon = item.icon

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={onCloseMobileMenu}
                  className={`flex items-center space-x-3 p-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-sky-400/10 text-sky-400 border border-sky-400/30'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
                  }`}
                >
                  <Icon className="h-5 w-5 text-sky-400" />
                  <span>{item.label}</span>
                </Link>
              )
            })}

            {/* Mobile Active Venture Highlight */}
            {activeProject && (
              <div className="mt-6 p-4 rounded-xl border border-border/40 bg-[#1c222e] space-y-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-sky-400 flex items-center gap-1">
                  <Layers className="h-3 w-3" />
                  Active Project Context
                </span>
                <p className="text-sm font-bold text-white">{activeProject.title}</p>
                <p className="text-xs text-muted-foreground">{activeProject.industry || 'Technology'}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
