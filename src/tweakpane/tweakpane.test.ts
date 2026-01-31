import { action, atom, context } from '@reatom/core'
import { describe, test, beforeEach, afterEach, expect } from 'vitest'

import {
  reatomPane,
  reatomPaneFolder,
  reatomPaneTab,
  reatomPaneSeparator,
} from './core'
import { withBinding } from './bindings'
import { withButton, withBlade } from './blades'
import { hotWrap } from '../hot-wrap/hot-wrap'

let container: HTMLDivElement

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  context.reset()
  container.remove()
})

describe('reatomPane', () => {
  test('creates a pane with name', () => {
    const pane = reatomPane({ name: 'test', container })
    expect(pane.name).toBe('tweakpane.pane.test')
  })

  test('returns pane instance when subscribed', () => {
    const pane = reatomPane({ name: 'test', container })
    hotWrap(pane)
    const paneInstance = pane()

    expect(paneInstance).toBeDefined()
    expect(paneInstance.registerPlugin).toBeDefined()
    expect(paneInstance.dispose).toBeDefined()
  })

  test('disposes pane on unsubscribe', () => {
    const pane = reatomPane({ name: 'test', container })
    const unsub = pane.subscribe()
    const paneInstance = pane()
    expect(paneInstance).toBeDefined()
    // Unsubscribe should not throw
    expect(() => unsub()).not.toThrow()
  })
})

describe('reatomPaneFolder', () => {
  test('creates folder with title', () => {
    const pane = reatomPane({ name: 'main', container })
    const folder = reatomPaneFolder({ title: 'Settings' }, pane)

    hotWrap(pane)
    expect(folder.name).toBe('tweakpane.pane.main.Settings')
    expect(folder()).toBeDefined()
  })
})

describe('reatomPaneTab', () => {
  test('creates tabs from string array', () => {
    const pane = reatomPane({ name: 'main', container })
    const tabs = reatomPaneTab(['General', 'Advanced'], pane)

    hotWrap(pane)
    expect(tabs.pages).toHaveLength(2)
    expect(tabs()).toBeDefined()
  })
})

describe('withBinding', () => {
  test('extends atom with binding property', () => {
    const pane = reatomPane({ name: 'test', container })
    const value = atom(0.5, 'value').extend(
      withBinding({ label: 'Value' }, pane),
    )

    expect(value.binding).toBeDefined()
    expect(value.binding.name).toBe('tweakpane.pane.test.value.binding')
  })

  test('binding creates control when subscribed', () => {
    const pane = reatomPane({ name: 'test', container })
    const value = atom(0.5, 'value').extend(
      withBinding({ label: 'Value' }, pane),
    )

    hotWrap(value)
    expect(pane()).toBeDefined()
    expect(value.binding()).toBeDefined()
  })

  test('atom value can be retrieved while bound', () => {
    const pane = reatomPane({ name: 'test', container })
    const value = atom(42, 'value').extend(withBinding({ label: 'Num' }, pane))

    hotWrap(value)
    expect(value()).toBe(42)
  })
})

describe('withButton', () => {
  test('extends action with button property', () => {
    const pane = reatomPane({ name: 'test', container })
    const doThing = action(() => {}, 'doThing').extend(
      withButton({ title: 'Do Thing' }, pane),
    )

    expect(doThing.button).toBeDefined()
    expect(doThing.button.name).toBe('tweakpane.pane.test.doThing.button')
  })

  test('button creates control when subscribed', () => {
    const pane = reatomPane({ name: 'test', container })
    const doThing = action(() => {}, 'doThing').extend(
      withButton({ title: 'Do Thing' }, pane),
    )

    hotWrap(doThing.button)
    expect(doThing.button()).toBeDefined()
  })

  test('action can be called while button is subscribed', () => {
    const pane = reatomPane({ name: 'test', container })
    let called = false
    const doThing = action(() => {
      called = true
    }, 'doThing').extend(withButton({ title: 'Click Me' }, pane))

    hotWrap(doThing.button)
    doThing()
    expect(called).toBe(true)
  })
})
