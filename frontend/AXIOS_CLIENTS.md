# Uso de Axios Clients - Guardian Onboarding

## 📋 Resumen

Los **Axios clients** se utilizan en todas las llamadas HTTP a los servicios backend mediante una **factory pattern** que proporciona instancias configuradas con interceptors.

---

## 🏗️ Factory de Axios Clients

Ubicación: `/lib/axios-clients.ts`

### 1. **createAuthClient()**
Cliente para servicio de autenticación (AUTH_SERVICE).

**Características:**
- ❌ No requiere token
- ✅ Interceptor de retry (3 reintentos con backoff exponencial para 5xx)
- ✅ Interceptor de errores (transformación consistente)
- ✅ Timeout: 10 segundos

**Configuración:**
```typescript
baseURL: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL
headers: { 'Content-Type': 'application/json' }
```

**Uso en el proyecto:**
```typescript
// app/actions/auth.ts - loginAction()
const authClient = createAuthClient()
const response = await authClient.post<LoginResponse>('/login', credentials)
```

---

### 2. **createProductsClient()**
Cliente para servicio de productos (PRODUCTS_SERVICE).

**Características:**
- ❌ No requiere token (servicio público)
- ✅ Interceptor de retry
- ✅ Interceptor de errores
- ✅ Timeout: 10 segundos

**Configuración:**
```typescript
baseURL: process.env.NEXT_PUBLIC_PRODUCTS_SERVICE_URL
headers: { 'Content-Type': 'application/json' }
```

**Uso en el proyecto:**
```typescript
// app/api/products/route.ts - GET /api/products
const productsClient = createProductsClient()
const response = await productsClient.get('/products', {
  params: { page, limit }
})

// app/api/products/[id]/route.ts - GET /api/products/[id]
const productsClient = createProductsClient()
const response = await productsClient.get(`/products/${id}`)
```

---

### 3. **createOnboardingClient(getToken)**
Cliente para servicio de onboarding (ONBOARDING_SERVICE).

**Características:**
- ✅ Requiere token (Bearer Authentication)
- ✅ Inyección automática de `Authorization: Bearer <token>`
- ✅ Interceptor de retry
- ✅ Interceptor de errores con manejo especial de 401
- ✅ Timeout: 15 segundos

**Configuración:**
```typescript
baseURL: process.env.ONBOARDING_SERVICE_URL (server-only)
headers: { 
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <token>' // Inyectado automáticamente
}
```

**Uso en el proyecto:**
```typescript
// app/actions/onboarding.ts - submitOnboardingAction()
const token = await serverCookies.getToken()
const onboardingClient = createOnboardingClient(() => token)
const response = await onboardingClient.post<OnboardingResponse>(
  '/onboarding/submit',
  data
)
```

---

## 🔄 Interceptors Implementados

### Retry Interceptor
Reintentos automáticos con backoff exponencial.

**Configuración:**
- Aplica a: Errores 5xx (500-599)
- Reintentos máximos: 3
- Delay: 2^(retry-1) * 1000ms
  - 1er reintento: 1s
  - 2do reintento: 2s
  - 3er reintento: 4s

```typescript
const retryInterceptor = async (error: AxiosError) => {
  if (error.response?.status >= 500 && error.response?.status < 600) {
    const retryCount = config._retryCount || 0
    if (retryCount < 3) {
      config._retryCount = retryCount + 1
      const delay = Math.pow(2, retryCount) * 1000
      await new Promise(resolve => setTimeout(resolve, delay))
      return axios.request(config)
    }
  }
  return Promise.reject(error)
}
```

### Error Interceptor
Transforma errores a formato consistente.

**Transformación:**
```typescript
// Antes (respuesta de Axios)
{
  response: {
    data: { message: "Error", errors: {...} },
    status: 400
  }
}

// Después (formato consistente)
{
  message: "Error message",
  statusCode: 400,
  errors: {...}
}
```

---

## 📍 Ubicaciones de Uso

### ✅ Login (AUTH_SERVICE)
**Archivo:** `app/actions/auth.ts`
**Función:** `loginAction(credentials)`
**Endpoint:** `POST /login`
**Cliente:** `createAuthClient()`

```typescript
const authClient = createAuthClient()
const response = await authClient.post<LoginResponse>('/login', {
  username: 'admin',
  password: 'password123'
})
// Response: { token: string, user: User }
```

---

### ✅ Productos - Listado (PRODUCTS_SERVICE)
**Archivo:** `app/api/products/route.ts`
**Endpoint:** `GET /products?page=1&limit=6`
**Cliente:** `createProductsClient()`

```typescript
const productsClient = createProductsClient()
const response = await productsClient.get('/products', {
  params: { page: 1, limit: 6 }
})
// Response: { data: Product[], total: number, page: number, pageSize: number }
```

