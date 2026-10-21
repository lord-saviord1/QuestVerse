import { useCallback, useEffect, useState } from 'react'
import { deletePhoto, listPhotos } from '@/features/photos/photoStore'
import type { SavedPhoto } from '@/features/photos/types'

type State = { photos: SavedPhoto[]; loading: boolean; error: string | null }

const READ_ERROR = 'Could not read the photos saved on this phone.'

export function useSavedPhotos() {
  const [state, setState] = useState<State>({ photos: [], loading: true, error: null })

  useEffect(() => {
    let active = true
    listPhotos()
      .then((photos) => {
        if (active) setState({ photos, loading: false, error: null })
      })
      .catch(() => {
        if (active) setState({ photos: [], loading: false, error: READ_ERROR })
      })
    return () => {
      active = false
    }
  }, [])

  const remove = useCallback(async (id: string) => {
    await deletePhoto(id)
    setState((prev) => ({ ...prev, photos: prev.photos.filter((p) => p.id !== id) }))
  }, [])

  return { ...state, remove }
}
