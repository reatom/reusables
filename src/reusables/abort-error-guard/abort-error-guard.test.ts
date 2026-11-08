import { action, withAbort, withAsync, wrap } from '@reatom/core'
import { describe, expect, test } from 'test'

import {
  clearAbortErrors,
  drainAbortErrors,
  installAbortErrorGuard,
} from './abort-error-guard'

const createAbortedAction = (name: string, message = 'cancelled') =>
  action(async () => {
    const error = new Error(message)
    error.name = 'AbortError'
    throw error
  }, name).extend(withAbort('manual'), withAsync())

describe('abortErrorGuard', () => {
  test('collects an AbortError from an async action rejection', async () => {
    const guard = installAbortErrorGuard()
    guard.clear()
    const request = createAbortedAction('request')

    await wrap(request()).catch(() => {})

    expect(guard.drain()).toEqual([
      { actionName: 'request.onReject', message: 'cancelled', count: 1 },
    ])
  })

  test('groups identical AbortErrors with a count', async () => {
    installAbortErrorGuard().clear()
    const request = createAbortedAction('request', 'superseded')

    const first = request()
    const second = request()
    await wrap(Promise.all([first.catch(() => {}), second.catch(() => {})]))

    expect(drainAbortErrors()).toEqual([
      { actionName: 'request.onReject', message: 'superseded', count: 2 },
    ])
  })

  test('does not collect non-abort rejections', async () => {
    installAbortErrorGuard().clear()
    const request = action(async () => {
      throw new Error('network error')
    }, 'request').extend(withAsync())

    await wrap(request()).catch(() => {})

    expect(drainAbortErrors()).toEqual([])
  })

  test('drain empties the collector', async () => {
    installAbortErrorGuard().clear()
    const request = createAbortedAction('request')

    await wrap(request()).catch(() => {})

    expect(drainAbortErrors()).toHaveLength(1)
    expect(drainAbortErrors()).toEqual([])
  })

  test('clear empties the collector', async () => {
    installAbortErrorGuard().clear()
    const request = createAbortedAction('request')

    await wrap(request()).catch(() => {})
    clearAbortErrors()

    expect(drainAbortErrors()).toEqual([])
  })

  test('installs only one collector', async () => {
    const first = installAbortErrorGuard()
    const second = installAbortErrorGuard()
    first.clear()
    const request = createAbortedAction('request')

    await wrap(request()).catch(() => {})

    expect(second.drain()).toEqual([
      { actionName: 'request.onReject', message: 'cancelled', count: 1 },
    ])
  })
})
