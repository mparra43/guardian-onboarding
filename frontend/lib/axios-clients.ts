import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'

const retryInterceptor = async (error: AxiosError): Promise<any> => {
  const config = error.config as InternalAxiosRequestConfig & { _retryCount?: number }
  
  if (!config) return Promise.reject(error)

  if (error.response && error.response.status >= 500 && error.response.status < 600) {
    config._retryCount = config._retryCount || 0
    const maxRetries = 3

    if (config._retryCount < maxRetries) {
      config._retryCount += 1
      const delay = Math.pow(2, config._retryCount - 1) * 1000
      await new Promise(resolve => setTimeout(resolve, delay))
      return axios.request(config)
    }
  }

  return Promise.reject(error)
}

const errorInterceptor = (error: AxiosError): Promise<never> => {
  if (error.response) {
    const apiError = {
      message: (error.response.data as any)?.message || 'An error occurred',
      statusCode: error.response.status,
      errors: (error.response.data as any)?.errors,
    }
    return Promise.reject(apiError)
  }
  
  if (error.request) {
    return Promise.reject({
      message: 'No response from server',
      statusCode: 0,
    })
  }
  
  return Promise.reject({
    message: error.message || 'Request failed',
    statusCode: 0,
  })
}

export const createAuthClient = (): AxiosInstance => {

  const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  client.interceptors.response.use(
    response => response,
    async error => {
      await retryInterceptor(error)
      return errorInterceptor(error)
    }
  )

  return client
}

export const createProductsClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_PRODUCTS_SERVICE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  client.interceptors.response.use(
    response => response,
    async error => {
      await retryInterceptor(error)
      return errorInterceptor(error)
    }
  )

  return client
}

export const createOnboardingClient = (getToken: () => string | null): AxiosInstance => {
  const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_ONBOARDING_SERVICE_URL,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    error => Promise.reject(error)
  )

  client.interceptors.response.use(
    response => response,
    async error => {
      if (error.response?.status === 401) {
        console.warn('Unauthorized - token may be invalid')
      }
      await retryInterceptor(error)
      return errorInterceptor(error)
    }
  )

  return client
}
