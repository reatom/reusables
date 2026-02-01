import { action, atom } from '@reatom/core'
import { describe, test, beforeEach, afterEach, expect } from '../test/test'

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
    expect(paneInstance.children).toEqual([])
  })

  test('pane element is in the DOM', () => {
    const pane = reatomPane({ name: 'test', container })
    hotWrap(pane)
    const paneInstance = pane()
    expect(paneInstance.element).toBeInTheDocument()
    expect(paneInstance.element.parentElement).toBe(container)
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

  test('folder element is in the DOM', () => {
    const pane = reatomPane({ name: 'main', container })
    const folder = reatomPaneFolder({ title: 'Settings' }, pane)

    hotWrap(pane)
    hotWrap(folder)
    const folderInstance = folder()
    expect(folderInstance.element).toBeInTheDocument()
    expect(folderInstance.element.parentElement).toBeDefined()
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

  test('tab element is in the DOM', () => {
    const pane = reatomPane({ name: 'main', container })
    const tabs = reatomPaneTab(['General', 'Advanced'], pane)

    hotWrap(pane)
    hotWrap(tabs)
    const tabsInstance = tabs()
    expect(tabsInstance.element).toBeInTheDocument()
    expect(tabsInstance.element.parentElement).toBeDefined()
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

  test('binding control is in the DOM', () => {
    const pane = reatomPane({ name: 'test', container })
    const value = atom(0.5, 'value').extend(
      withBinding({ label: 'Value' }, pane),
    )

    hotWrap(pane)
    hotWrap(value.binding)
    const bindingInstance = value.binding()
    expect(bindingInstance.element).toBeInTheDocument()
    expect(bindingInstance.element.parentElement).toBeDefined()
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

  test('button element is in the DOM', () => {
    const pane = reatomPane({ name: 'test', container })
    const doThing = action(() => {}, 'doThing').extend(
      withButton({ title: 'Do Thing' }, pane),
    )

    hotWrap(pane)
    hotWrap(doThing.button)
    const buttonInstance = doThing.button()
    expect(buttonInstance.element).toBeInTheDocument()
    expect(buttonInstance.element.parentElement).toBeDefined()
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

describe('reatomPaneSeparator', () => {
  test('creates separator with correct name', () => {
    const pane = reatomPane({ name: 'test', container })
    const separator = reatomPaneSeparator({}, pane)

    expect(separator.name).toBe('tweakpane.pane.test.separator')
  })

  test('separator creates blade when subscribed', () => {
    const pane = reatomPane({ name: 'test', container })
    const separator = reatomPaneSeparator({}, pane)

    hotWrap(pane)
    hotWrap(separator)
    expect(separator()).toBeDefined()
    expect(separator().dispose).toBeDefined()
  })

  test('separator element is in the DOM', () => {
    const pane = reatomPane({ name: 'test', container })
    const separator = reatomPaneSeparator({}, pane)

    hotWrap(pane)
    hotWrap(separator)
    const separatorInstance = separator()
    expect(separatorInstance.element).toBeInTheDocument()
    expect(separatorInstance.element.parentElement).toBeDefined()
  })
})

describe('withBlade', () => {
  test('extends atom with blade property', () => {
    const pane = reatomPane({ name: 'test', container })
    const value = atom(50, 'value').extend(
      withBlade({ view: 'slider', min: 0, max: 100 }, pane),
    )

    expect(value.blade).toBeDefined()
    expect(value.blade.name).toBe('tweakpane.pane.test.value.blade')
  })

  test('blade creates control when subscribed', () => {
    const pane = reatomPane({ name: 'test', container })
    const value = atom(50, 'value').extend(
      withBlade({ view: 'slider', min: 0, max: 100 }, pane),
    )

    hotWrap(value)
    expect(pane()).toBeDefined()
    expect(value.blade()).toBeDefined()
  })

  test('blade element is in the DOM', () => {
    const pane = reatomPane({ name: 'test', container })
    const value = atom(50, 'value').extend(
      withBlade({ view: 'slider', min: 0, max: 100 }, pane),
    )

    hotWrap(pane)
    hotWrap(value.blade)
    const bladeInstance = value.blade()
    expect(bladeInstance.element).toBeInTheDocument()
    expect(bladeInstance.element.parentElement).toBeDefined()
  })

  test('extends action with blade property', () => {
    const pane = reatomPane({ name: 'test', container })
    const doAction = action(() => {}, 'doAction').extend(
      withBlade({ view: 'button', title: 'Click' }, pane),
    )

    expect(doAction.blade).toBeDefined()
    expect(doAction.blade.name).toBe('tweakpane.pane.test.doAction.blade')
  })
})
