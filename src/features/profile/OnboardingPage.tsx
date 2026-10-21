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

  if (!user) return <p className="empty">Sign in first, then come back to this page.</p>

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
    <>
      <h1>About you</h1>
      <p className="lede">
        We use this to place you in your faculty, department and level on campus.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="faculty">Faculty</label>
          <input
            id="faculty"
            className="input"
            required
            value={faculty}
            onChange={(e) => setFaculty(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="department">Department</label>
          <input
            id="department"
            className="input"
            required
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="level">Level</label>
          <select
            id="level"
            className="input"
            required
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="" disabled>
              Choose your level
            </option>
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn" disabled={saving} style={{ marginTop: 16 }}>
          {saving ? 'Saving…' : 'Save and continue'}
        </button>
      </form>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </>
  )
}
