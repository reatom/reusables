import { action, atom, reatomEnum } from '@reatom/core'
import { reatomComponent } from '@reatom/react'

import { withBinding } from './bindings'
import { withButton } from './blades'
import { reatomPane, reatomPaneFolder, reatomPaneTab } from './core'
import { hotWrap } from '../hot-wrap/hot-wrap'

// --- Tweakpane with reatomComponent ---
// Atoms are auto-subscribed when read in render
// Actions use hotWrap for subscription + event handler wrapping

const settingsPane = reatomPane({ name: 'settings', title: 'Settings' })

const speed = atom(1.0, 'speed').extend(
  withBinding({ label: 'Speed', min: 0, max: 10, step: 0.1 }, settingsPane),
)

const enabled = atom(true, 'enabled').extend(
  withBinding({ label: 'Enabled' }, settingsPane),
)

const position = atom({ x: 0, y: 0 }, 'position').extend(
  withBinding({ label: 'Position' }, settingsPane),
)

const mode = reatomEnum(['idle', 'running', 'paused'], 'mode').extend(
  withBinding({ label: 'Mode' }, settingsPane),
)

const resetAction = action(() => {
  speed.set(1.0)
  enabled.set(true)
  position.set({ x: 0, y: 0 })
  mode.reset()
}, 'reset').extend(withButton({ title: 'Reset All' }, settingsPane))

export const SettingsPanel = reatomComponent(() => {
  // Reading atoms auto-subscribes them → Tweakpane bindings activate
  const currentSpeed = speed()
  const isEnabled = enabled()
  const pos = position()
  const currentMode = mode()

  return (
    <div>
      <p>Speed: {currentSpeed} </p>
      <p> Enabled: {isEnabled ? 'Yes' : 'No'} </p>
      <p>
        Position: {pos.x}, {pos.y}
      </p>
      <p>Mode: {currentMode}</p>
      {/* hotWrap for actions: subscribes (creates button) + wraps for onClick */}
      <button onClick={hotWrap(resetAction)}> Reset </button>
    </div>
  )
}, 'SettingsPanel')

// --- Folders example ---

const transformFolder = reatomPaneFolder({ title: 'Transform' }, settingsPane)

const scale = atom(1.0, 'scale').extend(
  withBinding({ label: 'Scale', min: 0.1, max: 5 }, transformFolder),
)

const rotation = atom(0, 'rotation').extend(
  withBinding({ label: 'Rotation', min: 0, max: 360 }, transformFolder),
)

export const TransformPanel = reatomComponent(() => {
  return (
    <div>
      <p>Scale: {scale()} </p>
      <p> Rotation: {rotation()}°</p>
    </div>
  )
}, 'TransformPanel')

// --- Tabs example ---

const tabsPane = reatomPane({ name: 'tabs-demo', title: 'Demo' })
const tabs = reatomPaneTab(['General', 'Advanced', 'Debug'], tabsPane)

const volume = atom(0.8, 'volume').extend(
  withBinding({ label: 'Volume', min: 0, max: 1 }, tabs.pages[0]),
)

const debugMode = atom(false, 'debugMode').extend(
  withBinding({ label: 'Debug' }, tabs.pages[2]),
)

export const TabsPanel = reatomComponent(() => {
  return (
    <div>
      <p>Volume: {Math.round(volume() * 100)}% </p>
      <p> Debug: {debugMode() ? 'On' : 'Off'} </p>
    </div>
  )
}, 'TabsPanel')
