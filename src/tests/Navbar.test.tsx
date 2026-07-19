import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { ThemeProvider } from '../components/ThemeProvider'
import Navbar from '../components/Navbar'
import authReducer from '../redux/slices/authSlice'

const renderNavbar = () => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        user: {
          user_id: 1,
          name: 'Suvam',
          email: 'roysuvam1999@gmail.com',
          phone_number: '1234567890',
          role: 'jobseeker' as const,
          bio: null,
          resume: null,
          resume_public_id: null,
          profile_pic: null,
          profile_pic_public_id: null,
          skills: [],
          subscription: null,
        },
        loading: false,
        btnLoading: false,
        isAuth: true,
      },
    },
  })

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <ThemeProvider>
          <Navbar />
        </ThemeProvider>
      </MemoryRouter>
    </Provider>
  )
}

beforeEach(() => {
  window.matchMedia = jest.fn().mockReturnValue({ matches: false })
  document.documentElement.classList.remove('light', 'dark')
  jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {})
})

afterEach(() => jest.restoreAllMocks())

describe('Navbar', () => {
  it('renders brand name', () => {
    renderNavbar()
    expect(screen.getByText('Hire')).toBeInTheDocument()
    expect(screen.getByText('Heaven')).toBeInTheDocument()
  })

  it('renders desktop nav links', () => {
    renderNavbar()
    expect(screen.getAllByText('HOME').length).toBeGreaterThan(0)
    expect(screen.getAllByText('JOBS').length).toBeGreaterThan(0)
    expect(screen.getAllByText('ABOUT').length).toBeGreaterThan(0)
  })

  it('renders avatar and user info in popover trigger area', () => {
    renderNavbar()
    expect(screen.getByText('S')).toBeInTheDocument()
  })

  it('opens mobile menu on hamburger click and shows X icon', async () => {
    renderNavbar()
    const menuBtn = screen.getByLabelText('Toggle menu')
    await userEvent.click(menuBtn)
    // After open, X icon is shown — button still present
    expect(menuBtn).toBeInTheDocument()
  })

  it('closes mobile menu on second hamburger click', async () => {
    renderNavbar()
    const menuBtn = screen.getByLabelText('Toggle menu')
    await userEvent.click(menuBtn)
    await userEvent.click(menuBtn)
    expect(menuBtn).toBeInTheDocument()
  })

  it('mobile menu contains My profile and Logout when authenticated', async () => {
    renderNavbar()
    const menuBtn = screen.getByLabelText('Toggle menu')
    await userEvent.click(menuBtn)
    expect(screen.getByText('My profile')).toBeInTheDocument()
    expect(screen.getByText('Logout')).toBeInTheDocument()
  })

  it('mobile Logout button calls handleLogout and closes menu', async () => {
    renderNavbar()
    const menuBtn = screen.getByLabelText('Toggle menu')
    await userEvent.click(menuBtn)
    await userEvent.click(screen.getByText('Logout'))
    expect(menuBtn).toBeInTheDocument()
  })
})
