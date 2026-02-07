import { atom } from '@reatom/core'
import { expect, userEvent, within } from 'storybook/test'

import type {
  Meta,
  StoryObj,
} from '../reatom-jsx-storybook/reatom-jsx-renderer'
import { withInstance } from './with-instance'

const withInstanceDemo = () => {
  let created = 0
  let disposed = 0

  const source = atom(1, 'storybook.withInstance.source').extend(
    withInstance(
      (target) => {
        created += 1
        return { doubled: target() * 2 }
      },
      () => {
        disposed += 1
      },
    ),
  )

  const root = document.createElement('section')
  root.style.display = 'grid'
  root.style.gap = '0.75rem'
  root.style.maxWidth = '24rem'

  const sourceValue = document.createElement('output')
  sourceValue.setAttribute('data-testid', 'source')

  const instanceValue = document.createElement('output')
  instanceValue.setAttribute('data-testid', 'instance')

  const createdCount = document.createElement('output')
  createdCount.setAttribute('data-testid', 'created')

  const disposedCount = document.createElement('output')
  disposedCount.setAttribute('data-testid', 'disposed')

  const increaseButton = document.createElement('button')
  increaseButton.type = 'button'
  increaseButton.textContent = 'Increase source'
  increaseButton.onclick = () => source.set((state) => state + 1)

  const render = () => {
    sourceValue.textContent = String(source())
    instanceValue.textContent = String(source.instance().doubled)
    createdCount.textContent = String(created)
    disposedCount.textContent = String(disposed)
  }

  source.instance.subscribe(render)
  source.subscribe(render)
  render()

  root.append(
    'Source',
    sourceValue,
    'Instance doubled',
    instanceValue,
    'Created',
    createdCount,
    'Disposed',
    disposedCount,
    increaseButton,
  )

  return root
}

const meta = {
  title: 'Reusables/withInstance',
  component: withInstanceDemo,
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj

export const ManagesLifecycle = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByTestId('source')).toHaveTextContent('1')
    await expect(canvas.getByTestId('instance')).toHaveTextContent('2')
    await expect(canvas.getByTestId('created')).toHaveTextContent('1')
    await expect(canvas.getByTestId('disposed')).toHaveTextContent('0')

    await userEvent.click(
      canvas.getByRole('button', { name: 'Increase source' }),
    )

    await expect(canvas.getByTestId('source')).toHaveTextContent('2')
    await expect(canvas.getByTestId('instance')).toHaveTextContent('4')
    await expect(canvas.getByTestId('created')).toHaveTextContent('2')
    await expect(canvas.getByTestId('disposed')).toHaveTextContent('1')
  },
} satisfies Story
