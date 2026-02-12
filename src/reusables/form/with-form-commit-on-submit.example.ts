import { reatomForm } from '@reatom/core'

import { withFormCommitOnSubmit } from './with-form-commit-on-submit'

const settingsForm = reatomForm(
  { name: '', email: '' },
  {
    onSubmit: async (state) => {
      console.log('Saved', state)
    },
  },
).extend(withFormCommitOnSubmit())

// Edit and submit
settingsForm.fields.name.change('Ada')
console.log('dirty before submit:', settingsForm.focus().dirty) // true

settingsForm.submit().then(() => {
  console.log('dirty after submit:', settingsForm.focus().dirty) // false
  console.log('current state:', settingsForm()) // { name: 'Ada', email: '' }
})
