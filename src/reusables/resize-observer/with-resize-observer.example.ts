import { atom, effect } from '@reatom/core'

import { withResizeObserver } from './with-resize-observer'

// --- Track a DOM element size ---

const panelElement = atom<HTMLElement | null>(null, 'panelElement').extend(
  withResizeObserver(),
)

// In a UI adapter, set the element from a ref callback.
// Wrap the callback if your adapter invokes refs outside the Reatom context:
// <section ref={wrap((node) => panelElement.set(node))} />

const unsub = panelElement.sizeEntry.subscribe((entry) => {
  console.log('Panel width:', entry?.contentRect.width)
  console.log('Panel height:', entry?.contentRect.height)
})

// --- Derive measurements from the latest ResizeObserverEntry ---

effect(() => {
  const rect = panelElement.sizeEntry()?.contentRect

  if (!rect) {
    console.log('Panel is not measured yet')
    return
  }

  console.log(
    `Panel size: ${Math.round(rect.width)}×${Math.round(rect.height)}`,
  )
})

unsub()
