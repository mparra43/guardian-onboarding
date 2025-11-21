# Microservicio de Autenticación - Guardian

## Arquitectura Clean Architecture

Este microservicio implementa Clean Architecture 


### Estructura de Capas

```
src/
├── domain/                 # Capa de Dominio
│   ├── entities/          # Entidades del dominio
│   └── repositories/      # Interfaces de repositorios (DIP)
├── application/           # Capa de Aplicación
│   ├── dto/              # Data Transfer Objects
│   └── use-cases/        # Casos de uso (lógica de negocio)
├── infrastructure/        # Capa de Infraestructura
│   ├── adapters/         # Implementaciones de repositorios
│   └── config/           # Configuraciones
└── presentation/          # Capa de Presentación
    └── controllers/      # Controladores HTTP
```


## Configuración

### Variables de Entorno

```env
PORT=3001
JWT_SECRET=guardian-secret-key-change-in-production
```

## Instalación

```bash
npm install
```

## Ejecución

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## Endpoint de Login

### POST /auth/login

**Request Body:**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 300
}
```

### Usuarios de Prueba

| Username | Password    | Email                |
|----------|-------------|----------------------|
| admin    | password123 | admin@guardian.com   |
| usuario  | admin2024   | usuario@guardian.com |
| test     | test1234    | test@guardian.com    |

### Características

- ✅ JWT con expiración de 5 minutos
- ✅ Validación de credenciales con bcrypt
- ✅ Validación de datos con class-validator
- ✅ Arquitectura limpia y desacoplada
- ✅ Inyección de dependencias
- ✅ Separación de responsabilidades
- ✅ Principios SOLID aplicados

## Prueba del Endpoint

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'
```

## Puerto del Microservicio

Este microservicio se ejecuta en el puerto **3001** por defecto.
