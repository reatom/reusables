import { action, atom, withConnectHook } from '@reatom/core'
import { reatomComponent } from '@reatom/react'

import { hotWrap } from './hot-wrap'

// Extension that logs on connect/disconnect (activates when subscribed)
const withLog = (name: string) =>
  withConnectHook(() => {
    console.log(`${name} connected`)
    return () => console.log(`${name} disconnected`)
  })

const count = atom(0, 'count')

// Action with extension that activates on subscription
const reset = action(() => count.set(0), 'reset').extend(withLog('reset'))

export const Counter = reatomComponent(() => {
  const value = count()

  return (
    <div>
      <p>Count: {value}</p>
      {/* hotWrap subscribes → extension activates, logs "reset subscribed" */}
      {/* On unmount → cleanup runs, logs "reset unsubscribed" */}
      <button onClick={hotWrap(reset)}>Reset</button>
    </div>
  )
}, 'Counter')
