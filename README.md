# Ares_Totoless

### Integrantes :
- Carlos Cereceda
- Matias Herrera
- Jesus Briceño

## Descripcion

AresTotoless es una pagina web destinada a la gestion y reproduccion de musica. La principal oferta del proyecto es una interfaz sencilla que permita explorar canciones, organizar playlists y reproducir musica mediante un frontend reactivo conectado a una capa de datos simulados (mocks).

## Funcionalidades
- Exploracion de musica en la seccion principal con reproductor fijo en la parte inferior
- Buscador de canciones y artistas, filtro por genero, ordenamiento y paginacion
- Creacion, edicion y eliminacion (CRUD) de playlists con persistencia en localStorage
- Vistas de detalle para canciones y artistas
- Inicio de sesion y registro de usuarios con validacion por campo
- Perfil de usuario, simulador de fallos de API y panel de administracion segun rol
- Diseño adaptable segun tamaño de pantalla (movil, tablet y escritorio)

## Tecnologia utilizada
- HTML5 semántico
- CSS3 (`css/custom.css`)
- JavaScript (ES6+)
- Alpine.js 3.17.5 (incluido vía CDN): utilizado para el estado reactivo de las vistas, formularios y tiendas globales (`Alpine.store`).
- Bootstrap 5.3.3 (incluido vía CDN): utilizado en lugar de Tailwind CSS para mantener consistencia con la maquetación responsiva base de la Entrega 1 y aprovechar sus componentes accesibles (modales, acordeón, toasts y menú colapsable).

## Estructura del proyecto
### AresTotoless/
- `index.html`
- `README.md`
- `css/`
  - `custom.css`
- `js/`
  - `api.js`
  - `vistas.js`
  - `sesion.js`
  - `toasts.js`
  - `formularios.js`
  - `perfil.js`
  - `playlists.js`
- `mocks/`
  - `artistas.json`
  - `canciones.json`
  - `generos.json`
  - `playlists.json`
  - `usuarios.json`
- `ia/`
  - `README.md`

## Instalación y ejecución

1. Clona el repositorio: `git clone https://github.com/mvtiasfelipe69/Ares_Totoless.git`
2. Abre la carpeta en VS Code.
3. Instala la extensión **Live Server** (no requiere Node.js ni `npm`, ya que las librerías se cargan por CDN).
4. Haz clic derecho en `index.html` y elige **Open with Live Server**.

> No abras `index.html` con doble clic (`file://`): la app carga sus datos con `fetch` y no funcionará.

<!-- [IA] inicio · ia/2026-11-12_yisuscrist67_readme.md -->
## Credenciales de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | `admin@arestotoless.cl` | `admin123` |
| Usuario | `camila.rojas@arestotoless.cl` | `camila123` |

Los usuarios están en `mocks/usuarios.json`. También se puede crear una cuenta nueva con el botón **Registrarse**. Las cuentas nuevas se guardan en el navegador (localStorage) y se mantienen al recargar.

## Sesión y rutas privadas

- Al iniciar sesión, el usuario se guarda en localStorage (clave `aresTotoless:sesion`), así que la sesión se mantiene al recargar la página.
- Las vistas **Playlists** (`#vista_playlists`), **Detalle de playlist** (`#playlist/:id`) y **Mi perfil** (`#perfil`) son privadas: sin sesión, la app vuelve al inicio y abre el formulario de inicio de sesión. Después de ingresar, lleva a la vista que se había pedido.
- La vista **Administración** (`#admin`) solo es accesible para usuarios con rol `admin`.
- **Cerrar sesión** borra la sesión guardada y sale de las vistas privadas.

## Endpoints simulados: sesión y perfil

| Función | Método | Ruta equivalente | Descripción |
|---|---|---|---|
| `api.login(credenciales)` | POST | `/api/auth/login` | Inicia sesión con `{ correo, password }`. 200 · 400 (campos vacíos) · 401 (credenciales incorrectas) |
| `api.registrar(datos)` | POST | `/api/auth/registro` | Crea una cuenta con `{ nombre, correo, password }`. 201 · 400 (datos inválidos) · 409 (correo ya registrado) |
| `api.actualizarPerfil(id, cambios)` | PATCH | `/api/usuarios/:id` | Cambia el nombre del usuario. 200 · 400 · 404 |
| `api.getUsuarios()` | GET | `/api/usuarios` | Lista los perfiles públicos de los usuarios (sin contraseña) para el panel de administración. 200 |

Todas las funciones son asíncronas, esperan entre 300 y 800 ms y responden con el formato `{ ok, status, data, error }`. La contraseña nunca se devuelve en la respuesta.
<!-- [IA] fin -->

