import { atom, action, effect } from '@reatom/core'

import { withLogger, type LogEntry } from './with-logger'

// --- Basic usage with default console logger ---

const counter = atom(0, 'counter').extend(withLogger())

counter.set(5) // Logs: [counter] [5] -> 5
counter.set(10) // Logs: [counter] [10] -> 10

// --- Custom logger function ---

const logs: LogEntry[] = []

const customLogger = (entry: LogEntry) => {
  logs.push(entry)
  console.log(`${entry.name} changed to ${entry.result} at ${entry.timestamp}`)
}

const message = atom('', 'message').extend(withLogger(customLogger))

message.set('Hello') // Logs with timestamp
message.set('World')

console.log('All logs:', logs)

// --- Logging actions ---

const greet = action((name: string) => `Hello, ${name}!`, 'greet').extend(
  withLogger(),
)

greet('Reatom') // Logs: [greet] ["Reatom"] -> "Hello, Reatom!"

// --- Analytics integration example ---

const analyticsLogger = (entry: LogEntry) => {
  // Send to analytics service
  // analytics.track('state_change', {
  //   action: entry.name,
  //   params: entry.params,
  //   result: entry.result,
  //   timestamp: entry.timestamp
  // })
  console.log('Analytics:', entry)
}

const settings = atom({ theme: 'light' }, 'settings').extend(
  withLogger(analyticsLogger),
)

settings.set({ theme: 'dark' })

// --- Conditional logging ---

const DEBUG = true // or use import.meta.env.DEV in Vite

const debugLogger = (entry: LogEntry) => {
  if (DEBUG) {
    console.debug(`[DEBUG] ${entry.name}:`, entry.params, '->', entry.result)
  }
}

const config = atom({}, 'config').extend(withLogger(debugLogger))

// --- Composing with other extensions ---

import { withReset } from '../reset/with-reset'

const form = atom({ name: '', email: '' }, 'form')
  .extend(withReset({ name: '', email: '' }))
  .extend(withLogger())

form.set({ name: 'John', email: 'john@example.com' })
form.reset() // Both set and reset are logged
