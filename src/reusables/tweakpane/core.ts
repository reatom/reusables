import { type AtomLike, named } from '@reatom/core'
import type {
  BaseParams,
  Controller,
  FolderApi,
  RackApi,
  TabPageApi,
} from '@tweakpane/core'
import * as EssentialsPlugin from '@tweakpane/plugin-essentials'
import { type FolderParams, Pane, type TabParams } from 'tweakpane'

import { reatomInstance } from '../instance/reatom-instance'

/** Types that may work as containers for other blades. */
export type BladeRackApi = FolderApi | RackApi | TabPageApi

/** A disposable resource with a controller. */
export type Disposable = { dispose: () => void; controller: Controller }

/**
 * Create a lazy reactive disposable resource.
 *
 * This helper wraps creation of external resources (Tweakpane instances,
 * folders, tabs, blades, etc.) in a computed atom so the resource is created
 * only when the atom is subscribed to and disposed automatically when the atom
 * is disconnected.
 *
 * @template T Resource type which must provide a `dispose()` method and a
 *   `controller`.
 * @param create Factory that creates and returns the disposable resource.
 * @param name Optional debugging name passed to the underlying computed atom.
 * @returns A computed atom that yields the created resource and manages its
 *   lifecycle.
 */
export const reatomDisposable = <T extends Disposable>(
  create: () => T,
  name: string = named('disposable'),
) =>
  reatomInstance(
    () => create(),
    (disposable) => disposable.dispose(),
    name,
  )

/** Pane configuration options. */
export type PaneConfig = ConstructorParameters<typeof Pane>[0]

/**
 * Creates a reactive Tweakpane instance.
 *
 * This atom manages the lifecycle of the Pane: creating it on connection and
 * disposing it when the atom is no longer subscribed to.
 *
 * @example
 *   const pane = reatomPane({ name: 'settings', title: 'Settings' })
 *   // Subscribe to activate
 *   effect(() => pane())
 *
 * @param params - Configuration options for the Pane
 * @param params.name - Unique debugging name for the atom (required)
 */
export const reatomPane = (params: PaneConfig & { name: string }) =>
  reatomDisposable(() => {
    const pane = new Pane(params)
    pane.registerPlugin(EssentialsPlugin)
    return pane
  }, `tweakpane.pane.${params.name}`)

/**
 * Creates a reactive folder associated with a parent blade rack.
 *
 * @example
 *   const pane = reatomPane({ name: 'main' })
 *   const folder = reatomPaneFolder({ title: 'Transform' }, pane)
 *
 * @param params - Folder configuration (title, expanded, etc.)
 * @param parent - The parent pane or folder atom
 */
export const reatomPaneFolder = (
  params: FolderParams,
  parent: AtomLike<BladeRackApi>,
) =>
  reatomDisposable(
    () => parent().addFolder(params),
    `${parent.name}.${params.title}`,
  )

/**
 * Creates a tab interface with multiple pages.
 *
 * @example
 *   const tabs = reatomPaneTab(['General', 'Advanced'], pane)
 *   // Access pages via the .pages extension
 *   const generalPage = tabs.pages[0]
 *
 * @param params - Tab configuration or simple array of page titles
 * @param parent - The parent pane or folder atom
 */
export const reatomPaneTab = (
  params:
    | string[]
    | (Omit<TabParams, 'pages'> & { pages: string[] | TabParams['pages'] }),
  parent: AtomLike<BladeRackApi>,
) => {
  const normalizedParams: TabParams = Array.isArray(params)
    ? { pages: params.map((title) => ({ title })) }
    : {
        ...params,
        pages: params.pages.map((p) =>
          typeof p === 'string' ? { title: p } : p,
        ),
      }
  return reatomDisposable(
    () => parent().addTab(normalizedParams),
    `${parent.name}.tabs`,
  ).extend((target) => ({
    pages: normalizedParams.pages.map((_, i) =>
      reatomDisposable(() => target().pages[i], `${target.name}.page.${i}`),
    ),
  }))
}

/**
 * Adds a visual separator to organize controls.
 *
 * @param params - Separator configuration
 * @param parent - The parent pane or folder atom
 */
export const reatomPaneSeparator = (
  params: BaseParams,
  parent: AtomLike<BladeRackApi>,
) =>
  reatomDisposable(
    () => parent().addBlade({ view: 'separator', ...params }),
    `${parent.name}.separator`,
  )
