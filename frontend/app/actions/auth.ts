'use server'

import { serverCookies } from '@/lib/cookies.server'
import { createAuthClient } from '@/lib/axios-clients'
import { LoginCredentials, LoginResponse, User, DecodedToken } from '@/types/auth'

/**
 * Decode JWT token to extract user data
 */
function decodeToken(token: string): DecodedToken | null {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      Buffer.from(base64, 'base64')
        .toString()
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}

/**
 * Server Action: Login user
 * 
 * Authenticates user with AUTH_SERVICE using Axios client
 * Sets httpOnly cookie with token
 */
export async function loginAction(credentials: LoginCredentials) {
  try {
    // Call AUTH_SERVICE using Axios client
    const authClient = createAuthClient()
    const response = await authClient.post<LoginResponse>('/auth/login', credentials)
    
    const { access_token, expires_in } = response.data

    // Decode token to extract user information
    const decoded = decodeToken(access_token)
    
    if (!decoded) {
      return {
        success: false,
        error: 'Invalid token received',
      }
    }

    // Create user object from decoded token
    const user: User = {
      id: decoded.sub,
      email: decoded.email,
      name: decoded.username,
      onboardingCompleted: false, // This will be updated after checking onboarding status
    }

    // Store token and user data in cookies
    await serverCookies.setToken(access_token)
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

/**
 * Server Action: Logout user
 */
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

/**
 * Server Action: Update user data
 */
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

/**
 * Server Action: Get current user
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const user = await serverCookies.getUserData()
    return user
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}
