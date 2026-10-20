import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthProvider'
import { isSupabaseConfigured } from '@/lib/supabase'

export function RequireAuth() {
  const { loading, user, profile } = useAuth()
  const location = useLocation()

  // Accounts are not set up yet (no Supabase keys), so there is nothing to protect.
  if (!isSupabaseConfigured) return <Outlet />

  if (loading) return <p>Loading…</p>
  if (!user) return <Navigate to="/sign-in" replace state={{ from: location.pathname }} />
  if (!profile?.onboarding_complete && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }
  return <Outlet />
}
