/**
 * AppRoutes.tsx
 *
 * Central router configuration for Startup Toolkit built with React Router v6+.
 * Defines public routes, methodology stage routes, workspace routes, and fallback 404 paths.
 */

import { lazy, Suspense } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { AppLayout } from '@/components/layout/AppLayout'
import { AuthForm } from '@/components/auth/AuthForm'
import { EmptyError } from '@/components/ui/EmptyState'
import { SkeletonDashboard, SkeletonWorkspace, TopLoadingBar } from '@/components/ui/Skeleton'
import { usePageMetadata } from '@/hooks/usePageMetadata'

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

function LoginPage() {
  const navigate = useNavigate()
  usePageMetadata({
    title: 'Sign In to Founder Workspace',
    description: 'Sign in to access your lean venture workspace, canvases, and pitch decks.',
    canonicalPath: '/login',
  })

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-8 shadow-xl">
        <AuthForm initialMode="login" onSuccess={() => navigate('/dashboard')} />
      </div>
    </div>
  )
}

function SignupPage() {
  const navigate = useNavigate()
  usePageMetadata({
    title: 'Create Founder Account',
    description:
      'Create a free founder account on Startup Toolkit to validate and scale your venture ideas.',
    canonicalPath: '/signup',
  })

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-8 shadow-xl">
        <AuthForm initialMode="signup" onSuccess={() => navigate('/dashboard')} />
      </div>
    </div>
  )
}

function NotFoundPage() {
  usePageMetadata({
    title: 'Page Not Found (404)',
    description: 'The requested workspace route or page does not exist on Startup Toolkit.',
  })

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <EmptyError
        message="404: The workspace route or page you requested does not exist."
        onRetry={() => {
          window.location.href = '/'
        }}
      />
    </div>
  )
}

function DashboardLoadingFallback() {
  return (
    <div className="p-6">
      <SkeletonDashboard count={3} />
    </div>
  )
}

function WorkspaceLoadingFallback() {
  return (
    <div className="p-6">
      <SkeletonWorkspace />
    </div>
  )
}

function GlobalPageFallback() {
  return (
    <div className="min-h-screen bg-background">
      <TopLoadingBar />
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

        {/* Protected & Methodology Workspace Routes wrapped in AppLayout */}
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
              <Suspense fallback={<DashboardLoadingFallback />}>
                <DashboardPage />
              </Suspense>
            }
          />
          <Route
            path="/workspace/:projectId"
            element={
              <Suspense fallback={<WorkspaceLoadingFallback />}>
                <WorkspacePage />
              </Suspense>
            }
          />
          <Route
            path="/empathy-map"
            element={
              <Suspense fallback={<WorkspaceLoadingFallback />}>
                <WorkspacePage />
              </Suspense>
            }
          />
          <Route
            path="/business-model-canvas"
            element={
              <Suspense fallback={<WorkspaceLoadingFallback />}>
                <WorkspacePage />
              </Suspense>
            }
          />
          <Route
            path="/prototype"
            element={
              <Suspense fallback={<WorkspaceLoadingFallback />}>
                <WorkspacePage />
              </Suspense>
            }
          />
          <Route
            path="/experiments"
            element={
              <Suspense fallback={<WorkspaceLoadingFallback />}>
                <WorkspacePage />
              </Suspense>
            }
          />
          <Route
            path="/pitch-deck"
            element={
              <Suspense fallback={<WorkspaceLoadingFallback />}>
                <PitchDeckPage />
              </Suspense>
            }
          />
          <Route
            path="/settings"
            element={
              <Suspense fallback={<WorkspaceLoadingFallback />}>
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
