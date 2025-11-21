import Cookies from 'js-cookie'

const TOKEN_COOKIE_NAME = 'auth_token'
const USER_COOKIE_NAME = 'user_data'

export const clientCookies = {
  getToken: (): string | null => {
    return Cookies.get(TOKEN_COOKIE_NAME) || null
  },

  getUserData: (): any | null => {
    const userData = Cookies.get(USER_COOKIE_NAME)
    
    if (!userData) return null
    
    try {
      return JSON.parse(userData)
    } catch {
      return null
    }
  },

  clearAuth: (): void => {
    Cookies.remove(TOKEN_COOKIE_NAME, { path: '/' })
    Cookies.remove(USER_COOKIE_NAME, { path: '/' })
  },
}

export { TOKEN_COOKIE_NAME, USER_COOKIE_NAME }
