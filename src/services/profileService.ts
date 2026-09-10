/**
 * profileService.ts
 *
 * Supabase API service wrapper for user profile management.
 * Provides functions to fetch/update user profiles, upload avatars, and manage credentials.
 */

import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Profile } from '@/types/database.types'

let mockProfile: Profile = {
  id: 'demo-user-id',
  email: 'founder@startuptoolkit.io',
  full_name: 'Mariyam Malik',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  theme_preference: 'dark',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export const profileService = {
  /**
   * Fetch current user profile record.
   */
  async getProfile(userId: string): Promise<Profile> {
    if (!isSupabaseConfigured) {
      return new Promise((resolve) => setTimeout(() => resolve({ ...mockProfile, id: userId }), 300))
    }

    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()

    if (error) {
      if (error.code === 'PGRST116') {
        // Record does not exist, return default fallback
        return {
          id: userId,
          email: 'founder@startuptoolkit.io',
          full_name: 'Founder User',
          theme_preference: 'dark',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      }
      console.error('[profileService.getProfile] Error:', error)
      throw new Error(error.message)
    }

    return data as Profile
  },

  /**
   * Update profile fields (full_name, avatar_url, theme_preference).
   */
  async updateProfile(userId: string, patch: Partial<Profile>): Promise<Profile> {
    if (!isSupabaseConfigured) {
      mockProfile = { ...mockProfile, ...patch, updated_at: new Date().toISOString() }
      return new Promise((resolve) => setTimeout(() => resolve({ ...mockProfile }), 300))
    }

    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        ...patch,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('[profileService.updateProfile] Error:', error)
      throw new Error(error.message)
    }

    return data as Profile
  },

  /**
   * Update user password via Supabase Auth.
   */
  async updatePassword(password: string): Promise<void> {
    if (!isSupabaseConfigured) {
      return new Promise((resolve) => setTimeout(() => resolve(), 300))
    }

    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      console.error('[profileService.updatePassword] Error:', error)
      throw new Error(error.message)
    }
  },
}
