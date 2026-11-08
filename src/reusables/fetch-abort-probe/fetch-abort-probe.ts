type FetchInput = Parameters<typeof window.fetch>[0]
type FetchSignal = RequestInit['signal']

type Deferred = {
  promise: Promise<void>
  resolve: () => void
}

export type FetchAbortProbe = {
  install: () => void
  restore: () => void
  waitForStart: () => Promise<void>
  waitForAbort: () => Promise<void>
  label: string
}

export type FetchAbortOptions = {
  assertLoading?: () => Promise<unknown>
  timeoutMs?: number
}

const createDeferred = (): Deferred => {
  let resolve: () => void = () => undefined
  const promise = new Promise<void>((done) => {
    resolve = done
  })
  return { promise, resolve }
}

const rejectAfter = (ms: number, message: string) => {
  let timeout: ReturnType<typeof globalThis.setTimeout> | undefined
  const promise = new Promise<never>((_, reject) => {
    timeout = globalThis.setTimeout(() => reject(new Error(message)), ms)
  })

  return {
    clear: () => {
      if (timeout !== undefined) globalThis.clearTimeout(timeout)
    },
    promise,
  }
}

const withTimeout = async <T>(
  promise: Promise<T>,
  ms: number,
  message: string,
) => {
  const timeout = rejectAfter(ms, message)
  try {
    return await Promise.race([promise, timeout.promise])
  } finally {
    timeout.clear()
  }
}

const requestUrl = (input: FetchInput) =>
  typeof input === 'string'
    ? input
    : input instanceof URL
      ? input.toString()
      : input.url

const requestSignal = (input: FetchInput) =>
  input instanceof Request ? input.signal : undefined

/**
 * Creates a browser-test probe for fetch requests that are aborted on cleanup.
 *
 * Call `install` before triggering the request and `restore` during test
 * cleanup. The probe watches matching `window.fetch` calls and their abort
 * signals without changing the wrapped fetch implementation.
 */
export const createFetchAbortProbe = (
  match: string | ((url: string) => boolean),
  label = String(match),
): FetchAbortProbe => {
  const matches =
    typeof match === 'string' ? (url: string) => url.includes(match) : match
  let restoreFetch = () => undefined
  let started = createDeferred()
  let aborted = createDeferred()

  const reset = () => {
    started = createDeferred()
    aborted = createDeferred()
  }

  const watchSignal = (signal: FetchSignal) => {
    if (!signal) return
    if (signal.aborted) aborted.resolve()
    else signal.addEventListener('abort', aborted.resolve, { once: true })
  }

  return {
    label,
    install: () => {
      restoreFetch()
      reset()

      const originalFetch = window.fetch
      window.fetch = ((input, init) => {
        if (matches(requestUrl(input))) {
          started.resolve()
          watchSignal(init?.signal ?? requestSignal(input))
        }
        return originalFetch.call(window, input, init)
      }) satisfies typeof window.fetch

      restoreFetch = () => {
        window.fetch = originalFetch
        restoreFetch = () => undefined
      }
    },
    restore: () => restoreFetch(),
    waitForStart: () => started.promise,
    waitForAbort: () => aborted.promise,
  }
}

/** Returns a setup/cleanup callback for test lifecycle hooks. */
export const fetchAbortLifecycle = (probe: FetchAbortProbe) => () => {
  probe.install()
  return () => probe.restore()
}

/**
 * Asserts that a matching loader request starts, remains loading, and is
 * aborted after navigation away from its route.
 */
export async function expectFetchAbortOnNavigation(
  probe: FetchAbortProbe,
  navigateAway: () => Promise<void>,
  options: FetchAbortOptions = {},
) {
  const timeoutMs = options.timeoutMs ?? 1_000

  await withTimeout(
    probe.waitForStart(),
    timeoutMs,
    `${probe.label} request did not start before navigation`,
  )
  await options.assertLoading?.()
  await navigateAway()
  await withTimeout(
    probe.waitForAbort(),
    timeoutMs,
    `${probe.label} request signal was not aborted after navigation`,
  )
}
