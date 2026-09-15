/**
 * AppRoutes.tsx
 *
 * Central router configuration for Startup Toolkit built with React Router v6+.
 * Defines public routes, protected private workspace routes, and fallback 404 paths.
 */

import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { AppLayout } from '@/components/layout/AppLayout'
import { AuthForm } from '@/components/auth/AuthForm'
import { EmptyError } from '@/components/ui/EmptyState'
import { SkeletonDashboard } from '@/components/ui/Skeleton'
import { Spinner } from '@/components/ui/Spinner'

// Code-split page components with React.lazy
const LandingPage = lazy(() =>
  import('@/pages/LandingPage').then((m) => ({ default: m.LandingPage })),
)
const PrivacyPolicyPage = lazy(() =>
  import('@/pages/PrivacyPolicyPage').then((m) => ({ default: m.PrivacyPolicyPage })),
)
const DashboardPage = lazy(() =>
  import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
const WorkspacePage = lazy(() =>
  import('@/pages/WorkspacePage').then((m) => ({ default: m.WorkspacePage })),
)
const PitchDeckPage = lazy(() =>
  import('@/pages/PitchDeckPage').then((m) => ({ default: m.PitchDeckPage })),
)
const SettingsPage = lazy(() =>
  import('@/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })),
)

// Placeholder Page views
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

function RouteLoadingFallback() {
  return (
    <div className="p-6">
      <SkeletonDashboard count={3} />
    </div>
  )
}

function GlobalPageFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Spinner size="lg" className="text-sky-400" />
    </div>
  )
}

export function AppRoutes() {
  return (
    <Suspense fallback={<GlobalPageFallback />}>
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
          <Route
            path="/dashboard"
            element={
              <Suspense fallback={<RouteLoadingFallback />}>
                <DashboardPage />
              </Suspense>
            }
          />
          <Route
            path="/workspace/:projectId"
            element={
              <Suspense fallback={<RouteLoadingFallback />}>
                <WorkspacePage />
              </Suspense>
            }
          />
          <Route
            path="/pitch-deck"
            element={
              <Suspense fallback={<RouteLoadingFallback />}>
                <PitchDeckPage />
              </Suspense>
            }
          />
          <Route
            path="/settings"
            element={
              <Suspense fallback={<RouteLoadingFallback />}>
                <SettingsPage />
              </Suspense>
            }
          />
        </Route>

        {/* Catch-all 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
