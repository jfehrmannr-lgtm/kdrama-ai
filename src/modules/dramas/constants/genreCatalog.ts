import type { DramaGenre } from '../../preferences/types/preferences'

export const GENRE_DETAILS: Record<DramaGenre, { description: string; accent: string }> = {
  Romance: { description: 'Slow burns, big feelings, and unforgettable chemistry.', accent: '#e56b8c' },
  Thriller: { description: 'Sharp twists and stories that keep you guessing.', accent: '#7b72d8' },
  Fantasy: { description: 'Other worlds, strange rules, and impossible choices.', accent: '#4f9db2' },
  Historical: { description: 'Period settings, palace intrigue, and rich tradition.', accent: '#b98654' },
  Comedy: { description: 'Warm laughs, chaos, and characters you want to keep around.', accent: '#e9a244' },
  Healing: { description: 'Gentle stories for a softer, slower evening.', accent: '#6fa27d' },
  Action: { description: 'High stakes, bold heroes, and momentum from episode one.', accent: '#cc5b4c' },
}

const GENRE_KEYWORDS: Record<DramaGenre, string[]> = {
  Romance: ['romance', 'romantic', 'love', 'lover', 'marry', 'wedding', 'heart', 'business proposal', 'crash landing'],
  Thriller: ['thriller', 'crime', 'murder', 'killer', 'revenge', 'secret', 'detective', 'mystery', 'stranger', 'mask'],
  Fantasy: ['fantasy', 'legend', 'magic', 'ghost', 'goblin', 'time travel', 'my demon', 'kingdom'],
  Historical: ['historical', 'period', 'palace', 'joseon', 'king', 'queen', 'empress', 'silla'],
  Comedy: ['comedy', 'funny', 'hilarious', 'rom-com', 'chaos', 'family', 'office'],
  Healing: ['healing', 'slice of life', 'comfort', 'daily', 'neighborhood', 'youth', 'home'],
  Action: ['action', 'warrior', 'fight', 'agent', 'police', 'hero', 'vigilante', 'martial'],
}

/**
 * Classifies public video text using the app's local genre keyword catalog.
 * @param text Title and description text returned by YouTube.
 * @returns Matching genres, falling back to Romance when no keyword matches.
 */
export const classifyGenres = (text: string): DramaGenre[] => {
  const normalized = text.toLowerCase()
  const matches = (Object.entries(GENRE_KEYWORDS) as [DramaGenre, string[]][])
    .filter(([, keywords]) => keywords.some((keyword) => normalized.includes(keyword)))
    .map(([genre]) => genre)

  return matches.length ? matches : ['Romance']
}
