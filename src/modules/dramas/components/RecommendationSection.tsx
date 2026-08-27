import { AnimatePresence } from 'framer-motion'
import type { DramaVideo } from '../types/drama'
import { DramaCard } from './DramaCard'
import { LoadingCards, SetupCard } from './RecommendationStates'

interface RecommendationSectionProps {
  recommendations: DramaVideo[]
  matchingCount: number
  isLoading: boolean
  hasApiKey: boolean
  errorMessage?: string
  onRetry(): void
}

const ErrorCard = ({ message, onRetry }: { message: string; onRetry(): void }) => (
  <div className="flex items-center gap-3.5 border border-error-line bg-error-surface p-5 text-error" role="alert">
    <div>
      <strong className="block text-[13px]">We could not reach MundoPelis.</strong>
      <span className="mt-1 block text-xs text-muted">{message}</span>
    </div>
    <button className="ml-auto border border-mint-line bg-transparent px-2.5 py-1.5 text-[11px] text-ink transition hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral" type="button" onClick={onRetry}>Try again</button>
  </div>
)

/** Renders ranked videos, loading state, setup guidance, and API errors. */
export const RecommendationSection = ({
  recommendations,
  matchingCount,
  isLoading,
  hasApiKey,
  errorMessage,
  onRetry,
}: RecommendationSectionProps) => (
  <section className="border-t border-mint-line pt-8" aria-labelledby="queue-title">
    <div className="mb-7 flex items-start justify-between gap-5">
      <div className="flex items-center gap-3.5">
        <span className="font-utility text-[10px] font-bold tracking-[.1em] text-coral">02</span>
        <h2 id="queue-title" className="m-0 font-display text-[23px] font-medium tracking-[-.04em] text-ink">Made for your queue</h2>
      </div>
      <div className="flex items-center gap-2 font-utility text-[9px] uppercase tracking-[.11em] text-muted sm:text-[11px]">
        {matchingCount} tailored picks <span className="size-1.5 rounded-full bg-success" />
      </div>
    </div>
    {!hasApiKey ? <SetupCard /> : null}
    {isLoading ? <LoadingCards /> : null}
    {errorMessage ? <ErrorCard message={errorMessage} onRetry={onRetry} /> : null}
    {!isLoading && !errorMessage && hasApiKey && recommendations.length === 0 ? (
      <div className="block border border-mint-line bg-mint-surface p-6 text-center">
        <span className="mb-2 block font-display text-2xl text-coral">o</span>
        <strong className="text-[13px] text-ink">No public videos yet</strong>
        <p className="mt-1.5 text-xs text-muted">Try refreshing when MundoPelis has new uploads.</p>
      </div>
    ) : null}
    <AnimatePresence mode="popLayout">
      {!isLoading && !errorMessage && recommendations.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 md:grid-cols-3">
          {recommendations.slice(0, 12).map((drama, index) => <DramaCard key={drama.id} drama={drama} position={index} />)}
        </div>
      ) : null}
    </AnimatePresence>
    <p className="mt-10 max-w-2xl font-utility text-[10px] leading-relaxed tracking-[.03em] text-muted">Recommendations use public metadata from the MundoPelis YouTube channel. Selecting a card opens its original YouTube video.</p>
  </section>
)
