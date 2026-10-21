import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthProvider'
import { isSupabaseConfigured } from '@/lib/supabase'
import cloudsUrl from '@/assets/clouds.webp'
import mistUrl from '@/assets/mist.webp'

// Normal and mirrored copies alternate, so the joins are seamless and the sky covers very wide screens.
const SKY_COPIES = [false, true, false, true, false]

const TABS = [
  { to: '/quests', label: 'Quests' },
  { to: '/camera', label: 'Camera' },
  { to: '/vault', label: 'Vault' },
  { to: '/map', label: 'Map' },
]

export function AppShell() {
  const { user } = useAuth()
  const topLink =
    !user && isSupabaseConfigured
      ? { to: '/sign-in', label: 'Sign in' }
      : { to: '/profile', label: 'Profile' }

  return (
    <div className="shell">
      <div className="sky" aria-hidden="true">
        <div className="sky__track">
          {SKY_COPIES.map((flip, i) => (
            <img
              key={i}
              className={flip ? 'sky__img sky__img--flip' : 'sky__img'}
              src={cloudsUrl}
              alt=""
              width={1600}
              height={640}
              decoding="async"
            />
          ))}
        </div>
        <div className="sky__track sky__track--mist">
          {SKY_COPIES.map((flip, i) => (
            <img
              key={i}
              className={flip ? 'sky__img sky__img--flip' : 'sky__img'}
              src={mistUrl}
              alt=""
              width={1600}
              height={480}
              decoding="async"
            />
          ))}
        </div>
      </div>

      <header className="topbar">
        <Link to="/" className="brand">
          Quest Verse
        </Link>
        <Link to={topLink.to} className="topbar__link">
          {topLink.label}
        </Link>
      </header>

      {!isSupabaseConfigured && (
        <p className="notice" role="status">
          Accounts are off while we test. Everything here is open.
        </p>
      )}

      <main className="page">
        <Outlet />
      </main>

      <nav className="tabbar" aria-label="Main">
        {TABS.map((tab) => (
          <NavLink key={tab.to} to={tab.to}>
            {tab.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
