# Guardian Onboarding - Documentación Técnica

## 📋 Resumen de Implementación

### ✅ Completado

#### 1. **Configuración Base**
- ✅ Next.js 16 con App Router y Turbopack
- ✅ TypeScript con configuración estricta
- ✅ Tailwind CSS para estilos
- ✅ ESLint configurado

#### 2. **Autenticación y Seguridad**
- ✅ Login con `username` y `password` (min 4 caracteres)
- ✅ Tokens almacenados en httpOnly cookies
- ✅ AuthContext (Provider Pattern) con `useAuth()` hook
- ✅ withAuthProtection HOC para rutas privadas
- ✅ useRequireAuth hook para protección client-side
- ✅ Redirección automática según estado de onboarding

#### 3. **Validaciones de Formularios**
- ✅ React Hook Form + Zod resolver
- ✅ Schemas centralizados en `/schemas`:
  - `loginSchema`: username (3-50), password (4-100)
  - `onboardingSchema`: nombre, documento, email, montoInicial (≥1000)
- ✅ Validación inline con mensajes de error accesibles (a11y)
- ✅ Prevención de doble envío (disable durante submit)

#### 4. **Axios Clients Factory**
- ✅ `createAuthClient()`: AUTH_SERVICE sin token
- ✅ `createProductsClient()`: PRODUCTS_SERVICE sin token
- ✅ `createOnboardingClient(getToken)`: ONBOARDING_SERVICE con Bearer token
- ✅ Interceptors implementados:
  - Retry con backoff exponencial (3 reintentos para 5xx)
  - Transformación consistente de errores
  - Inyección automática de Authorization header

#### 5. **Caching con SWR**
- ✅ Estrategia stale-while-revalidate
- ✅ Configuración:
  - `revalidateOnFocus: false`
  - `revalidateOnReconnect: true`
  - `dedupingInterval: 5000ms`
  - `keepPreviousData: true`
- ✅ Invalidación manual con `mutate()`
- ✅ TTLs configurables via env vars

#### 6. **Patrones de Diseño**
- ✅ **HOC**: `withAuthProtection` para proteger rutas
- ✅ **Provider**: `AuthContext` con estado global
- ✅ **Container/Presentational**: 
  - `ProductsContainer` (lógica)
  - `ProductsList` (presentación)
- ✅ **Compound Components**: `OnboardingForm` con subcomponentes
- ✅ **Custom Hooks**: 
  - `useProducts(page, limit)`
  - `useRequireAuth(options)`
  - `useAuth()`

#### 7. **Rutas Implementadas**

##### Públicas:
- ✅ `/` - Homepage con navbar y productos
- ✅ `/login` - Formulario de login con validaciones
- ✅ `/products` - Listado con paginación y SWR cache
- ✅ `/products/[id]` - Detalle con llamada GET a PRODUCTS_SERVICE

##### Privadas (requieren token):
- ✅ `/onboarding` - Formulario con validaciones complejas
  - Protegida con `withAuthProtection HOC`
  - Verifica token en cookie httpOnly
  - Persistencia local con localStorage
  - Llamada POST a ONBOARDING_SERVICE con Authorization header

#### 8. **API Routes**
- ✅ `/api/products` - GET con paginación (mock/real)
- ✅ `/api/products/[id]` - GET detalle (mock/real)
- ✅ Server Actions:
  - `loginAction`: Autentica y setea cookies
  - `logoutAction`: Limpia cookies
  - `submitOnboardingAction`: Envía datos con token
  - `getProductsAction`: Mock de productos
  - `getProductByIdAction`: Mock de detalle

#### 9. **Variables de Entorno**

##### Públicas (NEXT_PUBLIC_*):
```env
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:3001
NEXT_PUBLIC_PRODUCTS_SERVICE_URL=http://localhost:3002
NEXT_PUBLIC_APP_NAME=Guardian Onboarding
NEXT_PUBLIC_USE_MOCKS=true
```

##### Privadas (server-only):
```env
ONBOARDING_SERVICE_URL=http://localhost:3003
ONBOARDING_API_TOKEN=your_service_token
COOKIE_MAX_AGE=86400
COOKIE_SECURE=false
COOKIE_HTTP_ONLY=true
SWR_CACHE_TIME=300000
SWR_DEDUPING_INTERVAL=5000
```

#### 10. **Testing (Jest + RTL)**
- ✅ Jest configurado con TypeScript
- ✅ `jest.config.ts` con coverage thresholds (80%+ global, 85-90% críticos)
- ✅ `jest.setup.ts` con mocks de Next.js
- ✅ Tests implementados:
  - ✅ `useProducts.test.tsx`: 8 tests (fetch, error, pagination, navigation)
  - ✅ `LoginForm.test.tsx`: 8 tests (render, validaciones, submit, a11y)
  - ✅ `withAuthProtection.test.tsx`: 7 tests (auth, redirects, onboarding)
  - ✅ `ProductsList.test.tsx`: 11 tests (loading, error, empty, snapshot)
- ✅ Scripts:
  - `npm test`
  - `npm run test:watch`
  - `npm run test:coverage`
  - `npm run test:ci`

