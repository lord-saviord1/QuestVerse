import type { Quest } from '@/features/quests/types'

// Placeholder quests for testing the screens. Replace with the real list from the content sheet.
export const sampleQuests: Quest[] = [
  {
    id: 'tallest-tree',
    title: 'The tallest tree you can find',
    place: 'Anywhere on campus',
    instructions: 'Find the tallest tree near you and take one photo of it.',
    difficulty: 'easy',
    photoRule: 'Photograph the tree, not people.',
    sample: true,
  },
  {
    id: 'lunch-spot',
    title: 'Lunch at Mama Kiniko',
    place: 'Mama Kiniko',
    instructions: 'Take a photo of the place. Buying food is optional.',
    difficulty: 'easy',
    photoRule: 'Photograph the place, not other customers.',
    sample: true,
  },
  {
    id: 'two-faculties',
    title: 'Two faculties, one photo each',
    place: 'Faculty of Arts and Faculty of Science',
    instructions:
      'Take one photo outside the Faculty of Arts and one outside the Faculty of Science.',
    difficulty: 'medium',
    photoRule: 'No identifiable faces.',
    sample: true,
  },
  {
    id: 'your-lecture-hall',
    title: 'Your own lecture hall',
    place: 'The hall where you have the most lectures',
    instructions:
      'Take a photo of the room when it is empty or when no lecture is on. Do not disturb a class.',
    difficulty: 'medium',
    photoRule: 'Nobody else in the shot.',
    sample: true,
  },
  {
    id: 'five-places',
    title: 'Five places in one day',
    place: 'Five different places on campus',
    instructions:
      'Take a photo at five different places before the day ends. Stay in public areas and in daylight.',
    difficulty: 'hard',
    photoRule: 'Places only, no identifiable people.',
    sample: true,
  },
]

export function findQuest(id: string | undefined): Quest | undefined {
  return sampleQuests.find((q) => q.id === id)
}
