import { useCallback, useState } from 'react'
import { LoginView } from './modules/auth/components/LoginView'
import type { GoogleProfile } from './modules/auth/types/auth'
import { Dashboard } from './modules/dramas/components/Dashboard'
import { Brand } from './shared/components/Brand'

/** Renders the navigation shown before a user signs in. */
const PublicHeader = () => (
  <header className="flex h-[70px] items-center justify-between border-b border-mint-line bg-paper px-5 md:h-[82px] md:px-[5vw]">
    <Brand />
    <span className="hidden font-utility text-[10px] uppercase tracking-[.11em] text-muted sm:block">K-drama, curated</span>
  </header>
)

/** Coordinates authentication and the signed-in workspace. */
const App = () => {
  const [profile, setProfile] = useState<GoogleProfile | null>(null)
  /** Starts the in-memory session after GIS supplies a basic profile. */
  const handleSignIn = useCallback((nextProfile: GoogleProfile) => setProfile(nextProfile), [])
  /** Ends the in-memory session without deleting stored user preferences. */
  const logout = () => {
    window.google?.accounts.id.disableAutoSelect()
    setProfile(null)
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-[1320px] border-x border-mint-line bg-paper">
      {profile ? <Dashboard profile={profile} onLogout={logout} /> : <><PublicHeader /><LoginView onSignIn={handleSignIn} /></>}
    </div>
  )
}

export default App
