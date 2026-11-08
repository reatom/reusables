import { effect } from '@reatom/core'

import { reatomThemePreference } from './reatom-theme-preference'

// --- A persisted theme preference that follows the OS by default ---

const theme = reatomThemePreference()

console.log(theme()) // 'system' by default
console.log(theme.resolved()) // 'light' or 'dark', depending on the OS

// Persist an explicit choice — it survives reloads via localStorage
theme.set('dark')
console.log(theme.resolved()) // 'dark' — explicit preference wins

// Back to automatic — `resolved` follows the OS `prefers-color-scheme`
theme.set('system')

// Apply the concrete theme to the DOM reactively
effect(() => {
  const resolved = theme.resolved()
  document.documentElement.classList.toggle('dark', resolved === 'dark')
  document.documentElement.style.colorScheme = resolved
})

// --- Multiple instances with their own storage keys ---

const appTheme = reatomThemePreference({ key: 'app-theme', name: 'appTheme' })

appTheme.set('light')
console.log(appTheme.resolved()) // 'light'
