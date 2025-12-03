'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { LoginCredentials, User } from '@/types/auth'
import { clientCookies } from '@/lib/cookies.client'
import { createAuthClient } from '@/lib/axios-clients'

interface LoginResult {
  success: boolean
  user?: User
  error?: string
}

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: LoginCredentials) => Promise<LoginResult>
  logout: () => Promise<void>
  updateUser: (user: Partial<User>) => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const initAuth = () => {
      try {
        const userData = clientCookies.getUserData()
        if (userData) {
          setUser(userData)
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = useCallback(async (userData: LoginCredentials) => {
    const { loginAction } = await import('@/app/actions/auth')
    const result = await loginAction(userData)
    
    if (result.success && result.user) {
      setUser(result.user)
      return result
    }
    
    throw new Error(result.error || 'Login failed')
  }, [])

  const logout = useCallback(async () => {
    try {
      const { logoutAction } = await import('@/app/actions/auth')
      await logoutAction()
      
      setUser(null)
      clientCookies.clearAuth()
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
      setUser(null)
      clientCookies.clearAuth()
      router.push('/login')
    }
  }, [router])

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null
      const updated = { ...prev, ...updates }
      
      fetch('/api/auth/update-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      }).catch(error => console.error('Failed to update user:', error))
      
      return updated
    })
  }, [])

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}
