/**
 * profileService.ts
 *
 * Supabase API service wrapper for user profile management.
 * Provides functions to fetch/update user profiles, validate avatar URLs,
 * cache profile queries with TTL, and manage credentials.
 */

import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Profile } from '@/types/database.types'
import { sanitizeText, sanitizeHttpsUrl } from '@/lib/sanitize'

const PROFILE_CACHE_TTL_MS = 60_000
const profileCache = new Map<string, { data: Profile; expiresAt: number }>()

let mockProfile: Profile = {
  id: 'demo-user-id',
  email: 'founder@startuptoolkit.io',
  full_name: 'Mariyam Ali K.',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  theme_preference: 'dark',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export const profileService = {
  /**
   * Fetch current user profile record with TTL cache.
   */
  async getProfile(userId: string): Promise<Profile> {
    const cleanId = sanitizeText(userId, 64) || 'demo-user-id'
    const now = Date.now()
    const cached = profileCache.get(cleanId)
    if (cached && cached.expiresAt > now) {
      return cached.data
    }

    if (!isSupabaseConfigured) {
      const profile = { ...mockProfile, id: cleanId }
      profileCache.set(cleanId, { data: profile, expiresAt: now + PROFILE_CACHE_TTL_MS })
      return profile
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, avatar_url, theme_preference, created_at, updated_at')
      .eq('id', cleanId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        const fallback: Profile = {
          id: cleanId,
          email: 'founder@startuptoolkit.io',
          full_name: 'Mariyam Ali K.',
          theme_preference: 'dark',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        profileCache.set(cleanId, { data: fallback, expiresAt: now + PROFILE_CACHE_TTL_MS })
        return fallback
      }
      console.error('[profileService.getProfile] Error:', error)
      throw new Error(error.message)
    }

    const profile = data as Profile
    profileCache.set(cleanId, { data: profile, expiresAt: now + PROFILE_CACHE_TTL_MS })
    return profile
  },

  /**
   * Update profile fields with input sanitization and URL validation.
   */
  async updateProfile(userId: string, patch: Partial<Profile>): Promise<Profile> {
    const cleanId = sanitizeText(userId, 64) || 'demo-user-id'
    const sanitizedPatch: Partial<Profile> = {
      ...(patch.full_name !== undefined && { full_name: sanitizeText(patch.full_name, 120) }),
      ...(patch.email !== undefined && { email: sanitizeText(patch.email, 255) }),
      ...(patch.avatar_url !== undefined && {
        avatar_url: sanitizeHttpsUrl(patch.avatar_url, 500),
      }),
      ...(patch.theme_preference !== undefined &&
        ['light', 'dark', 'system'].includes(patch.theme_preference) && {
          theme_preference: patch.theme_preference,
        }),
    }

    if (!isSupabaseConfigured) {
      mockProfile = { ...mockProfile, ...sanitizedPatch, updated_at: new Date().toISOString() }
      profileCache.set(cleanId, {
        data: { ...mockProfile, id: cleanId },
        expiresAt: Date.now() + PROFILE_CACHE_TTL_MS,
      })
      return { ...mockProfile, id: cleanId }
    }

    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: cleanId,
        ...sanitizedPatch,
        updated_at: new Date().toISOString(),
      })
      .select('id, email, full_name, avatar_url, theme_preference, created_at, updated_at')
      .single()

    if (error) {
      console.error('[profileService.updateProfile] Error:', error)
      throw new Error(error.message)
    }

    const updated = data as Profile
    profileCache.set(cleanId, { data: updated, expiresAt: Date.now() + PROFILE_CACHE_TTL_MS })
    return updated
  },

  /**
   * Update user password via Supabase Auth with minimum complexity validation.
   */
  async updatePassword(password: string): Promise<void> {
    if (!password || password.length < 8) {
      throw new Error('Password must be at least 8 characters long.')
    }

    if (!isSupabaseConfigured) {
      return
    }

    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      console.error('[profileService.updatePassword] Error:', error)
      throw new Error(error.message)
    }
  },
}
