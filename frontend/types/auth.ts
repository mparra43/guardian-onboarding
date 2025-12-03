export interface User {
  id: string
  email: string
  name?: string
  onboardingCompleted: boolean
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
  expires_in: number
}

export interface DecodedToken {
  sub: string
  username: string
  email: string
  iat: number
  exp: number
}

export interface OnboardingData {
  nombre: string
  documento: string
  email: string
  montoInicial: number
}

export interface OnboardingResponse {
  success: boolean
  message: string
  data?: {
    id: string
    completedAt: string
  }
}

export interface ApiError {
  message: string
  statusCode: number
  errors?: Record<string, string[]>
}
