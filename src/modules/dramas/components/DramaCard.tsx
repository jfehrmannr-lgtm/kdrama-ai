import { motion, useReducedMotion } from 'framer-motion'
import type { DramaVideo } from '../types/drama'

interface DramaCardProps {
  drama: DramaVideo
  position: number
}

/** Formats a YouTube publication timestamp for the recommendation card. */
const formatPublishedDate = (date: string) => new Intl.DateTimeFormat('en', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
}).format(new Date(date))

/** Links a recommendation card to its original public YouTube video. */
export const DramaCard = ({ drama, position }: DramaCardProps) => {
  const reducedMotion = useReducedMotion()

  return <motion.a
    className="group block text-ink no-underline"
    href={drama.videoUrl}
    target="_blank"
    rel="noreferrer"
    initial={reducedMotion ? false : { opacity: 0, y: 18 }}
    animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
    transition={{ delay: position * 0.06, duration: 0.35 }}
  >
    <div className="relative aspect-[1.62] overflow-hidden bg-mint">
      <img className="size-full object-cover transition duration-500 group-hover:scale-105 motion-reduce:transition-none" src={drama.thumbnailUrl} alt="" loading="lazy" />
      <span className="absolute bottom-4 left-4 grid size-[31px] place-items-center rounded-full bg-ink pl-0.5 text-[11px] text-white" aria-hidden="true">&#9654;</span>
      {drama.score ? <span className="absolute right-3 top-3 bg-coral px-2 py-1.5 text-[9px] font-bold uppercase tracking-[0.05em] text-white">{drama.score}% match</span> : null}
    </div>
    <div className="pt-3.5">
      <div className="flex gap-2 font-utility text-[10px] uppercase tracking-[0.08em] text-muted">
        <span>{formatPublishedDate(drama.publishedAt)}</span><span className="text-coral">/</span><span>MundoPelis</span>
      </div>
      <h3 className="mb-3 mt-2 text-[21px] font-medium leading-tight tracking-[-0.04em] text-ink">{drama.title}</h3>
      <div className="flex gap-1.5">{drama.genres.slice(0, 2).map((genre) => <span className="bg-mint-surface px-1.5 py-1 text-[10px] text-muted" key={genre}>{genre}</span>)}</div>
    </div>
  </motion.a>
}
