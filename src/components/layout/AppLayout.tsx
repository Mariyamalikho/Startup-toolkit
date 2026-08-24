/**
 * AppLayout.tsx
 *
 * Structural dark workspace layout container for Startup Toolkit.
 * Implements desaturated dark canvas theme (#12161f), sticky top Navbar,
 * collapsible left Sidebar (#181d27), and scrollable main content viewport.
 */

import * as React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useProjectStore } from '@/store/projectStore'
import {
  Rocket,
  LayoutDashboard,
  Kanban,
  FileText,
  Settings,
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  Search,
  Bell,
  Layers,
} from 'lucide-react'
import { Input } from '@/components/ui/Input'

interface AppLayoutProps {
  children?: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false)

  const { user, signOut } = useAuth()
  const { projects, activeProject, setActiveProject } = useProjectStore()
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
      <header className="sticky top-0 z-40 h-16 bg-[#181d27]/90 backdrop-blur border-b border-border/40 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Toggle Sidebar Button */}
          <button
            type="button"
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="hidden md:inline-flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
            title="Toggle Sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Rocket className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-base tracking-tight text-white hidden sm:inline">
              Startup<span className="text-sky-400">Toolkit</span>
            </span>
          </Link>

          {/* Project Switcher Dropdown */}
          {projects.length > 0 && (
            <div className="hidden sm:flex items-center pl-4 border-l border-border/40">
              <div className="relative">
                <select
                  value={activeProject?.id || ''}
                  onChange={(e) => {
                    const selected = projects.find((p) => p.id === e.target.value)
                    if (selected) setActiveProject(selected)
                  }}
                  className="appearance-none bg-[#1c222e] border border-border/60 text-xs font-semibold text-foreground py-1.5 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-400 cursor-pointer"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          )}
        </div>

        {/* Right Action Icons & User Menu */}
        <div className="flex items-center space-x-3">
          {/* Global Search Bar */}
          <div className="hidden lg:flex items-center relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search tools, canvases…"
              className="pl-9 h-8 text-xs bg-[#1c222e] border-border/40 focus:border-sky-400"
            />
          </div>

          {/* Notification Icon */}
          <button
            type="button"
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors relative"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-sky-400" />
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserDropdownOpen((prev) => !prev)}
              className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-muted/30 transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-sky-400/20 border border-sky-400/30 flex items-center justify-center text-sky-300 font-bold text-xs">
                {user?.email ? user.email.charAt(0).toUpperCase() : 'G'}
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border/60 bg-[#1c222e] p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-border/40">
                  <p className="text-xs font-semibold text-foreground truncate">
                    {user?.email || 'Guest Founder'}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Founder Plan</p>
                </div>

                <div className="py-1">
                  <Link
                    to="/settings"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-lg"
                  >
                    <User className="mr-2 h-3.5 w-3.5" />
                    Account Settings
                  </Link>

                  {user && (
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false)
                        signOut()
                      }}
                      className="w-full flex items-center px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg text-left"
                    >
                      <LogOut className="mr-2 h-3.5 w-3.5" />
                      Sign Out
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

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
