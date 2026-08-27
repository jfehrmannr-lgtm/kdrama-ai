export const PROFILE_STORAGE_PREFIX = 'kdrama-profile:'
export const PREFERENCES_STORAGE_PREFIX = 'kdrama-preferences:'

/**
 * Builds the isolated localStorage key for a Google profile.
 * @param sub Stable Google subject identifier.
 * @returns The profile storage key.
 */
export const profileStorageKey = (sub: string): string => {
  return `${PROFILE_STORAGE_PREFIX}${sub}`
}

/**
 * Builds the isolated localStorage key for a user's preferences.
 * @param sub Stable Google subject identifier.
 * @returns The preferences storage key.
 */
export const preferencesStorageKey = (sub: string): string => {
  return `${PREFERENCES_STORAGE_PREFIX}${sub}`
}
