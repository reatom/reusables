import { atom } from '@reatom/core'
import { expect, userEvent, within } from 'storybook/test'

import type {
  Meta,
  StoryObj,
} from '../reatom-jsx-storybook/reatom-jsx-renderer'
import { withHistory } from './with-history'

const withHistoryDemo = () => {
  const counter = atom(0, 'storybook.withHistory.counter').extend(
    withHistory(2),
  )

  const root = document.createElement('section')
  root.style.display = 'grid'
  root.style.gap = '0.75rem'
  root.style.maxWidth = '24rem'

  const value = document.createElement('output')
  value.setAttribute('data-testid', 'value')

  const history = document.createElement('output')
  history.setAttribute('data-testid', 'history')

  const incrementButton = document.createElement('button')
  incrementButton.type = 'button'
  incrementButton.textContent = 'Increment'
  incrementButton.onclick = () => counter.set((state) => state + 1)

  const undoButton = document.createElement('button')
  undoButton.type = 'button'
  undoButton.textContent = 'Undo'
  undoButton.onclick = () => {
    const [, previous] = counter.history()
    if (previous !== undefined) counter.set(previous)
  }

  const render = () => {
    value.textContent = String(counter())
    history.textContent = counter.history().join(' > ')
  }

  counter.history.subscribe(render)
  render()

  root.append('Value', value, 'History', history, incrementButton, undoButton)

  return root
}

const meta = {
  title: 'Reusables/withHistory',
  component: withHistoryDemo,
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj

export const TracksHistory = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Increment' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Increment' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Increment' }))

    await expect(canvas.getByTestId('value')).toHaveTextContent('3')
    await expect(canvas.getByTestId('history')).toHaveTextContent('3 > 2 > 1')

    await userEvent.click(canvas.getByRole('button', { name: 'Undo' }))

    await expect(canvas.getByTestId('value')).toHaveTextContent('2')
  },
} satisfies Story
