import { useState, type ChangeEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { findQuest } from '@/features/quests/sampleQuests'
import { compressImage, type CompressedImage } from '@/lib/image'
import { BlobImage } from '@/features/photos/BlobImage'
import { newPhotoId, savePhoto } from '@/features/photos/photoStore'

type Step = 'pick' | 'processing' | 'preview' | 'saving' | 'done'

export function CameraPage() {
  const [params] = useSearchParams()
  const quest = findQuest(params.get('quest') ?? undefined)
  const [step, setStep] = useState<Step>('pick')
  const [photo, setPhoto] = useState<CompressedImage | null>(null)
  const [error, setError] = useState<string | null>(null)

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

  async function handleSave() {
    if (!photo || !quest) return
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
        label: null,
      })
      setStep('done')
    } catch (e) {
      setStep('preview')
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

      {photo && (step === 'preview' || step === 'saving') && (
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
        {(step === 'preview' || step === 'saving') && (
          <button type="button" className="btn" onClick={handleSave} disabled={busy}>
            {step === 'saving' ? 'Saving…' : 'Save photo'}
          </button>
        )}
      </div>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </>
  )
}
