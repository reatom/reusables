import { assert } from '@reatom/core'
import { beforeEach, afterEach, describe, expect, test, vi } from 'test'

import { reatomThemePreference } from './reatom-theme-preference'

describe('reatomThemePreference', () => {
  assert(typeof window !== 'undefined', 'Test requires a browser environment')

  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  /** Stubs `window.matchMedia` to return a controlled `matches` value. */
  const stubMatchMedia = (matches: boolean) => {
    const mql = {
      matches,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => mql),
    )
    return mql
  }

  test('defaults to "system"', () => {
    stubMatchMedia(false)

    const theme = reatomThemePreference()

    expect(theme()).toBe('system')
  })

  test('persists an explicit preference to localStorage under the configured key', () => {
    stubMatchMedia(false)

    const theme = reatomThemePreference({ key: 'theme' })

    theme.set('dark')

    const stored = JSON.parse(localStorage.getItem('theme')!) as {
      data: unknown
    }
    expect(stored.data).toBe('dark')
  })

  test('respects a custom storage key', () => {
    stubMatchMedia(false)

    const theme = reatomThemePreference({ key: 'app-theme' })

    theme.set('light')

    expect(localStorage.getItem('theme')).toBeNull()
    const stored = JSON.parse(localStorage.getItem('app-theme')!) as {
      data: unknown
    }
    expect(stored.data).toBe('light')
  })

  test('coerces a garbage persisted value back to "system"', () => {
    stubMatchMedia(false)

    localStorage.setItem(
      'theme',
      JSON.stringify({
        data: 'purple',
        id: 1,
        timestamp: Date.now(),
        version: 0,
        to: Date.now() + 1e8,
      }),
    )

    const theme = reatomThemePreference()

    expect(theme()).toBe('system')
  })

  test('resolved returns the explicit preference', () => {
    stubMatchMedia(false)

    const theme = reatomThemePreference()

    theme.set('dark')
    expect(theme.resolved()).toBe('dark')

    theme.set('light')
    expect(theme.resolved()).toBe('light')
  })

  test('explicit preference overrides the media query', () => {
    // OS reports dark, but the user prefers light explicitly
    stubMatchMedia(true)

    const theme = reatomThemePreference()
    theme.set('light')

    expect(theme.resolved()).toBe('light')
  })

  test('"system" resolves through the media query', () => {
    stubMatchMedia(true)
    const darkOs = reatomThemePreference()
    darkOs.set('system')
    const darkUnsub = darkOs.resolved.subscribe(() => {})
    expect(darkOs.resolved()).toBe('dark')
    darkUnsub()

    stubMatchMedia(false)
    const lightOs = reatomThemePreference()
    lightOs.set('system')
    const lightUnsub = lightOs.resolved.subscribe(() => {})
    expect(lightOs.resolved()).toBe('light')
    lightUnsub()
  })

  test('resolved computed has the expected name', () => {
    stubMatchMedia(false)

    const theme = reatomThemePreference({ name: 'appTheme' })

    expect(theme.resolved.name).toBe('appTheme.resolved')
  })
})
