import { atom, effect } from '@reatom/core'

import { withReset } from './with-reset'

// --- Basic counter with reset ---

const counter = atom(0, 'counter').extend(withReset(0))

counter.set(10)
console.log(counter()) // 10

counter.reset()
console.log(counter()) // 0

// --- Form state with reset ---

interface FormState {
  username: string
  email: string
  agreeToTerms: boolean
}

const initialFormState: FormState = {
  username: '',
  email: '',
  agreeToTerms: false,
}

const formState = atom(initialFormState, 'formState').extend(
  withReset(initialFormState),
)

// Simulate user filling out form
formState.set({
  username: 'johndoe',
  email: 'john@example.com',
  agreeToTerms: true,
})

// Clear form after submission
formState.reset()
console.log(formState()) // { username: '', email: '', agreeToTerms: false }

// --- Composing with other extensions ---

const settings = atom({ theme: 'light', fontSize: 14 }, 'settings').extend(
  withReset({ theme: 'light', fontSize: 14 }),
)

effect(() => {
  console.log('Settings changed:', settings())
})

settings.set({ theme: 'dark', fontSize: 16 })
settings.reset() // Logs: Settings changed: { theme: 'light', fontSize: 14 }
