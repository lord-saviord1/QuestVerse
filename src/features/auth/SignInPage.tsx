import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthProvider'
import { isSupabaseConfigured } from '@/lib/supabase'

export function SignInPage() {
  const { user, loading, signInWithGoogle, signInWithEmail } = useAuth()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [error, setError] = useState<string | null>(null)

  if (!loading && user) return <Navigate to="/" replace />

  if (!isSupabaseConfigured) {
    return (
      <section>
        <h1>Sign in</h1>
        <p>Accounts are not set up yet.</p>
      </section>
    )
  }

  async function handleGoogle() {
    setError(null)
    try {
      await signInWithGoogle()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not start Google sign-in.')
    }
  }

  async function handleEmail(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setStatus('sending')
    try {
      await signInWithEmail(email.trim())
      setStatus('sent')
    } catch (e) {
      setStatus('idle')
      setError(e instanceof Error ? e.message : 'Could not send the sign-in email.')
    }
  }

  return (
    <section>
      <h1>Sign in</h1>

      <button type="button" onClick={handleGoogle}>
        Continue with Google
      </button>
      <p>
        If Google sign-in does not work, open this page in Chrome or Safari, or use the email link
        below.
      </p>

      <form onSubmit={handleEmail}>
        <label htmlFor="email">Or get a sign-in link by email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Email me a link'}
        </button>
      </form>

      {status === 'sent' && <p>Check your email and tap the link to sign in.</p>}
      {error && <p role="alert">{error}</p>}
    </section>
  )
}
