/**
 * LandingPage.tsx
 *
 * Public Landing Page for Startup Toolkit.
 * Features structured product overview, interactive workspace preview,
 * methodology specification table, and founder attribution footer.
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
} from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '@/components/ui/SocialIcons'
import { Button } from '@/components/ui/Button'
import { ChevronStepperRibbon } from '@/components/navigation/ChevronStepperRibbon'

export function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 font-sans selection:bg-sky-400/30 flex flex-col justify-between">
      {/* Top Public Header */}
      <header className="sticky top-0 z-40 h-16 bg-[#12161f] border-b border-slate-800 px-4 sm:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2.5">
          <div className="h-9 w-9 rounded-lg bg-slate-900 border border-sky-400/50 flex items-center justify-center">
            <Rocket className="h-4 w-4 text-sky-400" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">
            Startup<span className="text-sky-400">Toolkit</span>
          </span>
        </Link>

        <div className="flex items-center space-x-3">
          <Link to="/login">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs font-semibold text-slate-100 hover:bg-slate-800 hover:text-white"
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
      </header>

      {/* Main Landing Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-16">
        {/* Hero Headline & Actions */}
        <div className="max-w-3xl space-y-5">
          <p className="font-mono text-xs uppercase tracking-widest text-sky-400 font-semibold">
            Venture Ideation &amp; Validation Workspace
          </p>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Structured frameworks for building and validating early-stage ventures.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
            Map customer discovery insights, model unit economics across a 9-box Business Model
            Canvas, track validation hypotheses, and export investor pitch decks from one unified
            workspace.
          </p>

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
              className="bg-[#181d27] border-slate-600 text-white hover:bg-slate-800 hover:border-sky-400/70 hover:text-sky-300 rounded-lg text-sm font-semibold px-6"
            >
              Inspect Live Canvas
            </Button>
          </div>
        </div>

        {/* Interactive Workspace Preview Container */}
        <div className="rounded-xl border border-slate-800 bg-[#12161f] p-4 sm:p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-semibold text-slate-200">
                Active Venture: EcoPack Innovation
              </span>
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
                className="h-7 px-3 text-xs font-semibold bg-[#181d27] border-slate-700 text-slate-100 hover:bg-slate-800 hover:border-sky-400/60 hover:text-sky-300"
              >
                Open Demo
              </Button>
            </div>
          </div>

          <div className="bg-[#181d27] p-2 rounded-lg border border-slate-800">
            <ChevronStepperRibbon currentStageId="bmc" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-[#181d27] border border-slate-800 space-y-2">
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
            </div>

            <div className="p-4 rounded-lg bg-[#181d27] border border-slate-800 space-y-2">
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
            </div>
          </div>
        </div>

        {/* Architectural Capabilities Matrix */}
        <div className="space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Core Methodology &amp; Infrastructure
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              Engineered for low-latency editing, strict tenant isolation, and clean document
              exports.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-[#12161f] border border-slate-800 flex items-start space-x-4">
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
            </div>

            <div className="p-5 rounded-xl bg-[#12161f] border border-slate-800 flex items-start space-x-4">
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
            </div>

            <div className="p-5 rounded-xl bg-[#12161f] border border-slate-800 flex items-start space-x-4">
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
            </div>

            <div className="p-5 rounded-xl bg-[#12161f] border border-slate-800 flex items-start space-x-4">
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
            </div>
          </div>
        </div>
      </main>

      {/* Public Footer */}
      <footer className="border-t border-slate-800 bg-[#12161f] py-8 px-4 sm:px-8 text-xs text-slate-300">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <Rocket className="h-4 w-4 text-sky-400" />
              <span className="font-bold text-white text-sm">Startup Toolkit</span>
              <span className="text-slate-400">© {new Date().getFullYear()}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 font-medium">
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

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <a
              href="https://mariyamalikhokhar.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#181d27] border border-slate-700 hover:border-sky-400 text-xs font-semibold text-slate-200 hover:text-sky-300 transition-colors"
            >
              <Globe className="h-3.5 w-3.5 text-sky-400" />
              <span>Website</span>
            </a>

            <a
              href="https://github.com/Mariyamalikho"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#181d27] border border-slate-700 hover:border-sky-400 text-xs font-semibold text-slate-200 hover:text-sky-300 transition-colors"
            >
              <GithubIcon className="h-3.5 w-3.5 text-sky-400" />
              <span>GitHub</span>
            </a>

            <a
              href="https://www.linkedin.com/in/mariyamali-khokhar/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#181d27] border border-slate-700 hover:border-sky-400 text-xs font-semibold text-slate-200 hover:text-sky-300 transition-colors"
            >
              <LinkedinIcon className="h-3.5 w-3.5 text-sky-400" />
              <span>LinkedIn</span>
            </a>

            <Link
              to="/privacy-policy"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#181d27] border border-slate-700 hover:border-sky-400 text-xs font-semibold text-slate-200 hover:text-sky-300 transition-colors"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Privacy Policy</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
