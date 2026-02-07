import { assert, clearStack, context } from '@reatom/core'
import { mount } from '@reatom/jsx'
import type { Preview } from './reatom-jsx-renderer'

clearStack()

const preview = {
  render: (args, storyContext) => {
    assert(
      typeof storyContext.component === 'function',
      'Story component should be a function',
    )
    const result = storyContext.component(args, storyContext)
    assert(result instanceof Element, 'Story component should return Element')
    mount(storyContext.canvasElement, result)
    return result
  },
  decorators: [(update) => context.start(update)],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      test: 'todo',
    },
  },
} satisfies Preview

export default preview
