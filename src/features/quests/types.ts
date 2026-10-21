export type Difficulty = 'easy' | 'medium' | 'hard'

export type Quest = {
  id: string
  title: string
  place: string
  instructions: string
  difficulty: Difficulty
  photoRule: string
  /** Sample quests are placeholders until the real list is ready. */
  sample: boolean
}

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
}
