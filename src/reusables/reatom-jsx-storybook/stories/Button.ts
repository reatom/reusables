import { action, atom, computed, noop, wrap } from '@reatom/core'
import { css, html } from '../../reatom-jsx-htm/htm'

export type ButtonProps = {
  /** Is this the principal call to action on the page? */
  primary?: boolean
  /** What background color to use */
  backgroundColor?: string
  /** How large should the button be? */
  size?: 'small' | 'medium' | 'large'
  /** Button contents */
  label: string
  /** Optional click handler */
  onClick?: () => void
}

const counter = atom(0)
const increment = action(() => {
  counter.set((value) => value + 1)
})

const buttonStyles = css`
  display: inline-block;
  cursor: pointer;
  border: 0;
  border-radius: 3em;
  font-weight: 700;
  line-height: 1;
  font-family: 'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;

  &[data-variant='primary'] {
    background-color: #555ab9;
    color: white;
  }

  &[data-variant='secondary'] {
    box-shadow: rgba(0, 0, 0, 0.15) 0px 0px 0px 1px inset;
    background-color: transparent;
    color: #333;
  }

  &[data-size='small'] {
    padding: 10px 16px;
    font-size: 12px;
  }

  &[data-size='medium'] {
    padding: 11px 20px;
    font-size: 14px;
  }

  &[data-size='large'] {
    padding: 12px 24px;
    font-size: 16px;
  }
`

export const Button = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  onClick = noop,
}: ButtonProps) =>
  html`<button
    type="button"
    css=${buttonStyles}
    data-variant=${primary ? 'primary' : 'secondary'}
    data-size=${size}
    style:backgroundColor=${backgroundColor}
    on:click=${wrap(() => {
      increment()
      onClick()
    })}
  >
    ${label} (${computed(() => counter())})
  </button>`
