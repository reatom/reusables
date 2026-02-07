import type { Meta, StoryObj } from '../reatom-jsx-renderer'

import { expect, fn, userEvent, within } from 'storybook/test'

import { Button, type ButtonProps } from './Button'

const meta = {
  title: 'Example/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'color' },
    label: { control: 'text' },
    onClick: { action: 'onClick' },
    primary: { control: 'boolean' },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
  },
  args: { onClick: fn() },
} satisfies Meta<ButtonProps>

export default meta

type Story = StoryObj<ButtonProps>

export const Primary = {
  args: { primary: true, label: 'Button' },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Button' }))
    await expect(args.onClick).toHaveBeenCalledTimes(1)
  },
} satisfies Story

export const Secondary = {
  args: { label: 'Button' },
} satisfies Story

export const Large = {
  args: { size: 'large', label: 'Button' },
} satisfies Story

export const Small = {
  args: { size: 'small', label: 'Button' },
} satisfies Story
