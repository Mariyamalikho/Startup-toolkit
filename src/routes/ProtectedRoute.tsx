/**
 * ProtectedRoute.tsx
 *
 * Route guard component that protects authenticated workspace routes.
 * Allows direct inspection of live demo workspaces (/workspace/demo-*) and
 * local fallback sessions when Supabase environment variables are not configured.
 */

import * as React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { LoadingOverlay } from '@/components/ui/Spinner'

interface ProtectedRouteProps {
  redirectPath?: string
  children?: React.ReactNode
}

export function ProtectedRoute({ redirectPath = '/login', children }: ProtectedRouteProps) {
  const { user, loading, isConfigured } = useAuth()
  const location = useLocation()

  if (loading) {
    return <LoadingOverlay message="Authenticating session..." />
  }

  const isLiveDemoWorkspace = location.pathname.startsWith('/workspace/demo-')

  if (!user && isConfigured && !isLiveDemoWorkspace) {
    return <Navigate to={redirectPath} replace />
  }

  return children ? <>{children}</> : <Outlet />
}
