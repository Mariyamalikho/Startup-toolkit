/**
 * supabase.ts
 *
 * Supabase client initialization.
 * Reads environment variables VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
 * Provides fallback validation and connection check helpers.
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key'

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
    import.meta.env.VITE_SUPABASE_URL !== 'https://your-project-id.supabase.co',
)

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

/**
 * Utility helper to test Supabase connection status.
 */
export async function checkSupabaseConnection(): Promise<{
  connected: boolean
  message: string
}> {
  if (!isSupabaseConfigured) {
    return {
      connected: false,
      message: 'Supabase credentials not configured in .env.local',
    }
  }

  try {
    const { error } = await supabase.from('projects').select('id').limit(1)
    if (error && error.code !== 'PGRST116') {
      return { connected: true, message: `Connected (Table notice: ${error.message})` }
    }
    return { connected: true, message: 'Successfully connected to Supabase backend!' }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown connection error'
    return { connected: false, message: `Connection failed: ${msg}` }
  }
}
