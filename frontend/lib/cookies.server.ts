import { cookies } from 'next/headers'

const TOKEN_COOKIE_NAME = 'auth_token'
const USER_COOKIE_NAME = 'user_data'

export const serverCookies = {
  getToken: async (): Promise<string | null> => {
    const cookieStore = await cookies()
    const tokenCookie = cookieStore.get(TOKEN_COOKIE_NAME)
    return tokenCookie?.value || null
  },

  setToken: async (token: string): Promise<void> => {
    const cookieStore = await cookies()
    const maxAge = parseInt(process.env.COOKIE_MAX_AGE || '86400', 10)
    
    cookieStore.set(TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge,
      path: '/',
    })
  },

  removeToken: async (): Promise<void> => {
    const cookieStore = await cookies()
    cookieStore.delete(TOKEN_COOKIE_NAME)
  },

  getUserData: async (): Promise<any | null> => {
    const cookieStore = await cookies()
    const userCookie = cookieStore.get(USER_COOKIE_NAME)
    
    if (!userCookie?.value) return null
    
    try {
      return JSON.parse(userCookie.value)
    } catch {
      return null
    }
  },

  setUserData: async (userData: any): Promise<void> => {
    const cookieStore = await cookies()
    const maxAge = parseInt(process.env.COOKIE_MAX_AGE || '86400', 10)
    
    cookieStore.set(USER_COOKIE_NAME, JSON.stringify(userData), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge,
      path: '/',
    })
  },

  removeUserData: async (): Promise<void> => {
    const cookieStore = await cookies()
    cookieStore.delete(USER_COOKIE_NAME)
  },
}

export { TOKEN_COOKIE_NAME, USER_COOKIE_NAME }
