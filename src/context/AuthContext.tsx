/**
 * AuthContext.tsx
 *
 * React Context provider and custom useAuth hook.
 * Manages active user session state, auto-refreshes tokens via
 * Supabase auth state listener, and provides local fallback session persistence
 * when Supabase credentials are not configured or when using demo mode.
 */

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

const DEMO_USER_STORAGE_KEY = 'startup-toolkit-demo-user'

function createFallbackUser(email: string): User {
  const now = new Date().toISOString()
  return {
    id: 'demo-user',
    app_metadata: { provider: 'email' },
    user_metadata: { full_name: email.split('@')[0] || 'Founder' },
    aud: 'authenticated',
    created_at: now,
    email,
  } as User
}

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  isConfigured: boolean
  signInDemo: (email?: string) => void
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedEmail = localStorage.getItem(DEMO_USER_STORAGE_KEY)
      if (savedEmail) {
        return createFallbackUser(savedEmail)
      }
    } catch {
      // Ignore storage access errors
    }
    return null
  })
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState<boolean>(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return
    }

    // Fetch initial session
    supabase.auth
      .getSession()
      .then(({ data: { session: activeSession } }) => {
        if (activeSession?.user) {
          setSession(activeSession)
          setUser(activeSession.user)
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })

    // Listen for auth state changes (sign in, sign out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, activeSession) => {
      if (activeSession?.user) {
        setSession(activeSession)
        setUser(activeSession.user)
      } else {
        const savedEmail = localStorage.getItem(DEMO_USER_STORAGE_KEY)
        setSession(null)
        setUser(savedEmail ? createFallbackUser(savedEmail) : null)
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signInDemo = (email = 'founder@startuptoolkit.app') => {
    const cleanEmail = email.trim() || 'founder@startuptoolkit.app'
    try {
      localStorage.setItem(DEMO_USER_STORAGE_KEY, cleanEmail)
    } catch {
      // Ignore storage errors
    }
    setUser(createFallbackUser(cleanEmail))
  }

  const signOut = async () => {
    try {
      localStorage.removeItem(DEMO_USER_STORAGE_KEY)
    } catch {
      // Ignore storage errors
    }
    setUser(null)
    setSession(null)
    if (isSupabaseConfigured) {
      await supabase.auth.signOut()
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isConfigured: isSupabaseConfigured,
        signInDemo,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
