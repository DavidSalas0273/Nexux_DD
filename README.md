# Nexus DD

Aplicación web fullstack con Angular (frontend) y Node.js + Express + PostgreSQL (backend).  
Incluye registro de usuarios, inicio de sesión con JWT y sesión persistente.

---

## Requisitos previos

Asegúrate de tener instalado lo siguiente antes de comenzar:

| Herramienta | Versión mínima | Descarga |
|---|---|---|
| Node.js | 18+ | https://nodejs.org |
| npm | 9+ | incluido con Node.js |
| PostgreSQL | 14+ | https://www.postgresql.org/download |
| Angular CLI | 22+ | `npm install -g @angular/cli` |

---

## Estructura del proyecto

```
nexus-dd/
├── backend/               # API REST - Node.js + Express + PostgreSQL
│   ├── src/
│   │   ├── config/        # Conexión a la base de datos
│   │   ├── controllers/   # Lógica de negocio (auth, usuarios)
│   │   ├── middleware/    # Middleware de autenticación JWT
│   │   ├── queries/       # Queries SQL
│   │   ├── routes/        # Rutas de la API
│   │   ├── scripts/       # Script de inicialización de BD
│   │   └── server.js      # Punto de entrada del servidor
│   ├── .env.example       # Plantilla de variables de entorno
│   └── package.json
└── src/                   # Frontend - Angular
    └── app/
        ├── guards/        # Auth guard para rutas protegidas
        ├── interceptors/  # Interceptor HTTP para JWT
        ├── models/        # Interfaces TypeScript
        ├── pages/         # Componentes de páginas (login, register, dashboard)
        └── services/      # Servicio de autenticación
```

---

## Configuración y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/DavidSalas0273/Nexux_DD.git
cd Nexux_DD
```

---

### 2. Configurar el Backend

#### 2.1 Instalar dependencias

```bash
cd backend
npm install
```

#### 2.2 Crear el archivo de variables de entorno

```bash
# Windows CMD
copy .env.example .env

# Windows PowerShell / Mac / Linux
cp .env.example .env
```

Abre el archivo `.env` y completa tus datos:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_contraseña_aqui
DB_NAME=nexus_dd

JWT_SECRET=cambia_esto_por_una_clave_segura
JWT_EXPIRES_IN=24h

UPLOAD_DIR=uploads
```

#### 2.3 Crear la base de datos en PostgreSQL

Abre psql o pgAdmin y ejecuta:

```sql
CREATE DATABASE nexus_dd;
```

#### 2.4 Inicializar las tablas

```bash
npm run init-db
```

Deberías ver en consola:
```
Conectando a PostgreSQL...
Tabla "usuarios" creada correctamente
Base de datos inicializada con éxito
```

#### 2.5 Iniciar el servidor backend

```bash
# Producción
npm start

# Desarrollo (auto-reload)
npm run dev
```

El backend quedará corriendo en: **http://localhost:3000**

Para verificar que está funcionando, abre en el navegador:
```
http://localhost:3000/api/health
```
Respuesta esperada: `{"status":"ok","message":"Nexus DD API is running"}`

---

### 3. Configurar el Frontend

Abre **otra terminal** en la carpeta raíz del proyecto (`nexus-dd/`):

#### 3.1 Instalar dependencias

```bash
npm install
```

#### 3.2 Iniciar el servidor de desarrollo

```bash
npm start
```

El frontend quedará corriendo en: **http://localhost:4200**

---

## Uso de la aplicación

1. Abre **http://localhost:4200** en el navegador
2. Haz clic en **"Regístrate aquí"** para crear una cuenta
3. Completa el formulario con nombre, correo, contraseña y foto (opcional)
4. Al registrarte serás redirigido automáticamente al dashboard
5. Puedes cerrar sesión y volver a iniciarla con tu correo y contraseña

---

## Endpoints de la API

| Método | Ruta | Descripción | Autenticación |
|--------|------|-------------|---------------|
| GET | `/api/health` | Estado del servidor | No |
| POST | `/api/auth/register` | Registrar nuevo usuario | No |
| POST | `/api/auth/login` | Iniciar sesión | No |
| GET | `/api/users/profile` | Obtener perfil del usuario | Sí (Bearer JWT) |

### Ejemplo: Registro

```
POST http://localhost:3000/api/auth/register
Content-Type: multipart/form-data

nombre: Juan Pérez
correo: juan@ejemplo.com
password: micontraseña123
foto: (archivo de imagen, opcional)
```

### Ejemplo: Login

```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "correo": "juan@ejemplo.com",
  "password": "micontraseña123"
}
```

---

## Tecnologías utilizadas

**Frontend**
- Angular 22
- TypeScript 6
- RxJS 7

**Backend**
- Node.js 18+
- Express 4
- PostgreSQL 14+
- JWT (jsonwebtoken)
- bcryptjs
- multer (subida de archivos)

---

## Ramas del repositorio

| Rama | Descripción |
|------|-------------|
| `main` | Código estable de producción |
| `develop` | Rama de integración |
| `feature-david-login-usuario` | Feature de login y registro de usuarios |
