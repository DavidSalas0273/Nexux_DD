# Nexus DD Backend

API REST para autenticación y gestión de usuarios con Node.js, Express y PostgreSQL.

## Requisitos

- Node.js 18+
- PostgreSQL 14+

## Instalación

```bash
cd backend
npm install
```

## Configuración

1. Copia `.env.example` a `.env` y completa tus credenciales:

```bash
cp .env.example .env
```

2. Crea la base de datos en PostgreSQL:

```sql
CREATE DATABASE nexus_dd;
```

3. Inicializa las tablas:

```bash
npm run init-db
```

## Uso

```bash
# Producción
npm start

# Desarrollo (con auto-reload)
npm run dev
```

## Endpoints

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/auth/register` | Registrar nuevo usuario | No |
| POST | `/api/auth/login` | Iniciar sesión | No |
| GET | `/api/users/profile` | Obtener perfil del usuario | Sí |
| GET | `/api/health` | Health check | No |

### Registro

```json
POST /api/auth/register
Content-Type: multipart/form-data

Fields:
- nombre: string
- correo: string
- password: string
- foto: file (opcional, max 5MB, jpg/png/gif)
```

### Login

```json
POST /api/auth/login
Content-Type: application/json

{
  "correo": "usuario@ejemplo.com",
  "password": "tucontraseña"
}
```

Respuesta:

```json
{
  "message": "Inicio de sesión exitoso",
  "token": "eyJhbGci...",
  "user": {
    "id": 1,
    "nombre": "Usuario",
    "correo": "usuario@ejemplo.com",
    "foto": "/uploads/profile-123.jpg"
  }
}
```
