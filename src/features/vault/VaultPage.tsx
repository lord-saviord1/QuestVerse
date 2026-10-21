import { Link } from 'react-router-dom'
import { BlobImage } from '@/features/photos/BlobImage'
import { useSavedPhotos } from '@/features/photos/useSavedPhotos'
import { findQuest } from '@/features/quests/sampleQuests'
import { describeLabel } from '@/features/places/labelOptions'

const dateFormat = new Intl.DateTimeFormat('en-NG', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

export function VaultPage() {
  const { photos, loading, error, remove } = useSavedPhotos()

  async function handleDelete(id: string) {
    if (window.confirm('Delete this photo from your phone? This cannot be undone.')) {
      await remove(id)
    }
  }

  return (
    <>
      <h1>Vault</h1>
      {loading && <p role="status">Opening your vault…</p>}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && photos.length === 0 && (
        <>
          <p className="empty">No photos yet. Finish a quest and your first photo shows up here.</p>
          <Link to="/quests" className="btn">
            See quests
          </Link>
        </>
      )}

      {photos.length > 0 && (
        <>
          <p className="lede">
            {photos.length} {photos.length === 1 ? 'photo' : 'photos'}, saved on this phone.
          </p>
          <ul className="vault-grid">
            {photos.map((photo) => {
              const quest = findQuest(photo.questId)
              const title = quest?.title ?? 'Quest photo'
              return (
                <li key={photo.id} className="photo-card">
                  <BlobImage blob={photo.blob} alt={`Photo for ${title}`} />
                  <div className="photo-card__body">
                    <strong>{title}</strong>
                    <span>{describeLabel(photo.label)}</span>
                    <span>{dateFormat.format(photo.createdAt)}</span>
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => void handleDelete(photo.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </>
  )
}
