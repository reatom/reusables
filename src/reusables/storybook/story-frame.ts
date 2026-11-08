import { ReatomError, type RootFrame } from '@reatom/core'

let activeStoryFrame: RootFrame | null = null

/**
 * Stores the active Storybook Reatom frame so a decorator can read it.
 *
 * Storybook runs `beforeEach` (and loaders) in a different scope than the
 * decorator that renders the story, so the frame created in the hook can't be
 * passed to the decorator directly. This module-level holder bridges the two:
 * create the frame in `beforeEach`, hand it off here, and have the decorator
 * read it via `getActiveStoryFrame`.
 *
 * Always reset to `null` on cleanup, otherwise a stale frame leaks into the
 * next story.
 *
 * @param frame - The frame to make active, or `null` to clear it
 */
export const setActiveStoryFrame = (frame: RootFrame | null): void => {
  activeStoryFrame = frame
}

/**
 * Returns the frame stored by `setActiveStoryFrame`.
 *
 * Meant to be called inside a Storybook decorator to feed
 * `reatomContext.Provider`.
 *
 * @throws {ReatomError} When no frame has been set
 */
export const getActiveStoryFrame = (): RootFrame => {
  if (activeStoryFrame === null) {
    throw new ReatomError('No active Storybook Reatom frame')
  }
  return activeStoryFrame
}
