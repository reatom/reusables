# withMCP

Extend Reatom atoms and actions with [WebMCP](https://github.com/webmachinelearning/webmcp) tool registration so browser AI agents can invoke application behavior through typed tools.

## Overview

```mermaid
flowchart TD
    A[Reatom atom / action] -->|.extend(withMCP(...))| B{isAction?}
    B -- yes --> C[adds registerMCP method]
    B -- no  --> D[wraps with withInitHook]
    C -->|registerMCP called| E[modelContext.registerTool]
    D -->|first init| E
    E --> F[navigator.modelContext / provided ctx]
    F --> G[AI agent calls tool]
    G -->|execute| H[Reatom reactive context via wrap]
```

## Installation

```bash
jsrepo add withMCP
```

## Usage

### Actions — explicit registration

Actions represent **executable behavior**. `withMCP` adds a `registerMCP()` method that registers the tool and returns a cleanup function.

```ts
import { action, atom } from '@reatom/core'
import { withMCP } from './with-mcp'

const cartAtom = atom<Array<{ goodsId: string; quantity: number }>>([], 'cart')

const addToCard = action((input: { goodsId: string; quantity: number }) => {
  cartAtom.set((state) => [...state, input])
  return { ok: true }
}, 'addToCard').extend(
  withMCP({
    description: 'Add a goods item to the shopping cart.',
    inputSchema: {
      type: 'object',
      properties: {
        goodsId: { type: 'string' },
        quantity: { type: 'number', minimum: 1 },
      },
      required: ['goodsId', 'quantity'],
    },
  }),
)

// Register in root layout / route:
const unregister = addToCard.registerMCP()

// Cleanup on unmount:
unregister()
```

### Atoms — automatic registration on first initialization

Atoms represent **readable state snapshots**. The tool is registered automatically when the atom is first initialized (via `withInitHook`). This is a page-level registration — there is no teardown mechanism, so it matches the lifetime of the atom itself.

```ts
const goodsAtom = atom(
  [{ id: 'sku-1', title: 'Laptop', price: 1200 }],
  'marketplace.goods',
).extend(
  withMCP({
    name: 'list-goods',
    description: 'List currently available goods in the marketplace.',
    annotations: { readOnlyHint: true },
  }),
)

// Tool registers itself on first atom initialization:
goodsAtom()
```

### Custom params mapper

Use `params` to remap tool input to multi-argument actions. `params` is ignored for atoms, which always read current state.

```ts
const translate = action(
  (text: string, targetLang: string) => `${text} → ${targetLang}`,
  'translate',
).extend(
  withMCP({
    description: 'Translate text to a target language.',
    params: ({ text, targetLang }: { text: string; targetLang: string }) => [
      text,
      targetLang,
    ],
  }),
)
```

## API

### `withMCP(options)`

Returns a `.extend()` compatible extension function.

| Option         | Type                              | Default                                      | Description                                             |
| -------------- | --------------------------------- | -------------------------------------------- | ------------------------------------------------------- |
| `name`         | `string`                          | `target.name`                                | Tool name exposed to agents.                            |
| `description`  | `string`                          | `'Use this tool to interact with "<name>".'` | Natural language description for agent planning.        |
| `inputSchema`  | `object`                          | —                                            | JSON Schema for the input object.                       |
| `annotations`  | `MCPToolAnnotations`              | —                                            | Hints such as `readOnlyHint`.                           |
| `modelContext` | `MCPModelContext`                 | `navigator.modelContext`                     | Static context override.                                |
| `autoRegister` | `boolean`                         | `false`                                      | Register immediately during extension (actions only).   |
| `params`       | `(input, client, target) => args` | forward `input` as first arg                 | Maps tool input to action arguments. Ignored for atoms. |

### `getMCPModelContext()`

Reads `navigator.modelContext` and validates it against the `MCPModelContext` interface. Returns `undefined` when not available (e.g. Node.js, non-WebMCP browsers).

### `MCPExt` (actions only)

```ts
interface MCPExt {
  registerMCP(options?: { modelContext?: MCPModelContext }): Unsubscribe
}
```

The `modelContext` passed to `registerMCP` takes precedence over the one provided to `withMCP`.

## Notes

- **Duplicate registration** is the caller's responsibility. Calling `registerMCP()` twice without an intermediate cleanup will throw because the underlying `modelContext.registerTool` does not allow duplicate names.
- **Reactive context**: tool `execute` callbacks are wrapped with Reatom's `wrap`, so they run inside the reactive context captured at registration time.
- **Atoms do not expose `registerMCP`** — TypeScript will report an error if you attempt to call it on an atom target.
- **Atom registration is page-level** — atom tools are registered on first initialization via `withInitHook`, which provides no cleanup callback. The tool stays registered for the lifetime of the page. For sub-tree or test isolation, prefer action-based tools where `registerMCP()` returns an explicit `Unsubscribe`.
- **`params` applies to actions only** — for atoms the `execute` callback always calls `target()` to read the current state, regardless of whether `params` is provided.
