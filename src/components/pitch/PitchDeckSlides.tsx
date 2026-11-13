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
  Sun,
  Moon,
} from 'lucide-react'
import type { Project } from '@/types/database.types'
import { Button } from '@/components/ui/Button'
import { Link } from 'react-router-dom'
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalFooter } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { useTheme } from '@/hooks/useTheme'

export type DeckTheme =
  | 'studio-light'
  | 'nordic-pearl'
  | 'warm-paper'
  | 'editorial-indigo'
  | 'cyberpunk'
  | 'emerald'
  | 'sunset'
  | 'purple'
  | 'midnight'

type NoteEntry = { id?: string; content: string; color?: string } | string

function getNoteText(entry: NoteEntry): string {
  return typeof entry === 'string' ? entry : entry.content
}

interface PitchDeckSlidesProps {
  project: Project
}

export interface ThemeConfig {
  id: DeckTheme
  name: string
  subtitle: string
  category: 'light' | 'dark'
  bg: string
  border: string
  accentGradient: string
  accentColor: string
  titleText: string
  bodyText: string
  mutedText: string
  cardBg: string
  cardBorder: string
  cardText: string
  badgeBg: string
  badgeText: string
  iconBg: string
  iconColor: string
  dotInactive: string
  controlBorder: string
  controlText: string
}

