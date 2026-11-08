import { reatomRoute, wrap } from '@reatom/core'

import {
  createFetchAbortProbe,
  expectFetchAbortOnNavigation,
  fetchAbortLifecycle,
} from './fetch-abort-probe'

// A route loader fetches data with Reatom's route-scoped abort signal.
const usersRoute = reatomRoute({
  path: 'users',
  async loader() {
    const response = await wrap(fetch('/api/users'))
    return await wrap(response.json())
  },
})

const homeRoute = reatomRoute('')
const usersProbe = createFetchAbortProbe('/api/users', 'users loader')

// Storybook's cleanup-aware beforeEach accepts this lifecycle callback.
const story = { beforeEach: fetchAbortLifecycle(usersProbe) }

// In a Storybook/Vitest browser interaction test:
async function assertUsersLoaderAbortsOnNavigation() {
  await expectFetchAbortOnNavigation(
    usersProbe,
    async () => {
      homeRoute.go()
    },
    {
      // For example, assert that a loading skeleton is visible before leaving.
      assertLoading: async () => {
        document.querySelector('[data-testid="users-loading"]')
      },
    },
  )
}

void usersRoute
void story
void assertUsersLoaderAbortsOnNavigation
