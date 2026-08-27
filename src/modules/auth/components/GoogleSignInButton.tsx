import { useEffect, useRef, useState } from 'react'
import {
  decodeGoogleCredential,
  loadGoogleIdentityScript,
} from '../services/googleIdentity'
import type { GoogleProfile } from '../types/auth'

interface GoogleSignInButtonProps {
  onSignIn(profile: GoogleProfile): void
}

/** Displays the Google brand mark used by the configuration notice. */
const GoogleMark = () => {
  return <span className="grid size-[25px] shrink-0 place-items-center rounded-full bg-white font-extrabold text-google-blue" aria-hidden="true">G</span>
}

/** Loads and renders the Google Identity Services sign-in control. */
export const GoogleSignInButton = ({ onSignIn }: GoogleSignInButtonProps) => {
  const buttonRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState('')
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined

  useEffect(() => {
    if (!clientId || !buttonRef.current) return
    let active = true

    loadGoogleIdentityScript()
      .then((google) => {
        if (!active || !buttonRef.current) return
        google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            try {
              onSignIn(decodeGoogleCredential(response.credential))
            } catch {
              setError('Google returned an invalid profile. Please try again.')
            }
          },
        })
        buttonRef.current.replaceChildren()
        google.accounts.id.renderButton(buttonRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'pill',
          width: 320,
        })
      })
      .catch(() => setError('Google Sign-In could not be loaded. Check your connection.'))

    return () => {
      active = false
    }
  }, [clientId, onSignIn])

  if (!clientId) {
    return (
      <div className="flex items-center gap-2.5 rounded-md border border-mint-line bg-google-surface p-3 text-xs leading-snug text-muted">
        <GoogleMark />
        <span>Add <code>VITE_GOOGLE_CLIENT_ID</code> to <code>.env.local</code> to enable Google Sign-In.</span>
      </div>
    )
  }

  return (
    <div className="min-h-11">
      <div ref={buttonRef} className="flex min-h-11 justify-center" />
      {error && <p className="mt-2 text-xs text-error-text" role="alert">{error}</p>}
    </div>
  )
}
