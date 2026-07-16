import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { ModeToggle } from '../components/ToggleMode'
import { ThemeProvider } from '../components/ThemeProvider'
import React, { useState, createContext, useContext } from 'react'

const Ctx = createContext({ open: false, toggle: () => {} })

jest.mock('../../@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = useState(false)
    return <Ctx.Provider value={{ open, toggle: () => setOpen((o: boolean) => !o) }}>{children}</Ctx.Provider>
  },
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => {
    const { toggle } = useContext(Ctx)
    return <button onClick={toggle}>{children}</button>
  },
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => {
    const { open } = useContext(Ctx)
    return open ? <div>{children}</div> : null
  },
  DropdownMenuItem: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
}))

const renderWithTheme = () =>
  render(
    <ThemeProvider>
      <ModeToggle />
    </ThemeProvider>
  )

beforeEach(() => {
  window.matchMedia = jest.fn().mockReturnValue({ matches: false })
  document.documentElement.classList.remove('light', 'dark')
  jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {})
})

afterEach(() => jest.restoreAllMocks())

describe('ModeToggle', () => {
  it('renders toggle button with sr-only text', () => {
    renderWithTheme()
    expect(screen.getByText('Toggle theme')).toBeInTheDocument()
  })

  it('opens dropdown and shows theme options', async () => {
    renderWithTheme()
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByText('Light')).toBeInTheDocument()
    expect(screen.getByText('Dark')).toBeInTheDocument()
    expect(screen.getByText('System')).toBeInTheDocument()
  })

  it('sets light theme on click', async () => {
    renderWithTheme()
    await userEvent.click(screen.getByRole('button'))
    await userEvent.click(screen.getByText('Light'))
    expect(document.documentElement.classList.contains('light')).toBe(true)
  })

  it('sets dark theme on click', async () => {
    renderWithTheme()
    await userEvent.click(screen.getByRole('button'))
    await userEvent.click(screen.getByText('Dark'))
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('sets system theme on click', async () => {
    renderWithTheme()
    await userEvent.click(screen.getByRole('button'))
    await userEvent.click(screen.getByText('System'))
    expect(document.documentElement.classList.contains('light')).toBe(true)
  })
})
