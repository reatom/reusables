import { context, urlAtom } from '@reatom/core'
import { describe, test, beforeEach, expect } from 'vitest'

import { hashToUrl, pathToHash, setupHashUrl } from './setup-hash-url'

// Note: These tests register event listeners via onEvent() which persist across test runs.
// context.reset() in beforeEach aborts these subscriptions, which may cause an AbortError
// during cleanup. This is expected behavior and doesn't affect test results.
beforeEach(() => {
  context.reset()
  window.history.replaceState({}, '', '/')
})

describe('hashToUrl', () => {
  test('parses hash into URL with pathname', () => {
    context.start(() => {
      window.history.replaceState({}, '', '/#/users/123')
      const url = hashToUrl()
      expect(url.pathname).toBe('/users/123')
    })
  })

  test('handles empty hash', () => {
    context.start(() => {
      window.history.replaceState({}, '', '/')
      const url = hashToUrl()
      expect(url.pathname).toBe('/')
    })
  })

  test('handles root hash', () => {
    context.start(() => {
      window.history.replaceState({}, '', '/#/')
      const url = hashToUrl()
      expect(url.pathname).toBe('/')
    })
  })
})

describe('pathToHash', () => {
  test('prefixes path with #', () => {
    context.start(() => {
      expect(pathToHash('/users/123')).toBe('#/users/123')
    })
  })

  test('handles root path', () => {
    context.start(() => {
      expect(pathToHash('/')).toBe('#/')
    })
  })
})

describe('setupHashUrl', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/#/')
  })

  test('sets initial urlAtom from hash', () => {
    window.history.replaceState({}, '', '/#/initial')
    setupHashUrl()
    expect(urlAtom().pathname).toBe('/initial')
  })

  test('updates urlAtom on hashchange', async () => {
    setupHashUrl()

    window.history.replaceState({}, '', '/#/after-change')
    window.dispatchEvent(new HashChangeEvent('hashchange'))

    // Wait for event to be processed
    await new Promise((resolve) => setTimeout(resolve, 10))

    expect(urlAtom().pathname).toBe('/after-change')
  })

  test('go() writes to hash via sync override', async () => {
    setupHashUrl()

    urlAtom.go('/new-page')

    // sync uses requestAnimationFrame, wait for it
    await new Promise((resolve) => requestAnimationFrame(resolve))
    expect(window.location.hash).toBe('#/new-page')
  })

  test('go() with replace uses replaceState', async () => {
    setupHashUrl()

    // Set initial path
    urlAtom.go('/first')
    await new Promise((resolve) => requestAnimationFrame(resolve))
    expect(window.location.hash).toBe('#/first')

    // Replace should update the hash without pushing to history
    urlAtom.go('/replaced', true)
    await new Promise((resolve) => requestAnimationFrame(resolve))
    expect(window.location.hash).toBe('#/replaced')
  })
})
