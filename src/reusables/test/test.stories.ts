import { expect, within } from 'storybook/test'

import type {
  Meta,
  StoryObj,
} from '../reatom-jsx-storybook/reatom-jsx-renderer'

const testReusableStory = () => {
  const root = document.createElement('section')
  root.style.display = 'grid'
  root.style.gap = '0.5rem'
  root.style.maxWidth = '34rem'

  const heading = document.createElement('h3')
  heading.textContent = 'test reusable'

  const description = document.createElement('p')
  description.setAttribute('data-testid', 'description')
  description.textContent =
    'Wraps Vitest test callbacks with Reatom context for deterministic reactive tests.'

  root.append(heading, description)
  return root
}

const meta = {
  title: 'Reusables/test',
  component: testReusableStory,
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj

export const UtilityOverview = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('heading', { name: 'test reusable' }),
    ).toBeInTheDocument()
    await expect(canvas.getByTestId('description')).toHaveTextContent(
      'Reatom context',
    )
  },
} satisfies Story
