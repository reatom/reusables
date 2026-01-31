import { atom, effect } from '@reatom/core'

import { withHistory } from './with-history'

// --- Basic counter with undo capability ---

const counter = atom(0, 'counter').extend(withHistory(10))

// Subscribe to activate the computed
const unsub = counter.history.subscribe(() => {})

counter.set(1)
console.log(counter.history()) // [1, 0]

counter.set(2)
console.log(counter.history()) // [2, 1, 0]

counter.set(3)
console.log(counter.history()) // [3, 2, 1, 0]

// Simple undo: restore previous state
const undo = () => {
  const [_current, previous] = counter.history()
  if (previous !== undefined) {
    counter.set(previous)
  }
}

undo()
console.log(counter()) // 2

unsub()

// --- Form state with history for undo/redo ---

interface FormState {
  username: string
  email: string
}

const formState = atom<FormState>(
  { username: '', email: '' },
  'formState',
).extend(withHistory(20))

effect(() => {
  const history = formState.history()
  console.log(`History length: ${history.length}`)
})

formState.set({ username: 'john', email: '' })
formState.set({ username: 'john', email: 'john@example.com' })

// Access previous states for undo functionality
const [current, ...past] = formState.history()
console.log('Current:', current)
console.log('Previous states:', past)

// --- Tracking value changes over time ---

const temperature = atom(20, 'temperature').extend(withHistory(5))

effect(() => {
  const [current, ...previous] = temperature.history()
  const avg =
    [current, ...previous].reduce((a, b) => a + b, 0) / (previous.length + 1)
  console.log(`Current: ${current}°C, Average: ${avg.toFixed(1)}°C`)
})

temperature.set(22)
temperature.set(19)
temperature.set(23)
temperature.set(21)
