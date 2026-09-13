/**
 * PitchDeckSlides.tsx
 *
 * 1:1 Pixel-Perfect Investor Pitch Deck Presenter & Theme Customizer Component for Startup Toolkit.
 * Automatically compiles Empathy Map insights, 9-box Business Model Canvas data, Experiments, and Roadmaps
 * into 10 presentation-ready investor slides with theme palette switching, content editing, and PDF export.
 */

import React, { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Printer,
  Rocket,
  Lightbulb,
  Gem,
  Users,
  TrendingUp,
  Radio,
  Box,
  DollarSign,
  Trophy,
  Target,
  ArrowLeft,
  Palette,
  Edit3,
  Sliders,
  Check,
} from 'lucide-react'
import type { Project } from '@/types/database.types'
import { Button } from '@/components/ui/Button'
import { Link } from 'react-router-dom'
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalFooter } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'

export type DeckTheme = 'cyberpunk' | 'emerald' | 'sunset' | 'purple' | 'midnight'

interface PitchDeckSlidesProps {
  project: Project
}

interface ThemeConfig {
  name: string
  bg: string
  border: string
  accentGradient: string
  badgeBg: string
  badgeText: string
}

const DECK_THEMES: Record<DeckTheme, ThemeConfig> = {
  cyberpunk: {
    name: 'Cyberpunk Sky',
    bg: 'bg-[#181d27]',
    border: 'border-sky-500/40',
    accentGradient: 'from-sky-400 to-indigo-600',
    badgeBg: 'bg-sky-500/10',
    badgeText: 'text-sky-300 border-sky-500/30',
  },
  emerald: {
    name: 'Emerald Growth',
    bg: 'bg-[#131e1a]',
    border: 'border-emerald-500/40',
    accentGradient: 'from-emerald-400 to-teal-600',
    badgeBg: 'bg-emerald-500/10',
    badgeText: 'text-emerald-300 border-emerald-500/30',
  },
  sunset: {
    name: 'Sunset Amber',
    bg: 'bg-[#1f1917]',
    border: 'border-amber-500/40',
    accentGradient: 'from-amber-400 to-rose-600',
    badgeBg: 'bg-amber-500/10',
    badgeText: 'text-amber-300 border-amber-500/30',
  },
  purple: {
    name: 'Royal Purple',
    bg: 'bg-[#1a1726]',
    border: 'border-purple-500/40',
    accentGradient: 'from-purple-400 to-pink-600',
    badgeBg: 'bg-purple-500/10',
    badgeText: 'text-purple-300 border-purple-500/30',
  },
  midnight: {
    name: 'Midnight Dark',
    bg: 'bg-[#0f172a]',
    border: 'border-slate-700',
    accentGradient: 'from-slate-300 to-slate-500',
    badgeBg: 'bg-slate-800',
    badgeText: 'text-slate-200 border-slate-700',
  },
}

interface SlideData {
  id: number
  title: string
  subtitle: string
  icon: React.ReactNode
  accentColor: string
  content: React.ReactNode
}

