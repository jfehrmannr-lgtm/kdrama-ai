import type { GoogleProfile } from '../../modules/auth/types/auth'
import {
  DEFAULT_PREFERENCES,
  type DramaGenre,
  type UserPreferences,
} from '../../modules/preferences/types/preferences'
import { preferencesStorageKey, profileStorageKey } from '../keys'

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

/** Resolves browser storage while keeping repository functions SSR-safe. */
const getStorage = (storage?: StorageLike): StorageLike | undefined => {
  if (storage) return storage
  return typeof window === 'undefined' ? undefined : window.localStorage
}

/** Reads and parses a stored value, treating malformed data as absent. */
const readJson = <T>(storage: StorageLike | undefined, key: string): T | null => {
  if (!storage) return null
  try {
    const value = storage.getItem(key)
    return value ? (JSON.parse(value) as T) : null
  } catch {
    return null
  }
}

/** Returns the persisted basic profile for one Google subject. */
export const getStoredProfile = (
  sub: string,
  storage?: StorageLike,
): GoogleProfile | null => {
  return readJson<GoogleProfile>(getStorage(storage), profileStorageKey(sub))
}

/** Persists only the basic Google profile, never the sign-in credential. */
export const saveProfile = (profile: GoogleProfile, storage?: StorageLike): void => {
  getStorage(storage)?.setItem(profileStorageKey(profile.sub), JSON.stringify(profile))
}

/** Returns validated preferences for one Google subject or the app defaults. */
export const getStoredPreferences = (
  sub: string,
  storage?: StorageLike,
): UserPreferences => {
  const saved = readJson<Partial<UserPreferences>>(
    getStorage(storage),
    preferencesStorageKey(sub),
  )

  return {
    favoriteGenres: Array.isArray(saved?.favoriteGenres)
      ? saved.favoriteGenres.filter((genre): genre is DramaGenre =>
          DEFAULT_PREFERENCES.favoriteGenres.includes(genre as DramaGenre) ||
          ['Thriller', 'Fantasy', 'Historical', 'Comedy', 'Action'].includes(genre),
        )
      : [...DEFAULT_PREFERENCES.favoriteGenres],
    updatedAt: saved?.updatedAt ?? '',
  }
}

/** Persists a deduplicated genre selection for one Google subject. */
export const savePreferences = (
  sub: string,
  favoriteGenres: DramaGenre[],
  storage?: StorageLike,
): UserPreferences => {
  const preferences: UserPreferences = {
    favoriteGenres: [...new Set(favoriteGenres)],
    updatedAt: new Date().toISOString(),
  }
  getStorage(storage)?.setItem(
    preferencesStorageKey(sub),
    JSON.stringify(preferences),
  )
  return preferences
}

/** Removes all locally persisted data for one Google subject. */
export const clearStoredUser = (sub: string, storage?: StorageLike): void => {
  const target = getStorage(storage)
  target?.removeItem(profileStorageKey(sub))
  target?.removeItem(preferencesStorageKey(sub))
}
