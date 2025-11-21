# Microservicio de Onboarding

Microservicio para gestionar el proceso de onboarding de usuarios, implementado con Clean Architecture, principios SOLID y mejores prácticas de seguridad.

## 🏗️ Arquitectura

Este proyecto sigue los principios de **Clean Architecture**, organizando el código en capas bien definidas:

```
src/
├── domain/                    # Capa de Dominio (Entidades y Contratos)
│   ├── entities/             # Entidades de negocio
│   │   └── onboarding.entity.ts
│   └── repositories/         # Interfaces de repositorios
│       └── onboarding.repository.interface.ts
│
├── application/              # Capa de Aplicación (Casos de Uso)
│   ├── dto/                 # Data Transfer Objects
│   │   ├── create-onboarding.dto.ts
│   │   ├── onboarding-response.dto.ts
│   │   └── health-response.dto.ts
│   └── use-cases/           # Lógica de negocio
│       └── create-onboarding.use-case.ts
│
├── infrastructure/           # Capa de Infraestructura (Implementaciones)
│   ├── adapters/            # Adaptadores (BD, APIs externas)
│   │   └── in-memory-onboarding.repository.ts
│   ├── auth/                # Estrategias de autenticación
│   │   └── jwt.strategy.ts
│   └── config/              # Configuraciones
│       └── jwt.config.ts
│
├── presentation/             # Capa de Presentación (Controladores)
│   ├── controllers/         # Controladores HTTP
│   │   └── onboarding.controller.ts
│   └── guards/              # Guards de autenticación
│       └── jwt-auth.guard.ts
│
├── app.module.ts            # Módulo principal con DI
└── main.ts                  # Punto de entrada con Swagger
```


## 📋 Requisitos previos

- Node.js >= 18
- npm >= 9

## 🔧 Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
```

## ⚙️ Configuración

Editar el archivo `.env`:

```env
PORT=3002
JWT_SECRET=guardian-secret-key-change-in-production
LOG_LEVEL=debug
```

> ⚠️ **IMPORTANTE**: El `JWT_SECRET` debe coincidir con el servicio de autenticación.

## 🏃 Ejecución

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

El servicio estará disponible en: `http://localhost:3002`

## 📚 Documentación API (Swagger)

Una vez iniciado el servicio, acceder a:

```
http://localhost:3002/api/docs
```

## 🔐 Endpoints

### 1. POST /onboarding

Crea un nuevo proceso de onboarding.

**Autenticación**: Requiere token JWT válido (Bearer Token)

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "nombre": "Juan Pérez",
  "documento": "12345678",
  "email": "juan.perez@example.com",
  "montoInicial": 1000
}
```

**Response** (201 Created):
```json
{
  "onboardingId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "REQUESTED"
}
```

**Errores posibles**:
- `400 Bad Request`: Datos inválidos o Content-Type incorrecto
- `401 Unauthorized`: Token inválido o expirado
- `403 Forbidden`: Token manipulado

### 2. GET /onboarding/health

Verifica el estado del servicio.

**Response** (200 OK):
```json
{
  "ok": true
}
```


## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

## 📦 Build

```bash
npm run build
```

## 🔄 Importaciones limpias

Configurado con path aliases en `tsconfig.json`:

```typescript
import { OnboardingEntity } from '@domain/entities/onboarding.entity';
import { CreateOnboardingDto } from '@application/dto/create-onboarding.dto';
import { InMemoryOnboardingRepository } from '@infrastructure/adapters/in-memory-onboarding.repository';
import { OnboardingController } from '@presentation/controllers/onboarding.controller';
```

## 🔧 Extensibilidad

### Cambiar repositorio

Para usar una base de datos real:

1. Crear nuevo adapter en `infrastructure/adapters/`
2. Implementar `OnboardingRepositoryInterface`
3. Actualizar el provider en `app.module.ts`:

```typescript
{
  provide: ONBOARDING_REPOSITORY,
  useClass: PostgresOnboardingRepository, // Nueva implementación
}
```

