export const DRAMA_GENRES = [
  'Romance',
  'Thriller',
  'Fantasy',
  'Historical',
  'Comedy',
  'Healing',
  'Action',
] as const

export type DramaGenre = (typeof DRAMA_GENRES)[number]

export interface UserPreferences {
  favoriteGenres: DramaGenre[]
  updatedAt: string
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  favoriteGenres: ['Romance', 'Healing'],
  updatedAt: '',
}
