/**
 * ProtectedRoute.tsx
 *
 * Route guard component that protects authenticated workspace routes.
 * Checks `useAuth()` state; if user is unauthenticated, redirects to `/login`.
 * While authentication state is initializing, displays a loading spinner overlay.
 */

import * as React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { LoadingOverlay } from '@/components/ui/Spinner'

interface ProtectedRouteProps {
  redirectPath?: string
  children?: React.ReactNode
}

export function ProtectedRoute({
  redirectPath = '/login',
  children,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingOverlay message="Authenticating session…" />
  }

  if (!user) {
    return <Navigate to={redirectPath} replace />
  }

  return children ? <>{children}</> : <Outlet />
}
