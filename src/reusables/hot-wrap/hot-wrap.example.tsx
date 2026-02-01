import {
  action,
  atom,
  type Action,
  type Ext,
  withConnectHook,
} from '@reatom/core'
import { reatomComponent } from '@reatom/react'

import { hotWrap } from './hot-wrap'

// External control channel (socket/CRDT) for remote resets.
type ResetSocket = {
  on: (event: 'reset', handler: () => void) => () => void
  close: () => void
}

const connectResetSocket = (_url: string): ResetSocket => ({
  on: () => () => undefined,
  close: () => undefined,
})

const withRemoteReset = <Target extends Action<[], unknown>>(): Ext<Target> =>
  withConnectHook((target) => {
    const socket = connectResetSocket('wss://example')
    const off = socket.on('reset', () => target())
    return () => {
      off()
      socket.close()
    }
  })

const count = atom(0, 'count')

// Action with extension that activates on subscription
const reset = action(() => count.set(0), 'reset').extend(withRemoteReset())

export const Counter = reatomComponent(() => {
  const value = count()

  return (
    <div>
      <p>Count: {value}</p>
      {/* hotWrap subscribes -> socket listener starts */}
      {/* On unmount -> cleanup runs, socket closes */}
      <button onClick={hotWrap(reset)}>Reset</button>
    </div>
  )
}, 'Counter')
