import { reatomForm } from '@reatom/core'

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

// Call in reatomFactoryComponent or a route loader:
profileForm.waitAutoSubmit()
