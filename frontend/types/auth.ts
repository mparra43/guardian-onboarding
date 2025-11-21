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
  token: string
  user: User
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
