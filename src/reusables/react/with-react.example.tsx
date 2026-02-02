import { action, atom } from '@reatom/core'
import { reatomComponent } from '@reatom/react'

import { withReact } from './with-react'

const count = atom(0, 'count').extend(withReact())
const increment = action(() => count.set(count() + 1), 'increment').extend(
  withReact(),
)

export const Counter = reatomComponent(() => {
  const countValue = count.useReact()
  const incrementClick = increment.useReact()

  return <button onClick={incrementClick}>{countValue}</button>
}, 'Counter')
