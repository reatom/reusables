# reatomJSXHtm

Small integration that binds [`htm`](https://github.com/developit/htm) to `@reatom/jsx` and re-exports all `@reatom/jsx` utilities.

## Exports

### `html`

Template tag created with `htm.bind(h)` from `@reatom/jsx`.

### Re-exports from `@reatom/jsx`

Everything from `@reatom/jsx` is re-exported, including helpers like `css`, `mount`, and `h`.

## Example

```ts
import { css, html, mount } from '#reatom/htm'

const buttonStyles = css`
  border: 0;
  border-radius: 8px;
  padding: 8px 12px;
  background: #1f2937;
  color: white;
`

const view = html`<button css=${buttonStyles}>Click me</button>`

mount(document.body, view)
```

## Why use it

- HTML-like authoring with tagged templates
- Native Reatom JSX runtime under the hood
- Single import for both `html` and `@reatom/jsx` helpers
