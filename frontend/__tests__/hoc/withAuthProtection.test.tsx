import React from 'react'
import { render, screen } from '@testing-library/react'
import { withAuthProtection } from '@/hoc/withAuthProtection'
import { AuthContext } from '@/contexts/AuthContext'

// Mock next/navigation
const mockPush = jest.fn()
const mockRouter = jest.fn(() => ({
  push: mockPush,
  back: jest.fn(),
}))

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter(),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}))

// Test component
const TestComponent = () => <div>Protected Content</div>
TestComponent.displayName = 'TestComponent'

describe('withAuthProtection HOC', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const renderWithAuth = (
    component: React.ReactElement,
    authValue: any
  ) => {
    return render(
      <AuthContext.Provider value={authValue}>
        {component}
      </AuthContext.Provider>
    )
  }

  it('should render protected component when user is authenticated', () => {
    const ProtectedComponent = withAuthProtection(TestComponent)
    const authValue = {
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        onboardingCompleted: true,
      },
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      updateUser: jest.fn(),
    }

    renderWithAuth(<ProtectedComponent />, authValue)

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('should show loading spinner when auth is loading', () => {
    const ProtectedComponent = withAuthProtection(TestComponent)
    const authValue = {
      user: null,
      isLoading: true,
      login: jest.fn(),
      logout: jest.fn(),
      updateUser: jest.fn(),
    }

    renderWithAuth(<ProtectedComponent />, authValue)

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('should redirect to login when user is not authenticated', () => {
    const ProtectedComponent = withAuthProtection(TestComponent)
    const authValue = {
      user: null,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      updateUser: jest.fn(),
    }

    renderWithAuth(<ProtectedComponent />, authValue)

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('should redirect to onboarding when onboarding is not completed', () => {
    const ProtectedComponent = withAuthProtection(TestComponent, {
      requireOnboarding: true,
    })
    const authValue = {
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        onboardingCompleted: false,
      },
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      updateUser: jest.fn(),
    }

    renderWithAuth(<ProtectedComponent />, authValue)

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('should allow access when onboarding is completed', () => {
    const ProtectedComponent = withAuthProtection(TestComponent, {
      requireOnboarding: true,
    })
    const authValue = {
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        onboardingCompleted: true,
      },
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      updateUser: jest.fn(),
    }

    renderWithAuth(<ProtectedComponent />, authValue)

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('should not require onboarding when option is disabled', () => {
    const ProtectedComponent = withAuthProtection(TestComponent, {
      requireOnboarding: false,
    })
    const authValue = {
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        onboardingCompleted: false,
      },
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      updateUser: jest.fn(),
    }

    renderWithAuth(<ProtectedComponent />, authValue)

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('should preserve component display name', () => {
    const ProtectedComponent = withAuthProtection(TestComponent)
    expect(ProtectedComponent.displayName).toBe('withAuthProtection(TestComponent)')
  })
})
