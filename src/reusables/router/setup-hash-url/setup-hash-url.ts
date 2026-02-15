import { onEvent, urlAtom } from '@reatom/core'

/**
 * Converts the current `window.location.hash` into a full URL object. Strips
 * the leading `#/` from the hash and joins with `window.origin`.
 *
 * @example
 *   // window.location.hash === '#/users/123'
 *   hashToUrl() // URL { pathname: '/users/123', ... }
 */
export const hashToUrl = () =>
  new URL([window.origin, window.location.hash.replace(/^#\//, '')].join('/'))

/**
 * Converts a pathname to a hash-prefixed string.
 *
 * @example
 *   pathToHash('/users/123') // '#/users/123'
 */
export const pathToHash = (path: string) => `#${path}`

/**
 * Configures `urlAtom` for hash-based routing (`#/path` instead of History
 * API). Sets the initial value from the hash, subscribes to `hashchange`, and
 * overrides sync to write hash URLs.
 *
 * Call once at app initialization before any routing runs.
 *
 * @see https://dev.to/guria/reatom-extensibility-saves-the-day-595e
 */
export const setupHashUrl = () => {
  urlAtom.syncFromSource(hashToUrl(), true)

  onEvent(window, 'hashchange', () => urlAtom.syncFromSource(hashToUrl(), true))

  urlAtom.sync.set(() => (url, replace) => {
    const path = url.href.replace(window.origin, '')
    if (replace) {
      history.replaceState({}, '', pathToHash(path))
    } else {
      history.pushState({}, '', pathToHash(path))
    }
  })
}
