# ✈️ AeroBoard

Tablero de **arribos y partidas** de Aeroparque (AEP) y Ezeiza (EZE), hecho con **Vue 3**.
Trabajo Práctico Final de **Programación en Nuevas Tecnologías 2**, ORT Argentina.

🔗 **Deploy:** https://aeroboard-ghlh.onrender.com

## 👥 Integrantes

- Lucas Pisati
- Gonzalo Mariscotti

## 📋 Descripción

AeroBoard muestra los vuelos de los dos aeropuertos de Buenos Aires, con filtros y búsqueda.
Hay dos perfiles:

| Rol | Qué puede hacer |
|---|---|
| **Pasajero** (`user`) | Registrarse, iniciar sesión, ver el tablero, filtrar por aeropuerto, tipo y estado, y buscar por vuelo o ciudad |
| **Administrador** (`admin`) | Todo lo anterior, más **crear, editar y borrar vuelos** (ABM) |

## 🛠️ Tecnologías

- **Vue 3** (Composition API, `<script setup>`) + **Vite**
- **Vue Router**: rutas con guard (`requiresAuth` y `requiresAdmin`)
- **Pinia** + `pinia-plugin-persistedstate`: sesión del usuario
- **Axios**: consumo de la REST API de Supabase (con interceptores y refresh token)
- **Supabase** (BaaS): Auth (GoTrue), base de datos Postgres y REST (PostgREST) con RLS
- **Tailwind CSS v4**
- **vite-plugin-pwa**: la app se puede instalar en el celular
- **Vitest**: tests unitarios
- **Docker + Nginx**: imagen de producción
- **GitHub Actions + Render**: CI/CD

## 📁 Estructura

```
src/
├── components/    # VueloCard.vue
├── composables/   # useAuth, useFetchVuelos, useVuelosAdmin
├── config/        # variables de entorno
├── router/        # rutas y guard de navegación
├── services/      # api.js (axios), auth, roles, vuelos
├── stores/        # Pinia: authStore
├── views/         # Tablero, AdminVuelos, SignIn, SignUp
├── pwa.js         # registro del service worker
└── main.js
tests/             # tests unitarios (Vitest)
.github/workflows/ # CI/CD
Dockerfile         # build + Nginx
nginx.conf         # config para SPA
```

## 🚀 Instalación local

**Requisitos:** Node.js 22 o superior y una cuenta de Supabase.

1. Clonar el repo:
   ```bash
   git clone https://github.com/pnt2-grupo2-aeroboard/AeroBoard.git
   cd AeroBoard
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Crear el archivo `.env` copiando el ejemplo:
   ```bash
   cp .env.example .env
   ```
   y completar con los datos de Supabase (**Project Settings → API**):
   ```
   VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-anon-key
   ```
4. Levantar el proyecto:
   ```bash
   npm run dev
   ```
   Abrir http://localhost:8080

## 🗄️ Base de datos (Supabase)

- **`vuelos`**: `numero`, `aerolinea`, `tipo` (arribo/partida), `origen_destino`, `fecha_hora`, `puerta`, `estado` (a horario/demorado/embarcando/cancelado) y `aeropuerto` (AEP/EZE).
- **`user_roles`**: `user_id` y `role` (`user` o `admin`). Un **trigger** le asigna `user` a cada cuenta nueva.
- **RLS**: cualquier usuario logueado puede leer los vuelos. Solo un `admin` puede insertarlos, modificarlos o borrarlos (función `mi_rol()`).

Para hacer admin a un usuario, en el SQL Editor de Supabase:
```sql
update user_roles set role = 'admin'
where user_id = (select id from auth.users where email = 'mail@ejemplo.com');
```

## 🧪 Tests

```bash
npm test
```

Tests unitarios con Vitest sobre la lógica crítica:
- `tests/authStore.test.js`: login, roles (admin y user) y cierre de sesión en el store.
- `tests/useVuelosAdmin.test.js`: ABM del composable con un service falso (crear, borrar y manejo de errores).

## 📱 PWA

La app usa `vite-plugin-pwa`, que genera el manifest y el service worker.
En el celular se puede instalar con **"Agregar a pantalla de inicio"**. En Chrome de escritorio aparece un ícono de instalar en la barra de direcciones.

## 🐳 Docker

Build en dos etapas: **Node** compila la app y **Nginx** sirve el `dist` en el puerto 10000.

```bash
docker build \
  --build-arg VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co \
  --build-arg VITE_SUPABASE_ANON_KEY=tu-anon-key \
  -t aeroboard .
docker run -p 10000:10000 aeroboard
```

Abrir http://localhost:10000

## 🔄 CI/CD (GitHub Actions + Render)

El workflow `.github/workflows/ci-cd.yml` se ejecuta en cada push o pull request a `main`:

1. **CI**: `npm ci` → `npm test` → `npm run build`.
2. **CD** (solo en push a `main` y si el CI pasó): llama al **Deploy Hook** de Render, que construye la imagen Docker y la publica.

### 🔐 Secrets de GitHub necesarios

Se cargan en **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Para qué se usa | De dónde sale |
|---|---|---|
| `VITE_SUPABASE_URL` | URL del proyecto de Supabase, la usa el build del CI | Supabase → Project Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Clave pública (anon) de Supabase para el build | Supabase → Project Settings → API |
| `RENDER_DEPLOY_HOOK_URL` | URL secreta que dispara el deploy en Render | Render → servicio → Settings → Deploy Hook |

### ☁️ Configuración en Render

1. **New → Web Service** → conectar el repo → **Language: Docker** → plan **Free**.
2. En **Environment Variables**, cargar `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`. Render las pasa al Dockerfile como build args.
3. En **Settings → Auto-Deploy: Off**. Así el deploy lo dispara solo GitHub Actions, después de que pasen los tests.

> El plan Free se duerme por inactividad. La primera carga puede tardar unos 50 segundos.
