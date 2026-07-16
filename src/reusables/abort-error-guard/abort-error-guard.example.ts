import { beforeEach } from 'vitest'

import { installAbortErrorGuard } from './abort-error-guard'

const abortErrors = installAbortErrorGuard()

beforeEach(() => {
  abortErrors.clear()

  return () => {
    const errors = abortErrors.drain()
    if (errors.length > 0) {
      throw new Error(
        `Reatom AbortErrors detected during test:\n${abortErrors.format(errors)}`,
      )
    }
  }
})