<!-- [IA] inicio · ia/2026-11-13_mvtiasfelipe69_readme-completo.md -->
## Endpoints simulados: catálogo y playlists

| Función | Método | Ruta equivalente | Descripción |
|---|---|---|---|
| `api.getCanciones({ busqueda, genero })` | GET | `/api/canciones` | Lista las canciones del catálogo con filtro opcional por búsqueda y género. 200 |
| `api.getCancion(id)` | GET | `/api/canciones/:id` | Devuelve el detalle de una canción por su ID. 200 · 404 |
| `api.getArtistas()` | GET | `/api/artistas` | Lista todos los artistas disponibles. 200 |
| `api.getArtista(id)` | GET | `/api/artistas/:id` | Devuelve el detalle de un artista por su ID. 200 · 404 |
| `api.getCancionesDeArtista(id)` | GET | `/api/artistas/:id/canciones` | Lista las canciones asociadas a un artista. 200 · 404 |
| `api.getGeneros()` | GET | `/api/generos` | Lista los géneros musicales disponibles. 200 |
| `api.getPlaylists()` | GET | `/api/playlists` | Lista las playlists del usuario autenticado. 200 · 401 |
| `api.getPlaylist(id)` | GET | `/api/playlists/:id` | Devuelve una playlist y el detalle de sus canciones. 200 · 401 · 404 |
| `api.crearPlaylist(datos)` | POST | `/api/playlists` | Crea una nueva playlist con `{ nombre, descripcion }`. 201 · 400 · 401 · 409 |
| `api.editarPlaylist(id, cambios)` | PATCH | `/api/playlists/:id` | Edita el nombre o descripción de una playlist. 200 · 400 · 401 · 404 · 409 |
| `api.eliminarPlaylist(id)` | DELETE | `/api/playlists/:id` | Elimina una playlist del usuario. 200 · 401 · 404 |
| `api.agregarCancionAPlaylist(id, cancionId)` | POST | `/api/playlists/:id/canciones` | Añade una canción del catálogo a una playlist. 201 · 401 · 404 · 409 |
| `api.quitarCancionDePlaylist(id, cancionId)` | DELETE | `/api/playlists/:id/canciones/:cancionId` | Quita una canción de una playlist. 200 · 401 · 404 |

## Vistas disponibles

| Vista | Ruta | Cómo llegar | Acceso |
|---|---|---|---|
| Tu música (Inicio) | `#vista_musica` | Logo **AresTotoless**, enlace **Inicio** o menú lateral → **Tu música** | Pública |
| Playlists | `#vista_playlists` | Menú lateral → **Playlists** (CRUD de playlists) | Privada |
| Detalle de playlist | `#playlist/:id` | Clic en una tarjeta de playlist (añadir o quitar canciones) | Privada |
| Explorar | `#vista_explorar` | Menú lateral → **Explorar** o buscador superior (filtros, orden y paginación) | Pública |
| Detalle de canción | `#cancion/:id` | Clic en el título de cualquier canción | Pública |
| Detalle de artista | `#artista/:id` | Clic en el nombre de cualquier artista | Pública |
| Iniciar sesión | (modal) | Botón **Iniciar sesión** del encabezado | Pública |
| Registro | (modal) | Botón **Registrarse** del encabezado | Pública |
| Mi perfil | `#perfil` | Menú lateral → **Mi perfil** | Privada |
| Administración | `#admin` | Menú lateral → **Administración** (solo cuentas con rol `admin`) | Privada (`admin`) |
| Página no encontrada | `#404` | Cualquier ruta hash no reconocida | Pública |
<!-- [IA] fin -->

<!-- [IA] inicio · ia/2026-11-12_yisuscrist67_readme.md -->
En **Mi perfil → Configuración → Simulador de API** se puede subir la probabilidad de falla o forzar un error (por ejemplo 500), para ver cómo la interfaz muestra los errores. En **Datos de prueba** se restablecen los datos originales de los mocks.

## Uso de IA

El registro de todas las consultas a IA está en [`ia/README.md`](ia/README.md).
<!-- [IA] fin -->

## Uso 

Al ingresar en la pagina se muestra la seccion principal de musica, donde se pueden ver las canciones y playlists disponibles.

La pagina cuenta con buscador tanto para canciones como para artistas, opciones de inicio de sesion o registro de usuario y un reproductor ubicado en la parte inferior.

## Estado del proyecto

Frontend completo correspondiente a la Entrega 2 implementado con datos simulados (`mocks/`), capa de servicios asíncrona (`js/api.js`) y persistencia local mediante `localStorage`.