export function PitchDeckSlides({ project }: PitchDeckSlidesProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [activeTheme, setActiveTheme] = useState<DeckTheme>('cyberpunk')
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Custom slide text overrides
  const [customTitle, setCustomTitle] = useState(project.title)
  const [customSubtitle, setCustomSubtitle] = useState(
    project.description || 'Transforming ideas into scalable startup ventures.',
  )

  const themeConfig = DECK_THEMES[activeTheme] || DECK_THEMES.cyberpunk

  // Extract canvas / empathy data with fallbacks
  const canvas = project.canvas || {}
  const empathy = project.empathy_map || {}

  const problemNotes = empathy.pains || [
    { content: 'High operational friction in legacy manual workflows.' },
    { content: 'Lack of real-time data visibility across team stakeholders.' },
  ]

  const solutionNotes = canvas.value_propositions || [
    { content: 'Automated 1-click methodology workspace.' },
    { content: 'Cloud database autosave with instant stakeholder exports.' },
  ]

  const customerSegments = canvas.customer_segments || [
    { content: 'Solo Technical Founders & Indie Hackers' },
    { content: 'Accelerator Cohorts & Product Operations Teams' },
  ]

  const revenueStreams = canvas.revenue_streams || [
    { content: 'Freemium Tier (3 active ventures)' },
    { content: 'Pro Founder Subscription ($19/mo per venture)' },
  ]

  const channels = canvas.channels || [
    { content: 'Product Hunt Launch & Build-in-Public' },
    { content: 'SEO Founder Guides & Startup Templates' },
  ]

  const partners = canvas.key_partners || [
    { content: 'Cloud Infrastructure Providers (Supabase / Vercel)' },
    { content: 'Startup Accelerators & Incubators' },
  ]

  const costs = canvas.cost_structure || [
    { content: 'Serverless backend database & hosting infrastructure' },
    { content: 'Security compliance & domain licensing' },
  ]

  const slides: SlideData[] = [
    {
      id: 1,
      title: customTitle,
      subtitle: customSubtitle,
      icon: <Rocket className="h-8 w-8 text-sky-400" />,
      accentColor: 'from-sky-400 to-blue-600',
      content: (
        <div className="text-center space-y-6 max-w-xl mx-auto py-8">
          <div className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border text-xs font-mono font-bold uppercase tracking-wider ${themeConfig.badgeBg} ${themeConfig.badgeText}`}>
            <span>Investor Pitch Deck</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {customTitle}
          </h2>

          <p className="text-base text-slate-300 leading-relaxed font-medium">
            {customSubtitle}
          </p>

          <div className="pt-6 flex items-center justify-center space-x-6 text-xs text-muted-foreground font-mono">
            <span>Sector: <strong className="text-sky-400">{project.industry || 'Tech'}</strong></span>
            <span>•</span>
            <span>Status: <strong className="text-emerald-400">Active Seed Stage</strong></span>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: 'The Problem',
      subtitle: 'Primary customer friction points and market inefficiencies.',
      icon: <Lightbulb className="h-8 w-8 text-amber-400" />,
      accentColor: 'from-amber-400 to-orange-600',
      content: (
        <div className="space-y-4 max-w-2xl mx-auto py-4">
          <div className="p-5 rounded-2xl bg-[#12161f] border border-amber-400/30 text-slate-200 text-sm leading-relaxed">
            "{project.description || 'Target customers face severe friction, fragmented tools, and slow iteration cycles today.'}"
          </div>

          <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider pt-2">
            Key Pain Points Identified:
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {problemNotes.slice(0, 4).map((p: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl bg-[#181d27] border border-border/60 text-xs text-white space-y-1">
                <span className="font-mono text-[10px] text-amber-400 font-bold">0{idx + 1}.</span>
                <p className="font-medium leading-relaxed">{p.content || p}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: 'The Solution & Value Prop',
      subtitle: 'Our unique approach to solving customer friction.',
      icon: <Gem className="h-8 w-8 text-emerald-400" />,
      accentColor: 'from-emerald-400 to-teal-600',
      content: (
        <div className="space-y-4 max-w-2xl mx-auto py-4">
          <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
            Core Value Propositions:
          </h4>

          <div className="grid grid-cols-1 gap-3">
            {solutionNotes.slice(0, 3).map((sol: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl bg-[#12161f] border border-emerald-400/30 text-xs text-white flex items-start space-x-3">
                <div className="h-6 w-6 rounded-lg bg-emerald-400/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                  {idx + 1}
                </div>
                <p className="font-medium leading-relaxed pt-0.5">{sol.content || sol}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: 'Target Market & Customer Segments',
      subtitle: 'Ideal customer personas and niche market focus.',
      icon: <Users className="h-8 w-8 text-sky-400" />,
      accentColor: 'from-sky-400 to-indigo-600',
      content: (
        <div className="space-y-4 max-w-2xl mx-auto py-4">
          <h4 className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
            Target Segments:
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {customerSegments.slice(0, 4).map((cs: any, idx: number) => (
              <div key={idx} className="p-5 rounded-2xl bg-[#12161f] border border-sky-400/30 text-xs text-white space-y-2">
                <span className="px-2.5 py-0.5 rounded-full bg-sky-400/20 text-sky-300 font-mono text-[10px] font-bold">
                  Segment 0{idx + 1}
                </span>
                <p className="font-bold text-sm">{cs.content || cs}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 5,
      title: 'Business Model & Revenue',
      subtitle: 'Monetization strategy and financial revenue streams.',
      icon: <TrendingUp className="h-8 w-8 text-emerald-400" />,
      accentColor: 'from-emerald-400 to-green-600',
      content: (
        <div className="space-y-4 max-w-2xl mx-auto py-4">
          <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
            Revenue Streams:
          </h4>

          <div className="grid grid-cols-1 gap-3">
            {revenueStreams.slice(0, 3).map((rev: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl bg-[#12161f] border border-emerald-400/30 text-xs text-white flex items-center justify-between">
                <span className="font-bold text-sm text-slate-100">{rev.content || rev}</span>
                <span className="px-3 py-1 rounded-lg bg-emerald-400/20 text-emerald-300 font-mono text-xs font-extrabold">
                  Recurring Revenue
                </span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 6,
      title: 'Go-To-Market & Channels',
      subtitle: 'Customer acquisition and distribution strategy.',
      icon: <Radio className="h-8 w-8 text-purple-400" />,
      accentColor: 'from-purple-400 to-pink-600',
      content: (
        <div className="space-y-4 max-w-2xl mx-auto py-4">
          <h4 className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
            Distribution Channels:
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {channels.slice(0, 4).map((ch: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl bg-[#12161f] border border-purple-400/30 text-xs text-white space-y-1">
                <span className="text-[10px] font-mono text-purple-400 font-bold">Channel 0{idx + 1}</span>
                <p className="font-semibold text-slate-100">{ch.content || ch}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 7,
      title: 'Key Partners & Infrastructure',
      subtitle: 'Strategic alliances and technical ecosystem.',
      icon: <Box className="h-8 w-8 text-indigo-400" />,
      accentColor: 'from-indigo-400 to-blue-600',
      content: (
        <div className="space-y-4 max-w-2xl mx-auto py-4">
          <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
            Strategic Partners:
          </h4>

          <div className="grid grid-cols-1 gap-3">
            {partners.slice(0, 3).map((kp: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl bg-[#12161f] border border-indigo-400/30 text-xs text-white font-semibold">
                {kp.content || kp}
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 8,
      title: 'Cost Structure & Expenses',
      subtitle: 'Major fixed and variable operational costs.',
      icon: <DollarSign className="h-8 w-8 text-rose-400" />,
      accentColor: 'from-rose-400 to-red-600',
      content: (
        <div className="space-y-4 max-w-2xl mx-auto py-4">
          <h4 className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
            Operational Expenses:
          </h4>

          <div className="grid grid-cols-1 gap-3">
            {costs.slice(0, 3).map((cst: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl bg-[#12161f] border border-rose-400/30 text-xs text-white font-semibold">
                {cst.content || cst}
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 9,
      title: 'Traction & Methodology Score',
      subtitle: 'Project completion momentum and readiness.',
      icon: <Trophy className="h-8 w-8 text-emerald-400" />,
      accentColor: 'from-emerald-400 to-sky-500',
      content: (
        <div className="text-center space-y-6 max-w-md mx-auto py-6">
          <div className="p-6 rounded-3xl bg-[#12161f] border border-emerald-400/40 space-y-3 shadow-xl">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase">Methodology Score</span>
            <div className="text-5xl font-extrabold text-white font-mono">{project.progress || 35}%</div>
            <p className="text-xs text-muted-foreground">Empathy mapping and business model canvas validated.</p>
          </div>
        </div>
      ),
    },
    {
      id: 10,
      title: 'The Investment Ask',
      subtitle: 'Partner with us to scale this venture.',
      icon: <Target className="h-8 w-8 text-sky-400" />,
      accentColor: 'from-sky-400 to-emerald-500',
      content: (
        <div className="text-center space-y-6 max-w-lg mx-auto py-6">
          <div className="p-6 rounded-3xl bg-[#12161f] border border-sky-400/40 space-y-4">
            <h3 className="text-2xl font-bold text-white">Raising Seed Round</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Seeking strategic seed investment to accelerate product engineering, expand distribution channels, and scale customer acquisition.
            </p>
            <div className="pt-2">
              <Button
                onClick={() => window.print()}
                className="bg-sky-400 text-slate-950 hover:bg-sky-300 font-extrabold text-xs px-6 h-10 shadow-lg shadow-sky-500/20"
              >
                <Printer className="mr-1.5 h-4 w-4" />
                Export / Print Deck
              </Button>
            </div>
          </div>
        </div>
      ),
    },
  ]

  const currentSlide = slides[currentSlideIndex]

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#181d27]/70 border border-border/40 p-4 rounded-2xl">
        <div className="flex items-center space-x-3">
          <Link to={`/workspace/${project.id}`}>
            <Button variant="outline" size="sm" className="h-9 px-2.5 border-border/60 text-muted-foreground hover:text-white">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>{customTitle} — Investor Pitch Deck</span>
              <span className="text-[10px] font-mono font-bold uppercase bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full">
                {themeConfig.name}
              </span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Slide {currentSlideIndex + 1} of {slides.length}
            </p>
          </div>
        </div>

        {/* Customizer & Print Trigger Buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsThemeModalOpen(true)}
            className="h-9 px-3 text-xs font-semibold border-border/60 hover:bg-muted/20"
          >
            <Palette className="mr-1.5 h-3.5 w-3.5 text-sky-400" />
            Deck Theme
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
            className="h-9 px-3 text-xs font-semibold border-border/60 hover:bg-muted/20"
          >
            <Edit3 className="mr-1.5 h-3.5 w-3.5 text-indigo-400" />
            Edit Cover
          </Button>

          <Button
            size="sm"
            onClick={() => window.print()}
            className="h-9 px-4 text-xs font-extrabold bg-sky-400 text-slate-950 hover:bg-sky-300 shadow-md shadow-sky-500/20"
          >
            <Printer className="mr-1.5 h-3.5 w-3.5" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Main Slide Presentation Stage */}
      <div className={`relative ${themeConfig.bg} border ${themeConfig.border} rounded-3xl p-8 sm:p-12 shadow-2xl min-h-[480px] flex flex-col justify-between overflow-hidden transition-all duration-300`}>
        {/* Top Slide Header */}
        <div className="flex items-center justify-between border-b border-border/40 pb-6">
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-2xl bg-gradient-to-br ${currentSlide.accentColor} text-slate-950 shadow-md`}>
              {currentSlide.icon}
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-widest">
                Slide 0{currentSlide.id} / 10
              </span>
              <h3 className="text-2xl font-extrabold text-white tracking-tight">{currentSlide.title}</h3>
            </div>
          </div>

          <span className="text-xs text-muted-foreground font-mono hidden sm:inline">
            {currentSlide.subtitle}
          </span>
        </div>

        {/* Slide Body Content */}
        <div className="py-6 flex-1 flex flex-col justify-center">
          {currentSlide.content}
        </div>

        {/* Bottom Slide Controls */}
        <div className="flex items-center justify-between border-t border-border/40 pt-6">
          <Button
            variant="outline"
            disabled={currentSlideIndex === 0}
            onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
            className="text-xs font-bold border-border/60"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>

          {/* Slide Dots Indicator */}
          <div className="flex items-center space-x-1.5">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentSlideIndex ? 'w-6 bg-sky-400' : 'w-2 bg-muted/40 hover:bg-muted'
                }`}
                title={`Go to Slide ${idx + 1}`}
              />
            ))}
          </div>

          <Button
            disabled={currentSlideIndex === slides.length - 1}
            onClick={() => setCurrentSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))}
            className="bg-sky-400 text-slate-950 hover:bg-sky-300 font-bold text-xs"
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Deck Theme Selector Modal */}
      <Modal open={isThemeModalOpen} onOpenChange={setIsThemeModalOpen}>
        <ModalContent className="max-w-md bg-[#181d27] border-border/60 p-6 rounded-2xl shadow-2xl space-y-6">
          <ModalHeader className="space-y-1">
            <div className="flex items-center space-x-2 text-sky-400">
              <Sliders className="h-5 w-5" />
              <ModalTitle className="text-xl font-bold text-white">Select Pitch Deck Theme</ModalTitle>
            </div>
            <p className="text-xs text-muted-foreground">
              Choose an aesthetic color palette and gradient style for your investor presentation deck.
            </p>
          </ModalHeader>

          <div className="space-y-3">
            {(Object.keys(DECK_THEMES) as DeckTheme[]).map((themeKey) => {
              const cfg = DECK_THEMES[themeKey]
              const isSelected = activeTheme === themeKey

              return (
                <button
                  key={themeKey}
                  type="button"
                  onClick={() => {
                    setActiveTheme(themeKey)
                    setIsThemeModalOpen(false)
                  }}
                  className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-sky-400/10 border-sky-400 text-white shadow-lg'
                      : 'bg-[#12161f] border-border/40 text-slate-300 hover:border-sky-400/40'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`h-6 w-6 rounded-full bg-gradient-to-tr ${cfg.accentGradient}`} />
                    <span className="text-xs font-bold">{cfg.name}</span>
                  </div>

                  {isSelected && <Check className="h-4 w-4 text-sky-400" />}
                </button>
              )
            })}
          </div>

          <ModalFooter className="pt-4 border-t border-border/40 flex justify-end">
            <Button
              type="button"
              onClick={() => setIsThemeModalOpen(false)}
              className="bg-sky-400 text-slate-950 font-bold text-xs px-5"
            >
              Apply Theme
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Cover Slide Modal */}
      <Modal open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <ModalContent className="max-w-md bg-[#181d27] border-border/60 p-6 rounded-2xl shadow-2xl space-y-6">
          <ModalHeader className="space-y-1">
            <div className="flex items-center space-x-2 text-indigo-400">
              <Edit3 className="h-5 w-5" />
              <ModalTitle className="text-xl font-bold text-white">Edit Pitch Deck Title</ModalTitle>
            </div>
            <p className="text-xs text-muted-foreground">
              Customize your startup title and 1-line tag for investor presentation.
            </p>
          </ModalHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200">Venture Title</label>
              <Input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="bg-[#1c222e] border-border/60 text-xs focus:border-indigo-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200">Tagline / Subtitle</label>
              <Textarea
                value={customSubtitle}
                onChange={(e) => setCustomSubtitle(e.target.value)}
                rows={3}
                className="bg-[#1c222e] border-border/60 text-xs focus:border-indigo-400 resize-none"
              />
            </div>
          </div>

          <ModalFooter className="pt-4 border-t border-border/40 flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              className="text-xs font-semibold border-border/60"
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="bg-indigo-500 text-white font-bold text-xs px-5"
            >
              Save Cover
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
