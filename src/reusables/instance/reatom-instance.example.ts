import { atom } from '@reatom/core'

import { reatomInstance } from './reatom-instance'

// --- Manage an imperative resource lifecycle ---

// Create a canvas rendering context that auto-disposes
const canvas = reatomInstance(
  () => {
    const el = document.createElement('canvas')
    document.body.appendChild(el)
    return el.getContext('2d')!
  },
  (ctx) => ctx.canvas.remove(),
  'canvas',
)

// The context is created lazily on first subscribe
const unsub = canvas.subscribe((ctx) => {
  ctx.fillStyle = 'steelblue'
  ctx.fillRect(0, 0, 100, 100)
})
// Unsubscribing removes the canvas from the DOM
unsub()

// --- Reactive dependencies: instance recreated on change ---

const url = atom('wss://example.com/feed')

// When `url` changes, the old WebSocket is closed
// and a new one opens with the updated URL.
void reatomInstance(
  () => new WebSocket(url()),
  (ws) => ws.close(),
  'socket',
)
