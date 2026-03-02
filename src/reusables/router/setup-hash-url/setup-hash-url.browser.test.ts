import { sleep, urlAtom, wrap } from '@reatom/core'
import { describe, test, beforeEach, expect } from 'test'

import { hashToUrl, pathToHash, setupHashUrl } from './setup-hash-url'

beforeEach(() => {
  window.history.replaceState({}, '', '/')
})

describe('hashToUrl', () => {
  test('parses hash into URL with pathname', () => {
    window.history.replaceState({}, '', '/#/users/123')
    const url = hashToUrl()
    expect(url.pathname).toBe('/users/123')
  })

  test('handles empty hash', () => {
    window.history.replaceState({}, '', '/')
    const url = hashToUrl()
    expect(url.pathname).toBe('/')
  })

  test('handles root hash', () => {
    window.history.replaceState({}, '', '/#/')
    const url = hashToUrl()
    expect(url.pathname).toBe('/')
  })
})

describe('pathToHash', () => {
  test('prefixes path with #', () => {
    expect(pathToHash('/users/123')).toBe('#/users/123')
  })

  test('handles root path', () => {
    expect(pathToHash('/')).toBe('#/')
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

    await wrap(sleep())

    expect(urlAtom().pathname).toBe('/after-change')
  })

  test('go() writes to hash via sync override', async () => {
    setupHashUrl()

    urlAtom.go('/new-page')

    await wrap(sleep())
    expect(window.location.hash).toBe('#/new-page')
  })

  test('go() with replace uses replaceState', async () => {
    setupHashUrl()

    // Set initial path
    urlAtom.go('/first')
    await wrap(sleep())
    expect(window.location.hash).toBe('#/first')

    // Replace should update the hash without pushing to history
    urlAtom.go('/replaced', true)
    await wrap(sleep())
    expect(window.location.hash).toBe('#/replaced')
  })
})
