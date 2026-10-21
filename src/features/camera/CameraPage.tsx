import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { findQuest } from '@/features/quests/sampleQuests'
import { compressImage, type CompressedImage } from '@/lib/image'
import { BlobImage } from '@/features/photos/BlobImage'
import { newPhotoId, savePhoto } from '@/features/photos/photoStore'
import type { PhotoLabel, Where } from '@/features/photos/types'
import {
  FLOORS,
  OTHER_PLACE,
  SAMPLE_PLACES,
  SPOT_SUGGESTIONS,
  WHERE_OPTIONS,
} from '@/features/places/labelOptions'

type Step = 'pick' | 'processing' | 'preview' | 'label' | 'saving' | 'done'

export function CameraPage() {
  const [params] = useSearchParams()
  const quest = findQuest(params.get('quest') ?? undefined)
  const [step, setStep] = useState<Step>('pick')
  const [photo, setPhoto] = useState<CompressedImage | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [where, setWhere] = useState<Where | ''>('')
  const [place, setPlace] = useState('')
  const [otherPlace, setOtherPlace] = useState('')
  const [floor, setFloor] = useState('')
  const [spot, setSpot] = useState('')
  const [rulesOk, setRulesOk] = useState(false)

  if (!quest) {
    return (
      <>
        <h1>Camera</h1>
        <p className="empty">Pick a quest first. Its photo gets taken here.</p>
        <Link to="/quests" className="btn">
          Choose a quest
        </Link>
      </>
    )
  }

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setError(null)
    setStep('processing')
    try {
      setPhoto(await compressImage(file))
      setStep('preview')
    } catch (e) {
      setStep('pick')
      setError(e instanceof Error ? e.message : 'Could not read that photo.')
    }
  }

  async function handleSave(event: FormEvent) {
    event.preventDefault()
    if (!photo || !quest || !where) return
    const placeName = place === OTHER_PLACE ? otherPlace.trim() : place
    if (!placeName) return

    const label: PhotoLabel = {
      where,
      place: placeName,
      floor: where === 'inside' ? floor : null,
      spot: spot.trim() || null,
    }

    setError(null)
    setStep('saving')
    try {
      await savePhoto({
        id: newPhotoId(),
        questId: quest.id,
        createdAt: Date.now(),
        blob: photo.blob,
        width: photo.width,
        height: photo.height,
        label,
      })
      setStep('done')
    } catch (e) {
      setStep('label')
      setError(e instanceof Error ? e.message : 'Could not save the photo.')
    }
  }

  if (step === 'done') {
    return (
      <>
        <h1>Saved</h1>
        <p className="lede">Your photo for “{quest.title}” is saved on this phone.</p>
        <p>Photos stay on this phone until accounts are on.</p>
        <div className="actions">
          <Link to="/vault" className="btn">
            See your vault
          </Link>
          <Link to="/quests" className="btn btn--ghost">
            More quests
          </Link>
        </div>
      </>
    )
  }

  const busy = step === 'processing' || step === 'saving'

  return (
    <>
      <Link to={`/quests/${quest.id}`} className="back">
        Back to the quest
      </Link>
      <h1>{quest.title}</h1>
      <p className="empty">
        <strong>Photo rule:</strong> {quest.photoRule}
      </p>

      {photo && (step === 'preview' || step === 'label' || step === 'saving') && (
        <figure className="photo-preview">
          <BlobImage blob={photo.blob} alt="Your photo, ready to save" />
          <figcaption>
            {photo.width} × {photo.height} pixels, about{' '}
            {Math.max(1, Math.round(photo.blob.size / 1024))} kB
          </figcaption>
        </figure>
      )}

      {step === 'processing' && <p role="status">Getting your photo ready…</p>}

      <div className="actions">
        {(step === 'pick' || step === 'preview') && (
          <label className="btn btn--ghost">
            {step === 'pick' ? 'Open camera' : 'Retake'}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="visually-hidden"
              onChange={handleFile}
            />
          </label>
        )}
        {step === 'preview' && (
          <button type="button" className="btn" onClick={() => setStep('label')}>
            Use this photo
          </button>
        )}
      </div>

      {(step === 'label' || step === 'saving') && (
        <form onSubmit={handleSave}>
          <h2>Where did you take it?</h2>

          <fieldset className="choices">
            <legend>Where</legend>
            {WHERE_OPTIONS.map((option) => (
              <label key={option.value} className="choice">
                <input
                  type="radio"
                  name="where"
                  value={option.value}
                  checked={where === option.value}
                  onChange={() => setWhere(option.value)}
                  required
                />
                <span>
                  <strong>{option.label}</strong>
                  <small>{option.hint}</small>
                </span>
              </label>
            ))}
          </fieldset>

          <div className="field">
            <label htmlFor="place">Building or place</label>
            <select
              id="place"
              className="input"
              required
              value={place}
              onChange={(e) => setPlace(e.target.value)}
            >
              <option value="" disabled>
                Choose a place
              </option>
              {SAMPLE_PLACES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
              <option value={OTHER_PLACE}>Other (type it)</option>
            </select>
          </div>

          {place === OTHER_PLACE && (
            <div className="field">
              <label htmlFor="other-place">Name of the place</label>
              <input
                id="other-place"
                className="input"
                required
                value={otherPlace}
                onChange={(e) => setOtherPlace(e.target.value)}
              />
            </div>
          )}

          {where === 'inside' && (
            <div className="field">
              <label htmlFor="floor">Floor</label>
              <select
                id="floor"
                className="input"
                required
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
              >
                <option value="" disabled>
                  Choose a floor
                </option>
                {FLOORS.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="field">
            <label htmlFor="spot">Spot inside or around it (optional)</label>
            <input
              id="spot"
              className="input"
              list="spot-suggestions"
              value={spot}
              onChange={(e) => setSpot(e.target.value)}
            />
            <datalist id="spot-suggestions">
              {SPOT_SUGGESTIONS.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
          </div>

          <label className="check">
            <input
              type="checkbox"
              checked={rulesOk}
              onChange={(e) => setRulesOk(e.target.checked)}
              required
            />
            <span>This photo follows the photo rule above.</span>
          </label>

          <div className="actions">
            <button type="submit" className="btn" disabled={busy}>
              {step === 'saving' ? 'Saving…' : 'Save photo'}
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setStep('preview')}
              disabled={busy}
            >
              Back
            </button>
          </div>
        </form>
      )}

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </>
  )
}
