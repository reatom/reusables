import { action, atom } from '@reatom/core'
import { expect, userEvent, within } from 'storybook/test'

import type {
  Meta,
  StoryObj,
} from '../reatom-jsx-storybook/reatom-jsx-renderer'
import { type LogEntry, withLogger } from './with-logger'

const extractResult = (result: unknown) => {
  if (
    Array.isArray(result) &&
    result[0] &&
    typeof result[0] === 'object' &&
    'payload' in result[0]
  ) {
    return String((result[0] as { payload: unknown }).payload)
  }
  return String(result)
}

const withLoggerDemo = () => {
  const logs: LogEntry[] = []

  const logger = (entry: LogEntry) => {
    logs.push(entry)
    render()
  }

  const counter = atom(0, 'storybook.withLogger.counter').extend(
    withLogger(logger),
  )
  const greet = action((name: string) => `Hello, ${name}!`, 'greet').extend(
    withLogger(logger),
  )

  const root = document.createElement('section')
  root.style.display = 'grid'
  root.style.gap = '0.75rem'
  root.style.maxWidth = '28rem'

  const value = document.createElement('output')
  value.setAttribute('data-testid', 'counter')

  const logCount = document.createElement('output')
  logCount.setAttribute('data-testid', 'log-count')

  const lastName = document.createElement('output')
  lastName.setAttribute('data-testid', 'last-name')

  const lastResult = document.createElement('output')
  lastResult.setAttribute('data-testid', 'last-result')

  const setButton = document.createElement('button')
  setButton.type = 'button'
  setButton.textContent = 'Set to 1'
  setButton.onclick = () => counter.set(1)

  const greetButton = document.createElement('button')
  greetButton.type = 'button'
  greetButton.textContent = 'Run greet'
  greetButton.onclick = () => void greet('Storybook')

  const render = () => {
    const last = logs.at(-1)
    value.textContent = String(counter())
    logCount.textContent = String(logs.length)
    lastName.textContent = last?.name ?? 'none'
    lastResult.textContent = last ? extractResult(last.result) : 'none'
  }

  counter.subscribe(render)
  render()

  root.append(
    'Counter',
    value,
    'Log count',
    logCount,
    'Last name',
    lastName,
    'Last result',
    lastResult,
    setButton,
    greetButton,
  )

  return root
}

const meta = {
  title: 'Reusables/withLogger',
  component: withLoggerDemo,
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj

export const LogsAtomsAndActions = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Set to 1' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Run greet' }))

    await expect(canvas.getByTestId('counter')).toHaveTextContent('1')
    await expect(canvas.getByTestId('log-count')).toHaveTextContent('2')
    await expect(canvas.getByTestId('last-name')).toHaveTextContent('greet')
    await expect(canvas.getByTestId('last-result')).toHaveTextContent(
      'Hello, Storybook!',
    )
  },
} satisfies Story
