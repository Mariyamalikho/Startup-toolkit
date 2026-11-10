/**
 * Sidebar.tsx
 *
 * Expandable/collapsible workspace sidebar navigation component for Startup Toolkit.
 * Features dark slate theme, active route indicators, active venture summary card,
 * and responsive mobile menu support.
 */

import { Link, useLocation } from 'react-router-dom'
import { useProjectStore } from '@/store/projectStore'
import {
  LayoutDashboard,
  Kanban,
  Settings,
  Layers,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react'
import { StageProgressSegments } from '@/components/ui/Skeleton'
import { isStagePath } from '@/lib/stages'

export interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  mobileMenuOpen?: boolean
  onCloseMobileMenu?: () => void
}

export function Sidebar({ isOpen, onToggle, mobileMenuOpen, onCloseMobileMenu }: SidebarProps) {
  const location = useLocation()
  const { activeProject } = useProjectStore()

  const projectId = activeProject?.id || 'demo-proj-1'

  // Stages live in the workspace stage nav; the sidebar only lists top-level pages.
  const navigationItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Workspace', icon: Kanban, path: `/workspace/${projectId}` },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ]

  const isItemActive = (path: string) =>
    path.startsWith('/workspace') ? isStagePath(location.pathname) : location.pathname === path

  return (
    <>
      <aside
        className={`bg-surface border-r border-border/40 transition-all duration-300 flex flex-col justify-between select-none ${
          isOpen ? 'w-64' : 'w-16'
        } hidden md:flex`}
      >
        <div className="p-3 space-y-4">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = isItemActive(item.path)
              const Icon = item.icon

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all relative group ${
                    isActive
                      ? 'bg-sky-400/10 text-sky-400 border border-sky-400/30'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
                  }`}
                  title={!isOpen ? item.label : undefined}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 ${isActive ? 'text-sky-400' : 'text-muted-foreground group-hover:text-foreground'}`}
                  />
                  {isOpen && <span className="truncate">{item.label}</span>}

                  {!isOpen && (
                    <div className="absolute left-14 z-50 hidden group-hover:block bg-surface text-foreground text-[11px] font-medium px-2.5 py-1 rounded-md border border-border/60 shadow-xl whitespace-nowrap pointer-events-none">
                      {item.label}
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="p-3 space-y-3 border-t border-border/40">
          {isOpen && activeProject && (
            <div className="p-3.5 rounded-xl border border-border/40 bg-muted/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-sky-400 flex items-center gap-1">
                  <Layers className="h-3 w-3" />
                  Active Venture
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {activeProject.progress}%
                </span>
              </div>

              <div>
                <p className="text-xs font-bold text-foreground truncate">{activeProject.title}</p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {activeProject.industry || 'Tech & SaaS'}
                </p>
              </div>

              <StageProgressSegments progress={activeProject.progress} />
            </div>
          )}

          <button
            type="button"
            onClick={onToggle}
            className="w-full flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/20 border border-transparent hover:border-border/40 transition-colors text-xs font-medium"
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

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md md:hidden pt-16 flex flex-col">
          <div className="bg-surface border-b border-border/40 p-4 space-y-2 flex-1">
            <div className="pb-3 mb-2 border-b border-border/40 flex items-center justify-between">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-sky-400" />
                Workspace Navigation
              </span>
            </div>

            {navigationItems.map((item) => {
              const isActive = isItemActive(item.path)
              const Icon = item.icon

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={onCloseMobileMenu}
                  className={`flex items-center space-x-3 p-3 rounded-lg text-sm font-semibold transition-all ${
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

            {activeProject && (
              <div className="mt-6 p-4 rounded-xl border border-border/40 bg-muted/20 space-y-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-sky-400 flex items-center gap-1">
                  <Layers className="h-3 w-3" />
                  Active Project Context
                </span>
                <p className="text-sm font-bold text-foreground">{activeProject.title}</p>
                <p className="text-xs text-muted-foreground">
                  {activeProject.industry || 'Technology'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
