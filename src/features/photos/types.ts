export type Where = 'inside' | 'outside' | 'near' | 'at'

export type PhotoLabel = {
  where: Where
  place: string
  floor: string | null
  spot: string | null
}

export type SavedPhoto = {
  id: string
  questId: string
  createdAt: number
  blob: Blob
  width: number
  height: number
  /** Where the photo was taken. Null until the label step exists or if skipped. */
  label: PhotoLabel | null
}
