import type { GoogleProfile } from '../types/auth'
import { GoogleSignInButton } from './GoogleSignInButton'

interface LoginViewProps {
  onSignIn(profile: GoogleProfile): void
}

/** Renders the unauthenticated landing view and Google sign-in entry point. */
export const LoginView = ({ onSignIn }: LoginViewProps) => (
  <main className="grid min-h-[calc(100vh-82px)] grid-cols-1 bg-paper md:grid-cols-[.9fr_1.1fr]">
    <div
      className="relative min-h-[290px] overflow-hidden bg-ink p-7 text-paper sm:min-h-[360px] md:min-h-[650px] md:p-[clamp(35px,6vw,90px)]"
      aria-hidden="true"
    >
      <div className="absolute -right-[10%] top-[7%] aspect-square w-[370px] rounded-full border border-[rgb(220_231_226/20%)] [transform:rotate(-25deg)] md:w-[min(33vw,420px)]" />
      <div className="absolute right-[4%] top-[20%] aspect-square w-[240px] rounded-full border border-[rgb(233_161_91/60%)] [transform:rotate(-25deg)] md:w-[min(22vw,280px)]" />
      <div className="absolute right-[16%] top-[18%] font-display text-3xl text-amber">+</div>
      <div className="absolute bottom-[29%] right-[28%] font-display text-3xl text-mint">*</div>
      <p className="relative m-0 font-display text-[47px] leading-[.94] tracking-[-.07em] sm:text-[56px] md:text-[clamp(42px,5vw,76px)]">
        stories<br />worth<br /><em className="text-amber">staying up for.</em>
      </p>
      <div className="absolute bottom-[9%] right-[10%] font-utility text-[10px] uppercase tracking-[.18em] text-night-muted">vol. 01 / seoul after dark</div>
    </div>
    <section className="max-w-[510px] self-center px-6 py-12 sm:px-12 md:px-[clamp(28px,7vw,100px)] md:py-[72px]">
      <span className="font-utility text-[10px] font-bold uppercase tracking-[.18em] text-coral">YOUR NEXT OBSESSION</span>
      <h1 className="mb-[22px] mt-5 font-display text-[clamp(42px,5vw,68px)] font-medium leading-[.98] tracking-[-.07em] text-ink">Find the drama<br /><em className="text-coral">that finds you.</em></h1>
      <p className="max-w-[390px] text-[15px] leading-[1.7] text-muted">A quieter way to discover Korean dramas. Tell us what you love and we will make the watchlist feel personal.</p>
      <div className="my-6 mt-11 flex items-center gap-3.5 font-utility text-[10px] uppercase tracking-[.13em] text-muted before:h-px before:flex-1 before:bg-mint-line after:h-px after:flex-1 after:bg-mint-line"><span>first, let us know you</span></div>
      <GoogleSignInButton onSignIn={onSignIn} />
      <p className="mt-6 text-center text-[11px] text-privacy"><span className="mr-1.5 text-coral">&#9671;</span> Your profile and picks stay on this device.</p>
    </section>
  </main>
)
