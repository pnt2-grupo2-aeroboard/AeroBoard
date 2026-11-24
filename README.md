Markdown
# AeroBoard – Tablero de Arribos y Partidas

TP final de Programación en Nuevas Tecnologías 2 (ORT). Grupo 2: Lucas Pisati y Gonzalo Mariscotti.

## Qué hace
- Pasajeros con cuenta: ven y buscan vuelos de Aeroparque y Ezeiza.
- Admin: crea, edita y borra vuelos.
- Se puede instalar como app (PWA).

## Tecnologías
Vue 3 (Composition API) · Vite · Vue Router · Pinia · Axios · Tailwind CSS · Supabase · Docker · Render

## Instalación
1. `git clone git@github.com:pnt2-grupo2-aeroboard/AeroBoard.git`
2. `cd AeroBoard` y `npm install`
3. Copiar `.env.example` como `.env` y completar la URL y la anon key de Supabase.
4. `npm run dev` y abrir http://localhost:8080

## Variables de entorno (secrets)
| Variable | Descripción |
| --- | --- |
| VITE_SUPABASE_URL | URL del proyecto de Supabase |
| VITE_SUPABASE_ANON_KEY | Clave pública (anon) de Supabase |

En GitHub Actions y en Render se cargan como secrets, nunca en el código.

## Estructura
`src/components` · `src/composables` · `src/config` · `src/router` · `src/services` · `src/stores` · `src/views`

## Roles
| Acción | Pasajero | Admin |
| --- | --- | --- |
| Ver y buscar vuelos | Sí | Sí |
| Crear, editar y borrar vuelos | No | Sí |
Link: (completar)

## Deploy