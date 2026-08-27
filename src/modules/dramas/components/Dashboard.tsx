import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { GoogleProfile } from '../../auth/types/auth'
import { PreferencePanel } from '../../preferences/components/PreferencePanel'
import { type DramaGenre, type UserPreferences } from '../../preferences/types/preferences'
import { getStoredPreferences, savePreferences } from '../../../storage/repositories/userRepository'
import { Brand } from '../../../shared/components/Brand'
import { ProfileAvatar } from '../../../shared/components/ProfileAvatar'
import { RecommendationSection } from './RecommendationSection'
import { fetchMundoPelisVideos } from '../services/youtubeService'
import { rankRecommendations } from '../utils/recommendations'

const youtubeApiKey = import.meta.env.VITE_YOUTUBE_API_KEY as string | undefined
const channelId = import.meta.env.VITE_MUNDOPELIS_CHANNEL_ID as string | undefined

/** Returns the first display-name segment used in greetings. */
const getFirstName = (name: string): string => name.split(' ')[0] || name

interface DashboardProps {
  profile: GoogleProfile
  onLogout(): void
}

/** Renders the authenticated recommendation workspace. */
export const Dashboard = ({ profile, onLogout }: DashboardProps) => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => getStoredPreferences(profile.sub))
  const [draftGenres, setDraftGenres] = useState<DramaGenre[]>(preferences.favoriteGenres)
  const [savedMessage, setSavedMessage] = useState('')
  const { data: videos = [], isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['mundopelis-videos', youtubeApiKey, channelId],
    queryFn: () => fetchMundoPelisVideos(youtubeApiKey ?? '', channelId),
    enabled: Boolean(youtubeApiKey),
    staleTime: 1000 * 60 * 10,
  })

  const recommendations = rankRecommendations(videos, preferences.favoriteGenres)
  const matchingCount = recommendations.filter((drama) => (drama.score ?? 0) > 0).length
  /** Toggles one genre in the unsaved preference draft. */
  const toggleGenre = (genre: DramaGenre) => {
    setDraftGenres((current) => current.includes(genre)
      ? current.filter((item) => item !== genre)
      : [...current, genre])
    setSavedMessage('')
  }
  /** Persists the current genre draft for the signed-in Google subject. */
  const saveGenrePreferences = () => {
    if (draftGenres.length === 0) return
    const nextPreferences = savePreferences(profile.sub, draftGenres)
    setPreferences(nextPreferences)
    setSavedMessage('Preferences saved')
    window.setTimeout(() => setSavedMessage(''), 2400)
  }
  const errorMessage = error instanceof Error ? error.message : error ? 'Try again in a moment.' : undefined

  return (
    <>
      <header className="flex h-[70px] items-center justify-between bg-ink px-5 md:h-[82px] md:px-[5vw]">
        <Brand inverse />
        <div className="flex items-center gap-0 md:gap-[30px]">
          <span className="hidden font-utility text-[10px] uppercase tracking-[.11em] text-night-muted sm:block">{isFetching ? 'Refreshing picks' : 'MundoPelis / public videos'}</span>
          <button className="flex items-center gap-2.5 border-0 bg-transparent p-0 text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber" type="button" onClick={onLogout} title="Log out">
            <ProfileAvatar profile={profile} />
            <span className="hidden text-[13px] font-semibold sm:block">{getFirstName(profile.name)}</span>
            <span className="text-base text-night-muted">&#8599;</span>
          </button>
        </div>
      </header>
      <main className="bg-paper px-5 pb-[70px] pt-[42px] md:px-[8vw] md:pb-[100px] md:pt-[clamp(48px,7vw,94px)]">
        <section className="block justify-between gap-8 pb-14 md:flex md:items-end">
          <div>
            <span className="font-utility text-[10px] font-bold uppercase tracking-[.18em] text-coral">YOUR PERSONAL SCREENING ROOM</span>
            <h1 className="mb-4 mt-5 max-w-[650px] font-display text-[44px] font-medium leading-[.98] tracking-[-.07em] text-ink sm:text-[clamp(44px,5.5vw,74px)]">Good evening, <em className="text-coral">{getFirstName(profile.name)}.</em></h1>
            <p className="max-w-[390px] text-[15px] leading-[1.7] text-muted">A few stories selected around the things you like to feel.</p>
          </div>
          <div className="mt-7 flex items-center gap-3 md:mt-0 md:pb-1">
            <ProfileAvatar profile={profile} size="large" />
            <div className="grid gap-0.5"><strong className="text-[13px] text-ink">{profile.name}</strong><span className="text-[11px] text-muted">{profile.email}</span></div>
          </div>
        </section>
        <PreferencePanel draftGenres={draftGenres} savedMessage={savedMessage} onToggle={toggleGenre} onSave={saveGenrePreferences} />
        <RecommendationSection recommendations={recommendations} matchingCount={matchingCount} isLoading={isLoading} hasApiKey={Boolean(youtubeApiKey)} errorMessage={errorMessage} onRetry={() => void refetch()} />
      </main>
      <footer className="flex flex-wrap items-start justify-between gap-5 border-t border-mint-line bg-paper px-5 py-6 text-[11px] text-muted md:px-[8vw]">
        <Brand /><span className="order-3 w-full font-utility text-[10px] uppercase tracking-[.1em] md:order-none md:w-auto">made for the in-between episodes</span><button className="text-[11px] text-muted underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral" type="button" onClick={onLogout}>Log out</button>
      </footer>
    </>
  )
}
