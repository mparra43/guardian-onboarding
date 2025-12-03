import { serverCookies } from './cookies.server'
import { User } from '@/types/auth'

/**
 * Decode JWT token
 */
export function decodeToken(token: string): any | null {
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
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token)
  if (!decoded || !decoded.exp) return true
  
  const currentTime = Math.floor(Date.now() / 1000)
  return decoded.exp < currentTime
}

/**
 * Get authenticated user from server-side cookies
 * Returns null if not authenticated or token is invalid/expired
 */
export async function getServerAuth(): Promise<{ user: User; token: string } | null> {
  try {
    const token = await serverCookies.getToken()
    
    if (!token) {
      return null
    }

    // Check if token is expired
    if (isTokenExpired(token)) {
      // Clear expired token
      await serverCookies.removeToken()
      await serverCookies.removeUserData()
      return null
    }

    const user = await serverCookies.getUserData()
    
    if (!user) {
      return null
    }

    return { user, token }
  } catch (error) {
    console.error('Error getting server auth:', error)
    return null
  }
}

/**
 * Require authentication - throws redirect if not authenticated
 * Use in server components that require authentication
 */
export async function requireAuth(): Promise<{ user: User; token: string }> {
  const auth = await getServerAuth()
  
  if (!auth) {
    throw new Error('Unauthorized')
  }
  
  return auth
}
