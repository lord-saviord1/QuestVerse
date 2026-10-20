import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthProvider'
import { isSupabaseConfigured } from '@/lib/supabase'

export function ProfilePage() {
  const { user, profile, signOut } = useAuth()

  if (!isSupabaseConfigured) {
    return (
      <>
        <h1>Profile</h1>
        <p className="empty">Accounts are off while we test, so there is no profile yet.</p>
      </>
    )
  }

  if (!user) {
    return (
      <>
        <h1>Profile</h1>
        <p className="empty">Sign in to see your profile.</p>
        <Link to="/sign-in" className="btn">
          Sign in
        </Link>
      </>
    )
  }

  return (
    <>
      <h1>{profile?.display_name ?? 'Your profile'}</h1>
      <dl className="facts">
        <div>
          <dt>Faculty</dt>
          <dd>{profile?.faculty ?? 'Not set'}</dd>
        </div>
        <div>
          <dt>Department</dt>
          <dd>{profile?.department ?? 'Not set'}</dd>
        </div>
        <div>
          <dt>Level</dt>
          <dd>{profile?.level ?? 'Not set'}</dd>
        </div>
      </dl>
      <Link to="/onboarding" className="btn btn--ghost">
        Edit details
      </Link>{' '}
      <button type="button" className="btn btn--ghost" onClick={() => void signOut()}>
        Sign out
      </button>
    </>
  )
}
