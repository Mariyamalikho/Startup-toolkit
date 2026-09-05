/**
 * AppRoutes.tsx
 *
 * Central router configuration for Startup Toolkit built with React Router v6+.
 * Defines public routes, protected private workspace routes, and fallback 404 paths.
 */

import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { AppLayout } from '@/components/layout/AppLayout'
import { AuthForm } from '@/components/auth/AuthForm'
import { EmptyError } from '@/components/ui/EmptyState'
import { LandingPage } from '@/pages/LandingPage'
import { PrivacyPolicyPage } from '@/pages/PrivacyPolicyPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { WorkspacePage } from '@/pages/WorkspacePage'
import { PitchDeckPage } from '@/pages/PitchDeckPage'

// Placeholder Page views (will be expanded in Phase 2 Days 33-40)
function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-xl">
        <AuthForm initialMode="login" />
      </div>
    </div>
  )
}

function SignupPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-xl">
        <AuthForm initialMode="signup" />
      </div>
    </div>
  )
}

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <EmptyError
        message="404 — The workspace route or page you requested does not exist."
        onRetry={() => {
          window.location.href = '/'
        }}
      />
    </div>
  )
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Protected Private Workspace Routes wrapped in AppLayout */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/workspace/:projectId" element={<WorkspacePage />} />
        <Route path="/pitch-deck" element={<PitchDeckPage />} />
        <Route path="/settings" element={<div className="font-bold text-foreground">Settings View (Phase 2)</div>} />
      </Route>

      {/* Catch-all 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
