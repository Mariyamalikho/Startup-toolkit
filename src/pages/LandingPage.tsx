/**
 * LandingPage.tsx
 *
 * Pixel-Perfect Public Landing Page for Startup Toolkit.
 * Features announcement pill, hero typography, primary/secondary CTA triggers,
 * desaturated dark interactive workspace UI mockup preview, feature grid cards, and footer.
 */

import { Link, useNavigate } from 'react-router-dom'
import {
  Rocket,
  ArrowRight,
  Sparkles,
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
    <div className="min-h-screen bg-[#12161f] text-foreground font-sans selection:bg-primary/30 flex flex-col justify-between">
      {/* ── Top Public Header ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 h-16 bg-[#181d27]/90 backdrop-blur-md border-b border-border/40 px-4 sm:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Rocket className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">
            Startup<span className="text-sky-400">Toolkit</span>
          </span>
        </Link>

        <div className="flex items-center space-x-3">
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-xs font-semibold">
              Sign In
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="sm" className="text-xs font-bold bg-sky-400 text-slate-950 hover:bg-sky-300">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* ── Main Landing Body ────────────────────────────────────────── */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-12 md:py-20 space-y-20">
        {/* Hero Headline & Subtitle Section */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          {/* Announcement Pill Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-sky-400/10 border border-sky-400/30 text-sky-300 text-xs font-semibold shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-sky-400 animate-pulse" />
            <span>All-in-One Founder Methodology Suite • Powered by Supabase</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Turn Startup Ideas into{' '}
            <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Investor-Ready Ventures
            </span>
          </h1>

          {/* Subtitle Paragraph */}
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            From Ideation and Empathy Mapping to Business Model Canvas and Pitch Decks — everything early-stage founders need in one dark, pixel-perfect workspace.
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
            <Button
              size="lg"
              onClick={() => navigate('/signup')}
              className="bg-sky-400 text-slate-950 hover:bg-sky-300 font-bold px-8 shadow-lg shadow-sky-500/20 text-sm group"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/workspace/demo-proj-1')}
              className="border-border/60 hover:bg-muted/20 text-sm font-semibold"
            >
              Explore Live Canvas Demo
            </Button>
          </div>
        </div>

        {/* ── Interactive Workspace Mockup Preview Card ────────────────── */}
        <div className="rounded-2xl border border-border/60 bg-[#181d27] p-4 sm:p-6 shadow-2xl space-y-6">
          {/* Mockup Header Bar */}
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <div className="flex items-center space-x-2">
              <span className="h-3 w-3 rounded-full bg-red-500/80" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="pl-2 font-mono text-xs text-muted-foreground">workspace.startuptoolkit.io</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-semibold">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Real-time Autosave Active</span>
            </div>
          </div>

          {/* Stepper Ribbon Inside Mockup */}
          <div className="bg-[#1c222e] p-2 rounded-xl border border-border/40">
            <ChevronStepperRibbon currentStageId="bmc" />
          </div>

          {/* Canvas Mockup Quadrant Grid Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#1c222e] border border-border/40 space-y-2">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                <Kanban className="h-3.5 w-3.5" />
                Problem & Value Prop
              </span>
              <p className="text-xs text-muted-foreground">High friction in early-stage founder methodology alignment.</p>
              <div className="pt-2">
                <span className="inline-block px-2 py-1 bg-amber-500/20 text-amber-300 text-[11px] rounded font-mono">
                  Post-it: Frictionless UI
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#1c222e] border border-border/40 space-y-2">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                Customer Segments
              </span>
              <p className="text-xs text-muted-foreground">Solo founders, pre-seed teams, and incubator cohort members.</p>
              <div className="pt-2">
                <span className="inline-block px-2 py-1 bg-sky-500/20 text-sky-300 text-[11px] rounded font-mono">
                  Target: Technical Founders
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#1c222e] border border-border/40 space-y-2">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                <Grid className="h-3.5 w-3.5" />
                Revenue Streams
              </span>
              <p className="text-xs text-muted-foreground">Freemium tier, Pro Founder plan ($19/mo), and Enterprise cohorts.</p>
              <div className="pt-2">
                <span className="inline-block px-2 py-1 bg-emerald-500/20 text-emerald-300 text-[11px] rounded font-mono">
                  SaaS Subscription Model
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Feature Highlights Grid ─────────────────────────────────── */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Built for High-Execution Founders</h2>
            <p className="text-sm text-muted-foreground">Structured startup frameworks combined with modern database sync.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#181d27] border border-border/40 space-y-3 hover:border-sky-400/40 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-sky-400/10 text-sky-400 flex items-center justify-center">
                <Kanban className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Structured Canvas</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Organize ideas, empathy maps, and business model canvas quadrants in a 1:1 pixel-perfect dark UI.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#181d27] border border-border/40 space-y-3 hover:border-sky-400/40 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-indigo-400/10 text-indigo-400 flex items-center justify-center">
                <Database className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Supabase Autosave</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                1000ms debounced automatic database saving so your work is never lost.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#181d27] border border-border/40 space-y-3 hover:border-sky-400/40 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-purple-400/10 text-purple-400 flex items-center justify-center">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Protected Workspaces</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                PostgreSQL RLS security policies keeping your startup venture IP completely confidential.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#181d27] border border-border/40 space-y-3 hover:border-sky-400/40 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Pitch Deck Export</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Instantly convert your canvas insights into structured pitch deck slides for investors.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ── Public Footer ────────────────────────────────────────────── */}
      <footer className="border-t border-border/40 bg-[#181d27] py-10 px-4 sm:px-8 text-xs text-muted-foreground space-y-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Copyright */}
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <Rocket className="h-4 w-4 text-sky-400" />
              <span className="font-bold text-white text-sm">Startup Toolkit</span>
              <span className="text-muted-foreground">© {new Date().getFullYear()}</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Built with precision by <span className="font-semibold text-slate-200">Mariyam Ali Khokhar</span>
            </p>
          </div>

          {/* Founder Social Links & Privacy Policy */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://mariyamalikhokhar.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#1c222e] border border-border/60 hover:border-sky-400 text-xs font-semibold text-slate-300 hover:text-sky-300 transition-colors"
            >
              <Globe className="h-3.5 w-3.5 text-sky-400" />
              <span>Website</span>
            </a>

            <a
              href="https://github.com/Mariyamalikho"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#1c222e] border border-border/60 hover:border-sky-400 text-xs font-semibold text-slate-300 hover:text-sky-300 transition-colors"
            >
              <GithubIcon className="h-3.5 w-3.5 text-indigo-400" />
              <span>GitHub</span>
            </a>

            <a
              href="https://www.linkedin.com/in/mariyamali-khokhar/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#1c222e] border border-border/60 hover:border-sky-400 text-xs font-semibold text-slate-300 hover:text-sky-300 transition-colors"
            >
              <LinkedinIcon className="h-3.5 w-3.5 text-sky-400" />
              <span>LinkedIn</span>
            </a>

            <Link
              to="/privacy-policy"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#1c222e] border border-border/60 hover:border-sky-400 text-xs font-semibold text-slate-300 hover:text-sky-300 transition-colors"
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
