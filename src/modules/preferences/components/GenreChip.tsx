import type { CSSProperties } from 'react'
import { GENRE_DETAILS } from '../../dramas/constants/genreCatalog'
import type { DramaGenre } from '../types/preferences'

interface GenreChipProps {
  genre: DramaGenre
  selected: boolean
  onToggle(): void
}

/** Renders one selectable genre preference. */
export const GenreChip = ({ genre, selected, onToggle }: GenreChipProps) => (
  <button
    type="button"
    className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs text-muted transition duration-150 hover:border-[var(--chip-accent)] hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral ${selected ? 'border-[var(--chip-accent)] bg-[color-mix(in_srgb,var(--chip-accent)_11%,transparent)] text-ink' : 'border-mint-line'}`}
    style={{ '--chip-accent': GENRE_DETAILS[genre].accent } as CSSProperties}
    aria-pressed={selected}
    onClick={onToggle}
  >
    <span className="size-1.5 rounded-full bg-[var(--chip-accent)]" />
    {genre}
    {selected && <span className="text-[15px] leading-[10px] text-[var(--chip-accent)]" aria-hidden="true">+</span>}
  </button>
)
