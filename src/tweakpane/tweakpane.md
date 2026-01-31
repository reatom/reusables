# Tweakpane Integration

Reactive bindings for [Tweakpane](https://tweakpane.github.io/docs/) — a compact GUI for fine-tuning values and monitoring data. This integration manages Tweakpane's lifecycle automatically through Reatom's subscription model.

## Installation

This integration requires `tweakpane` and `@tweakpane/plugin-essentials`:

```bash
npm install tweakpane @tweakpane/plugin-essentials
```

## Core Concepts

All Tweakpane resources (panes, folders, bindings) are wrapped in computed atoms that:

- Create the resource only when subscribed to
- Automatically dispose when unsubscribed
- Support reactive updates

## API Reference

### `reatomPane(params)`

Creates a reactive Tweakpane instance.

```ts
import { reatomPane } from 'reusables/reatom/tweakpane'

const pane = reatomPane({ name: 'settings', title: 'Settings' })

// Activate by subscribing
pane.subscribe()
```

### `reatomPaneFolder(params, parent)`

Creates a collapsible folder inside a pane.

```ts
const folder = reatomPaneFolder({ title: 'Transform' }, pane)
```

### `reatomPaneTab(pages, parent)`

Creates a tabbed interface.

```ts
const tabs = reatomPaneTab(['General', 'Advanced'], pane)
// Access pages
const generalPage = tabs.pages[0]
```

### `withBinding(params, parent)`

Extension that creates a two-way binding between an atom and a Tweakpane control.

```ts
import { atom } from '@reatom/core'
import { withBinding } from 'reusables/reatom/tweakpane'

const speed = atom(1.0, 'speed').extend(
  withBinding({ label: 'Speed', min: 0, max: 10 }, pane),
)

// Subscribe to activate the binding
speed.subscribe((v) => console.log('Speed:', v))
```

**Automatic view detection**: Tweakpane automatically chooses the appropriate control based on the initial value:

| Value Type             | Control       |
| ---------------------- | ------------- |
| `number`               | Slider/Number |
| `boolean`              | Checkbox      |
| `string`               | Text input    |
| `#rrggbb`              | Color picker  |
| `{ x, y }` / `{x,y,z}` | Point editor  |
| `enumAtom`             | Dropdown      |

### `withButton(params, parent)`

Extension that triggers an action from a button.

```ts
import { action, effect, getCalls } from '@reatom/core'
import { withButton } from 'reusables/reatom/tweakpane'

const reset = action(() => {
  // reset logic
}, 'reset').extend(withButton({ title: 'Reset' }, pane))

// Must subscribe to activate
effect(() => getCalls(reset))
```

### `reatomFpsGraph(params, parent)`

Creates an FPS monitoring graph.

```ts
import { reatomFpsGraph } from 'reusables/reatom/tweakpane'

const fps = reatomFpsGraph({ label: 'FPS' }, pane)
fps.subscribe()

function render() {
  fps().begin()
  // ... render ...
  fps().end()
  requestAnimationFrame(render)
}
```

## Complete Example

```ts
import { action, atom, effect, enumAtom, getCalls } from '@reatom/core'
import {
  reatomPane,
  reatomPaneFolder,
  withBinding,
  withButton,
} from 'reusables/reatom/tweakpane'

// Create pane
const pane = reatomPane({ name: 'game', title: 'Game Settings' })

// Basic values
const speed = atom(1.0, 'speed').extend(
  withBinding({ label: 'Speed', min: 0, max: 10 }, pane),
)

const color = atom('#ff0000', 'color').extend(
  withBinding({ label: 'Color' }, pane),
)

const difficulty = enumAtom(['easy', 'medium', 'hard'], 'difficulty').extend(
  withBinding({ label: 'Difficulty' }, pane),
)

// Folder for transforms
const transform = reatomPaneFolder({ title: 'Transform' }, pane)

const position = atom({ x: 0, y: 0 }, 'position').extend(
  withBinding({ label: 'Position' }, transform),
)

const scale = atom(1.0, 'scale').extend(
  withBinding({ label: 'Scale', min: 0.1, max: 5 }, transform),
)

// Reset button
const reset = action(() => {
  speed.set(1.0)
  position.set({ x: 0, y: 0 })
  scale.set(1.0)
}, 'reset').extend(withButton({ title: 'Reset All' }, pane))

// Activate everything
speed.subscribe()
color.subscribe()
difficulty.subscribe()
position.subscribe()
scale.subscribe()
effect(() => getCalls(reset))
```

## Lifecycle Management

Resources are automatically disposed when their atoms are unsubscribed:

```ts
const pane = reatomPane({ name: 'temp' })
const unsub = pane.subscribe()

// Later: disposes the pane and all its children
unsub()
```

This integrates seamlessly with Reatom's `effect` for component-scoped GUIs.
