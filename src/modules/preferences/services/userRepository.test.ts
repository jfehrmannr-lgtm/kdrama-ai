import { describe, expect, it } from 'vitest'
import type { GoogleProfile } from '../../auth/types/auth'
import {
  getStoredPreferences,
  getStoredProfile,
  savePreferences,
  saveProfile,
} from '../../../storage/repositories/userRepository'

class MemoryStorage implements Storage {
  private values = new Map<string, string>()

  get length() { return this.values.size }
  clear() { this.values.clear() }
  getItem(key: string) { return this.values.get(key) ?? null }
  key(index: number) { return [...this.values.keys()][index] ?? null }
  removeItem(key: string) { this.values.delete(key) }
  setItem(key: string, value: string) { this.values.set(key, value) }
}

const firstProfile: GoogleProfile = {
  sub: 'google-sub-one',
  name: 'First Viewer',
  email: 'first@example.com',
}

describe('user storage', () => {
  it('keeps profiles and preferences isolated by Google sub', () => {
    const storage = new MemoryStorage()
    saveProfile(firstProfile, storage)
    saveProfile({ ...firstProfile, sub: 'google-sub-two', name: 'Second Viewer' }, storage)
    savePreferences(firstProfile.sub, ['Thriller'], storage)
    savePreferences('google-sub-two', ['Historical', 'Comedy'], storage)

    expect(getStoredProfile(firstProfile.sub, storage)).toEqual(firstProfile)
    expect(getStoredProfile('google-sub-two', storage)?.name).toBe('Second Viewer')
    expect(getStoredPreferences(firstProfile.sub, storage).favoriteGenres).toEqual(['Thriller'])
    expect(getStoredPreferences('google-sub-two', storage).favoriteGenres).toEqual(['Historical', 'Comedy'])
  })

  it('returns safe defaults for missing or malformed preferences', () => {
    const storage = new MemoryStorage()
    storage.setItem('kdrama-preferences-google-sub-one', '{not-json')

    expect(getStoredPreferences(firstProfile.sub, storage).favoriteGenres).toEqual(['Romance', 'Healing'])
  })

  it('writes a fresh update timestamp when preferences change', () => {
    const storage = new MemoryStorage()
    const saved = savePreferences(firstProfile.sub, ['Action', 'Action'], storage)

    expect(saved.favoriteGenres).toEqual(['Action'])
    expect(saved.updatedAt).not.toBe('')
    expect(getStoredPreferences(firstProfile.sub, storage)).toEqual(saved)
  })
})
