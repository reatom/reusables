import { reatomForm, withCallHook } from '@reatom/core'

import { withFormUnsavedWarning } from './with-form-unsaved-warning'

// Basic: browser "Leave site?" dialog when form is dirty
export const settingsForm = reatomForm(
  { name: '', email: '' },
  {
    onSubmit: async (state) => {
      console.log('Saved', state)
    },
  },
).extend(withFormUnsavedWarning())

// With custom predicate: only warn for specific fields
export const profileForm = reatomForm(
  { bio: '', avatar: '' },
  {
    onSubmit: async (state) => {
      console.log('Saved', state)
    },
  },
).extend(withFormUnsavedWarning((form) => form.fields.bio.focus().dirty))

// Hook into preventNavigation for SPA router integration
profileForm.preventNavigation.extend(
  withCallHook(() => {
    console.log('Navigation prevented — form has unsaved changes')
    // e.g. router.block(() => 'You have unsaved changes')
  }),
)
