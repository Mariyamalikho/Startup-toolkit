/**
 * DashboardPage.tsx
 *
 * Pixel-Perfect Founder Workspace Dashboard Page for Startup Toolkit.
 * Features stat cards summary, search & industry filter controls,
 * ProjectGrid supporting Grid and List view modes, and new project action triggers.
 */

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useProjectStore } from '@/store/projectStore'
import type { Project } from '@/types/database.types'
import {
  Rocket,
  Plus,
  Search,
  Filter,
  Layers,
  Database,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ProjectGrid } from '@/components/dashboard/ProjectGrid'

export function DashboardPage() {
  const navigate = useNavigate()
  const { projects, activeProject, loading, fetchUserProjects } = useProjectStore()

  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedIndustry, setSelectedIndustry] = React.useState<string>('all')

  React.useEffect(() => {
    fetchUserProjects()
  }, [])

  // Filter projects by search query and selected industry
  const filteredProjects = React.useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesIndustry =
        selectedIndustry === 'all' || (p.industry && p.industry.toLowerCase() === selectedIndustry.toLowerCase())
      return matchesSearch && matchesIndustry
    })
  }, [projects, searchQuery, selectedIndustry])

  // Extract unique industries for filter dropdown
  const industries = React.useMemo(() => {
    const set = new Set<string>()
    projects.forEach((p) => {
      if (p.industry) set.add(p.industry)
    })
    return Array.from(set)
  }, [projects])

  const handleCreateNewVenture = () => {
    const id = `proj-${Date.now()}`
    const newProj: Project = {
      id,
      user_id: 'demo-user',
      title: 'New Startup Venture',
      description: 'Define your problem statement, empathy mapping, and business model canvas.',
      industry: 'Tech',
      status: 'active',
      progress: 20,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    useProjectStore.getState().addProject(newProj)
    navigate(`/workspace/${id}`)
  }

  return (
    <div className="space-y-8">
      {/* Top Banner Header & Primary CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-400/10 border border-sky-400/30 text-sky-300 text-xs font-semibold">
            <Rocket className="h-3.5 w-3.5 text-sky-400" />
            <span>Founder Workspace Overview</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Startup Ventures Dashboard
          </h1>
          <p className="text-xs text-muted-foreground">
            Manage your methodology canvases, empathy maps, and investor-ready pitch decks.
          </p>
        </div>

        <Button
          onClick={handleCreateNewVenture}
          className="bg-sky-400 text-slate-950 hover:bg-sky-300 font-bold px-5 h-11 text-xs shadow-lg shadow-sky-500/20"
        >
          <Plus className="mr-2 h-4 w-4 stroke-[3]" />
          New Startup Venture
        </Button>
      </div>

      {/* ── Summary Stat Cards Grid ───────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Ventures */}
        <div className="p-4 rounded-2xl bg-[#181d27] border border-border/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Total Ventures</span>
            <div className="h-8 w-8 rounded-xl bg-sky-400/10 text-sky-400 flex items-center justify-center">
              <Rocket className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{projects.length}</div>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
            <span>Active founder workspace</span>
          </p>
        </div>

        {/* Card 2: Active Workspace */}
        <div className="p-4 rounded-2xl bg-[#181d27] border border-border/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Active Venture</span>
            <div className="h-8 w-8 rounded-xl bg-indigo-400/10 text-indigo-400 flex items-center justify-center">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="text-base font-extrabold text-white truncate font-mono">
            {activeProject?.title || 'None selected'}
          </div>
          <p className="text-[11px] text-sky-400 font-semibold truncate">
            {activeProject?.industry || 'Startup'}
          </p>
        </div>

        {/* Card 3: Stage Progress */}
        <div className="p-4 rounded-2xl bg-[#181d27] border border-border/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Canvas Completion</span>
            <div className="h-8 w-8 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">45%</div>
          <p className="text-[11px] text-muted-foreground">Average methodology score</p>
        </div>

        {/* Card 4: Database Sync Status */}
        <div className="p-4 rounded-2xl bg-[#181d27] border border-border/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Supabase Storage</span>
            <div className="h-8 w-8 rounded-xl bg-purple-400/10 text-purple-400 flex items-center justify-center">
              <Database className="h-4 w-4" />
            </div>
          </div>
          <div className="text-base font-extrabold text-emerald-400 font-mono flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" />
            <span>RLS Active</span>
          </div>
          <p className="text-[11px] text-muted-foreground">1000ms debounced autosave</p>
        </div>
      </div>

      {/* ── Search & Filter Controls Toolbar ──────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#181d27]/60 p-3 rounded-2xl border border-border/40">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search ventures by name or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 text-xs bg-[#1c222e] border-border/60 focus:border-sky-400"
          />
        </div>

        {/* Industry Filter Dropdown */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="h-10 bg-[#1c222e] border border-border/60 text-xs font-semibold text-foreground px-3 rounded-xl focus:outline-none focus:border-sky-400 cursor-pointer"
          >
            <option value="all">All Industries ({projects.length})</option>
            {industries.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Project Grid & List View Toggle Component ─────────────────── */}
      <ProjectGrid
        projects={filteredProjects}
        isLoading={loading}
        onCreateProject={handleCreateNewVenture}
      />
    </div>
  )
}
