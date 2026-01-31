import { atom, effect, withComputed } from '@reatom/core'

import { reatomInstance } from './reatom-instance'
import { withInstance } from './with-instance'

// --- Derive an instance from an atom ---

const config = atom({ width: 800, height: 600 }, 'config').extend(
  withInstance(
    (target) => {
      const { width, height } = target()
      const el = document.createElement('canvas')
      el.width = width
      el.height = height
      return el
    },
    (el) => el.remove(),
  ),
)

// Access the managed canvas via config.instance
effect(() => {
  document.body.appendChild(config.instance())
})

// --- Composing instances ---

const resolution = atom({ w: 1920, h: 1080 }, 'resolution').extend(
  withInstance(
    (res) => {
      const c = document.createElement('canvas')
      c.width = res().w
      c.height = res().h
      return c
    },
    (c) => c.remove(),
  ),
)

const renderer = reatomInstance(
  () => resolution.instance().getContext('2d')!,
).extend(
  withComputed((ctx) => {
    ctx.fillStyle = '#333'
    ctx.fillRect(
      0,
      0,
      resolution.instance().width,
      resolution.instance().height,
    )
    return ctx
  }),
)

// Subscribe to activate the chain
void renderer.subscribe(() => {})
