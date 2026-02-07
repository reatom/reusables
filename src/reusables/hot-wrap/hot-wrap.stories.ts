import { action, atom, withConnectHook } from '@reatom/core'
import { expect, userEvent, within } from 'storybook/test'

import type {
  Meta,
  StoryObj,
} from '../reatom-jsx-storybook/reatom-jsx-renderer'
import { hotWrap } from './hot-wrap'

const hotWrapDemo = () => {
  const count = atom(0, 'storybook.hotWrap.count')
  let connected = 0
  let disconnected = 0
  let render = () => undefined

  const reset = action(() => count.set(0), 'storybook.hotWrap.reset').extend(
    withConnectHook(() => {
      connected += 1
      render()

      return () => {
        disconnected += 1
        render()
      }
    }),
  )

  const runReset = hotWrap(reset)

  const root = document.createElement('section')
  root.style.display = 'grid'
  root.style.gap = '0.75rem'
  root.style.maxWidth = '24rem'

  const value = document.createElement('output')
  value.setAttribute('data-testid', 'count')

  const connectedCount = document.createElement('output')
  connectedCount.setAttribute('data-testid', 'connected')

  const disconnectedCount = document.createElement('output')
  disconnectedCount.setAttribute('data-testid', 'disconnected')

  const incrementButton = document.createElement('button')
  incrementButton.type = 'button'
  incrementButton.textContent = 'Increment'
  incrementButton.onclick = () => count.set((state) => state + 1)

  const resetButton = document.createElement('button')
  resetButton.type = 'button'
  resetButton.textContent = 'Reset with hotWrap'
  resetButton.onclick = () => void runReset()

  render = () => {
    value.textContent = String(count())
    connectedCount.textContent = String(connected)
    disconnectedCount.textContent = String(disconnected)
  }

  count.subscribe(render)
  render()

  root.append(
    'Count',
    value,
    'Connect hooks',
    connectedCount,
    'Disconnect hooks',
    disconnectedCount,
    incrementButton,
    resetButton,
  )

  return root
}

const meta = {
  title: 'Reusables/hotWrap',
  component: hotWrapDemo,
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj

export const SubscribesAndWrapsAction = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByTestId('connected')).toHaveTextContent('1')
    await expect(canvas.getByTestId('disconnected')).toHaveTextContent('0')

    await userEvent.click(canvas.getByRole('button', { name: 'Increment' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Increment' }))
    await expect(canvas.getByTestId('count')).toHaveTextContent('2')

    await userEvent.click(
      canvas.getByRole('button', { name: 'Reset with hotWrap' }),
    )
    await expect(canvas.getByTestId('count')).toHaveTextContent('0')
  },
} satisfies Story
