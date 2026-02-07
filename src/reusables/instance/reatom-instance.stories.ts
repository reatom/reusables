import { atom } from '@reatom/core'
import { expect, userEvent, within } from 'storybook/test'

import type {
  Meta,
  StoryObj,
} from '../reatom-jsx-storybook/reatom-jsx-renderer'
import { reatomInstance } from './reatom-instance'

const reatomInstanceDemo = () => {
  const source = atom(0, 'storybook.reatomInstance.source')
  let created = 0
  let disposed = 0

  const instance = reatomInstance(
    () => {
      created += 1
      return { id: source() }
    },
    () => {
      disposed += 1
    },
    'storybook.reatomInstance.instance',
  )

  const root = document.createElement('section')
  root.style.display = 'grid'
  root.style.gap = '0.75rem'
  root.style.maxWidth = '24rem'

  const instanceId = document.createElement('output')
  instanceId.setAttribute('data-testid', 'instance-id')

  const createdCount = document.createElement('output')
  createdCount.setAttribute('data-testid', 'created')

  const disposedCount = document.createElement('output')
  disposedCount.setAttribute('data-testid', 'disposed')

  const updateButton = document.createElement('button')
  updateButton.type = 'button'
  updateButton.textContent = 'Update source'
  updateButton.onclick = () => source.set((state) => state + 1)

  const render = () => {
    instanceId.textContent = String(instance().id)
    createdCount.textContent = String(created)
    disposedCount.textContent = String(disposed)
  }

  instance.subscribe(render)
  render()

  root.append(
    'Instance id',
    instanceId,
    'Created',
    createdCount,
    'Disposed',
    disposedCount,
    updateButton,
  )

  return root
}

const meta = {
  title: 'Reusables/reatomInstance',
  component: reatomInstanceDemo,
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj

export const RecreatesOnDependencyChange = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByTestId('instance-id')).toHaveTextContent('0')
    await expect(canvas.getByTestId('created')).toHaveTextContent('1')
    await expect(canvas.getByTestId('disposed')).toHaveTextContent('0')

    await userEvent.click(canvas.getByRole('button', { name: 'Update source' }))

    await expect(canvas.getByTestId('instance-id')).toHaveTextContent('1')
    await expect(canvas.getByTestId('created')).toHaveTextContent('2')
    await expect(canvas.getByTestId('disposed')).toHaveTextContent('1')
  },
} satisfies Story
