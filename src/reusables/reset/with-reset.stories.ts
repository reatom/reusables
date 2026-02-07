import { atom } from '@reatom/core'
import { expect, userEvent, within } from 'storybook/test'

import type {
  Meta,
  StoryObj,
} from '../reatom-jsx-storybook/reatom-jsx-renderer'
import { withReset } from './with-reset'

const withResetDemo = () => {
  const counter = atom(0, 'storybook.withReset.counter').extend(withReset(0))

  const root = document.createElement('section')
  root.style.display = 'grid'
  root.style.gap = '0.75rem'
  root.style.maxWidth = '20rem'

  const value = document.createElement('output')
  value.setAttribute('data-testid', 'value')

  const increaseButton = document.createElement('button')
  increaseButton.type = 'button'
  increaseButton.textContent = 'Increase'
  increaseButton.onclick = () => counter.set((state) => state + 1)

  const resetButton = document.createElement('button')
  resetButton.type = 'button'
  resetButton.textContent = 'Reset'
  resetButton.onclick = () => counter.reset()

  const render = () => {
    value.textContent = String(counter())
  }

  counter.subscribe(render)
  render()

  root.append('Value', value, increaseButton, resetButton)

  return root
}

const meta = {
  title: 'Reusables/withReset',
  component: withResetDemo,
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj

export const CounterReset = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Increase' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Increase' }))
    await expect(canvas.getByTestId('value')).toHaveTextContent('2')

    await userEvent.click(canvas.getByRole('button', { name: 'Reset' }))
    await expect(canvas.getByTestId('value')).toHaveTextContent('0')
  },
} satisfies Story
