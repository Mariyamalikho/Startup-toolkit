/**
 * Navbar.tsx
 *
 * Glassmorphism top navigation header component for Startup Toolkit.
 * Features brand identity, active venture selector dropdown, global search input,
 * autosave status badge, notification drawer, theme toggle, and user profile menu.
 */

import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useProjectStore } from '@/store/projectStore'
import { useTheme } from '@/hooks/useTheme'
import {
  Rocket,
  Search,
  Bell,
  ChevronDown,
  User,
  LogOut,
  CreditCard,
  Key,
  Sun,
  Moon,
  Menu,
  X,
  CheckCircle2,
  Zap,
} from 'lucide-react'
import { Input } from '@/components/ui/Input'

interface NavbarProps {
  onToggleSidebar?: () => void
  isSidebarOpen?: boolean
  mobileMenuOpen?: boolean
  onToggleMobileMenu?: () => void
}

export function Navbar({
  onToggleSidebar,
  mobileMenuOpen,
  onToggleMobileMenu,
}: NavbarProps) {
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false)
  const [notificationsOpen, setNotificationsOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')

  const { user, signOut } = useAuth()
  const { projects, activeProject, setActiveProject } = useProjectStore()
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()

  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false)
        setNotificationsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-40 h-16 bg-[#181d27]/90 backdrop-blur-md border-b border-border/40 px-4 sm:px-6 flex items-center justify-between">
      {/* ── Left Brand & Venture Selector Section ─────────────────── */}
      <div className="flex items-center space-x-4">
        {/* Toggle Sidebar Button (Desktop) */}
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="hidden md:inline-flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
            title="Toggle Sidebar Navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        {/* Toggle Mobile Menu Button */}
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        )}

        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Rocket className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-base tracking-tight text-white hidden sm:inline">
            Startup<span className="text-sky-400">Toolkit</span>
          </span>
        </Link>

        {/* Active Project Switcher Dropdown */}
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

      {/* ── Middle Global Search Bar ──────────────────────────────── */}
      <div className="hidden lg:flex items-center relative w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search canvas tools, metrics, AI..."
          className="pl-9 pr-12 h-8 text-xs bg-[#1c222e] border-border/40 focus:border-sky-400"
        />
        <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground bg-muted/20 border border-border/40 rounded">
          ⌘K
        </kbd>
      </div>

      {/* ── Right Actions & Profile Menu ───────────────────────────── */}
      <div className="flex items-center space-x-3" ref={dropdownRef}>
        {/* Autosave Database Status Badge */}
        <div className="hidden sm:flex items-center space-x-1.5 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
          <CheckCircle2 className="h-3 w-3" />
          <span>Supabase Synced</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
          title="Toggle Theme Mode"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notifications Icon & Drawer Toggle */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setNotificationsOpen((prev) => !prev)
              setUserDropdownOpen(false)
            }}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors relative"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
          </button>

          {/* Notifications Dropdown Panel */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-border/60 bg-[#1c222e] p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-border/40">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-sky-400" />
                  Notifications
                </span>
                <span className="text-[10px] font-semibold text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded-full">
                  2 New
                </span>
              </div>

              <div className="py-2 space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-muted/20 border border-border/30 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">Supabase Connected</span>
                    <span className="text-[10px] text-muted-foreground">Just now</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Project database table schema updated cleanly.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-muted/20 border border-border/30 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">Autosave Active</span>
                    <span className="text-[10px] text-muted-foreground">5m ago</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    1000ms debounced saves active on canvas inputs.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setUserDropdownOpen((prev) => !prev)
              setNotificationsOpen(false)
            }}
            className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-muted/30 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 border border-sky-400/30 flex items-center justify-center text-white font-bold text-xs shadow-md">
              {user?.email ? user.email.charAt(0).toUpperCase() : 'G'}
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
          </button>

          {/* User Profile Dropdown Menu */}
          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-border/60 bg-[#1c222e] p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2.5 border-b border-border/40">
                <p className="text-xs font-bold text-white truncate">
                  {user?.email || 'Guest Founder'}
                </p>
                <span className="inline-block mt-0.5 text-[10px] font-semibold text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded-md">
                  Pro Founder Plan
                </span>
              </div>

              <div className="py-1 space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setUserDropdownOpen(false)
                    navigate('/settings')
                  }}
                  className="w-full flex items-center px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-lg text-left"
                >
                  <User className="mr-2.5 h-3.5 w-3.5 text-sky-400" />
                  Account Settings
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUserDropdownOpen(false)
                    navigate('/settings')
                  }}
                  className="w-full flex items-center px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-lg text-left"
                >
                  <CreditCard className="mr-2.5 h-3.5 w-3.5 text-sky-400" />
                  Billing & Subscriptions
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUserDropdownOpen(false)
                    navigate('/settings')
                  }}
                  className="w-full flex items-center px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-lg text-left"
                >
                  <Key className="mr-2.5 h-3.5 w-3.5 text-sky-400" />
                  API Keys & Integrations
                </button>
              </div>

              {user && (
                <div className="pt-1 border-t border-border/40">
                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false)
                      signOut()
                    }}
                    className="w-full flex items-center px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg text-left font-medium"
                  >
                    <LogOut className="mr-2.5 h-3.5 w-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
