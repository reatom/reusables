import { isAction, withMiddleware, type GenericExt } from '@reatom/core'

/** Log entry passed to the logger function. */
export interface LogEntry {
  /** Name of the atom or action. */
  name: string
  /** Parameters passed to the action or setter. */
  params: unknown[]
  /** Result value (new state or action return value). */
  result: unknown
  /** Timestamp of the log entry. */
  timestamp: number
}

/** Logger function type. */
export type LoggerFn = (entry: LogEntry) => void

/** Default console logger. */
export const consoleLogger: LoggerFn = (entry) => {
  console.log(`[${entry.name}]`, entry.params, '->', entry.result)
}

/**
 * Atom/action extension that logs all state changes and action calls.
 *
 * Intercepts updates via middleware and calls the provided logger function with
 * details about each operation.
 *
 * @example
 *   const counter = atom(0, 'counter').extend(withLogger())
 *   counter.set(5) // Logs: [counter] [5] -> 5
 *
 * @example
 *   // Custom logger
 *   const counter = atom(0, 'counter').extend(
 *     withLogger((entry) => {
 *       analytics.track('state_change', entry)
 *     }),
 *   )
 *
 * @param logger - Logger function (defaults to console.log)
 */
export const withLogger = (logger: LoggerFn = consoleLogger): GenericExt =>
  withMiddleware((target) => (next, ...params) => {
    // Just a state reading, do nothing
    if (!isAction(target) && !params.length) return next()

    const result = next(...params)

    logger({
      name: target.name,
      params,
      result,
      timestamp: Date.now(),
    })

    return result
  })
