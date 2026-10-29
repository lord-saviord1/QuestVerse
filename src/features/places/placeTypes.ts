// Same lists as the Places tab in the content sheet, so exported rows paste straight in.
export const PLACE_TYPES = [
  'Faculty',
  'Lecture hall',
  'Hostel',
  'Food',
  'Sports',
  'Library',
  'Admin',
  'Open space',
  'Gate',
  'Other',
]

export const PHOTO_RULES = ['Yes', 'No', 'Ask first'] as const
export type PhotosAllowed = (typeof PHOTO_RULES)[number]
