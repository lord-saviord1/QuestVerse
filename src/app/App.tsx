import { Link, Route, Routes } from 'react-router-dom'
import { HomePage } from '@/app/HomePage'
import { useAuth } from '@/features/auth/AuthProvider'
import { isSupabaseConfigured } from '@/lib/supabase'
import { RequireAuth } from '@/features/auth/RequireAuth'
import { SignInPage } from '@/features/auth/SignInPage'
import { OnboardingPage } from '@/features/profile/OnboardingPage'
import { QuestsPage } from '@/features/quests/QuestsPage'
import { CameraPage } from '@/features/camera/CameraPage'
import { VaultPage } from '@/features/vault/VaultPage'
import { MapPage } from '@/features/map/MapPage'
import { ProfilePage } from '@/features/profile/ProfilePage'

export function App() {
  const { user, signOut } = useAuth()

  return (
    <>
      {!isSupabaseConfigured && (
        <p role="status">Accounts are not set up yet. Pages are open for testing.</p>
      )}
      <nav aria-label="Main">
        <Link to="/">Home</Link> <Link to="/quests">Quests</Link> <Link to="/camera">Camera</Link>{' '}
        <Link to="/vault">Vault</Link> <Link to="/map">Map</Link> <Link to="/profile">Profile</Link>{' '}
        {user ? (
          <button type="button" onClick={() => void signOut()}>
            Sign out
          </button>
        ) : (
          <Link to="/sign-in">Sign in</Link>
        )}
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route
            path="/onboarding"
            element={
              <RequireAuth>
                <OnboardingPage />
              </RequireAuth>
            }
          />
          <Route
            path="/quests"
            element={
              <RequireAuth>
                <QuestsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/camera"
            element={
              <RequireAuth>
                <CameraPage />
              </RequireAuth>
            }
          />
          <Route
            path="/vault"
            element={
              <RequireAuth>
                <VaultPage />
              </RequireAuth>
            }
          />
          <Route
            path="/map"
            element={
              <RequireAuth>
                <MapPage />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
          />
        </Routes>
      </main>
    </>
  )
}
