'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface UseRequireAuthOptions {
  redirectTo?: string
  requireOnboarding?: boolean
}

export function useRequireAuth(options: UseRequireAuthOptions = {}) {
  const { redirectTo = '/login', requireOnboarding = true } = options
  const auth = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (auth.isLoading) return

    if (!auth.isAuthenticated) {
      const returnUrl = pathname !== redirectTo ? `?returnUrl=${encodeURIComponent(pathname)}` : ''
      router.push(`${redirectTo}${returnUrl}`)
      return
    }

    if (requireOnboarding && auth.user && !auth.user.onboardingCompleted) {
      if (pathname !== '/onboarding') {
        router.push('/onboarding')
      }
    }
  }, [auth.isLoading, auth.isAuthenticated, auth.user, router, redirectTo, requireOnboarding, pathname])

  return auth
}
