import { GenreChip } from './GenreChip'
import { DRAMA_GENRES, type DramaGenre } from '../types/preferences'

interface PreferencePanelProps {
  draftGenres: DramaGenre[]
  savedMessage: string
  onToggle(genre: DramaGenre): void
  onSave(): void
}

/** Lets a signed-in viewer tune and persist their genre preferences. */
export const PreferencePanel = ({
  draftGenres,
  savedMessage,
  onToggle,
  onSave,
}: PreferencePanelProps) => (
  <section className="border-t border-mint-line py-8" aria-labelledby="mood-board-title">
    <div className="flex items-start justify-between gap-5">
      <div className="flex items-center gap-3.5">
        <span className="font-utility text-[10px] font-bold tracking-[.1em] text-coral">01</span>
        <h2 id="mood-board-title" className="m-0 font-display text-[23px] font-medium tracking-[-.04em] text-ink">Your mood board</h2>
      </div>
      <span className="max-w-[125px] text-right text-[10px] uppercase tracking-[.11em] text-muted">Tune your recommendations</span>
    </div>
    <div className="mt-7 flex flex-wrap gap-2">
      {DRAMA_GENRES.map((genre) => (
        <GenreChip key={genre} genre={genre} selected={draftGenres.includes(genre)} onToggle={() => onToggle(genre)} />
      ))}
    </div>
    <div className="mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <p className="m-0 text-xs text-muted">
        {draftGenres.length
          ? `${draftGenres.length} ${draftGenres.length === 1 ? 'genre' : 'genres'} selected`
          : 'Choose at least one genre to save your mood board.'}
      </p>
      <button
        className="w-full border border-ink bg-ink px-4 py-2.5 text-left text-[11px] font-bold text-paper transition hover:bg-ink-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral sm:w-auto"
        type="button"
        disabled={!draftGenres.length}
        onClick={onSave}
      >
        {savedMessage || 'Save preferences'} <span className="ml-2 text-amber">&#8594;</span>
      </button>
    </div>
  </section>
)
