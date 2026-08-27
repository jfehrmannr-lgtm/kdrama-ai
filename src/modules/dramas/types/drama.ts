import type { DramaGenre } from '../../preferences/types/preferences'

export interface DramaVideo {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  publishedAt: string
  videoUrl: string
  genres: DramaGenre[]
  score?: number
}

export interface YouTubeVideoItem {
  id: { videoId?: string } | string
  snippet: {
    title: string
    description: string
    publishedAt: string
    thumbnails?: {
      high?: { url: string }
      medium?: { url: string }
      default?: { url: string }
    }
  }
}
