/**
 * AuthForm.tsx
 *
 * Auth form component supporting Login and Signup modes.
 * Connects to Supabase Auth API with form validation, password visibility toggle,
 * loading states, notification feedback, and instant demo workspace access.
 */

import React, { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, UserPlus, LogIn, AlertCircle, Rocket } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Button } from '@/components/ui/Button'
import { LoadingButton } from '@/components/ui/Spinner'
import { useToast } from '@/components/ui/Toast'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

export type AuthMode = 'login' | 'signup'

interface AuthFormProps {
  initialMode?: AuthMode
  onSuccess?: () => void
  className?: string
}

export function AuthForm({ initialMode = 'login', onSuccess, className }: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { toast } = useToast()
  const { signInDemo } = useAuth()

  const handleDemoAccess = () => {
    const demoEmail = email && email.includes('@') ? email : 'founder@startuptoolkit.app'
    signInDemo(demoEmail)
    toast({
      variant: 'success',
      title: 'Workspace Ready',
      description: `Signed in as ${demoEmail}.`,
    })
    onSuccess?.()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    // Basic Validation
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.')
      return
    }

    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.')
      return
    }

    setIsLoading(true)

    // Handle Local Persistence Mode when Supabase env vars are not configured
    if (!isSupabaseConfigured) {
      setTimeout(() => {
        signInDemo(email)
        setIsLoading(false)
        toast({
          variant: 'success',
          title: mode === 'login' ? 'Signed In' : 'Account Initialized',
          description: 'Session active with local workspace storage.',
        })
        onSuccess?.()
      }, 400)
      return
    }

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error

        toast({
          variant: 'success',
          title: 'Welcome back!',
          description: 'Successfully signed in to your account.',
        })
        onSuccess?.()
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error

        // If Supabase email confirmation is enabled and session is not immediately returned,
        // also initialize local session so the founder can enter the workspace right away.
        if (!data.session) {
          signInDemo(email)
        }

        toast({
          variant: 'success',
          title: 'Account created!',
          description: data.session
            ? 'Your workspace is ready.'
            : 'Account registered. Entering your workspace now.',
        })
        onSuccess?.()
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An authentication error occurred'
      // If Supabase endpoint is unreachable or unconfigured, allow seamless fallback
      if (msg.toLowerCase().includes('fetch') || msg.toLowerCase().includes('placeholder')) {
        signInDemo(email)
        toast({
          variant: 'info',
          title: 'Offline Workspace Mode',
          description: 'Signed in using local browser persistence.',
        })
        onSuccess?.()
        return
      }
      setErrorMessage(msg)
      toast({
        variant: 'error',
        title: mode === 'login' ? 'Login Failed' : 'Registration Failed',
        description: msg,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={className}>
      {/* Mode Switcher Tabs */}
      <div className="flex rounded-lg bg-muted p-1 mb-6">
        <button
          type="button"
          onClick={() => {
            setMode('login')
            setErrorMessage(null)
          }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
            mode === 'login'
              ? 'bg-surface text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('signup')
            setErrorMessage(null)
          }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
            mode === 'signup'
              ? 'bg-surface text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Create Account
        </button>
      </div>

      {/* Error Alert Box */}
      {errorMessage && (
        <div className="flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-500/10 p-3 mb-4 text-xs text-red-500">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1.5">
          <Label htmlFor="auth-email">Email address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="auth-email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-9"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="auth-password">Password</Label>
            {mode === 'login' && (
              <button
                type="button"
                onClick={() =>
                  toast({
                    variant: 'info',
                    title: 'Password Reset',
                    description: 'Enter your email above or use instant demo access below.',
                  })
                }
                className="text-[11px] text-muted-foreground hover:text-foreground underline"
              >
                Forgot?
              </button>
            )}
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="auth-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-9 pr-9"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <LoadingButton
          type="submit"
          isLoading={isLoading}
          loadingText={mode === 'login' ? 'Signing in...' : 'Creating account...'}
          className="w-full mt-2 bg-sky-400 text-slate-950 hover:bg-sky-300 font-bold"
        >
          {mode === 'login' ? (
            <>
              <LogIn className="mr-1.5 h-4 w-4" />
              Sign In
            </>
          ) : (
            <>
              <UserPlus className="mr-1.5 h-4 w-4" />
              Create Account
            </>
          )}
        </LoadingButton>

        {/* Instant Demo Access Divider */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/60" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase font-mono">
            <span className="bg-surface px-2 text-muted-foreground">or</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleDemoAccess}
          className="w-full text-xs font-semibold border-border/80 hover:border-sky-400/60 hover:text-sky-300"
        >
          <Rocket className="mr-1.5 h-3.5 w-3.5 text-sky-400" />
          Continue with Demo Workspace
        </Button>
      </form>
    </div>
  )
}
