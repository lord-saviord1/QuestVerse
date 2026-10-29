import type { PhotosAllowed } from '@/features/places/placeTypes'

// Pinned places are kept on the phone (localStorage) and exported by hand as CSV.

export type PinnedPlace = {
  id: string
  name: string
  type: string
  faculty: string
  photosAllowed: PhotosAllowed
  lat: number
  lng: number
  accuracy: number
  notes: string
  addedAt: number
}

const KEY = 'qv-pinned-places'

function isPin(value: unknown): value is PinnedPlace {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.id === 'string' &&
    typeof v.name === 'string' &&
    typeof v.lat === 'number' &&
    typeof v.lng === 'number'
  )
}

export function loadPins(): PinnedPlace[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const data: unknown = JSON.parse(raw)
    return Array.isArray(data) ? data.filter(isPin) : []
  } catch {
    return []
  }
}

/** Returns false if the phone refused to store the data (for example, storage is full). */
export function savePins(pins: PinnedPlace[]): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(pins))
    return true
  } catch {
    return false
  }
}

function csvCell(value: string | number): string {
  const text = String(value)
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

/** CSV with the same column names as the Places tab, ready to paste into the sheet. */
export function pinsToCsv(pins: PinnedPlace[]): string {
  const header = [
    'Place name',
    'Type',
    'Faculty or area',
    'Photos allowed?',
    'Latitude',
    'Longitude',
    'Accuracy (m)',
    'Notes',
  ]
  const rows = pins.map((p) =>
    [
      p.name,
      p.type,
      p.faculty,
      p.photosAllowed,
      p.lat.toFixed(6),
      p.lng.toFixed(6),
      Math.round(p.accuracy),
      p.notes,
    ]
      .map(csvCell)
      .join(','),
  )
  return [header.map(csvCell).join(','), ...rows].join('\n')
}
