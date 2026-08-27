import type { GoogleProfile } from '../types/auth'

interface GoogleCredentialResponse {
  credential: string
}

interface GoogleButtonOptions {
  type: 'standard'
  theme: 'outline' | 'filled_blue' | 'filled_black'
  size: 'large' | 'medium' | 'small'
  text: 'signin_with' | 'signup_with' | 'continue_with' | 'signin'
  shape: 'rectangular' | 'pill' | 'circle' | 'square'
  width: number
}

interface GoogleIdentityApi {
  accounts: {
    id: {
      initialize(options: {
        client_id: string
        callback(response: GoogleCredentialResponse): void
      }): void
      renderButton(element: HTMLElement, options: GoogleButtonOptions): void
      disableAutoSelect(): void
    }
  }
}

declare global {
  interface Window {
    google?: GoogleIdentityApi
  }
}

const GOOGLE_SCRIPT_ID = 'google-identity-services'

/**
 * Extracts the basic profile claims from a Google credential in memory.
 * @param credential JWT returned by Google Identity Services.
 * @returns The profile fields required by the frontend.
 * @throws When the credential does not contain a usable profile payload.
 */
export const decodeGoogleCredential = (credential: string): GoogleProfile => {
  const payload = credential.split('.')[1]
  if (!payload) throw new Error('Google credential has no profile payload')

  const decoded = JSON.parse(
    decodeURIComponent(
      atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
        .split('')
        .map((character) => `%${`00${character.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(''),
    ),
  ) as Partial<GoogleProfile>

  if (!decoded.sub || !decoded.name || !decoded.email) {
    throw new Error('Google credential is missing profile information')
  }

  return {
    sub: decoded.sub,
    name: decoded.name,
    email: decoded.email,
    picture: decoded.picture,
  }
}

/** Loads the Google Identity Services browser script once. */
export const loadGoogleIdentityScript = (): Promise<GoogleIdentityApi> => {
  if (window.google) return Promise.resolve(window.google)

  return new Promise((resolve, reject) => {
    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID)
    if (existingScript) {
      existingScript.addEventListener('load', () => window.google && resolve(window.google))
      existingScript.addEventListener('error', () => reject(new Error('Google Sign-In failed to load')))
      return
    }

    const script = document.createElement('script')
    script.id = GOOGLE_SCRIPT_ID
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => {
      if (window.google) resolve(window.google)
      else reject(new Error('Google Sign-In is unavailable'))
    }
    script.onerror = () => reject(new Error('Google Sign-In failed to load'))
    document.head.appendChild(script)
  })
}
