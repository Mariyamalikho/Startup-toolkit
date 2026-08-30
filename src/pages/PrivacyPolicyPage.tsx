/**
 * PrivacyPolicyPage.tsx
 *
 * Pixel-Perfect Public Privacy Policy Page for Startup Toolkit.
 * Explains founder data protection, Supabase Row Level Security (RLS),
 * 1000ms debounced database autosave, local storage, and founder contact info.
 */

import { Link } from 'react-router-dom'
import {
  Rocket,
  ShieldCheck,
  Lock,
  Database,
  Globe,
  ArrowLeft,
  HardDrive,
  UserCheck,
} from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '@/components/ui/SocialIcons'
import { Button } from '@/components/ui/Button'

export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#12161f] text-foreground font-sans selection:bg-primary/30 flex flex-col justify-between">
      {/* ── Top Header ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 h-16 bg-[#181d27]/90 backdrop-blur-md border-b border-border/40 px-4 sm:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Rocket className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">
            Startup<span className="text-sky-400">Toolkit</span>
          </span>
        </Link>

        <Link to="/">
          <Button variant="outline" size="sm" className="text-xs font-semibold border-border/60">
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Back to Home
          </Button>
        </Link>
      </header>

      {/* ── Privacy Policy Content ──────────────────────────────────── */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 space-y-10">
        {/* Title Header */}
        <div className="space-y-3 text-center sm:text-left border-b border-border/40 pb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-400/10 border border-sky-400/30 text-sky-300 text-xs font-semibold">
            <ShieldCheck className="h-3.5 w-3.5 text-sky-400" />
            <span>Privacy & Security Commitments</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: August 30, 2026 • Transparent founder data practices for Startup Toolkit.
          </p>
        </div>

        {/* Policy Content Sections */}
        <div className="space-y-8 text-sm leading-relaxed text-slate-300">
          {/* Section 1 */}
          <section className="p-6 rounded-2xl bg-[#181d27] border border-border/40 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-sky-400" />
              1. Information We Collect
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When you use Startup Toolkit, we collect minimal data required to provide seamless venture creation:
            </p>
            <ul className="list-disc list-inside text-xs text-slate-300 space-y-1.5 pl-2">
              <li><strong className="text-white">Account Information:</strong> Email address provided during sign-up via Supabase Authentication.</li>
              <li><strong className="text-white">Venture & Canvas Data:</strong> Project titles, descriptions, empathy maps, business model canvas notes, and methodology progress.</li>
              <li><strong className="text-white">Usage Preferences:</strong> Selected active venture ID and theme display mode (Dark/Light).</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="p-6 rounded-2xl bg-[#181d27] border border-border/40 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="h-5 w-5 text-indigo-400" />
              2. Data Protection & Row Level Security (RLS)
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We treat your startup intellectual property with utmost security:
            </p>
            <ul className="list-disc list-inside text-xs text-slate-300 space-y-1.5 pl-2">
              <li><strong className="text-white">PostgreSQL RLS Policies:</strong> All Supabase database tables enforce Row Level Security. Only your authenticated user account can access or modify your project records.</li>
              <li><strong className="text-white">Encrypted Connections:</strong> All API communication between your browser and Supabase backend is encrypted over HTTPS using SSL/TLS protocols.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="p-6 rounded-2xl bg-[#181d27] border border-border/40 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Database className="h-5 w-5 text-emerald-400" />
              3. Debounced Autosave & Local Storage
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              To prevent data loss while you type into canvas fields:
            </p>
            <ul className="list-disc list-inside text-xs text-slate-300 space-y-1.5 pl-2">
              <li><strong className="text-white">1000ms Debounced Sync:</strong> Changes auto-save to Supabase 1 second after typing stops.</li>
              <li><strong className="text-white">Local Storage Usage:</strong> Browser local storage stores transient UI states (active tab, theme) without tracking cookies or third-party ad pixels.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="p-6 rounded-2xl bg-[#181d27] border border-border/40 space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-purple-400" />
              4. Your Rights & Data Deletion
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              You own your venture data completely. You have the right to request a full export of your startup projects or request complete account deletion at any time by contacting our engineering team.
            </p>
          </section>

          {/* Section 5: Founder & Engineering Contact */}
          <section className="p-6 rounded-2xl bg-[#1c222e] border border-sky-400/30 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                MA
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Built by Mariyam Ali Khokhar</h3>
                <p className="text-xs text-muted-foreground">Founder & Lead Software Engineer</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              If you have any questions or feedback regarding privacy or data security in Startup Toolkit, feel free to connect directly through my personal platforms:
            </p>

            <div className="flex flex-wrap gap-2.5 pt-1">
              <a
                href="https://mariyamalikhokhar.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-surface border border-border/60 hover:border-sky-400 text-xs font-semibold text-slate-200 hover:text-sky-300 transition-colors"
              >
                <Globe className="h-3.5 w-3.5 text-sky-400" />
                <span>mariyamalikhokhar.com</span>
              </a>

              <a
                href="https://github.com/Mariyamalikho"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-surface border border-border/60 hover:border-sky-400 text-xs font-semibold text-slate-200 hover:text-sky-300 transition-colors"
              >
                <GithubIcon className="h-3.5 w-3.5 text-indigo-400" />
                <span>GitHub Profile</span>
              </a>

              <a
                href="https://www.linkedin.com/in/mariyamali-khokhar/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-surface border border-border/60 hover:border-sky-400 text-xs font-semibold text-slate-200 hover:text-sky-300 transition-colors"
              >
                <LinkedinIcon className="h-3.5 w-3.5 text-sky-400" />
                <span>LinkedIn Profile</span>
              </a>
            </div>
          </section>
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="border-t border-border/40 bg-[#181d27] py-8 px-4 sm:px-8 text-center text-xs text-muted-foreground">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Rocket className="h-4 w-4 text-sky-400" />
            <span className="font-bold text-white">Startup Toolkit</span>
            <span>© {new Date().getFullYear()}</span>
          </div>

          <div className="flex items-center space-x-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/privacy-policy" className="text-sky-400 font-semibold">Privacy Policy</Link>
            <a href="https://mariyamalikhokhar.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Website</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
