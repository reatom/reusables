import { context, urlAtom } from '@reatom/core'
import { describe, test, beforeEach, expect } from 'vitest'

import { setupStorybookUrl } from './setup-storybook-url'

beforeEach(() => {
  context.reset()
  // Reset to a known URL
  window.history.replaceState({}, '', '/')
})

describe('setupStorybookUrl', () => {
  test('disables sync by setting it to noop', () => {
    const originalHref = window.location.href
    setupStorybookUrl()

    // urlAtom.sync should now be noop — calling it should not change the URL
    urlAtom.sync()(new URL('https://example.com/test'))
    expect(window.location.href).toBe(originalHref)
  })

  test('restores original URL after urlAtom changes', async () => {
    const originalHref = window.location.href
    setupStorybookUrl()

    // Change the routing state
    urlAtom.set(new URL('https://example.com/new-page'))

    // The internal state should reflect the new URL
    expect(urlAtom().pathname).toBe('/new-page')

    // But the browser URL should be restored to original
    expect(window.location.href).toBe(originalHref)
  })
})
