import { describe, expect, it, vi } from 'vitest'
import { fetchMundoPelisVideos } from './youtubeService'

describe('MundoPelis YouTube service', () => {
  it('requests public channel videos and maps them to real YouTube links', async () => {
    const calls: URL[] = []
    const fetcher = vi.fn(async (url: URL) => {
      calls.push(url)
      return new Response(JSON.stringify({
        items: [{
          id: { videoId: 'abc123' },
          snippet: {
            title: 'Romantic office comedy',
            description: 'A new love story',
            publishedAt: '2026-08-01T00:00:00Z',
            thumbnails: { high: { url: 'https://img.youtube.com/abc123.jpg' } },
          },
        }],
      }), { status: 200 })
    }) as unknown as typeof fetch

    const videos = await fetchMundoPelisVideos('test-key', 'mundo-channel', fetcher)

    expect(calls).toHaveLength(1)
    expect(calls[0].searchParams.get('channelId')).toBe('mundo-channel')
    expect(calls[0].searchParams.get('type')).toBe('video')
    expect(calls[0].searchParams.get('key')).toBe('test-key')
    expect(videos[0]).toMatchObject({
      id: 'abc123',
      thumbnailUrl: 'https://img.youtube.com/abc123.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=abc123',
      genres: ['Romance', 'Comedy'],
    })
  })

  it('resolves the real channel before requesting its videos when no id is configured', async () => {
    const calls: URL[] = []
    const fetcher = vi.fn(async (url: URL) => {
      calls.push(url)
      const body = url.pathname.endsWith('/search') && url.searchParams.get('type') === 'channel'
        ? { items: [{ id: { channelId: 'resolved-channel' } }] }
        : { items: [] }
      return new Response(JSON.stringify(body), { status: 200 })
    }) as unknown as typeof fetch

    await fetchMundoPelisVideos('test-key', undefined, fetcher)

    expect(calls).toHaveLength(2)
    expect(calls[0].searchParams.get('q')).toBe('MundoPelis')
    expect(calls[1].searchParams.get('channelId')).toBe('resolved-channel')
  })

  it('surfaces API failures to the UI layer', async () => {
    const fetcher = vi.fn(async () => new Response('{}', { status: 403 })) as unknown as typeof fetch

    await expect(fetchMundoPelisVideos('test-key', 'mundo-channel', fetcher)).rejects.toThrow('403')
  })
})
