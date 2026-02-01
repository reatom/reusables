import { reatomForm } from '@reatom/core'

import { withFormAutoFocusOnError } from './with-form-auto-focus-on-error'

const form = reatomForm(
  {
    name: {
      initState: '',
      validate: ({ value }) => (!value ? 'Required' : ''),
    },
    email: {
      initState: '',
      validate: ({ value }) => (!value ? 'Required' : ''),
    },
  },
  {
    onSubmit: async (state) => {
      console.log('Submitted', state)
    },
  },
).extend(withFormAutoFocusOnError())

// Example: attach element refs to drive focus on error
const nameInput = { focus: () => console.log('focus name') }
const emailInput = { focus: () => console.log('focus email') }

form.fields.name.elementRef.set(nameInput)
form.fields.email.elementRef.set(emailInput)

// Trigger submit (will reject and focus name)
form.submit().catch(() => {})
