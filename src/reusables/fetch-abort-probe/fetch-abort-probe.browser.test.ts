import { afterEach, describe, expect, test, vi } from 'test'

import { createFetchAbortProbe } from './fetch-abort-probe'

const nativeFetch = window.fetch

const pendingFetch = () => new Promise<Response>(() => {})

describe('createFetchAbortProbe', () => {
  afterEach(() => {
    window.fetch = nativeFetch
  })

  test('observes matching requests and their abort signals', async () => {
    const fetchStub = vi.fn(pendingFetch)
    window.fetch = fetchStub as typeof window.fetch
    const probe = createFetchAbortProbe('/api/users')
    const controller = new AbortController()

    probe.install()
    void window.fetch('https://example.test/api/users/42', {
      signal: controller.signal,
    })

    await probe.waitForStart()
    controller.abort()
    await probe.waitForAbort()

    expect(fetchStub).toHaveBeenCalledOnce()
    probe.restore()
  })

  test('ignores non-matching requests', async () => {
    window.fetch = vi.fn(pendingFetch) as typeof window.fetch
    const probe = createFetchAbortProbe('/api/users')

    probe.install()
    void window.fetch('https://example.test/api/projects')

    await expect(
      Promise.race([
        probe.waitForStart().then(() => 'started'),
        new Promise<'timeout'>((resolve) => {
          window.setTimeout(() => resolve('timeout'), 20)
        }),
      ]),
    ).resolves.toBe('timeout')

    probe.restore()
  })

  test('supports predicates', async () => {
    const matchesProject = vi.fn((url: string) => url.endsWith('/api/projects'))
    window.fetch = vi.fn(pendingFetch) as typeof window.fetch
    const probe = createFetchAbortProbe(matchesProject, 'project loader')

    probe.install()
    void window.fetch('https://example.test/api/projects')

    await probe.waitForStart()

    expect(matchesProject).toHaveBeenCalledWith(
      'https://example.test/api/projects',
    )
    expect(probe.label).toBe('project loader')
    probe.restore()
  })

  test('re-installs from the original fetch and restores it idempotently', () => {
    const originalFetch = window.fetch
    const probe = createFetchAbortProbe('/api/users')

    probe.install()
    const firstPatch = window.fetch
    probe.install()

    expect(window.fetch).not.toBe(firstPatch)

    probe.restore()
    expect(window.fetch).toBe(originalFetch)

    probe.restore()
    expect(window.fetch).toBe(originalFetch)
  })

  test('observes a signal that was already aborted', async () => {
    window.fetch = vi.fn(pendingFetch) as typeof window.fetch
    const probe = createFetchAbortProbe('/api/users')
    const controller = new AbortController()
    controller.abort()

    probe.install()
    void window.fetch('https://example.test/api/users/42', {
      signal: controller.signal,
    })

    await probe.waitForAbort()
    probe.restore()
  })
})
