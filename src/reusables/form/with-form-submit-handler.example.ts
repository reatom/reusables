import { reatomForm } from '@reatom/core'

import { withFormSubmitHandler } from './with-form-submit-handler'

// Silent skip when not dirty
const silentForm = reatomForm(
  { name: '' },
  {
    onSubmit: async (state) => {
      console.log('Submitted', state)
    },
  },
).extend(withFormSubmitHandler({ requireDirty: true }))

silentForm.handleSubmit() // silently skipped (not dirty)

silentForm.fields.name.change('Ada')
silentForm.handleSubmit() // submits (dirty)

// Error when not dirty
const errorForm = reatomForm(
  { name: '' },
  {
    onSubmit: async (state) => {
      console.log('Submitted', state)
    },
  },
).extend(withFormSubmitHandler({ requireDirty: 'No changes to save' }))

errorForm.handleSubmit() // sets form.submit.error
console.log(errorForm.submit.error()?.message) // "No changes to save"

errorForm.fields.name.change('Ada')
errorForm.handleSubmit() // submits (dirty)
