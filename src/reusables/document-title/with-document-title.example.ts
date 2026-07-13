import { atom, computed } from '@reatom/core'

import { withDocumentTitle } from './with-document-title'

// --- Derive a document title from a page label ---

const pageLabel = atom('Home', 'pageLabel')

const documentTitle = computed(
  () => `${pageLabel()} | My App`,
  'documentTitle',
).extend(withDocumentTitle())

// The sync is active only while the atom has subscribers.
// Before subscribing, document.title is untouched.
const unsub = documentTitle.subscribe(() => {})
console.log(document.title) // 'Home | My App'

pageLabel.set('Settings')
console.log(document.title) // 'Settings | My App'

// After unsubscribing, further changes no longer touch document.title.
unsub()
pageLabel.set('Profile')
console.log(document.title) // still 'Settings | My App'