const DECK_THEMES: Record<DeckTheme, ThemeConfig> = {
  // Light Themes
  'studio-light': {
    id: 'studio-light',
    name: 'Studio Minimalist',
    subtitle: 'Crisp white canvas with sky blue accents',
    category: 'light',
    bg: 'bg-white',
    border: 'border-slate-200',
    accentGradient: 'bg-sky-500',
    accentColor: 'text-sky-600',
    titleText: 'text-slate-900',
    bodyText: 'text-slate-700',
    mutedText: 'text-slate-500',
    cardBg: 'bg-slate-50',
    cardBorder: 'border-slate-200',
    cardText: 'text-slate-900',
    badgeBg: 'bg-sky-50',
    badgeText: 'text-sky-700 border-sky-200',
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-600',
    dotInactive: 'bg-slate-200 hover:bg-slate-300',
    controlBorder: 'border-slate-300',
    controlText: 'text-slate-700 hover:text-slate-900',
  },
  'nordic-pearl': {
    id: 'nordic-pearl',
    name: 'Nordic Pearl',
    subtitle: 'Subtle slate gray with emerald highlight',
    category: 'light',
    bg: 'bg-[#f8fafc]',
    border: 'border-emerald-200',
    accentGradient: 'bg-emerald-500',
    accentColor: 'text-emerald-700',
    titleText: 'text-slate-900',
    bodyText: 'text-slate-700',
    mutedText: 'text-slate-500',
    cardBg: 'bg-white',
    cardBorder: 'border-emerald-100 shadow-sm',
    cardText: 'text-slate-900',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700 border-emerald-200',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-700',
    dotInactive: 'bg-slate-200 hover:bg-slate-300',
    controlBorder: 'border-slate-300',
    controlText: 'text-slate-700 hover:text-slate-900',
  },
  'warm-paper': {
    id: 'warm-paper',
    name: 'Warm Editorial',
    subtitle: 'Cream ivory background with amber focus',
    category: 'light',
    bg: 'bg-[#faf8f5]',
    border: 'border-amber-200',
    accentGradient: 'bg-amber-500',
    accentColor: 'text-amber-700',
    titleText: 'text-amber-950',
    bodyText: 'text-amber-900/80',
    mutedText: 'text-amber-800/60',
    cardBg: 'bg-white',
    cardBorder: 'border-amber-200/70 shadow-sm',
    cardText: 'text-amber-950',
    badgeBg: 'bg-amber-100/70',
    badgeText: 'text-amber-800 border-amber-300',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-700',
    dotInactive: 'bg-amber-200 hover:bg-amber-300',
    controlBorder: 'border-amber-300',
    controlText: 'text-amber-900 hover:text-amber-950',
  },
  'editorial-indigo': {
    id: 'editorial-indigo',
    name: 'Executive Indigo',
    subtitle: 'Cool soft indigo with deep navy typography',
    category: 'light',
    bg: 'bg-[#f4f7fc]',
    border: 'border-indigo-200',
    accentGradient: 'bg-indigo-600',
    accentColor: 'text-indigo-700',
    titleText: 'text-slate-900',
    bodyText: 'text-slate-700',
    mutedText: 'text-slate-500',
    cardBg: 'bg-white',
    cardBorder: 'border-indigo-100 shadow-sm',
    cardText: 'text-slate-900',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-700 border-indigo-200',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-700',
    dotInactive: 'bg-indigo-200 hover:bg-indigo-300',
    controlBorder: 'border-indigo-200',
    controlText: 'text-slate-700 hover:text-slate-900',
  },

  // Dark Themes
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk Sky',
    subtitle: 'Deep midnight navy with bright electric cyan',
    category: 'dark',
    bg: 'bg-[#0d1424]',
    border: 'border-sky-500/40',
    accentGradient: 'bg-sky-400',
    accentColor: 'text-sky-400',
    titleText: 'text-white',
    bodyText: 'text-slate-200',
    mutedText: 'text-slate-400',
    cardBg: 'bg-[#131c30]',
    cardBorder: 'border-sky-500/20',
    cardText: 'text-white',
    badgeBg: 'bg-sky-500/10',
    badgeText: 'text-sky-300 border-sky-500/30',
    iconBg: 'bg-sky-950/60',
    iconColor: 'text-sky-400',
    dotInactive: 'bg-slate-700 hover:bg-slate-600',
    controlBorder: 'border-slate-700',
    controlText: 'text-slate-200 hover:text-white',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Growth',
    subtitle: 'Forest dark spruce with vivid mint green',
    category: 'dark',
    bg: 'bg-[#0a1813]',
    border: 'border-emerald-500/40',
    accentGradient: 'bg-emerald-400',
    accentColor: 'text-emerald-400',
    titleText: 'text-white',
    bodyText: 'text-slate-200',
    mutedText: 'text-slate-400',
    cardBg: 'bg-[#10241d]',
    cardBorder: 'border-emerald-500/20',
    cardText: 'text-white',
    badgeBg: 'bg-emerald-500/10',
    badgeText: 'text-emerald-300 border-emerald-500/30',
    iconBg: 'bg-emerald-950/60',
    iconColor: 'text-emerald-400',
    dotInactive: 'bg-slate-700 hover:bg-slate-600',
    controlBorder: 'border-slate-700',
    controlText: 'text-slate-200 hover:text-white',
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Amber',
    subtitle: 'Warm espresso tone with bright gold amber',
    category: 'dark',
    bg: 'bg-[#1a120e]',
    border: 'border-amber-500/40',
    accentGradient: 'bg-amber-400',
    accentColor: 'text-amber-400',
    titleText: 'text-white',
    bodyText: 'text-slate-200',
    mutedText: 'text-slate-400',
    cardBg: 'bg-[#271b15]',
    cardBorder: 'border-amber-500/20',
    cardText: 'text-white',
    badgeBg: 'bg-amber-500/10',
    badgeText: 'text-amber-300 border-amber-500/30',
    iconBg: 'bg-amber-950/60',
    iconColor: 'text-amber-400',
    dotInactive: 'bg-slate-700 hover:bg-slate-600',
    controlBorder: 'border-slate-700',
    controlText: 'text-slate-200 hover:text-white',
  },
  purple: {
    id: 'purple',
    name: 'Cobalt Slate',
    subtitle: 'Deep oceanic slate with neon cobalt accent',
    category: 'dark',
    bg: 'bg-[#0f172a]',
    border: 'border-blue-500/40',
    accentGradient: 'bg-blue-400',
    accentColor: 'text-blue-400',
    titleText: 'text-white',
    bodyText: 'text-slate-200',
    mutedText: 'text-slate-400',
    cardBg: 'bg-[#182338]',
    cardBorder: 'border-blue-500/20',
    cardText: 'text-white',
    badgeBg: 'bg-blue-500/10',
    badgeText: 'text-blue-300 border-blue-500/30',
    iconBg: 'bg-blue-950/60',
    iconColor: 'text-blue-400',
    dotInactive: 'bg-slate-700 hover:bg-slate-600',
    controlBorder: 'border-slate-700',
    controlText: 'text-slate-200 hover:text-white',
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Black',
    subtitle: 'Pure OLED black with monochrome gray accents',
    category: 'dark',
    bg: 'bg-[#080b11]',
    border: 'border-slate-800',
    accentGradient: 'bg-slate-400',
    accentColor: 'text-slate-300',
    titleText: 'text-white',
    bodyText: 'text-slate-200',
    mutedText: 'text-slate-400',
    cardBg: 'bg-[#111723]',
    cardBorder: 'border-slate-800',
    cardText: 'text-white',
    badgeBg: 'bg-slate-800',
    badgeText: 'text-slate-200 border-slate-700',
    iconBg: 'bg-slate-900',
    iconColor: 'text-slate-300',
    dotInactive: 'bg-slate-800 hover:bg-slate-700',
    controlBorder: 'border-slate-700',
    controlText: 'text-slate-200 hover:text-white',
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
  const { theme: appTheme } = useTheme()
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

  const [activeTheme, setActiveTheme] = useState<DeckTheme>(() => {
    const saved = localStorage.getItem('startup-toolkit-deck-theme') as DeckTheme | null
    if (saved && DECK_THEMES[saved]) return saved
    return appTheme === 'light' ? 'studio-light' : 'cyberpunk'
  })

  const [themeFilter, setThemeFilter] = useState<'all' | 'light' | 'dark'>('all')
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Custom slide text overrides
  const [customTitle, setCustomTitle] = useState(project.title)
  const [customSubtitle, setCustomSubtitle] = useState(
    project.description || 'Transforming ideas into scalable startup ventures.',
  )

  const handleSelectTheme = (themeKey: DeckTheme) => {
    setActiveTheme(themeKey)
    localStorage.setItem('startup-toolkit-deck-theme', themeKey)
    setIsThemeModalOpen(false)
  }

  const themeConfig =
    DECK_THEMES[activeTheme] ||
    (appTheme === 'light' ? DECK_THEMES['studio-light'] : DECK_THEMES.cyberpunk)

  // Extract canvas / empathy data with fallbacks
  const canvas = project.canvas || {}
  const empathy = project.empathy_map || {}

  const problemNotes: NoteEntry[] = empathy.pains || [
    { content: 'High operational friction in legacy manual workflows.' },
    { content: 'Lack of real-time data visibility across team stakeholders.' },
  ]

  const solutionNotes: NoteEntry[] = canvas.value_propositions || [
    { content: 'Automated 1-click methodology workspace.' },
    { content: 'Cloud database autosave with instant stakeholder exports.' },
  ]

  const customerSegments: NoteEntry[] = canvas.customer_segments || [
    { content: 'Solo Technical Founders & Indie Hackers' },
    { content: 'Accelerator Cohorts & Product Operations Teams' },
  ]

  const revenueStreams: NoteEntry[] = canvas.revenue_streams || [
    { content: 'Freemium Tier (3 active ventures)' },
    { content: 'Pro Founder Subscription ($19/mo per venture)' },
  ]

  const channels: NoteEntry[] = canvas.channels || [
    { content: 'Product Hunt Launch & Build-in-Public' },
    { content: 'SEO Founder Guides & Startup Templates' },
  ]

  const partners: NoteEntry[] = canvas.key_partners || [
    { content: 'Cloud Infrastructure Providers (Supabase / Vercel)' },
    { content: 'Startup Accelerators & Incubators' },
  ]

  const costs: NoteEntry[] = canvas.cost_structure || [
    { content: 'Serverless backend database & hosting infrastructure' },
    { content: 'Security compliance & domain licensing' },
  ]

  const slides: SlideData[] = [
    {
      id: 1,
      title: customTitle,
      subtitle: customSubtitle,
      icon: <Rocket className={`h-8 w-8 ${themeConfig.accentColor}`} />,
      accentColor: 'from-sky-400 to-blue-600',
      content: (
        <div className="text-center space-y-6 max-w-xl mx-auto py-8">
          <div
            className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border text-xs font-mono font-bold uppercase tracking-wider ${themeConfig.badgeBg} ${themeConfig.badgeText}`}
          >
            <span>Investor Pitch Deck</span>
          </div>

          <h2
            className={`text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight ${themeConfig.titleText}`}
          >
            {customTitle}
          </h2>

          <p className={`text-base leading-relaxed font-medium ${themeConfig.bodyText}`}>
            {customSubtitle}
          </p>

          <div
            className={`pt-6 flex items-center justify-center space-x-6 text-xs font-mono ${themeConfig.mutedText}`}
          >
            <span>
              Sector:{' '}
              <strong className={themeConfig.accentColor}>{project.industry || 'Tech'}</strong>
            </span>
            <span>•</span>
            <span>
              Status:{' '}
              <strong className="text-emerald-500 dark:text-emerald-400 font-bold">
                Active Seed Stage
              </strong>
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: 'The Problem',
      subtitle: 'Primary customer friction points and market inefficiencies.',
      icon: <Lightbulb className="h-8 w-8 text-amber-500 dark:text-amber-400" />,
      accentColor: 'from-amber-400 to-orange-600',
      content: (
        <div className="space-y-4 max-w-2xl mx-auto py-4">
          <div
            className={`p-5 rounded-2xl ${themeConfig.cardBg} border ${themeConfig.cardBorder} ${themeConfig.cardText} text-sm leading-relaxed shadow-sm`}
          >
            "
            {project.description ||
              'Target customers face severe friction, fragmented tools, and slow iteration cycles today.'}
            "
          </div>

          <h4 className="text-xs font-mono font-bold text-amber-500 dark:text-amber-400 uppercase tracking-wider pt-2">
            Key Pain Points Identified:
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {problemNotes.slice(0, 4).map((p, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl ${themeConfig.cardBg} border ${themeConfig.cardBorder} text-xs ${themeConfig.cardText} space-y-1 shadow-sm`}
              >
                <span className="font-mono text-[10px] text-amber-500 dark:text-amber-400 font-bold">
                  0{idx + 1}.
                </span>
                <p className="font-medium leading-relaxed">{getNoteText(p)}</p>
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
      icon: <Gem className="h-8 w-8 text-emerald-500 dark:text-emerald-400" />,
      accentColor: 'from-emerald-400 to-teal-600',
      content: (
        <div className="space-y-4 max-w-2xl mx-auto py-4">
          <h4 className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Core Value Propositions:
          </h4>

          <div className="grid grid-cols-1 gap-3">
            {solutionNotes.slice(0, 3).map((sol, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl ${themeConfig.cardBg} border ${themeConfig.cardBorder} text-xs ${themeConfig.cardText} flex items-start space-x-3 shadow-sm`}
              >
                <div className="h-6 w-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                  {idx + 1}
                </div>
                <p className="font-medium leading-relaxed pt-0.5">{getNoteText(sol)}</p>
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
      icon: <Users className={`h-8 w-8 ${themeConfig.accentColor}`} />,
      accentColor: 'from-sky-400 to-indigo-600',
      content: (
        <div className="space-y-4 max-w-2xl mx-auto py-4">
          <h4
            className={`text-xs font-mono font-bold uppercase tracking-wider ${themeConfig.accentColor}`}
          >
            Target Segments:
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {customerSegments.slice(0, 4).map((cs, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl ${themeConfig.cardBg} border ${themeConfig.cardBorder} text-xs ${themeConfig.cardText} space-y-2 shadow-sm`}
              >
                <span
                  className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${themeConfig.badgeBg} ${themeConfig.badgeText}`}
                >
                  Segment 0{idx + 1}
                </span>
                <p className="font-bold text-sm">{getNoteText(cs)}</p>
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
      icon: <TrendingUp className="h-8 w-8 text-emerald-500 dark:text-emerald-400" />,
      accentColor: 'from-emerald-400 to-green-600',
      content: (
        <div className="space-y-4 max-w-2xl mx-auto py-4">
          <h4 className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Revenue Streams:
          </h4>

          <div className="grid grid-cols-1 gap-3">
            {revenueStreams.slice(0, 3).map((rev, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl ${themeConfig.cardBg} border ${themeConfig.cardBorder} text-xs ${themeConfig.cardText} flex items-center justify-between shadow-sm`}
              >
                <span className={`font-bold text-sm ${themeConfig.cardText}`}>
                  {getNoteText(rev)}
                </span>
                <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 font-mono text-xs font-extrabold">
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
      icon: <Radio className="h-8 w-8 text-purple-500 dark:text-purple-400" />,
      accentColor: 'from-purple-400 to-pink-600',
      content: (
        <div className="space-y-4 max-w-2xl mx-auto py-4">
          <h4 className="text-xs font-mono font-bold text-purple-500 dark:text-purple-400 uppercase tracking-wider">
            Distribution Channels:
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {channels.slice(0, 4).map((ch, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl ${themeConfig.cardBg} border ${themeConfig.cardBorder} text-xs ${themeConfig.cardText} space-y-1 shadow-sm`}
              >
                <span className="text-[10px] font-mono text-purple-500 dark:text-purple-400 font-bold">
                  Channel 0{idx + 1}
                </span>
                <p className={`font-semibold ${themeConfig.cardText}`}>{getNoteText(ch)}</p>
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
      icon: <Box className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />,
      accentColor: 'from-indigo-400 to-blue-600',
      content: (
        <div className="space-y-4 max-w-2xl mx-auto py-4">
          <h4 className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Strategic Partners:
          </h4>

          <div className="grid grid-cols-1 gap-3">
            {partners.slice(0, 3).map((kp, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl ${themeConfig.cardBg} border ${themeConfig.cardBorder} text-xs ${themeConfig.cardText} font-semibold shadow-sm`}
              >
                {getNoteText(kp)}
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
      icon: <DollarSign className="h-8 w-8 text-rose-500 dark:text-rose-400" />,
      accentColor: 'from-rose-400 to-red-600',
      content: (
        <div className="space-y-4 max-w-2xl mx-auto py-4">
          <h4 className="text-xs font-mono font-bold text-rose-500 dark:text-rose-400 uppercase tracking-wider">
            Operational Expenses:
          </h4>

          <div className="grid grid-cols-1 gap-3">
            {costs.slice(0, 3).map((cst, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl ${themeConfig.cardBg} border ${themeConfig.cardBorder} text-xs ${themeConfig.cardText} font-semibold shadow-sm`}
              >
                {getNoteText(cst)}
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
      icon: <Trophy className="h-8 w-8 text-emerald-500 dark:text-emerald-400" />,
      accentColor: 'from-emerald-400 to-sky-500',
      content: (
        <div className="text-center space-y-6 max-w-md mx-auto py-6">
          <div
            className={`p-6 rounded-3xl ${themeConfig.cardBg} border ${themeConfig.cardBorder} space-y-3 shadow-lg`}
          >
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
              Methodology Score
            </span>
            <div className={`text-5xl font-extrabold font-mono ${themeConfig.titleText}`}>
              {project.progress || 35}%
            </div>
            <p className={`text-xs ${themeConfig.mutedText}`}>
              Empathy mapping and business model canvas validated.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 10,
      title: 'The Investment Ask',
      subtitle: 'Partner with us to scale this venture.',
      icon: <Target className={`h-8 w-8 ${themeConfig.accentColor}`} />,
      accentColor: 'from-sky-400 to-emerald-500',
      content: (
        <div className="text-center space-y-6 max-w-lg mx-auto py-6">
          <div
            className={`p-6 rounded-3xl ${themeConfig.cardBg} border ${themeConfig.cardBorder} space-y-4 shadow-lg`}
          >
            <h3 className={`text-2xl font-bold ${themeConfig.titleText}`}>Raising Seed Round</h3>
            <p className={`text-xs leading-relaxed ${themeConfig.mutedText}`}>
              Seeking strategic seed investment to accelerate product engineering, expand
              distribution channels, and scale customer acquisition.
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

  const lightThemes = (Object.keys(DECK_THEMES) as DeckTheme[]).filter(
    (k) => DECK_THEMES[k].category === 'light',
  )
  const darkThemes = (Object.keys(DECK_THEMES) as DeckTheme[]).filter(
    (k) => DECK_THEMES[k].category === 'dark',
  )

  const visibleThemeKeys = (Object.keys(DECK_THEMES) as DeckTheme[]).filter((k) => {
    if (themeFilter === 'all') return true
    return DECK_THEMES[k].category === themeFilter
  })

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface border border-border p-4 rounded-2xl shadow-sm">
        <div className="flex items-center space-x-3">
          <Link to={`/workspace/${project.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-2.5 border-border text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <span>{customTitle} - Investor Pitch Deck</span>
              <span
                className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md flex items-center gap-1 ${
                  themeConfig.category === 'light'
                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-300/40'
                    : 'bg-sky-500/20 text-sky-600 dark:text-sky-300 border border-sky-400/30'
                }`}
              >
                {themeConfig.category === 'light' ? (
                  <Sun className="h-3 w-3" />
                ) : (
                  <Moon className="h-3 w-3" />
                )}
                <span>{themeConfig.name}</span>
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
            className="h-9 px-3 text-xs font-semibold border-border hover:bg-muted/40"
          >
            <Palette className="mr-1.5 h-3.5 w-3.5 text-sky-500 dark:text-sky-400" />
            Deck Theme
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
            className="h-9 px-3 text-xs font-semibold border-border hover:bg-muted/40"
          >
            <Edit3 className="mr-1.5 h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
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
      <div
        className={`relative ${themeConfig.bg} border ${themeConfig.border} rounded-3xl p-8 sm:p-12 shadow-2xl min-h-[480px] flex flex-col justify-between overflow-hidden transition-all duration-300`}
      >
        {/* Top Slide Header */}
        <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-6">
          <div className="flex items-center space-x-3">
            <div
              className={`p-2.5 rounded-xl border ${themeConfig.iconBg} ${themeConfig.border} ${themeConfig.iconColor}`}
            >
              {currentSlide.icon}
            </div>
            <div>
              <span
                className={`text-[10px] font-mono font-bold uppercase tracking-widest ${themeConfig.accentColor}`}
              >
                Slide 0{currentSlide.id} / 10
              </span>
              <h3 className={`text-2xl font-extrabold tracking-tight ${themeConfig.titleText}`}>
                {currentSlide.title}
              </h3>
            </div>
          </div>

          <span className={`text-xs font-mono hidden sm:inline ${themeConfig.mutedText}`}>
            {currentSlide.subtitle}
          </span>
        </div>

        {/* Slide Body Content */}
        <div className="py-6 flex-1 flex flex-col justify-center">{currentSlide.content}</div>

        {/* Bottom Slide Controls */}
        <div className="flex items-center justify-between border-t border-black/10 dark:border-white/10 pt-6">
          <Button
            variant="outline"
            disabled={currentSlideIndex === 0}
            onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
            className={`text-xs font-bold ${themeConfig.controlBorder} ${themeConfig.controlText} bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10`}
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
                  idx === currentSlideIndex
                    ? `w-6 ${themeConfig.accentGradient}`
                    : `w-2 ${themeConfig.dotInactive}`
                }`}
                title={`Go to Slide ${idx + 1}`}
              />
            ))}
          </div>

          <Button
            disabled={currentSlideIndex === slides.length - 1}
            onClick={() => setCurrentSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))}
            className={`font-bold text-xs ${
              themeConfig.category === 'light'
                ? 'bg-slate-900 text-white hover:bg-slate-800'
                : 'bg-sky-400 text-slate-950 hover:bg-sky-300'
            }`}
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Deck Theme Selector Modal */}
      <Modal open={isThemeModalOpen} onOpenChange={setIsThemeModalOpen}>
        <ModalContent className="max-w-lg bg-surface border-border p-6 rounded-2xl shadow-2xl space-y-6">
          <ModalHeader className="space-y-1">
            <div className="flex items-center space-x-2 text-sky-500 dark:text-sky-400">
              <Sliders className="h-5 w-5" />
              <ModalTitle className="text-xl font-bold text-foreground">
                Select Pitch Deck Theme
              </ModalTitle>
            </div>
            <p className="text-xs text-muted-foreground">
              Choose an aesthetic light or dark color palette formatted for stakeholder reviews and
              investor presentations.
            </p>
          </ModalHeader>

          {/* Theme Category Filter Pills */}
          <div className="flex items-center gap-2 p-1 bg-muted/40 rounded-xl border border-border">
            <button
              type="button"
              onClick={() => setThemeFilter('all')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                themeFilter === 'all'
                  ? 'bg-surface text-foreground shadow-sm font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All Themes ({Object.keys(DECK_THEMES).length})
            </button>
            <button
              type="button"
              onClick={() => setThemeFilter('light')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                themeFilter === 'light'
                  ? 'bg-surface text-foreground shadow-sm font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Sun className="h-3.5 w-3.5 text-amber-500" />
              <span>Light Themes ({lightThemes.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setThemeFilter('dark')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                themeFilter === 'dark'
                  ? 'bg-surface text-foreground shadow-sm font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Moon className="h-3.5 w-3.5 text-sky-400" />
              <span>Dark Themes ({darkThemes.length})</span>
            </button>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {visibleThemeKeys.map((themeKey) => {
              const cfg = DECK_THEMES[themeKey]
              const isSelected = activeTheme === themeKey

              return (
                <button
                  key={themeKey}
                  type="button"
                  onClick={() => handleSelectTheme(themeKey)}
                  className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition-all text-left ${
                    isSelected
                      ? 'bg-sky-400/10 border-sky-400 shadow-sm ring-1 ring-sky-400/30'
                      : 'bg-muted/30 border-border hover:border-sky-400/40 hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    {/* Swatch Preview */}
                    <div
                      className={`h-9 w-9 rounded-xl border flex items-center justify-center shrink-0 shadow-sm ${cfg.bg} ${cfg.border}`}
                    >
                      <div className={`h-3 w-3 rounded-full ${cfg.accentGradient}`} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground">{cfg.name}</span>
                        <span
                          className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded ${
                            cfg.category === 'light'
                              ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-300/40'
                              : 'bg-sky-500/10 text-sky-600 dark:text-sky-300 border border-sky-400/30'
                          }`}
                        >
                          {cfg.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate">{cfg.subtitle}</p>
                    </div>
                  </div>

                  <div className="shrink-0 pl-2">
                    {isSelected ? (
                      <div className="h-6 w-6 rounded-full bg-sky-400 text-slate-950 flex items-center justify-center">
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="h-6 w-6 rounded-full border border-border" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          <ModalFooter className="pt-3 border-t border-border flex justify-end">
            <Button
              type="button"
              onClick={() => setIsThemeModalOpen(false)}
              className="bg-sky-400 text-slate-950 hover:bg-sky-300 font-bold text-xs px-5"
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Cover Slide Modal */}
      <Modal open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <ModalContent className="max-w-md bg-surface border-border p-6 rounded-2xl shadow-2xl space-y-6">
          <ModalHeader className="space-y-1">
            <div className="flex items-center space-x-2 text-indigo-500 dark:text-indigo-400">
              <Edit3 className="h-5 w-5" />
              <ModalTitle className="text-xl font-bold text-foreground">
                Edit Pitch Deck Title
              </ModalTitle>
            </div>
            <p className="text-xs text-muted-foreground">
              Customize your startup title and 1-line tag for investor presentation.
            </p>
          </ModalHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Venture Title</label>
              <Input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="bg-background border-border text-foreground text-xs focus:border-indigo-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Tagline / Subtitle</label>
              <Textarea
                value={customSubtitle}
                onChange={(e) => setCustomSubtitle(e.target.value)}
                rows={3}
                className="bg-background border-border text-foreground text-xs focus:border-indigo-400 resize-none"
              />
            </div>
          </div>

          <ModalFooter className="pt-4 border-t border-border flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              className="text-xs font-semibold border-border"
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
