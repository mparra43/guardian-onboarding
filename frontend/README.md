# Guardian Onboarding - Frontend

Sistema de onboarding con Next.js 16, TypeScript, Tailwind CSS y patrones de diseño avanzados.

## 🚀 Características

- **Next.js 16** con App Router y Turbopack
- **TypeScript** con tipado estricto
- **Tailwind CSS** para estilos
- **React Hook Form + Zod** para validaciones
- **SWR** para caching y revalidation
- **Axios** clients con interceptors
- **Jest + React Testing Library** para tests
- **Lighthouse** para auditorías de rendimiento
- **Patrones de diseño**: HOC, Provider, Container/Presentational, Compound Components, Custom Hooks

## 📋 Requisitos

- Node.js 18+
- npm o yarn

## 🛠️ Instalación

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env.local

# Configurar variables en .env.local
```

## 🔐 Variables de Entorno

### Públicas (accesibles en el cliente - NEXT_PUBLIC_*)
```bash
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:3001
NEXT_PUBLIC_PRODUCTS_SERVICE_URL=http://localhost:3002
NEXT_PUBLIC_APP_NAME=Guardian Onboarding
NEXT_PUBLIC_USE_MOCKS=true
```

### Privadas (solo server-side)
```bash
ONBOARDING_SERVICE_URL=http://localhost:3003
ONBOARDING_API_TOKEN=your_service_token
COOKIE_MAX_AGE=86400
```

## 🏃 Ejecución

```bash
npm run dev          # Desarrollo
npm run build        # Build producción
npm start            # Producción
npm run lint         # Linting
npm test             # Tests
npm run test:coverage # Cobertura
```

## 🧪 Testing (80%+ coverage)

```bash
npm test              # Run tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## 📊 Lighthouse (90+ scores)

```bash
npm install -g @lhci/cli
lhci autorun --config=lighthouserc.js
```

## 🏗️ Arquitectura

- **Patrones**: HOC, Provider, Container/Presentational, Compound Components
- **Axios Factory**: `createAuthClient()`, `createProductsClient()`, `createOnboardingClient()`
- **SWR Caching**: stale-while-revalidate strategy
- **httpOnly Cookies**: Secure token storage
- **Zod Schemas**: Centralized validation in `/schemas`

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
