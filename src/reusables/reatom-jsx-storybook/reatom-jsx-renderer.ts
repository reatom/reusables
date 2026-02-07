import type {
  Args,
  ComponentAnnotations,
  DecoratorFunction,
  LoaderFunction,
  ProjectAnnotations,
  StoryAnnotations,
  StoryContext as StorybookStoryContext,
  StrictArgs,
  WebRenderer,
} from 'storybook/internal/types'

export interface ReatomRenderer extends WebRenderer {
  component: (
    args: this['T'],
    context: StorybookStoryContext<ReatomRenderer, this['T']>,
  ) => unknown
  storyResult: Element
}

export type Meta<TArgs = Args> = ComponentAnnotations<ReatomRenderer, TArgs>
export type StoryObj<TArgs = Args> = StoryAnnotations<ReatomRenderer, TArgs>
export type Decorator<TArgs = StrictArgs> = DecoratorFunction<
  ReatomRenderer,
  TArgs
>
export type Loader<TArgs = StrictArgs> = LoaderFunction<ReatomRenderer, TArgs>
export type StoryContext<TArgs = StrictArgs> = StorybookStoryContext<
  ReatomRenderer,
  TArgs
>
export type Preview = ProjectAnnotations<ReatomRenderer>
