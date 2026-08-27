import { classifyGenres } from '../constants/genreCatalog'
import type { DramaVideo, YouTubeVideoItem } from '../types/drama'

const API_ROOT = 'https://www.googleapis.com/youtube/v3'

interface YouTubeSearchResponse {
  items?: YouTubeVideoItem[]
}

interface YouTubeChannelResponse {
  items?: Array<{ id: string }>
}

/** Extracts a video id from either supported YouTube item shape. */
const getVideoId = (item: YouTubeVideoItem): string | undefined => {
  return typeof item.id === 'string' ? item.id : item.id.videoId
}

/** Fetches JSON and converts non-successful YouTube responses to errors. */
const fetchJson = async <T>(url: URL, fetcher: typeof fetch): Promise<T> => {
  const response = await fetcher(url)
  if (!response.ok) {
    throw new Error(`YouTube API request failed (${response.status})`)
  }
  return response.json() as Promise<T>
}

/** Resolves the MundoPelis channel when no channel id is configured. */
const resolveChannelId = async (
  apiKey: string,
  fetcher: typeof fetch,
): Promise<string> => {
  const params = new URLSearchParams({
    part: 'id',
    forHandle: '@MundoPelis-o4n',
    key: apiKey,
  })

  const response = await fetchJson<YouTubeChannelResponse>(
    new URL(`${API_ROOT}/channels?${params}`),
    fetcher,
  )

  const channelId = response.items?.[0]?.id

  if (!channelId) {
    throw new Error('MundoPelis channel was not found')
  }

  return channelId
}

/**
 * Fetches public MundoPelis video metadata and applies local genre labels.
 * @param apiKey Browser-safe YouTube Data API key.
 * @param channelId Optional known MundoPelis channel id.
 * @param fetcher Injectable fetch implementation used by tests.
 * @returns Public video metadata with links and local genres.
 */
export const fetchMundoPelisVideos = async (
  apiKey: string,
  channelId = import.meta.env.VITE_MUNDOPELIS_CHANNEL_ID as string | undefined,
  fetcher: typeof fetch = fetch,
): Promise<DramaVideo[]> => {
  if (!apiKey) throw new Error('Missing YouTube API key')
  const resolvedChannelId = channelId || (await resolveChannelId(apiKey, fetcher))
  const params = new URLSearchParams({
    part: 'snippet',
    channelId: resolvedChannelId,
    type: 'video',
    order: 'date',
    maxResults: '24',
    key: apiKey,
  })
  const response = await fetchJson<YouTubeSearchResponse>(
    new URL(`${API_ROOT}/search?${params}`),
    fetcher,
  )

  return (response.items ?? [])
    .map((item) => {
      const id = getVideoId(item)
      if (!id) return null
      const text = `${item.snippet.title} ${item.snippet.description}`
      return {
        id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnailUrl:
          item.snippet.thumbnails?.high?.url ??
          item.snippet.thumbnails?.medium?.url ??
          item.snippet.thumbnails?.default?.url ??
          `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        publishedAt: item.snippet.publishedAt,
        videoUrl: `https://www.youtube.com/watch?v=${id}`,
        genres: classifyGenres(text),
      }
    })
    .filter((video): video is DramaVideo => video !== null)
}
