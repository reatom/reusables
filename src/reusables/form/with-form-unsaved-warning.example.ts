import { reatomForm } from '@reatom/core'

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

// With callback: integrate with SPA router navigation guards
export const profileForm = reatomForm(
  { bio: '' },
  {
    onSubmit: async (state) => {
      console.log('Saved', state)
    },
  },
).extend(
  withFormUnsavedWarning((dirty) => {
    console.log('Form dirty:', dirty)
    // e.g. router.block(() => 'You have unsaved changes')
  }),
)