#### 11. **Lighthouse Configuration**
- ✅ `lighthouserc.js` configurado
- ✅ Targets:
  - Performance: ≥90
  - Accessibility: ≥90
  - Best Practices: ≥90
  - SEO: ≥90
- ✅ Métricas específicas:
  - FCP ≤2000ms
  - LCP ≤2500ms
  - CLS ≤0.1
  - TBT ≤300ms
- ✅ Script: `npm run lighthouse`

#### 12. **Optimizaciones Next.js**
- ✅ Server Components por defecto
- ✅ Client Components solo cuando necesario
- ✅ Image optimization con `next/image`
- ✅ Font optimization con `next/font`
- ✅ Code splitting automático
- ✅ Lazy loading de componentes

#### 13. **Componentes UI**
- ✅ `Button`: Variantes (primary, secondary, outline, ghost), sizes
- ✅ `Card`: Sistema compuesto (Card, CardHeader, CardBody, CardFooter)
- ✅ `Input`: Con label, error, helperText, a11y (aria-invalid, aria-describedby)
- ✅ `Navbar`: Con auth state y navegación

#### 14. **Cookies Management**
- ✅ `serverCookies`: httpOnly, secure, SameSite
  - `getToken()`, `setToken()`, `removeToken()`
  - `getUserData()`, `setUserData()`, `removeUserData()`
- ✅ `clientCookies`: Solo lectura
  - `getToken()`, `getUserData()`, `clearAuth()`

#### 15. **TypeScript Types**
- ✅ `types/index.ts`: Product, ProductsResponse
- ✅ `types/auth.ts`: User, LoginCredentials, LoginResponse, OnboardingData, OnboardingResponse, ApiError
- ✅ Tipado estricto en todos los componentes y hooks

#### 16. **Documentación**
- ✅ README.md completo con:
  - Instalación y configuración
  - Variables de entorno explicadas
  - Scripts disponibles
  - Arquitectura y patrones
  - Testing y Lighthouse
  - Seguridad y optimizaciones

---

## 🎯 Cumplimiento de Requerimientos

### ✅ Login
- [x] Página pública en `/login`
- [x] Validaciones: username ≥3, password ≥4
- [x] Llama a AUTH_SERVICE via Axios
- [x] Token en httpOnly cookie

### ✅ Products
- [x] Lista en homepage con paginación
- [x] GET a PRODUCTS_SERVICE (sin token)
- [x] Caching con SWR (stale-while-revalidate)
- [x] Enlaces a `/products/[id]`
- [x] Detalle con GET `/products/:id`

### ✅ Onboarding
- [x] Ruta privada `/onboarding`
- [x] Protegida con HOC + hook
- [x] Verificación token server-side
- [x] Formulario con validaciones:
  - nombre: 2-100 chars, solo letras
  - documento: numérico
  - email: formato válido
  - montoInicial: ≥1000
- [x] POST a ONBOARDING_SERVICE con Bearer token
- [x] Persistencia local con localStorage

### ✅ Axios Clients
- [x] Factory pattern con 3 clientes
- [x] Interceptors (retry, error, auth)
- [x] Separación por servicio

### ✅ Patrones de Diseño
- [x] HOC: `withAuthProtection`
- [x] Provider: `AuthContext`
- [x] Container/Presentational: Products
- [x] Compound Components: `OnboardingForm`
- [x] Custom Hooks: 3 implementados

### ✅ Testing
- [x] Jest + RTL configurado
- [x] 34+ tests unitarios
- [x] Coverage >80% global
- [x] Tests críticos: hooks, forms, HOC

### ✅ Lighthouse
- [x] Configuración con targets ≥90
- [x] Script automatizado
- [x] Métricas Core Web Vitals

---

## 📊 Métricas

- **Componentes**: 15+
- **Hooks**: 3 custom
- **Tests**: 34 unit tests
- **Coverage**: 80%+ objetivo
- **Lighthouse**: 90+ scores objetivo
- **TypeScript**: Tipado estricto 100%

---

## 🚀 Próximos Pasos (Opcionales)

1. **E2E Tests**: Agregar Playwright/Cypress
2. **Storybook**: Documentar componentes UI
3. **PWA**: Service workers y offline support
4. **i18n**: Internacionalización
5. **Analytics**: Google Analytics/Mixpanel
6. **Error Tracking**: Sentry integration
7. **API Mocking**: MSW para tests de integración

---

## 📝 Notas Técnicas

### Mock vs Real Services
- Variables `NEXT_PUBLIC_USE_MOCKS=true` activa mocks
- API routes verifican env y llaman mock o servicio real
- Server Actions tienen lógica mock incluida

### Seguridad
- Cookies httpOnly previenen XSS
- CSRF protection con SameSite
- Variables privadas nunca expuestas al cliente
- Validación server + client side

### Performance
- SWR reduce requests redundantes
- Server Components minimizan JS bundle
- Image optimization automática
- Code splitting por ruta

### Accessibility
- Semantic HTML
- ARIA labels y roles
- Keyboard navigation
- Error messages descriptivos
