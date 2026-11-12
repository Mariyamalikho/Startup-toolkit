/**
 * LandingPage.tsx
 *
 * Public Landing Page for Startup Toolkit.
 * Optimized for search engines, mobile responsiveness, structured semantic hierarchy,
 * internal linking, and fast perceived loading.
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Rocket,
  ArrowRight,
  Kanban,
  Users,
  Grid,
  FileText,
  Database,
  Lock,
  CheckCircle2,
  Globe,
  ShieldCheck,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Calendar,
  FlaskConical,
  HelpCircle,
} from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '@/components/ui/SocialIcons'
import { Button } from '@/components/ui/Button'
import { ChevronStepperRibbon } from '@/components/navigation/ChevronStepperRibbon'
import { usePageMetadata } from '@/hooks/usePageMetadata'

interface FAQItem {
  question: string
  answer: string
}

const FAQS: FAQItem[] = [
  {
    question: 'What frameworks are included in Startup Toolkit?',
    answer:
      'Startup Toolkit incorporates essential lean startup frameworks: a freeform raw ideation board, qualitative customer persona empathy mapping, Alexander Osterwalder’s 9-Box Business Model Canvas, a lean hypothesis experiment tracker, a 6-month engineering roadmap, and an automated 10-slide investor pitch deck.',
  },
  {
    question: 'Do I need a credit card or paid subscription to use it?',
    answer:
      'No. Startup Toolkit is completely free and includes an instant demo workspace that runs in your browser with local persistence. You can draft business models, test hypotheses, and export pitch decks immediately without signing up.',
  },
  {
    question: 'How does real-time data sync across tools in the workspace?',
    answer:
      'Customer personas and value propositions established in your empathy map or ideation board automatically sync across the Business Model Canvas, experiment tracker, and investor pitch deck slides, preventing manual re-entry.',
  },
  {
    question: 'Can I export my business model canvas and pitch deck to PDF?',
    answer:
      'Yes. The built-in client-side PDF export engine compiles your empathy insights, 9-box canvas blocks, validation metrics, and milestone roadmap into an executive PDF report formatted for stakeholder reviews and investor presentations.',
  },
  {
    question: 'How is my venture data secured?',
    answer:
      'When connected to Supabase, all tables enforce PostgreSQL Row Level Security (RLS) policies scoped strictly to your authenticated user account. When running offline or in demo mode, data remains isolated inside your browser’s local storage.',
  },
]

export function LandingPage() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  usePageMetadata({
    title: 'Lean Venture Ideation & Validation Workspace',
    description:
      'Integrated lean startup workspace: customer Empathy Mapping, Osterwalder 9-Box Business Model Canvas, hypothesis experiments, prototype roadmap, and 1-click investor pitch deck exports.',
    canonicalPath: '/',
  })

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 font-sans selection:bg-sky-400/30 flex flex-col justify-between">
      {/* ── Top Public Header & Navigation ──────────────────────────── */}
      <header className="sticky top-0 z-40 h-16 bg-[#12161f]/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center space-x-2.5 focus:outline-none focus:ring-2 focus:ring-sky-400 rounded-lg"
        >
          <div className="h-9 w-9 rounded-lg bg-slate-900 border border-sky-400/50 flex items-center justify-center">
            <Rocket className="h-4 w-4 text-sky-400" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">
            Startup<span className="text-sky-400">Toolkit</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center space-x-6 text-xs font-semibold text-slate-300"
        >
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <a href="#methodology" className="hover:text-white transition-colors">
            Methodology
          </a>
          <Link to="/workspace/demo-proj-1" className="hover:text-sky-400 transition-colors">
            Live Demo
          </Link>
          <Link to="/pitch-deck" className="hover:text-sky-400 transition-colors">
            Pitch Deck
          </Link>
          <a href="#faq" className="hover:text-white transition-colors">
            FAQ
          </a>
        </nav>

        {/* Action Buttons & Mobile Toggle */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Link to="/login">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs font-semibold text-slate-100 hover:bg-slate-800 hover:text-white"
            >
              Sign In
            </Button>
          </Link>

          <Link to="/signup" className="hidden sm:inline-block">
            <Button
              size="sm"
              className="text-xs font-bold bg-sky-400 text-slate-950 hover:bg-sky-300 rounded-lg"
            >
              Get Started
            </Button>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#12161f] border-b border-slate-800 px-4 py-4 space-y-3 animate-in fade-in slide-in-from-top-2">
          <nav
            aria-label="Mobile Navigation"
            className="flex flex-col space-y-2 text-sm font-semibold text-slate-200"
          >
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Features
            </a>
            <a
              href="#methodology"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Methodology Flow
            </a>
            <Link
              to="/workspace/demo-proj-1"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sky-400 hover:bg-slate-800 transition-colors"
            >
              Inspect Live Demo Canvas
            </Link>
            <Link
              to="/pitch-deck"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sky-400 hover:bg-slate-800 transition-colors"
            >
              View Investor Pitch Deck
            </Link>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              FAQ
            </a>
            <Link
              to="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg bg-sky-400 text-slate-950 font-bold text-center mt-2"
            >
              Get Started Free
            </Link>
          </nav>
        </div>
      )}

      {/* ── Main Landing Body ───────────────────────────────────────── */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-20">
        {/* ── Hero Section ──────────────────────────────────────────── */}
        <section aria-labelledby="hero-heading" className="max-w-3xl space-y-5">
          <p className="font-mono text-xs uppercase tracking-widest text-sky-400 font-semibold">
            Lean Startup Methodology &amp; Venture Strategy
          </p>

          <h1
            id="hero-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-[1.15]"
          >
            Structured frameworks for building and validating early-stage ventures.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
            Map customer discovery insights, model unit economics across a 9-box Business Model
            Canvas, track validation hypotheses, and export investor pitch decks from one unified
            workspace.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <Button
              size="lg"
              onClick={() => navigate('/signup')}
              className="bg-sky-400 text-slate-950 hover:bg-sky-300 font-bold px-6 rounded-lg text-sm h-11 w-full sm:w-auto justify-center shadow-sm"
            >
              Open New Workspace
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/workspace/demo-proj-1')}
              className="bg-[#181d27] border-slate-700 text-white hover:bg-slate-800 hover:border-sky-400/70 hover:text-sky-300 rounded-lg text-sm font-semibold px-6 h-11 w-full sm:w-auto justify-center"
            >
              Inspect Live Canvas
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/pitch-deck')}
              className="bg-[#12161f] border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg text-sm font-semibold px-5 h-11 w-full sm:w-auto justify-center"
            >
              Sample Pitch Deck
            </Button>
          </div>

          {/* Value Highlights */}
          <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-slate-400 font-medium">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Zero-friction instant demo</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>100% Client-side privacy fallback</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Printable PDF export engine</span>
            </div>
          </div>
        </section>

        {/* ── Interactive Workspace Preview Card ────────────────────── */}
        <section
          aria-label="Interactive Workspace Preview"
          className="rounded-2xl border border-slate-800 bg-[#12161f] p-4 sm:p-6 space-y-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="space-y-0.5">
              <span className="font-mono text-xs font-semibold text-slate-200">
                Active Venture: EcoPack Innovation
              </span>
              <p className="text-[11px] text-muted-foreground">
                Sustainable food packaging venture model in discovery phase
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center space-x-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 font-mono">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Autosave Synced</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/workspace/demo-proj-1')}
                className="h-8 px-3 text-xs font-semibold bg-[#181d27] border-slate-700 text-slate-100 hover:bg-slate-800 hover:border-sky-400/60 hover:text-sky-300"
              >
                Open Full Canvas
              </Button>
            </div>
          </div>

          <div className="bg-[#181d27] p-2 rounded-lg border border-slate-800 overflow-x-auto">
            <ChevronStepperRibbon currentStageId="canvas" preview />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <article className="p-4 rounded-xl bg-[#181d27] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Kanban className="h-3.5 w-3.5" />
                  Value Propositions
                </span>
                <span className="font-mono text-[11px] text-slate-400">Block 04 / 09</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Compostable thermal packaging engineered for regional meal delivery operators at
                parity unit cost with Expanded Polystyrene.
              </p>
            </article>

            <article className="p-4 rounded-xl bg-[#181d27] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  Customer Segments &amp; Revenue
                </span>
                <span className="font-mono text-[11px] text-slate-400">Block 07 / 09</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Direct B2B wholesale supply contracts with multi-location cloud kitchens and
                regional grocery fulfillment centers.
              </p>
            </article>
          </div>
        </section>

        {/* ── 5-Step Methodology Flow Section ───────────────────────── */}
        <section id="methodology" aria-labelledby="methodology-heading" className="space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <p className="font-mono text-xs uppercase tracking-widest text-sky-400 font-semibold">
              End-to-End Founder Lifecycle
            </p>
            <h2 id="methodology-heading" className="text-xl sm:text-2xl font-bold text-white mt-1">
              The 5-Stage Venture Validation Process
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              A continuous, interconnected workflow taking founders from raw concept to
              investor-ready presentation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Step 1 */}
            <article className="p-5 rounded-xl bg-[#12161f] border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-sky-400">STAGE 01</span>
                  <Sparkles className="h-4 w-4 text-sky-400" />
                </div>
                <h3 className="text-base font-bold text-white">Raw Ideation</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Capture unstructured startup concepts, feature brainstorms, growth hacks, and
                  operational risks on a flexible post-it canvas.
                </p>
              </div>
              <Link
                to="/workspace/demo-proj-1"
                className="text-xs font-semibold text-sky-400 hover:text-sky-300 inline-flex items-center space-x-1"
              >
                <span>Explore Ideation Tool</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </article>

            {/* Step 2 */}
            <article className="p-5 rounded-xl bg-[#12161f] border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-sky-400">STAGE 02</span>
                  <Users className="h-4 w-4 text-sky-400" />
                </div>
                <h3 className="text-base font-bold text-white">Customer Empathy Mapping</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Organize customer interview observations across Thinks &amp; Feels, Hears, Sees,
                  and Says &amp; Does to expose real buyer pain points.
                </p>
              </div>
              <Link
                to="/empathy-map"
                className="text-xs font-semibold text-sky-400 hover:text-sky-300 inline-flex items-center space-x-1"
              >
                <span>Open Empathy Canvas</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </article>

            {/* Step 3 */}
            <article className="p-5 rounded-xl bg-[#12161f] border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-sky-400">STAGE 03</span>
                  <Grid className="h-4 w-4 text-sky-400" />
                </div>
                <h3 className="text-base font-bold text-white">9-Box Business Model</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Map Osterwalder’s 9 building blocks: value propositions, key partners, channels,
                  customer segments, cost structures, and revenue streams.
                </p>
              </div>
              <Link
                to="/business-model-canvas"
                className="text-xs font-semibold text-sky-400 hover:text-sky-300 inline-flex items-center space-x-1"
              >
                <span>Launch 9-Box Canvas</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </article>

            {/* Step 4 */}
            <article className="p-5 rounded-xl bg-[#12161f] border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-sky-400">STAGE 04</span>
                  <FlaskConical className="h-4 w-4 text-sky-400" />
                </div>
                <h3 className="text-base font-bold text-white">Lean Experiments</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Translate critical business assumptions into rapid falsifiable tests with
                  measurable success thresholds before writing code.
                </p>
              </div>
              <Link
                to="/experiments"
                className="text-xs font-semibold text-sky-400 hover:text-sky-300 inline-flex items-center space-x-1"
              >
                <span>Track Experiments</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </article>

            {/* Step 5 */}
            <article className="p-5 rounded-xl bg-[#12161f] border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-sky-400">STAGE 05</span>
                  <Calendar className="h-4 w-4 text-sky-400" />
                </div>
                <h3 className="text-base font-bold text-white">Prototype Roadmap</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Sequence product engineering milestones across Discovery, Prototype, Alpha, Beta,
                  and Launch on a 6-month visual Gantt timeline.
                </p>
              </div>
              <Link
                to="/prototype"
                className="text-xs font-semibold text-sky-400 hover:text-sky-300 inline-flex items-center space-x-1"
              >
                <span>View Roadmap</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </article>

            {/* Pitch Deck Synthesis */}
            <article className="p-5 rounded-xl bg-[#12161f] border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-sky-400">OUTPUT</span>
                  <FileText className="h-4 w-4 text-sky-400" />
                </div>
                <h3 className="text-base font-bold text-white">Investor Pitch Deck</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Automatically compile all canvas insights into a 10-slide investor pitch deck with
                  theme customization and printable PDF reports.
                </p>
              </div>
              <Link
                to="/pitch-deck"
                className="text-xs font-semibold text-sky-400 hover:text-sky-300 inline-flex items-center space-x-1"
              >
                <span>Preview Pitch Deck</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </article>
          </div>
        </section>

        {/* ── Architectural Capabilities Matrix Section ───────────── */}
        <section id="features" aria-labelledby="features-heading" className="space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <p className="font-mono text-xs uppercase tracking-widest text-sky-400 font-semibold">
              Engineering Architecture
            </p>
            <h2 id="features-heading" className="text-xl sm:text-2xl font-bold text-white mt-1">
              Core Technical Infrastructure
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              Engineered for low-latency editing, strict tenant isolation, and clean document
              exports.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <article className="p-5 rounded-xl bg-[#12161f] border border-slate-800 flex items-start space-x-4">
              <div className="h-9 w-9 rounded-lg bg-slate-900 border border-slate-700 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                <Grid className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">
                  Empathy Map &amp; 9-Box Business Model Canvas
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Drag-and-drop sticky notes across customer discovery quadrants and business model
                  blocks with cross-tool state synchronization.
                </p>
              </div>
            </article>

            <article className="p-5 rounded-xl bg-[#12161f] border border-slate-800 flex items-start space-x-4">
              <div className="h-9 w-9 rounded-lg bg-slate-900 border border-slate-700 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                <Database className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">
                  Debounced Persistence &amp; Query Caching
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  1000ms debounced autosave with exponential backoff retry handling, in-memory TTL
                  query caching, and offline state recovery.
                </p>
              </div>
            </article>

            <article className="p-5 rounded-xl bg-[#12161f] border border-slate-800 flex items-start space-x-4">
              <div className="h-9 w-9 rounded-lg bg-slate-900 border border-slate-700 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">
                  Row Level Security &amp; Input Sanitization
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  PostgreSQL Row Level Security policies enforce strict user-scoped access across
                  all tables and private storage buckets.
                </p>
              </div>
            </article>

            <article className="p-5 rounded-xl bg-[#12161f] border border-slate-800 flex items-start space-x-4">
              <div className="h-9 w-9 rounded-lg bg-slate-900 border border-slate-700 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">
                  Pitch Deck &amp; Printable PDF Reports
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Compile canvas insights, validation experiments, and 6-month roadmaps into
                  presentation slides and structured PDF documents.
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* ── Frequently Asked Questions (FAQ) Section ──────────────── */}
        <section id="faq" aria-labelledby="faq-heading" className="space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <p className="font-mono text-xs uppercase tracking-widest text-sky-400 font-semibold">
              Knowledge Base
            </p>
            <h2 id="faq-heading" className="text-xl sm:text-2xl font-bold text-white mt-1">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              Everything you need to know about using Startup Toolkit for venture validation.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index

              return (
                <div
                  key={index}
                  className="rounded-xl border border-slate-800 bg-[#12161f] overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 text-sm font-bold text-white hover:text-sky-400 focus:outline-none focus:bg-slate-800/40"
                    aria-expanded={isOpen}
                  >
                    <span className="flex items-center gap-2.5">
                      <HelpCircle className="h-4 w-4 text-sky-400 shrink-0" />
                      <span>{faq.question}</span>
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-sky-400' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 animate-in fade-in">
                      {faq.answer}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* ── Ready to Validate CTA Section ─────────────────────────── */}
        <section
          aria-labelledby="cta-heading"
          className="rounded-2xl border border-sky-400/30 bg-[#12161f] p-8 sm:p-12 text-center space-y-4"
        >
          <h2
            id="cta-heading"
            className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
          >
            Ready to validate your startup idea?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Start structuring your customer discovery interviews, business model blocks, and
            investor pitch deck in minutes.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              onClick={() => navigate('/workspace/demo-proj-1')}
              className="bg-sky-400 text-slate-950 hover:bg-sky-300 font-bold px-8 rounded-lg text-sm h-11 w-full sm:w-auto"
            >
              Start Free in Demo Mode
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/signup')}
              className="bg-[#181d27] border-slate-700 text-white hover:bg-slate-800 rounded-lg text-sm font-semibold px-6 h-11 w-full sm:w-auto"
            >
              Create Account
            </Button>
          </div>
        </section>
      </main>

      {/* ── Public Footer & Internal Linking ───────────────────────── */}
      <footer className="border-t border-slate-800 bg-[#12161f] py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-300">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Top Footer Navigation Columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Col 1: Brand Info */}
            <div className="col-span-2 md:col-span-1 space-y-3">
              <div className="flex items-center space-x-2">
                <Rocket className="h-4 w-4 text-sky-400" />
                <span className="font-bold text-white text-base">Startup Toolkit</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Integrated venture validation workspace for early-stage founders and product teams.
              </p>
              <p className="text-xs text-slate-300 font-medium">
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
            </div>

            {/* Col 2: Methodology Tools */}
            <div className="space-y-3">
              <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                Methodology
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link
                    to="/workspace/demo-proj-1"
                    className="hover:text-sky-400 transition-colors"
                  >
                    Ideation Board
                  </Link>
                </li>
                <li>
                  <Link to="/empathy-map" className="hover:text-sky-400 transition-colors">
                    Customer Empathy Map
                  </Link>
                </li>
                <li>
                  <Link
                    to="/business-model-canvas"
                    className="hover:text-sky-400 transition-colors"
                  >
                    9-Box Business Model
                  </Link>
                </li>
                <li>
                  <Link to="/experiments" className="hover:text-sky-400 transition-colors">
                    Validation Experiments
                  </Link>
                </li>
                <li>
                  <Link to="/prototype" className="hover:text-sky-400 transition-colors">
                    Prototype Roadmap
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Resources & Product */}
            <div className="space-y-3">
              <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                Resources
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/pitch-deck" className="hover:text-sky-400 transition-colors">
                    Investor Pitch Deck
                  </Link>
                </li>
                <li>
                  <Link
                    to="/workspace/demo-proj-1"
                    className="hover:text-sky-400 transition-colors"
                  >
                    Live Demo Workspace
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="hover:text-sky-400 transition-colors">
                    Founder Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="hover:text-sky-400 transition-colors">
                    Privacy Policy &amp; Security
                  </Link>
                </li>
                <li>
                  <a
                    href="/sitemap.xml"
                    className="hover:text-sky-400 transition-colors font-mono text-[11px]"
                  >
                    Sitemap XML
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Founder Social Links */}
            <div className="space-y-3">
              <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                Connect
              </h4>
              <div className="flex flex-col space-y-2 text-xs">
                <a
                  href="https://mariyamalikhokhar.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 hover:text-sky-300 transition-colors"
                >
                  <Globe className="h-3.5 w-3.5 text-sky-400" />
                  <span>mariyamalikhokhar.com</span>
                </a>

                <a
                  href="https://github.com/Mariyamalikho"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 hover:text-sky-300 transition-colors"
                >
                  <GithubIcon className="h-3.5 w-3.5 text-sky-400" />
                  <span>GitHub (@Mariyamalikho)</span>
                </a>

                <a
                  href="https://www.linkedin.com/in/mariyamali-khokhar/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 hover:text-sky-300 transition-colors"
                >
                  <LinkedinIcon className="h-3.5 w-3.5 text-sky-400" />
                  <span>LinkedIn Profile</span>
                </a>

                <Link
                  to="/privacy-policy"
                  className="inline-flex items-center space-x-1.5 hover:text-emerald-400 transition-colors pt-1"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Security &amp; RLS Verified</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Strip */}
          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <span>
              © {new Date().getFullYear()} Startup Toolkit. Engineered with lean venture
              methodology.
            </span>
            <div className="flex items-center space-x-4">
              <Link to="/privacy-policy" className="hover:text-slate-200 transition-colors">
                Privacy
              </Link>
              <Link to="/login" className="hover:text-slate-200 transition-colors">
                Sign In
              </Link>
              <Link to="/signup" className="hover:text-slate-200 transition-colors">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
