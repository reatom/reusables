import { assert, atom, computed } from '@reatom/core'
import { afterEach, describe, expect, notify, test } from 'test'

import { withDocumentTitle } from './with-document-title'

describe('withDocumentTitle', () => {
  assert(typeof document !== 'undefined', 'Test requires a browser environment')

  const originalTitle = document.title
  afterEach(() => {
    document.title = originalTitle
  })

  test('sets document.title immediately on subscribe', () => {
    document.title = 'initial'

    const title = computed(() => 'Home', 'title').extend(withDocumentTitle())
    const unsub = title.subscribe(() => {})
    notify()

    expect(document.title).toBe('Home')
    unsub()
  })

  test('does not touch document.title without a subscriber', () => {
    document.title = 'untouched'

    atom('Home', 'title').extend(withDocumentTitle())
    notify()

    expect(document.title).toBe('untouched')
  })

  test('updates document.title when the atom changes', () => {
    const label = atom('Home', 'label')
    const title = computed(() => `${label()} | App`, 'title').extend(
      withDocumentTitle(),
    )
    const unsub = title.subscribe(() => {})
    notify()
    expect(document.title).toBe('Home | App')

    label.set('Settings')
    notify()
    expect(document.title).toBe('Settings | App')

    unsub()
  })

  test('stops updating document.title after unsubscribe', () => {
    const label = atom('Home', 'label')
    const title = computed(() => `${label()} | App`, 'title').extend(
      withDocumentTitle(),
    )
    const unsub = title.subscribe(() => {})
    notify()

    label.set('Settings')
    notify()
    expect(document.title).toBe('Settings | App')

    unsub()
    notify()

    label.set('Profile')
    notify()
    expect(document.title).toBe('Settings | App')
  })
})
