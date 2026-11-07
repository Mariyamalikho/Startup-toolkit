/**
 * ProtectedRoute.tsx
 *
 * Route guard component that protects authenticated workspace routes.
 * Allows direct inspection of methodology stages and live demo workspaces
 * (/workspace/*, /empathy-map, /business-model-canvas, /prototype, /pitch-deck)
 * as well as local fallback sessions when Supabase credentials are not configured.
 */

import * as React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { LoadingOverlay } from '@/components/ui/Spinner'

interface ProtectedRouteProps {
  redirectPath?: string
  children?: React.ReactNode
}

const PUBLIC_INSPECTABLE_PREFIXES = [
  '/workspace/',
  '/empathy-map',
  '/business-model-canvas',
  '/prototype',
  '/experiments',
  '/pitch-deck',
]

export function ProtectedRoute({ redirectPath = '/login', children }: ProtectedRouteProps) {
  const { user, loading, isConfigured } = useAuth()
  const location = useLocation()

  if (loading) {
    return <LoadingOverlay message="Authenticating session..." />
  }

  const isInspectableMethodologyRoute = PUBLIC_INSPECTABLE_PREFIXES.some((prefix) =>
    location.pathname.startsWith(prefix),
  )

  if (!user && isConfigured && !isInspectableMethodologyRoute) {
    return <Navigate to={redirectPath} replace />
  }

  return children ? <>{children}</> : <Outlet />
}
