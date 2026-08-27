/** Displays the missing API configuration needed for public video fetching. */
export const SetupCard = () => (
  <div className="mb-6 flex items-start gap-3.5 border border-mint-line bg-config-surface p-5" role="status">
    <span className="grid size-[27px] shrink-0 place-items-center rounded-full border border-coral font-bold text-coral">!</span>
    <div><strong className="text-[13px] text-ink">Connect your YouTube data source</strong><p className="mt-1.5 text-xs leading-snug text-muted">Add <code>VITE_YOUTUBE_API_KEY</code> to <code>.env.local</code>. An optional <code>VITE_MUNDOPELIS_CHANNEL_ID</code> avoids the channel lookup request.</p></div>
  </div>
)

/** Displays lightweight placeholders while the YouTube query is pending. */
export const LoadingCards = () => (
  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3" aria-label="Loading recommendations">
    {[1, 2, 3].map((item) => <div className="aspect-[1.1] animate-pulse bg-mint" key={item} />)}
  </div>
)
