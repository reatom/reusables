# withInstance

Atom extension that adds a lifecycle-managed `.instance` property derived from the atom's value.

Depends on [`reatomInstance`](./reatom-instance.md).

## `withInstance(create, dispose?)`

When the source atom changes, the previous instance is disposed and a new one is created automatically.

### Parameters

| Parameter | Type                    | Description                       |
| --------- | ----------------------- | --------------------------------- |
| `create`  | `(target: T) => I`      | Factory receiving the source atom |
| `dispose` | `(instance: I) => void` | Cleanup callback (optional)       |

### Example

```ts
import { atom } from '@reatom/core'
import { withInstance } from 'reusables/reatom/extension/with-instance'

const dimensions = atom({ x: 1, y: 1, z: 1 }).extend(
  withInstance(
    (dims) => new BoxGeometry(dims().x, dims().y, dims().z),
    (geometry) => geometry.dispose(),
  ),
)

// Access the managed instance via .instance
const unsub = dimensions.instance.subscribe((geometry) => {
  scene.add(new Mesh(geometry, material))
})

// When dimensions change, old geometry is disposed,
// new one is created automatically.
dimensions.set({ x: 2, y: 3, z: 4 })
```

### Composing instances

Instances created with `withInstance` can be consumed by other [`reatomInstance`](./reatom-instance.md) calls, forming reactive dependency chains:

```ts
import { reatomInstance } from 'reusables/reatom/factory/reatom-instance'

const material = atom({ color: '#00ff00' }).extend(
  withInstance(
    (params) => new MeshStandardMaterial({ color: params().color }),
    (mat) => mat.dispose(),
  ),
)

const mesh = reatomInstance(
  () => new Mesh(dimensions.instance(), material.instance()),
  (m) => m.removeFromParent(),
)
```
