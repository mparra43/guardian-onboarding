'use client'

import React, { ComponentType } from 'react'
import { useRequireAuth } from '@/hooks/useRequireAuth'

interface WithAuthProtectionOptions {
  redirectTo?: string
  requireOnboarding?: boolean
  loadingComponent?: ComponentType
}

export function withAuthProtection<P extends object>(
  Component: ComponentType<P>,
  options: WithAuthProtectionOptions = {}
) {
  const {
    redirectTo = '/login',
    requireOnboarding = true,
    loadingComponent: LoadingComponent,
  } = options

  const ProtectedComponent = (props: P) => {
    const auth = useRequireAuth({ redirectTo, requireOnboarding })

    if (auth.isLoading) {
      if (LoadingComponent) {
        return <LoadingComponent />
      }
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )
    }

    if (!auth.isAuthenticated) {
      return null
    }

    return <Component {...props} />
  }

  ProtectedComponent.displayName = `withAuthProtection(${Component.displayName || Component.name || 'Component'})`

  return ProtectedComponent
}
