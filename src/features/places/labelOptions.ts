import type { PhotoLabel, Where } from '@/features/photos/types'

export const WHERE_OPTIONS: { value: Where; label: string; hint: string }[] = [
  { value: 'inside', label: 'Inside', hint: 'In a room or hallway' },
  { value: 'outside', label: 'Outside', hint: 'Outdoors, at a building' },
  { value: 'near', label: 'Near', hint: 'A short walk from it' },
  { value: 'at', label: 'At', hint: 'Right at the place' },
]

// Placeholder list for testing. Replace it with the real places from the content sheet.
export const SAMPLE_PLACES = [
  'Faculty of Arts',
  'Faculty of Science',
  'Library',
  'Mama Kiniko',
  'Main gate',
]

export const OTHER_PLACE = 'Other'

export const FLOORS = ['Basement', 'Ground', '1st', '2nd', '3rd', '4th', 'Other']

export const SPOT_SUGGESTIONS = [
  'Lecture hall',
  'Corridor',
  'Steps',
  'Cafeteria',
  'Lab',
  'Notice board',
  'Outdoor area',
]

const WHERE_PHRASE: Record<Where, string> = {
  inside: 'Inside',
  outside: 'Outside',
  near: 'Near',
  at: 'At',
}

function floorPhrase(floor: string): string {
  return floor === 'Basement' || floor === 'Other' ? floor : `${floor} floor`
}

/** A short line for captions, for example "Inside · Faculty of Arts · 1st floor · Lecture hall". */
export function describeLabel(label: PhotoLabel | null): string {
  if (!label) return 'No place label'
  const parts = [WHERE_PHRASE[label.where], label.place]
  if (label.floor) parts.push(floorPhrase(label.floor))
  if (label.spot) parts.push(label.spot)
  return parts.join(' · ')
}
