import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Example } from './Example'

describe('Example', () => {
  it('renders the given label', () => {
    render(<Example label="Click me" />)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = jest.fn()
    render(<Example label="Click me" onClick={onClick} />)

    await user.click(screen.getByRole('button', { name: 'Click me' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
