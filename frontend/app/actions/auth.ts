'use server'

import { serverCookies } from '@/lib/cookies.server'
import { createAuthClient } from '@/lib/axios-clients'
import { LoginCredentials, LoginResponse, User } from '@/types/auth'

export async function loginAction(credentials: LoginCredentials) {
  try {
    if (process.env.NEXT_PUBLIC_USE_MOCKS === 'true') {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockUser: User = {
        id: '1',
        email: `${credentials.username}@example.com`,
        name: credentials.username,
        onboardingCompleted: false,
      }
      
      const mockToken = 'mock_jwt_token_' + Date.now()
      
      await serverCookies.setToken(mockToken)
      await serverCookies.setUserData(mockUser)
      
      return {
        success: true,
        user: mockUser,
      }
    }
    
    const authClient = createAuthClient()
    const response = await authClient.post<LoginResponse>('/login', credentials)
    
    const { token, user } = response.data

    await serverCookies.setToken(token)
    await serverCookies.setUserData(user)

    return {
      success: true,
      user,
    }
  } catch (error: any) {
    console.error('Login error:', error)
    return {
      success: false,
      error: error.message || 'Invalid credentials',
    }
  }
}

export async function logoutAction() {
  try {
    await serverCookies.removeToken()
    await serverCookies.removeUserData()
    
    return { success: true }
  } catch (error: any) {
    console.error('Logout error:', error)
    return {
      success: false,
      error: error.message || 'Logout failed',
    }
  }
}

export async function updateUserAction(userData: User) {
  try {
    await serverCookies.setUserData(userData)
    
    return { success: true }
  } catch (error: any) {
    console.error('Update user error:', error)
    return {
      success: false,
      error: error.message || 'Update failed',
    }
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const user = await serverCookies.getUserData()
    return user
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}
