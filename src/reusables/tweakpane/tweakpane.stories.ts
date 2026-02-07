import { action, atom } from '@reatom/core'
import { expect, userEvent, within } from 'storybook/test'

import type {
  Meta,
  StoryObj,
} from '../reatom-jsx-storybook/reatom-jsx-renderer'
import { hotWrap } from '../hot-wrap/hot-wrap'
import { withButton } from './blades'
import { withBinding } from './bindings'
import { reatomPane } from './core'

const tweakpaneDemo = () => {
  const paneHost = document.createElement('div')
  paneHost.style.border = '1px solid #ddd'
  paneHost.style.padding = '0.5rem'
  paneHost.style.borderRadius = '0.5rem'
  paneHost.style.minHeight = '4rem'

  const pane = reatomPane({
    name: `storybook.tweakpane.${Math.round(Math.random() * 100000)}`,
    title: 'Settings',
    container: paneHost,
  })

  const speed = atom(1, 'storybook.tweakpane.speed').extend(
    withBinding({ label: 'Speed', min: 0, max: 5, step: 1 }, pane),
  )
  const reset = action(() => speed.set(1), 'storybook.tweakpane.reset').extend(
    withButton({ title: 'Reset speed' }, pane),
  )

  const readSpeed = hotWrap(speed)
  const runReset = hotWrap(reset)

  const root = document.createElement('section')
  root.style.display = 'grid'
  root.style.gap = '0.75rem'
  root.style.maxWidth = '30rem'

  const speedValue = document.createElement('output')
  speedValue.setAttribute('data-testid', 'speed')

  const paneMounted = document.createElement('output')
  paneMounted.setAttribute('data-testid', 'pane-mounted')

  const increaseButton = document.createElement('button')
  increaseButton.type = 'button'
  increaseButton.textContent = 'Increase speed'
  increaseButton.onclick = () => speed.set((state) => state + 1)

  const resetButton = document.createElement('button')
  resetButton.type = 'button'
  resetButton.textContent = 'Reset speed'
  resetButton.onclick = () => void runReset()

  const render = () => {
    speedValue.textContent = String(readSpeed())
    paneMounted.textContent = String(pane().element.parentElement === paneHost)
  }

  speed.subscribe(render)
  render()

  root.append(
    'Speed',
    speedValue,
    'Pane mounted',
    paneMounted,
    increaseButton,
    resetButton,
    paneHost,
  )

  return root
}

const meta = {
  title: 'Reusables/tweakpane',
  component: tweakpaneDemo,
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj

export const PaneBinding = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByTestId('pane-mounted')).toHaveTextContent('true')
    await expect(canvas.getByTestId('speed')).toHaveTextContent('1')

    await userEvent.click(
      canvas.getByRole('button', { name: 'Increase speed' }),
    )
    await userEvent.click(
      canvas.getByRole('button', { name: 'Increase speed' }),
    )
    await expect(canvas.getByTestId('speed')).toHaveTextContent('3')

    await userEvent.click(canvas.getByRole('button', { name: 'Reset speed' }))
    await expect(canvas.getByTestId('speed')).toHaveTextContent('1')
  },
} satisfies Story
