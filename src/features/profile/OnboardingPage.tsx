import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthProvider'
import { getSupabase } from '@/lib/supabase'

const LEVELS = [100, 200, 300, 400, 500, 600]

export function OnboardingPage() {
  const { user, profile, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [faculty, setFaculty] = useState(profile?.faculty ?? '')
  const [department, setDepartment] = useState(profile?.department ?? '')
  const [level, setLevel] = useState(profile?.level ? String(profile.level) : '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!user) return null

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!user) return
    setError(null)
    setSaving(true)
    const { error: saveError } = await getSupabase()
      .from('profiles')
      .upsert({
        id: user.id,
        faculty: faculty.trim(),
        department: department.trim(),
        level: Number(level),
        onboarding_complete: true,
      })
    setSaving(false)
    if (saveError) {
      setError(saveError.message)
      return
    }
    await refreshProfile()
    navigate('/', { replace: true })
  }

  return (
    <section>
      <h1>About you</h1>
      <p>We use this to place you in your faculty, department and level on campus.</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="faculty">Faculty</label>
        <input id="faculty" required value={faculty} onChange={(e) => setFaculty(e.target.value)} />

        <label htmlFor="department">Department</label>
        <input
          id="department"
          required
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />

        <label htmlFor="level">Level</label>
        <select id="level" required value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="" disabled>
            Choose your level
          </option>
          {LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

        <button type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Continue'}
        </button>
      </form>
      {error && <p role="alert">{error}</p>}
    </section>
  )
}
