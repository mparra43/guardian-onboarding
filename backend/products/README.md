# Products Microservice

Microservicio de gestión de productos implementado con **Clean Architecture**, principios **SOLID**, inyección de dependencias y documentación automática con **Swagger**.

## 🏗️ Arquitectura

Este proyecto sigue los principios de **Clean Architecture** con una separación clara de responsabilidades en 4 capas:

```
src/
├── domain/                    # Capa de Dominio (entidades y contratos)
│   ├── entities/
│   │   └── product.entity.ts  # Entidad Product con lógica de negocio
│   └── repositories/
│       └── product.repository.interface.ts  # Contrato del repositorio
│
├── application/               # Capa de Aplicación (casos de uso)
│   ├── dto/
│   │   └── product-response.dto.ts  # DTOs para respuestas
│   └── use-cases/
│       ├── get-products.use-case.ts      # Obtener todos los productos
│       └── get-product-by-id.use-case.ts # Obtener producto por ID
│
├── infrastructure/            # Capa de Infraestructura (adaptadores)
│   ├── adapters/
│   │   └── in-memory-product.repository.ts  # Implementación en memoria
│   └── config/
│       └── config.ts          # Configuración del servicio
│
├── presentation/              # Capa de Presentación (controladores)
│   └── controllers/
│       ├── products.controller.ts  # Endpoints de productos
│       └── health.controller.ts    # Health check
│
├── app.module.ts              # Módulo principal con DI
└── main.ts                    # Bootstrap con Swagger
```

## 🎯 Principios SOLID Aplicados

### Single Responsibility Principle (SRP)
- Cada clase tiene una única responsabilidad
- Los casos de uso encapsulan una sola operación de negocio
- Los controladores solo coordinan, sin lógica de negocio

### Open/Closed Principle (OCP)
- El sistema está abierto a extensión mediante nuevos casos de uso
- Cerrado a modificación mediante interfaces y abstracciones

### Liskov Substitution Principle (LSP)
- Las implementaciones de repositorio son intercambiables
- Se puede reemplazar `InMemoryProductRepository` por una implementación con BD real

### Interface Segregation Principle (ISP)
- `IProductRepository` define solo los métodos necesarios
- Los contratos son específicos y no fuerzan dependencias innecesarias

### Dependency Inversion Principle (DIP)
- Los casos de uso dependen de abstracciones (`IProductRepository`)
- Las implementaciones concretas se inyectan mediante DI de NestJS

## 📋 Endpoints

### Products
- `GET /api/products` - Obtener todos los productos
- `GET /api/products/:id` - Obtener un producto específico

### Health
- `GET /api/health` - Health check del servicio

## 📚 Documentación Swagger

Una vez iniciado el servicio, la documentación interactiva estará disponible en:
- **Swagger UI**: http://localhost:3002/api/docs

## 🚀 Instalación y Ejecución

### Instalar dependencias
```bash
npm install
```

### Modo desarrollo
```bash
npm run start:dev
```

### Modo producción
```bash
npm run build
npm run start:prod
```

### Ejecutar tests
```bash
npm test
npm run test:e2e
npm run test:cov
```

## 🔧 Configuración

El microservicio escucha en el puerto **3002** por defecto. Puedes cambiar esto mediante la variable de entorno `PORT`:

```bash
PORT=3003 npm run start:dev
```

## 📦 Dependencias Principales

- **@nestjs/core** - Framework principal
- **@nestjs/swagger** - Documentación automática
- **class-validator** - Validación de DTOs
- **class-transformer** - Transformación de datos

## 🔄 Importaciones Limpias

El proyecto está configurado con **path aliases** en `tsconfig.json`:

```typescript
import { Product } from '@domain/entities/product.entity';
import { GetProductsUseCase } from '@application/use-cases/get-products.use-case';
import { InMemoryProductRepository } from '@infrastructure/adapters/in-memory-product.repository';
import { ProductsController } from '@presentation/controllers/products.controller';
```

## 🎨 Patrones de Diseño Implementados

### Repository Pattern
- Abstracción del acceso a datos mediante `IProductRepository`
- Permite cambiar la fuente de datos sin afectar la lógica de negocio

### Dependency Injection
- Configuración en `app.module.ts`
- Inyección mediante tokens y el decorador `@Inject()`

### Use Case Pattern
- Encapsulación de la lógica de negocio en casos de uso
- Cada caso de uso realiza una única operación

### DTO Pattern
- Transferencia de datos con validación y documentación
- Separación entre entidades de dominio y objetos de respuesta

## 🧪 Testing

La arquitectura facilita el testing mediante:
- Inyección de dependencias para mocks
- Casos de uso independientes y testables
- Repositorios intercambiables

## 🔐 Características

✅ Clean Architecture con 4 capas bien definidas  
✅ Principios SOLID aplicados  
✅ Inyección de dependencias  
✅ Documentación automática con Swagger  
✅ Validación de datos con class-validator  
✅ Importaciones limpias mediante path aliases  
✅ Manejo de errores con códigos HTTP apropiados  
✅ CORS habilitado para integración con frontend  
✅ Health check endpoint  

## 📝 Próximos Pasos para Producción

Para preparar este microservicio para producción, considera:

1. **Base de datos**: Reemplazar `InMemoryProductRepository` con TypeORM, Prisma o MongoDB
2. **Autenticación**: Agregar JWT y guards
3. **Logging**: Implementar Winston o Pino
4. **Variables de entorno**: Usar @nestjs/config
5. **Docker**: Crear Dockerfile y docker-compose
6. **CI/CD**: Configurar pipelines de despliegue
7. **Monitoring**: Agregar Prometheus/Grafana
8. **Tests**: Aumentar cobertura de tests unitarios y E2E

## 📄 Licencia

MIT
