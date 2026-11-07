import {
  action,
  atom,
  type Action,
  type Ext,
  withConnectHook,
} from '@reatom/core'
import { reatomFactoryComponent } from '@reatom/react'

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

// hotWrap runs in the factory body (init): its subscription lives until the
// init frame is aborted on unmount, which closes the socket. The render frame
// is not aborted on unmount, so hotWrap in render would never unsubscribe.
export const Counter = reatomFactoryComponent(() => {
  const onReset = hotWrap(reset)

  return () => (
    <div>
      <p>Count: {count()}</p>
      <button onClick={onReset}>Reset</button>
    </div>
  )
}, 'Counter')
