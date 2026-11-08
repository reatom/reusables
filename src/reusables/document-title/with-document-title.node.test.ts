import { assert, atom, computed } from '@reatom/core'
import { describe, expect, test } from 'test'

import { withDocumentTitle } from './with-document-title'

describe('withDocumentTitle', () => {
  assert(
    typeof document === 'undefined',
    'This test should run in a Node environment',
  )

  test('does not crash without document (SSR)', () => {
    const label = atom('Home', 'label')
    const title = computed(() => `${label()} | App`, 'title').extend(
      withDocumentTitle(),
    )

    const unsub = title.subscribe(() => {})
    label.set('Settings')

    expect(title()).toBe('Settings | App')
    unsub()
  })
})
