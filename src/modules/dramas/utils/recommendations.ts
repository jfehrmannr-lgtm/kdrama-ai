import type { DramaVideo } from '../types/drama'
import type { DramaGenre } from '../../preferences/types/preferences'

/**
 * Ranks videos by the percentage of the user's favorite genres they match.
 * @param videos Public videos already classified with local genres.
 * @param favoriteGenres Genres selected by the signed-in user.
 * @returns A stable, descending list with a percentage score on each video.
 */
export const rankRecommendations = (
  videos: DramaVideo[],
  favoriteGenres: DramaGenre[],
): DramaVideo[] => {
  const favorites = new Set(favoriteGenres)
  return videos
    .map((video, index) => ({
      video,
      index,
      score: favoriteGenres.length
        ? Math.round(
            (video.genres.filter((genre) => favorites.has(genre)).length /
              favoriteGenres.length) * 100,
          )
        : 0,
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ video, score }) => ({ ...video, score }))
}
