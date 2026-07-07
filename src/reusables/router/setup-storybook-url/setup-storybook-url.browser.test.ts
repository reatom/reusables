import { atom, urlAtom } from '@reatom/core'
import { describe, test, beforeEach, expect } from 'test'

import { setupStorybookUrl } from './setup-storybook-url'

beforeEach(() => {
  // Reset to a known URL
  window.history.replaceState({}, '', '/')
})

describe('setupStorybookUrl', () => {
  test('returns a context frame', () => {
    const frame = setupStorybookUrl()
    expect(frame).toBeDefined()
    expect(typeof frame.run).toBe('function')
  })

  test('disables sync by setting it to noop', () => {
    const originalHref = window.location.href
    const frame = setupStorybookUrl()

    frame.run(() => {
      // urlAtom.sync should now be noop — calling it should not change the URL
      urlAtom.sync()(new URL('https://example.com/test'))
      expect(window.location.href).toBe(originalHref)
    })
  })

  test('restores original URL after urlAtom changes', () => {
    const originalHref = window.location.href
    const frame = setupStorybookUrl()

    frame.run(() => {
      // Change the routing state
      urlAtom.set(new URL('https://example.com/new-page'))

      // The internal state should reflect the new URL
      expect(urlAtom().pathname).toBe('/new-page')

      // But the browser URL should be restored to original
      expect(window.location.href).toBe(originalHref)
    })
  })

  test('navigates to initialPath', () => {
    const frame = setupStorybookUrl('dashboard')

    frame.run(() => {
      expect(urlAtom().pathname).toBe('/dashboard')
    })
  })

  test('runs beforeNavigate inside the frame before navigation', () => {
    let pathnameDuringSetup: string | undefined

    const frame = setupStorybookUrl('dashboard', () => {
      // Navigation has not happened yet — loaders will see state set here
      pathnameDuringSetup = urlAtom().pathname
    })

    expect(pathnameDuringSetup).toBe('/')
    frame.run(() => {
      expect(urlAtom().pathname).toBe('/dashboard')
    })
  })

  test('state set in beforeNavigate is scoped to the returned frame', () => {
    const marker = atom<string | null>(null, 'marker')

    const frame = setupStorybookUrl('', () => {
      marker.set('from-setup')
    })

    frame.run(() => {
      expect(marker()).toBe('from-setup')
    })
  })
})
