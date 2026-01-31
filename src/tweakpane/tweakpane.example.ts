import { action, atom, effect, getCalls, reatomEnum } from '@reatom/core'

import { withBinding } from './bindings'
import { withButton } from './blades'
import { reatomPane, reatomPaneFolder, reatomPaneTab } from './core'
import { reatomFpsGraph } from './essentials'

// --- Basic pane with number binding ---

const settingsPane = reatomPane({ name: 'settings', title: 'Settings' })

const speed = atom(1.0, 'speed').extend(
  withBinding({ label: 'Speed', min: 0, max: 10, step: 0.1 }, settingsPane),
)

// Subscribe to activate the binding
speed.subscribe((value) => {
  console.log('Speed changed:', value)
})

// --- Boolean binding ---

const enabled = atom(true, 'enabled').extend(
  withBinding({ label: 'Enabled' }, settingsPane),
)

enabled.subscribe((value) => {
  console.log('Enabled:', value)
})

// --- String binding ---

const playerName = atom('Player 1', 'playerName').extend(
  withBinding({ label: 'Name' }, settingsPane),
)

playerName.subscribe((value) => {
  console.log('Player name:', value)
})

// --- Color binding (auto-detected from hex string) ---

const accentColor = atom('#ff0000', 'accentColor').extend(
  withBinding({ label: 'Accent Color' }, settingsPane),
)

accentColor.subscribe((value) => {
  document.body.style.setProperty('--accent-color', value)
})

// --- Enum atom (auto-creates dropdown) ---

const difficulty = reatomEnum(['easy', 'medium', 'hard'], 'difficulty').extend(
  withBinding({ label: 'Difficulty' }, settingsPane),
)

difficulty.subscribe((value) => {
  console.log('Difficulty:', value)
})

// --- Point binding (2D coordinates) ---

const position = atom({ x: 0, y: 0 }, 'position').extend(
  withBinding({ label: 'Position' }, settingsPane),
)

position.subscribe((value) => {
  console.log('Position:', value.x, value.y)
})

// --- Button binding for actions ---

const resetAction = action(() => {
  speed.set(1.0)
  enabled.set(true)
  position.set({ x: 0, y: 0 })
  console.log('Settings reset!')
}, 'reset').extend(withButton({ title: 'Reset All' }, settingsPane))

// Must subscribe to activate the button
effect(() => getCalls(resetAction))

// --- Organized with folders ---

const transformFolder = reatomPaneFolder({ title: 'Transform' }, settingsPane)

const scale = atom(1.0, 'scale').extend(
  withBinding({ label: 'Scale', min: 0.1, max: 5 }, transformFolder),
)

const rotation = atom(0, 'rotation').extend(
  withBinding({ label: 'Rotation', min: 0, max: 360 }, transformFolder),
)

scale.subscribe()
rotation.subscribe()

// --- Tabs for grouping ---

const tabsPane = reatomPane({ name: 'tabs-demo', title: 'Demo' })
const tabs = reatomPaneTab(['General', 'Advanced', 'Debug'], tabsPane)

const volume = atom(0.8, 'volume').extend(
  withBinding({ label: 'Volume', min: 0, max: 1 }, tabs.pages[0]),
)

const debugMode = atom(false, 'debugMode').extend(
  withBinding({ label: 'Debug' }, tabs.pages[2]),
)

volume.subscribe()
debugMode.subscribe()

// --- FPS Graph for performance monitoring ---

const debugPane = reatomPane({ name: 'debug', title: 'Debug' })
const fpsGraph = reatomFpsGraph({ label: 'FPS', interval: 500 }, debugPane)

// In your render loop:
function renderLoop() {
  fpsGraph().begin()

  // ... your rendering code ...

  fpsGraph().end()
  requestAnimationFrame(renderLoop)
}

// Start the loop
fpsGraph.subscribe()
renderLoop()
