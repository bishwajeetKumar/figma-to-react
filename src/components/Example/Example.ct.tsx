import { test, expect } from '@playwright/experimental-ct-react'
import { Example } from './Example'

test('renders and responds to clicks', async ({ mount }) => {
  let clicked = false
  const component = await mount(
    <Example label="Click me" onClick={() => (clicked = true)} />,
  )

  await expect(component).toContainText('Click me')
  await component.click()
  expect(clicked).toBe(true)
})
