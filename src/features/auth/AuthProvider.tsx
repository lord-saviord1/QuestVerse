import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Profile } from '@/features/profile/types'

type AuthContextValue = {
  user: User | null
  profile: Profile | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string) => Promise<void>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await getSupabase()
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()
  if (error) {
    console.error('Could not load profile', error)
    return null
  }
  return data as Profile | null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sessionState, setSessionState] = useState<{ session: Session | null; ready: boolean }>({
    session: null,
    ready: !isSupabaseConfigured,
  })
  const [profileState, setProfileState] = useState<{
    userId: string | null
    profile: Profile | null
  }>({ userId: null, profile: null })

  const user = sessionState.session?.user ?? null
  const userId = user?.id ?? null

  // Track the signed-in session.
  useEffect(() => {
    if (!isSupabaseConfigured) return
    const supabase = getSupabase()
    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (active) setSessionState({ session: data.session, ready: true })
    })

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionState({ session, ready: true })
    })

    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [])

  // Load the profile whenever the signed-in person changes.
  useEffect(() => {
    if (!userId) return
    let active = true
    fetchProfile(userId).then((profile) => {
      if (active) setProfileState({ userId, profile })
    })
    return () => {
      active = false
    }
  }, [userId])

  const refreshProfile = useCallback(async () => {
    if (!userId) return
    const profile = await fetchProfile(userId)
    setProfileState({ userId, profile })
  }, [userId])

  const signInWithGoogle = useCallback(async () => {
    const { error } = await getSupabase().auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (error) throw error
  }, [])

  const signInWithEmail = useCallback(async (email: string) => {
    const { error } = await getSupabase().auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    })
    if (error) throw error
  }, [])

  const signOut = useCallback(async () => {
    const { error } = await getSupabase().auth.signOut()
    if (error) throw error
  }, [])

  const value = useMemo<AuthContextValue>(() => {
    const profileLoaded = userId === null || profileState.userId === userId
    return {
      user,
      profile: profileState.userId === userId ? profileState.profile : null,
      loading: !sessionState.ready || !profileLoaded,
      signInWithGoogle,
      signInWithEmail,
      signOut,
      refreshProfile,
    }
  }, [
    user,
    userId,
    profileState,
    sessionState.ready,
    signInWithGoogle,
    signInWithEmail,
    signOut,
    refreshProfile,
  ])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
