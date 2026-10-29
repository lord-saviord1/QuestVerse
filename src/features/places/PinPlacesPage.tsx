import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { newPhotoId } from '@/features/photos/photoStore'
import { PHOTO_RULES, PLACE_TYPES, type PhotosAllowed } from '@/features/places/placeTypes'
import { loadPins, pinsToCsv, savePins, type PinnedPlace } from '@/features/places/pinStore'
import { useGeolocation } from '@/features/places/useGeolocation'

const GOOD_ACCURACY = 15
const MAX_ACCURACY = 30

export function PinPlacesPage() {
  const geo = useGeolocation()
  const [pins, setPins] = useState<PinnedPlace[]>(() => loadPins())
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [faculty, setFaculty] = useState('')
  const [photosAllowed, setPhotosAllowed] = useState<PhotosAllowed>('Yes')
  const [notes, setNotes] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [csvText, setCsvText] = useState<string | null>(null)

  const accuracy = geo.accuracy
  const hasFix = geo.status === 'ready' && accuracy !== undefined
  const usable = hasFix && accuracy <= MAX_ACCURACY

  function readout() {
    switch (geo.status) {
      case 'waiting':
        return 'Finding your position…'
      case 'denied':
        return 'Location is blocked. Allow location for this site in your browser settings, then reload.'
      case 'unavailable':
        return 'This browser cannot give a location.'
      case 'error':
        return 'Could not get a position yet. Move to open sky and wait a moment.'
      default:
        break
    }
    const quality =
      accuracy! <= GOOD_ACCURACY
        ? 'good'
        : accuracy! <= MAX_ACCURACY
          ? 'fair, waiting a bit helps'
          : 'too rough, wait or move to open sky'
    return `Position found. Accuracy about ${Math.round(accuracy!)} m (${quality}).`
  }

  function handleAdd(event: FormEvent) {
    event.preventDefault()
    if (!usable || geo.lat === undefined || geo.lng === undefined || accuracy === undefined) return
    const pin: PinnedPlace = {
      id: newPhotoId(),
      name: name.trim(),
      type,
      faculty: faculty.trim(),
      photosAllowed,
      lat: geo.lat,
      lng: geo.lng,
      accuracy,
      notes: notes.trim(),
      addedAt: Date.now(),
    }
    const next = [...pins, pin]
    if (!savePins(next)) {
      setMessage('Could not save on this phone. Export what you have, then clear some pins.')
      return
    }
    setPins(next)
    setName('')
    setNotes('')
    setMessage(`Added “${pin.name}”.`)
    setCsvText(null)
  }

  function handleDelete(id: string) {
    const next = pins.filter((p) => p.id !== id)
    savePins(next)
    setPins(next)
    setCsvText(null)
  }

  async function handleCopy() {
    const csv = pinsToCsv(pins)
    try {
      await navigator.clipboard.writeText(csv)
      setMessage('Copied. Paste it into the sheet or send it on WhatsApp.')
      setCsvText(null)
    } catch {
      setCsvText(csv)
      setMessage('Could not copy automatically. Select the text below and copy it.')
    }
  }

  return (
    <>
      <Link to="/map" className="back">
        Back to the map
      </Link>
      <h1>Pin places</h1>
      <p className="lede">
        Stand at the place, wait for a good position, then add it. Everything stays on this phone
        until you export it.
      </p>

      <p className="empty" role="status">
        {readout()}
      </p>

      <form onSubmit={handleAdd}>
        <div className="field">
          <label htmlFor="pin-name">Place name</label>
          <input
            id="pin-name"
            className="input"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="pin-type">Type</label>
          <select
            id="pin-type"
            className="input"
            required
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="" disabled>
              Choose a type
            </option>
            {PLACE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="pin-faculty">Faculty or area (optional)</label>
          <input
            id="pin-faculty"
            className="input"
            value={faculty}
            onChange={(e) => setFaculty(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="pin-photos">Are photos allowed here?</label>
          <select
            id="pin-photos"
            className="input"
            value={photosAllowed}
            onChange={(e) => setPhotosAllowed(e.target.value as PhotosAllowed)}
          >
            {PHOTO_RULES.map((rule) => (
              <option key={rule} value={rule}>
                {rule}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="pin-notes">Notes (optional)</label>
          <input
            id="pin-notes"
            className="input"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <button type="submit" className="btn" disabled={!usable} style={{ marginTop: 16 }}>
          Add place here
        </button>
      </form>

      {message && <p role="status">{message}</p>}

      <h2>Pinned on this phone ({pins.length})</h2>
      {pins.length === 0 && <p className="empty">Nothing pinned yet.</p>}
      {pins.length > 0 && (
        <>
          <ul className="pin-list">
            {pins.map((pin) => (
              <li key={pin.id} className="pin-item">
                <div>
                  <strong>{pin.name}</strong>
                  <span>
                    {pin.type} · {pin.lat.toFixed(5)}, {pin.lng.toFixed(5)} · about{' '}
                    {Math.round(pin.accuracy)} m
                  </span>
                </div>
                <button type="button" className="link-button" onClick={() => handleDelete(pin.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <div className="actions">
            <button type="button" className="btn btn--ghost" onClick={() => void handleCopy()}>
              Copy as CSV
            </button>
          </div>
        </>
      )}

      {csvText && (
        <textarea
          className="input csv-box"
          readOnly
          rows={8}
          value={csvText}
          onFocus={(e) => e.target.select()}
        />
      )}
    </>
  )
}
