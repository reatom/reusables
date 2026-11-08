import {
  computed,
  reatomEnum,
  reatomMediaQuery,
  withLocalStorage,
} from '@reatom/core'

/** A user-facing theme choice, including an automatic option. */
export type ThemePreference = 'system' | 'light' | 'dark'

/** The concrete theme derived from a preference and applied to the UI. */
export type ResolvedTheme = 'light' | 'dark'

/** Options for {@link reatomThemePreference}. */
export interface ThemePreferenceOptions {
  /** LocalStorage key the preference is persisted under. */
  key?: string
  /** Debug name for the underlying enum atom. */
  name?: string
}

/**
 * Coerces a persisted snapshot into a valid theme preference, falling back to
 * `'system'` for missing or unrecognized values.
 */
const coerceThemePreference = (snapshot: unknown): ThemePreference =>
  snapshot === 'light' || snapshot === 'dark' || snapshot === 'system'
    ? snapshot
    : 'system'

/**
 * Factory that creates a persisted theme-preference atom.
 *
 * The returned atom holds a three-state preference — `'system' | 'light' |
 * 'dark'` — and is persisted to `localStorage`. It is extended with a
 * `resolved` computed that maps the `'system'` preference through the
 * `(prefers-color-scheme: dark)` media query to a concrete `'light' | 'dark'`
 * theme, while explicit preferences pass through unchanged.
 *
 * The preference/state split lets a user opt out of a manual choice
 * (`'system'`) so the UI can follow the OS setting, while `resolved()` always
 * yields the theme you should actually render.
 *
 * @example
 *   const theme = reatomThemePreference()
 *   theme.set('dark') // explicit preference, persisted
 *   theme.resolved() // 'dark'
 *
 * @param options - {@link ThemePreferenceOptions}
 */
export const reatomThemePreference = ({
  key = 'theme',
  name = 'themePreference',
}: ThemePreferenceOptions = {}) => {
  const isDarkPreferred = reatomMediaQuery('(prefers-color-scheme: dark)')

  return reatomEnum(['system', 'light', 'dark'], name).extend(
    withLocalStorage({ key, fromSnapshot: coerceThemePreference }),
    (target) => ({
      resolved: computed(() => {
        const preference = target()
        if (preference === 'system') {
          return isDarkPreferred() ? 'dark' : 'light'
        }
        return preference
      }, `${name}.resolved`),
    }),
  )
}
