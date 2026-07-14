import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { ModeToggle } from '../components/ToggleMode'
import { ThemeProvider } from '../components/ThemeProvider'
import React from 'react'

jest.mock('../../@/components/ui/dropdown-menu', () => {
  const { useState, createContext, useContext } = require('react')
  const Ctx = createContext({ open: false, toggle: () => {} })
  const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = useState(false)
    return <Ctx.Provider value={{ open, toggle: () => setOpen((o: boolean) => !o) }}>{children}</Ctx.Provider>
  }
  const DropdownMenuTrigger = ({ children }: { children: React.ReactNode }) => {
    const { toggle } = useContext(Ctx)
    return <div onClick={toggle}>{children}</div>
  }
  const DropdownMenuContent = ({ children }: { children: React.ReactNode }) => {
    const { open } = useContext(Ctx)
    return open ? <div>{children}</div> : null
  }
  const DropdownMenuItem = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick}>{children}</button>
  )
  return { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem }
})

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
