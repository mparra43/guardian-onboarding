import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '@/components/auth/LoginForm'
import { AuthContext } from '@/contexts/AuthContext'
import { loginAction } from '@/app/actions/auth'

// Mock dependencies
jest.mock('@/app/actions/auth')
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}))

const mockLogin = jest.fn()
const mockAuthContext = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: mockLogin,
  logout: jest.fn(),
  updateUser: jest.fn(),
}

describe('LoginForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const renderWithContext = (component: React.ReactElement) => {
    return render(
      <AuthContext.Provider value={mockAuthContext}>
        {component}
      </AuthContext.Provider>
    )
  }

  it('should render login form with all fields', () => {
    renderWithContext(<LoginForm />)

    expect(screen.getByLabelText(/nombre de usuario/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /iniciar sesión/i })
    ).toBeInTheDocument()
  })

  it('should show validation error for short username', async () => {
    const user = userEvent.setup()
    renderWithContext(<LoginForm />)

    const usernameInput = screen.getByLabelText(/nombre de usuario/i)
    await user.type(usernameInput, 'ab') // Less than 3 characters
    await user.tab() // Trigger blur event

    await waitFor(() => {
      expect(
        screen.getByText(/el nombre de usuario debe tener al menos 3 caracteres/i)
      ).toBeInTheDocument()
    })
  })

  it('should show validation error for short password', async () => {
    const user = userEvent.setup()
    renderWithContext(<LoginForm />)

    const passwordInput = screen.getByLabelText(/contraseña/i)
    await user.type(passwordInput, '123') // Less than 4 characters
    await user.tab()

    await waitFor(() => {
      expect(
        screen.getByText(/la contraseña debe tener al menos 4 caracteres/i)
      ).toBeInTheDocument()
    })
  })

  it('should submit form with valid data', async () => {
    const user = userEvent.setup()
    const mockUser = {
      id: '1',
      email: 'admin@example.com',
      name: 'admin',
      onboardingCompleted: false,
    }

    ;(loginAction as jest.Mock).mockResolvedValue({
      success: true,
      user: mockUser,
    })

    renderWithContext(<LoginForm />)

    await user.type(screen.getByLabelText(/nombre de usuario/i), 'admin')
    await user.type(screen.getByLabelText(/contraseña/i), 'password123')
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    await waitFor(() => {
      expect(loginAction).toHaveBeenCalledWith({
        username: 'admin',
        password: 'password123',
      })
      expect(mockLogin).toHaveBeenCalledWith(mockUser)
    })
  })

  it('should display error message on login failure', async () => {
    const user = userEvent.setup()
    ;(loginAction as jest.Mock).mockResolvedValue({
      success: false,
      error: 'Invalid credentials',
    })

    renderWithContext(<LoginForm />)

    await user.type(screen.getByLabelText(/nombre de usuario/i), 'admin')
    await user.type(screen.getByLabelText(/contraseña/i), 'wrongpassword')
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })
  })

  it('should disable submit button while submitting', async () => {
    const user = userEvent.setup()
    ;(loginAction as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    )

    renderWithContext(<LoginForm />)

    await user.type(screen.getByLabelText(/nombre de usuario/i), 'admin')
    await user.type(screen.getByLabelText(/contraseña/i), 'password123')

    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i })
    await user.click(submitButton)

    expect(submitButton).toBeDisabled()
    expect(screen.getByText(/iniciando sesión/i)).toBeInTheDocument()
  })

  it('should handle max length validation', async () => {
    const user = userEvent.setup()
    renderWithContext(<LoginForm />)

    const longUsername = 'a'.repeat(51) // More than 50 characters
    await user.type(screen.getByLabelText(/nombre de usuario/i), longUsername)
    await user.tab()

    await waitFor(() => {
      expect(
        screen.getByText(/el nombre de usuario es muy largo/i)
      ).toBeInTheDocument()
    })
  })

  it('should have accessible form fields', () => {
    renderWithContext(<LoginForm />)

    const usernameInput = screen.getByLabelText(/nombre de usuario/i)
    const passwordInput = screen.getByLabelText(/contraseña/i)

    expect(usernameInput).toHaveAttribute('type', 'text')
    expect(usernameInput).toHaveAttribute('autoComplete', 'username')
    expect(passwordInput).toHaveAttribute('type', 'password')
    expect(passwordInput).toHaveAttribute('autoComplete', 'current-password')
  })
})
