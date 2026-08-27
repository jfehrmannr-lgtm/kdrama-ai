import { describe, expect, it } from 'vitest'
import { decodeGoogleCredential } from './googleIdentity'

describe('Google credential decoding', () => {
  it('extracts only the basic profile fields needed by the frontend', () => {
    const payload = btoa(JSON.stringify({
      sub: 'google-sub',
      name: 'Drama Viewer',
      email: 'viewer@example.com',
      picture: 'https://example.com/avatar.jpg',
      id_token: 'must-not-be-stored',
    })).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')

    expect(decodeGoogleCredential(`header.${payload}.signature`)).toEqual({
      sub: 'google-sub',
      name: 'Drama Viewer',
      email: 'viewer@example.com',
      picture: 'https://example.com/avatar.jpg',
    })
  })

  it('rejects credentials without a subject', () => {
    const payload = btoa(JSON.stringify({ name: 'Viewer', email: 'viewer@example.com' }))

    expect(() => decodeGoogleCredential(`header.${payload}.signature`)).toThrow('missing profile')
  })
})
