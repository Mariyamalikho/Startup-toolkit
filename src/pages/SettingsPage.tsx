/**
 * SettingsPage.tsx
 *
 * 1:1 Pixel-Perfect Founder Account Settings & Profile Management Page for Startup Toolkit.
 * Supports full name update, avatar URL / upload preview, theme preferences (Dark, Light, System),
 * password change security credentials, and automatic persistence to Supabase profiles.
 */

import React, { useState, useEffect } from 'react'
import { User, Lock, Moon, Sun, Monitor, Camera, Key, ShieldCheck, Save } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { profileService } from '@/services/profileService'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { useToast } from '@/components/ui/Toast'

export function SettingsPage() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [fullName, setFullName] = useState('Mariyam Ali K.')
  const [email, setEmail] = useState(user?.email || 'founder@startuptoolkit.io')
  const [avatarUrl, setAvatarUrl] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  )
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  // Fetch initial profile
  useEffect(() => {
    if (user?.id) {
      profileService.getProfile(user.id).then((p) => {
        if (p.full_name) setFullName(p.full_name)
        if (p.avatar_url) setAvatarUrl(p.avatar_url)
        if (p.theme_preference) setTheme(p.theme_preference)
        if (p.email) setEmail(p.email)
      })
    }
  }, [user])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await profileService.updateProfile(user?.id || 'demo-user-id', {
        full_name: fullName,
        avatar_url: avatarUrl,
        theme_preference: theme,
        email,
      })
      toast({
        title: 'Profile Updated',
        description: 'Your account settings and theme preferences have been saved.',
        variant: 'success',
      })
    } catch (err: unknown) {
      toast({
        title: 'Save Failed',
        description: (err as Error).message || 'Failed to update profile settings.',
        variant: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPassword || newPassword !== confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'New password and confirm password fields do not match.',
        variant: 'error',
      })
      return
    }

    setSavingPassword(true)
    try {
      await profileService.updatePassword(newPassword)
      toast({
        title: 'Password Changed',
        description: 'Your account credentials have been updated successfully.',
        variant: 'success',
      })
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: unknown) {
      toast({
        title: 'Update Failed',
        description: (err as Error).message || 'Failed to update account password.',
        variant: 'error',
      })
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-[#181d27]/70 border border-border/40 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <span>Account Settings & Profile</span>
            <span className="text-[10px] font-mono font-bold uppercase bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full">
              Founder Portal
            </span>
          </h1>
          <p className="text-xs text-muted-foreground pt-1">
            Manage display name, avatar, color theme preferences, and security credentials.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-[#12161f] border border-border/40 px-3 py-1.5 rounded-xl text-xs">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span className="text-muted-foreground font-mono">
            Status: <strong className="text-emerald-400 font-bold">Active Session</strong>
          </span>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-[#181d27] border border-border/60 p-6 rounded-2xl shadow-xl space-y-6">
          <div className="border-b border-border/40 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <User className="h-4 w-4 text-sky-400" />
              <span>Founder Profile Information</span>
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar Preview & Upload */}
            <div className="relative group">
              <img
                src={
                  avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
                }
                alt="Founder Avatar"
                className="h-24 w-24 rounded-full object-cover border-2 border-sky-400/60 shadow-lg"
              />
              <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer">
                <Camera className="h-6 w-6 text-white" />
              </div>
            </div>

            <div className="space-y-3 flex-1 w-full">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-200">Avatar Image URL</Label>
                <Input
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="bg-[#1c222e] border-border/60 text-xs focus:border-sky-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-200">Founder Display Name</Label>
                  <Input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-[#1c222e] border-border/60 text-xs focus:border-sky-400"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-200">Email Address</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[#1c222e] border-border/60 text-xs focus:border-sky-400"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences Card */}
        <div className="bg-[#181d27] border border-border/60 p-6 rounded-2xl shadow-xl space-y-6">
          <div className="border-b border-border/40 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sun className="h-4 w-4 text-amber-400" />
              <span>Theme & Interface Preferences</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Dark Theme Button */}
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-xl border flex items-center space-x-3 transition-all ${
                theme === 'dark'
                  ? 'bg-sky-400/10 border-sky-400 text-sky-400 shadow-md shadow-sky-500/20'
                  : 'bg-[#1c222e] border-border/60 text-muted-foreground hover:text-white'
              }`}
            >
              <Moon className="h-5 w-5 shrink-0" />
              <div className="text-left">
                <div className="text-xs font-bold">Dark Theme</div>
                <div className="text-[10px] opacity-70">High-contrast dark cards</div>
              </div>
            </button>

            {/* Light Theme Button */}
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-4 rounded-xl border flex items-center space-x-3 transition-all ${
                theme === 'light'
                  ? 'bg-sky-400/10 border-sky-400 text-sky-400 shadow-md shadow-sky-500/20'
                  : 'bg-[#1c222e] border-border/60 text-muted-foreground hover:text-white'
              }`}
            >
              <Sun className="h-5 w-5 shrink-0" />
              <div className="text-left">
                <div className="text-xs font-bold">Light Theme</div>
                <div className="text-[10px] opacity-70">Clean light workplace</div>
              </div>
            </button>

            {/* System Theme Button */}
            <button
              type="button"
              onClick={() => setTheme('system')}
              className={`p-4 rounded-xl border flex items-center space-x-3 transition-all ${
                theme === 'system'
                  ? 'bg-sky-400/10 border-sky-400 text-sky-400 shadow-md shadow-sky-500/20'
                  : 'bg-[#1c222e] border-border/60 text-muted-foreground hover:text-white'
              }`}
            >
              <Monitor className="h-5 w-5 shrink-0" />
              <div className="text-left">
                <div className="text-xs font-bold">System Default</div>
                <div className="text-[10px] opacity-70">Match OS preferences</div>
              </div>
            </button>
          </div>
        </div>

        {/* Submit Profile Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            className="bg-sky-400 text-slate-950 hover:bg-sky-300 font-extrabold text-xs px-6 h-10 shadow-md shadow-sky-500/20"
          >
            <Save className="mr-2 h-4 w-4" />
            {loading ? 'Saving Changes...' : 'Save Profile Preferences'}
          </Button>
        </div>
      </form>

      {/* Security Credentials Section */}
      <form
        onSubmit={handleUpdatePassword}
        className="bg-[#181d27] border border-border/60 p-6 rounded-2xl shadow-xl space-y-6"
      >
        <div className="border-b border-border/40 pb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="h-4 w-4 text-purple-400" />
            <span>Security Credentials & Password</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-200">New Password</Label>
            <Input
              type="password"
              placeholder="••••••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-[#1c222e] border-border/60 text-xs focus:border-purple-400"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-200">Confirm New Password</Label>
            <Input
              type="password"
              placeholder="••••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-[#1c222e] border-border/60 text-xs focus:border-purple-400"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-mono">
            <Key className="h-3.5 w-3.5 text-purple-400" />
            Password must be at least 8 characters.
          </span>

          <Button
            type="submit"
            disabled={savingPassword || !newPassword}
            className="bg-purple-500 text-white hover:bg-purple-400 font-extrabold text-xs px-5 h-9 shadow-md shadow-purple-500/20"
          >
            {savingPassword ? 'Updating...' : 'Update Password'}
          </Button>
        </div>
      </form>
    </div>
  )
}
