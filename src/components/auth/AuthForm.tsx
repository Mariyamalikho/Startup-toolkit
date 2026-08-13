/**
 * AuthForm.tsx
 *
 * Auth form component supporting Login and Signup modes.
 * Connects to Supabase Auth API with form validation, password visibility toggle,
 * loading states, and notification feedback.
 */

import React, { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, UserPlus, LogIn, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { LoadingButton } from '@/components/ui/Spinner'
import { useToast } from '@/components/ui/Toast'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

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

    // Handle Unconfigured Demo Mode
    if (!isSupabaseConfigured) {
      setTimeout(() => {
        setIsLoading(false)
        toast({
          variant: 'info',
          title: mode === 'login' ? 'Demo Login Successful' : 'Demo Account Created',
          description: 'Supabase credentials not set in .env.local — running in demo mode.',
        })
        onSuccess?.()
      }, 1000)
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
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error

        toast({
          variant: 'success',
          title: 'Account created!',
          description: 'Please check your email to confirm your subscription.',
        })
        onSuccess?.()
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An authentication error occurred'
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
                    description: 'Password reset links will be enabled in Auth Context phase.',
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
          loadingText={mode === 'login' ? 'Signing in…' : 'Creating account…'}
          className="w-full mt-2"
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
      </form>
    </div>
  )
}
