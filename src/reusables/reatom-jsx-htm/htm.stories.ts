import { expect, userEvent, within } from 'storybook/test'

import type {
  Meta,
  StoryObj,
} from '../reatom-jsx-storybook/reatom-jsx-renderer'
import { html } from './htm'

const htmDemo = () => {
  let count = 0

  const root = html`<section style="display:grid;gap:.75rem;max-width:20rem">
    <output data-testid="value">0</output>
    <button type="button">Increment</button>
  </section>` as HTMLElement

  const value = root.querySelector('[data-testid="value"]')
  const incrementButton = root.querySelector('button')

  if (
    !(value instanceof HTMLElement) ||
    !(incrementButton instanceof HTMLElement)
  ) {
    throw new Error('Failed to create template elements')
  }

  incrementButton.onclick = () => {
    count += 1
    value.textContent = String(count)
  }

  return root
}

const meta = {
  title: 'Reusables/reatomJSXHtm',
  component: htmDemo,
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj

export const TaggedTemplateRendering = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Increment' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Increment' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Increment' }))

    await expect(canvas.getByTestId('value')).toHaveTextContent('3')
  },
} satisfies Story
