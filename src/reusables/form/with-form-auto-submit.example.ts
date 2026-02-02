import { reatomForm, effect } from '@reatom/core'

import { withFormAutoSubmit } from './with-form-auto-submit'

// Auto-submit when the user stops typing for 400ms.
const profileForm = reatomForm(
  { name: '', email: '' },
  {
    onSubmit: async (state) => {
      console.log('Submitting', state)
    },
  },
).extend(withFormAutoSubmit({ debounceMs: 400 }))

effect(() => {
  console.log('Dirty:', profileForm.focus().dirty)
})

// Simulate user input
profileForm.fields.name.change('Ada')
profileForm.fields.email.change('ada@example.com')
