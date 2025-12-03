import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    }
  },
  useSearchParams() {
    return {
      get: jest.fn(),
    }
  },
  usePathname() {
    return '/'
  },
  useParams() {
    return {}
  },
}))

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return props
  },
}))

// Mock environment variables
process.env.AUTH_SERVICE_URL = 'http://localhost:3001'
process.env.PRODUCTS_SERVICE_URL = 'http://localhost:3002/api'
process.env.ONBOARDING_SERVICE_URL = 'http://localhost:3003/api'
process.env.NEXT_PUBLIC_APP_NAME = 'Guardian Onboarding Test'
process.env.NEXT_PUBLIC_USE_MOCKS = 'true'
process.env.ONBOARDING_SERVICE_URL = 'http://localhost:3003'

// Global test utilities
global.console = {
  ...console,
  // Suppress console errors in tests unless needed
  error: jest.fn(),
  warn: jest.fn(),
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
} as any
