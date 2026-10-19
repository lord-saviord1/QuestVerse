import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/** True when both Supabase settings are present. The app still runs without them (accounts are off). */
export const isSupabaseConfigured = Boolean(url && anonKey)

let client: SupabaseClient | undefined

/**
 * Returns the shared Supabase client, creating it on first use.
 * Throws a clear error if the environment variables are missing.
 */
export function getSupabase(): SupabaseClient {
  if (client) return client

  if (!url || !anonKey) {
    throw new Error(
      'Missing Supabase settings. Copy .env.example to .env and set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
    )
  }

  client = createClient(url, anonKey)
  return client
}
