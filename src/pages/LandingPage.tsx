/**
 * LandingPage.tsx
 *
 * Public Landing Page for Startup Toolkit.
 * Optimized for search engines, mobile responsiveness, structured semantic hierarchy,
 * internal linking, and fast perceived loading.
 */

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
  Sun,
  Moon,
} from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '@/components/ui/SocialIcons'
import { Button } from '@/components/ui/Button'
import { ChevronStepperRibbon } from '@/components/navigation/ChevronStepperRibbon'
import { usePageMetadata } from '@/hooks/usePageMetadata'
import { useTheme } from '@/hooks/useTheme'

export function LandingPage() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  usePageMetadata({
    title: 'Lean Venture Ideation & Validation Workspace',
    description:
      'Integrated lean startup workspace: customer Empathy Mapping, Osterwalder 9-Box Business Model Canvas, hypothesis experiments, prototype roadmap, and 1-click investor pitch deck exports.',
    canonicalPath: '/',
  })

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-sky-400/30 flex flex-col justify-between transition-colors">
      {/* ── Top Public Header & Navigation ──────────────────────────── */}
      <header className="sticky top-0 z-40 h-16 bg-surface/95 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl w-full h-full mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center space-x-2.5 focus:outline-none focus:ring-2 focus:ring-sky-400 rounded-lg"
          >
            <div className="h-9 w-9 rounded-lg bg-background border border-sky-500/40 flex items-center justify-center">
              <Rocket className="h-4 w-4 text-sky-500 dark:text-sky-400" />
            </div>
            <span className="font-bold text-lg tracking-tight text-foreground">
              Startup<span className="text-sky-500 dark:text-sky-400">Toolkit</span>
            </span>
          </Link>

          {/* Action Buttons & Theme Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="h-8 w-8 rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted/40 flex items-center justify-center transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <Link to="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs font-semibold text-foreground hover:bg-muted/40"
              >
                Sign In
              </Button>
            </Link>

            <Link to="/signup">
              <Button
                size="sm"
                className="text-xs font-bold bg-sky-400 text-slate-950 hover:bg-sky-300 rounded-lg"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Landing Body ───────────────────────────────────────── */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-14">
        {/* ── Hero Section ──────────────────────────────────────────── */}
        <section aria-labelledby="hero-heading" className="max-w-3xl space-y-5">
          <p className="font-mono text-xs uppercase tracking-widest text-sky-600 dark:text-sky-400 font-semibold">
            Venture Ideation &amp; Validation Workspace
          </p>

          <h1
            id="hero-heading"
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight"
          >
            Structured frameworks for building and validating early-stage ventures.
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl font-normal">
            Map customer discovery insights, model unit economics across a 9-box Business Model
            Canvas, track validation hypotheses, and export investor pitch decks from one unified
            workspace.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              size="lg"
              onClick={() => navigate('/signup')}
              className="bg-sky-400 text-slate-950 hover:bg-sky-300 font-bold px-6 rounded-lg text-sm"
            >
              Open New Workspace
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/workspace/demo-proj-1')}
              className="bg-surface border-border text-foreground hover:bg-muted/40 hover:border-sky-400/70 rounded-lg text-sm font-semibold px-6"
            >
              Inspect Live Canvas
            </Button>
          </div>
        </section>

        {/* ── Interactive Workspace Preview Card ────────────────────── */}
        <section
          aria-label="Interactive Workspace Preview"
          className="rounded-xl border border-border bg-surface p-4 sm:p-6 space-y-5 shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-semibold text-foreground">
                Active Venture: EcoPack Innovation
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center space-x-1.5 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 font-mono">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Autosave Synced</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/workspace/demo-proj-1')}
                className="h-7 px-3 text-xs font-semibold bg-background border-border text-foreground hover:bg-muted/40 hover:border-sky-400/60"
              >
                Open Demo
              </Button>
            </div>
          </div>

          <ChevronStepperRibbon currentStageId="canvas" preview />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <article className="p-4 rounded-lg bg-background border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Kanban className="h-3.5 w-3.5" />
                  Value Propositions
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">Block 04 / 09</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Compostable thermal packaging engineered for regional meal delivery operators at
                parity unit cost with Expanded Polystyrene.
              </p>
            </article>

            <article className="p-4 rounded-lg bg-background border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  Customer Segments &amp; Revenue
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">Block 07 / 09</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Direct B2B wholesale supply contracts with multi-location cloud kitchens and
                regional grocery fulfillment centers.
              </p>
            </article>
          </div>
        </section>

        {/* ── Core Methodology & Infrastructure ─────────────────────── */}
        <section id="features" aria-labelledby="features-heading" className="space-y-6">
          <div className="border-b border-border pb-4">
            <h2 id="features-heading" className="text-xl sm:text-2xl font-bold text-foreground">
              Core Methodology &amp; Infrastructure
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Engineered for low-latency editing, strict tenant isolation, and clean document
              exports.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <article className="p-5 rounded-xl bg-surface border border-border flex items-start space-x-4">
              <div className="h-9 w-9 rounded-lg bg-background border border-border text-sky-500 dark:text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                <Grid className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-foreground">
                  Empathy Map &amp; 9-Box Business Model Canvas
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Drag-and-drop sticky notes across customer discovery quadrants and business model
                  blocks with cross-tool state synchronization.
                </p>
              </div>
            </article>

            <article className="p-5 rounded-xl bg-surface border border-border flex items-start space-x-4">
              <div className="h-9 w-9 rounded-lg bg-background border border-border text-sky-500 dark:text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                <Database className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-foreground">
                  Debounced Persistence &amp; Query Caching
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  1000ms debounced autosave with exponential backoff retry handling, in-memory TTL
                  query caching, and offline state recovery.
                </p>
              </div>
            </article>

            <article className="p-5 rounded-xl bg-surface border border-border flex items-start space-x-4">
              <div className="h-9 w-9 rounded-lg bg-background border border-border text-sky-500 dark:text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-foreground">
                  Row Level Security &amp; Input Sanitization
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  PostgreSQL Row Level Security policies enforce strict user-scoped access across
                  all tables and private storage buckets.
                </p>
              </div>
            </article>

            <article className="p-5 rounded-xl bg-surface border border-border flex items-start space-x-4">
              <div className="h-9 w-9 rounded-lg bg-background border border-border text-sky-500 dark:text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-foreground">
                  Pitch Deck &amp; Printable PDF Reports
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Compile canvas insights, validation experiments, and 6-month roadmaps into
                  presentation slides and structured PDF documents.
                </p>
              </div>
            </article>
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
