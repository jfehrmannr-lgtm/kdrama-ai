import { describe, expect, it } from 'vitest'
import { classifyGenres } from '../constants/genreCatalog'
import type { DramaVideo } from '../types/drama'
import { rankRecommendations } from './recommendations'

const videos: DramaVideo[] = [
  {
    id: 'romance', title: 'A quiet love story', description: '', thumbnailUrl: '',
    publishedAt: '2026-01-01', videoUrl: 'https://youtube.com/watch?v=romance', genres: ['Romance'],
  },
  {
    id: 'thriller', title: 'The hidden detective', description: '', thumbnailUrl: '',
    publishedAt: '2026-01-02', videoUrl: 'https://youtube.com/watch?v=thriller', genres: ['Thriller'],
  },
  {
    id: 'both', title: 'A romantic mystery', description: '', thumbnailUrl: '',
    publishedAt: '2026-01-03', videoUrl: 'https://youtube.com/watch?v=both', genres: ['Romance', 'Thriller'],
  },
]

describe('recommendation ranking', () => {
  it('puts videos matching more favorite genres first', () => {
    const ranked = rankRecommendations(videos, ['Romance', 'Thriller'])
    expect(ranked.map((video) => video.id)).toEqual(['both', 'romance', 'thriller'])
    expect(ranked[0].score).toBe(100)
  })

  it('preserves source order when scores tie', () => {
    const ranked = rankRecommendations(videos, ['Fantasy'])
    expect(ranked.map((video) => video.id)).toEqual(['romance', 'thriller', 'both'])
  })
})

describe('local genre classification', () => {
  it('classifies keyword-rich titles without a remote metadata service', () => {
    expect(classifyGenres('A palace romance with a time travel mystery')).toEqual([
      'Romance', 'Thriller', 'Fantasy', 'Historical',
    ])
  })

  it('falls back to romance for an unclassified public title', () => {
    expect(classifyGenres('MundoPelis episode 7')).toEqual(['Romance'])
  })
})
