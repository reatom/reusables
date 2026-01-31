import { type AtomLike } from '@reatom/core'
import type { BaseInputParams } from '@tweakpane/core'
import type { FpsGraphBladeApi } from '@tweakpane/plugin-essentials/dist/types/fps-graph/api/fps-graph'
import type { BaseBladeParams } from 'tweakpane'

import { withBinding } from './bindings'
import { withBlade } from './blades'
import { type BladeRackApi, reatomDisposable } from './core'

/** Configuration for radio grid binding. */
export type RadioGridParams<T> = {
  groupName: string
  size: [number, number]
  cells: (x: number, y: number) => { title: string; value: T }
  label: string
} & BaseInputParams

/**
 * Creates a 2D grid of radio buttons.
 *
 * @param params - Grid configuration (group name, size, cells, etc.)
 * @param parent - Parent blade rack
 */
export const withRadioGrid = <T>(
  params: RadioGridParams<T>,
  parent: AtomLike<BladeRackApi>,
) => withBinding<T>({ view: 'radiogrid', ...params }, parent)

/** Configuration for button grid blade. */
export type ButtonGridParams = {
  size: [number, number]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cells: (x: number, y: number) => { title: string; [key: string]: any }
  label: string
} & BaseBladeParams

/**
 * Creates a 2D grid of buttons.
 *
 * @param params - Grid configuration
 * @param parent - Parent blade rack
 */
export const withButtonGrid = (
  params: ButtonGridParams,
  parent: AtomLike<BladeRackApi>,
) => withBlade({ view: 'buttongrid', ...params }, parent)

/** Configuration for cubic bezier blade. */
export type CubicBezierParams = {
  expanded?: boolean
  picker?: 'inline' | 'popup'
  label?: string
} & BaseBladeParams

/**
 * Creates a cubic bezier curve editor.
 *
 * @param params - Editor configuration
 * @param parent - Parent blade rack
 */
export const withCubicBezier = (
  params: CubicBezierParams,
  parent: AtomLike<BladeRackApi>,
) => withBlade({ view: 'cubicbezier', ...params, value: [0, 0, 1, 1] }, parent)

/** Configuration for FPS graph blade. */
export type FpsGraphParams = {
  rows?: number
  max?: number
  min?: number
  interval?: number
  label?: string
} & BaseBladeParams

/**
 * Creates a performance monitoring graph.
 *
 * @example
 *   const pane = reatomPane({ name: 'debug' })
 *   const fpsGraph = reatomFpsGraph({ label: 'FPS', interval: 500 }, pane)
 *   // In render loop:
 *   fpsGraph().begin()
 *   // ... render ...
 *   fpsGraph().end()
 *
 * @param params - Graph configuration
 * @param parent - Parent blade rack
 */
export const reatomFpsGraph = (
  params: FpsGraphParams,
  parent: AtomLike<BladeRackApi>,
) =>
  reatomDisposable(
    () =>
      parent().addBlade({
        view: 'fpsgraph',
        ...params,
      }) as unknown as FpsGraphBladeApi,
    `${parent.name}.fpsGraph`,
  )
