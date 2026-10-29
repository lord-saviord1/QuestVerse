import { Route, Routes } from 'react-router-dom'
import { AppShell } from '@/app/AppShell'
import { HomePage } from '@/app/HomePage'
import { RequireAuth } from '@/features/auth/RequireAuth'
import { SignInPage } from '@/features/auth/SignInPage'
import { OnboardingPage } from '@/features/profile/OnboardingPage'
import { ProfilePage } from '@/features/profile/ProfilePage'
import { QuestsPage } from '@/features/quests/QuestsPage'
import { QuestDetailPage } from '@/features/quests/QuestDetailPage'
import { CameraPage } from '@/features/camera/CameraPage'
import { VaultPage } from '@/features/vault/VaultPage'
import { MapPage } from '@/features/map/MapPage'
import { PinPlacesPage } from '@/features/places/PinPlacesPage'

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route element={<RequireAuth />}>
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/quests" element={<QuestsPage />} />
          <Route path="/quests/:id" element={<QuestDetailPage />} />
          <Route path="/camera" element={<CameraPage />} />
          <Route path="/vault" element={<VaultPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/pin-places" element={<PinPlacesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>
    </Routes>
  )
}