---

### ✅ Productos - Detalle (PRODUCTS_SERVICE)
**Archivo:** `app/api/products/[id]/route.ts`
**Endpoint:** `GET /products/:id`
**Cliente:** `createProductsClient()`

```typescript
const productsClient = createProductsClient()
const response = await productsClient.get('/products/123')
// Response: Product { id, name, description, price, ... }
```

---

### ✅ Onboarding (ONBOARDING_SERVICE)
**Archivo:** `app/actions/onboarding.ts`
**Función:** `submitOnboardingAction(data)`
**Endpoint:** `POST /onboarding/submit`
**Cliente:** `createOnboardingClient(getToken)`

```typescript
const token = await serverCookies.getToken()
const onboardingClient = createOnboardingClient(() => token)
const response = await onboardingClient.post('/onboarding/submit', {
  nombre: 'Juan Pérez',
  documento: '12345678',
  email: 'juan@example.com',
  montoInicial: 5000
})
// Response: { success: boolean, message: string, data?: {...} }
```

---

## 🔐 Autenticación

### Token Management

**Almacenamiento:**
```typescript
// Server-side (httpOnly cookie)
await serverCookies.setToken(token)
const token = await serverCookies.getToken()
```

**Inyección en requests:**
```typescript
// Automática en createOnboardingClient
client.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

---

## 🎯 Flujo Completo

### Ejemplo: Login → Onboarding → Ver Producto

```typescript
// 1. Login con AUTH_SERVICE
const authClient = createAuthClient()
const loginResponse = await authClient.post('/login', { username, password })
await serverCookies.setToken(loginResponse.data.token)

// 2. Submit Onboarding con ONBOARDING_SERVICE (requiere token)
const token = await serverCookies.getToken()
const onboardingClient = createOnboardingClient(() => token)
await onboardingClient.post('/onboarding/submit', onboardingData)

// 3. Ver productos con PRODUCTS_SERVICE (sin token)
const productsClient = createProductsClient()
const products = await productsClient.get('/products', { params: { page: 1 } })

// 4. Ver detalle de producto (sin token)
const product = await productsClient.get('/products/123')
```

---

## ⚙️ Variables de Entorno

```env
# Públicas (cliente + servidor)
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:3001
NEXT_PUBLIC_PRODUCTS_SERVICE_URL=http://localhost:3002

# Privadas (solo servidor)
ONBOARDING_SERVICE_URL=http://localhost:3003
ONBOARDING_API_TOKEN=optional_service_token

# Mock mode
NEXT_PUBLIC_USE_MOCKS=true  # false para servicios reales
```

---

## 🧪 Testing

### Mock de Axios Clients

```typescript
// En tests
jest.mock('@/lib/axios-clients', () => ({
  createProductsClient: jest.fn(() => ({
    get: jest.fn().mockResolvedValue({
      data: { data: mockProducts, total: 10 }
    })
  })),
  createAuthClient: jest.fn(() => ({
    post: jest.fn().mockResolvedValue({
      data: { token: 'mock_token', user: mockUser }
    })
  })),
}))
```

---

## 📊 Ventajas del Enfoque

1. ✅ **Configuración centralizada**: Un solo lugar para configurar interceptors
2. ✅ **Reutilizable**: Misma instancia para múltiples endpoints
3. ✅ **Type-safe**: TypeScript para requests y responses
4. ✅ **Retry automático**: Sin código repetitivo
5. ✅ **Error handling**: Formato consistente en toda la app
6. ✅ **Token injection**: Automático para servicios privados
7. ✅ **Separación de concerns**: Cada servicio con su cliente
8. ✅ **Testeable**: Fácil de mockear en tests

---

## 🔍 Debugging

### Enable Axios Logging

```typescript
// En desarrollo
const client = createProductsClient()
client.interceptors.request.use(request => {
  console.log('Starting Request', {
    url: request.url,
    method: request.method,
    headers: request.headers
  })
  return request
})

client.interceptors.response.use(response => {
  console.log('Response:', {
    status: response.status,
    data: response.data
  })
  return response
})
```

---

## 📝 Resumen de Endpoints

| Servicio | Endpoint | Método | Token | Cliente | Archivo |
|----------|----------|--------|-------|---------|---------|
| AUTH | `/login` | POST | ❌ | `createAuthClient()` | `app/actions/auth.ts` |
| PRODUCTS | `/products` | GET | ❌ | `createProductsClient()` | `app/api/products/route.ts` |
| PRODUCTS | `/products/:id` | GET | ❌ | `createProductsClient()` | `app/api/products/[id]/route.ts` |
| ONBOARDING | `/onboarding/submit` | POST | ✅ | `createOnboardingClient()` | `app/actions/onboarding.ts` |
