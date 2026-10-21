import type { SavedPhoto } from '@/features/photos/types'

// Photos live on the phone (IndexedDB) until accounts and uploads are set up.

const DB_NAME = 'quest-verse'
const STORE = 'photos'

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE, { keyPath: 'id' })
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('Could not open phone storage.'))
  })
}

async function run<T>(
  mode: IDBTransactionMode,
  action: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await openDb()
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(STORE, mode)
    const request = action(tx.objectStore(STORE))
    tx.oncomplete = () => {
      db.close()
      resolve(request.result)
    }
    tx.onerror = () => {
      db.close()
      reject(tx.error ?? new Error('Phone storage error.'))
    }
    tx.onabort = () => {
      db.close()
      reject(tx.error ?? new Error('Phone storage was interrupted. It may be full.'))
    }
  })
}

export function newPhotoId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export async function savePhoto(photo: SavedPhoto): Promise<void> {
  await run('readwrite', (store) => store.put(photo))
}

export async function listPhotos(): Promise<SavedPhoto[]> {
  const all = await run<SavedPhoto[]>('readonly', (store) => store.getAll())
  return all.sort((a, b) => b.createdAt - a.createdAt)
}

export async function deletePhoto(id: string): Promise<void> {
  await run('readwrite', (store) => store.delete(id))
}
