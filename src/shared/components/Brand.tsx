interface BrandProps {
  inverse?: boolean
}

/** Renders the application wordmark and home link. */
export const Brand = ({ inverse = false }: BrandProps) => (
  <a
    className={`inline-flex items-center gap-2.5 text-[17px] font-extrabold tracking-[-0.04em] no-underline ${inverse ? 'text-paper' : 'text-ink'}`}
    href="/"
    aria-label="Dramalens home"
  >
    <span className={`grid size-7 place-items-center rounded-full border font-display text-[17px] font-bold tracking-[-0.12em] ${inverse ? 'border-paper' : 'border-ink'}`}>
      d<span className="text-coral">.</span>
    </span>
    <span>dramalens</span>
  </a>
)
