import {
  addGlobalExtension,
  isAbort,
  isAction,
  withCallHook,
} from '@reatom/core'

interface CollectedAbortError {
  actionName: string
  message: string
}

/** An AbortError observed on an async action's `.onReject` lifecycle action. */
export interface DrainAbortError extends CollectedAbortError {
  /** Number of identical errors collected since the last reset. */
  count: number
}

/** Controls the process-wide AbortError collector. */
export interface AbortErrorGuard {
  clear: typeof clearAbortErrors
  drain: typeof drainAbortErrors
  format: typeof formatAbortErrors
}

const collected: CollectedAbortError[] = []
let installed = false

/** Removes all collected AbortErrors without returning them. */
export const clearAbortErrors = () => {
  collected.length = 0
}

/**
 * Returns collected AbortErrors grouped by action name and message, then clears
 * the collector.
 */
export const drainAbortErrors = (): DrainAbortError[] => {
  const grouped = new Map<string, DrainAbortError>()

  for (const error of collected) {
    const key = `${error.actionName}\0${error.message}`
    const existing = grouped.get(key)

    if (existing) existing.count += 1
    else grouped.set(key, { ...error, count: 1 })
  }

  clearAbortErrors()
  return [...grouped.values()]
}

/** Formats drained AbortErrors for a test failure message. */
export const formatAbortErrors = (errors: DrainAbortError[]) =>
  errors
    .map((error) => `  - ${error.actionName}: ${error.message} ×${error.count}`)
    .join('\n')

const recordAbort = (actionName: string, payload: unknown) => {
  const error = (payload as { error?: unknown }).error

  if (isAbort(error)) {
    collected.push({ actionName, message: error.message })
  }
}

/**
 * Starts collecting AbortErrors emitted by `.onReject` lifecycle actions.
 *
 * Registration is process-wide and permanent because `addGlobalExtension`
 * cannot be uninstalled. Calling this function again is safe and does not add
 * another collector.
 */
export const installAbortErrorGuard = (): AbortErrorGuard => {
  if (!installed) {
    installed = true

    addGlobalExtension((target) => {
      if (isAction(target) && target.name.endsWith('.onReject')) {
        target.extend(
          withCallHook((payload) => recordAbort(target.name, payload)),
        )
      }

      return target
    })
  }

  return {
    clear: clearAbortErrors,
    drain: drainAbortErrors,
    format: formatAbortErrors,
  }
}
