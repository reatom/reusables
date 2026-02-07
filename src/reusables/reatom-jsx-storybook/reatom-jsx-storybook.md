# reatomJSXStorybook

Storybook setup for `@reatom/jsx` with an HTML renderer, typed story helpers, a Vitest bridge, and starter stories.

## What this reusable adds

- `.storybook/main.ts` with `@storybook/html-vite` and common addons
- `.storybook/preview.ts` with Reatom-aware `render` and decorator
- `.storybook/reatom-jsx-renderer.ts` type helpers (`Meta`, `StoryObj`, `Preview`)
- `.storybook/vitest.setup.ts` to apply Storybook annotations in tests
- `src/stories/Button.ts` and `src/stories/Button.stories.ts` examples

## Requirements

- Storybook `10.x` (`@storybook/html-vite`, `storybook`)
- `@reatom/jsx`
- `reatomJSXHtm` reusable (pulled automatically as a dependency)

## Story authoring

Use the custom renderer types from `.storybook/reatom-jsx-renderer`:

```ts
import type { Meta, StoryObj } from '../../.storybook/reatom-jsx-renderer'
import { Button, type ButtonProps } from './Button'

const meta = {
  title: 'Example/Button',
  component: Button,
} satisfies Meta<ButtonProps>

export default meta

export const Primary = {
  args: { primary: true, label: 'Button' },
} satisfies StoryObj<ButtonProps>
```

Story `component` functions are expected to return a real `Element`. The reusable `preview.ts` mounts this element into Storybook's canvas using `mount` from `@reatom/jsx`.

## Running Storybook

```bash
pnpm storybook
```

## Testing stories in Vitest

Keep the generated `.storybook/vitest.setup.ts` in your Vitest setup list so Storybook annotations are active during tests.
