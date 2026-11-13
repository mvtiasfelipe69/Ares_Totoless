# Ares_Totoless

### Integrantes :
- Carlos Cereceda
- Matias Herrera
- Jesus Briceño

## Descripcion

AresTotoless es una pagina web destinada a la gestion y reproduccion de musica. La principal oferta del proyecto es una interfaz sencilla que permita explorar canciones , organizar playlists y reproducir musica. 

El proyecto actualmente se encuentra en estado de desarrollo, por lo tanto aun se estan implementando funcionalidades.

## Funcionalidades
- Exploracion de musica en la seccion principal
- Buscador de canciones y artistas
- Visualizacion de playlists
- Reproduccion de musica
- Inicio de sesion
- Registro de usuarios
- Diseño adaptable segun tamaño de pantalla
- Reproductor de radio 

## Tecnologia utilizada
- HTML5
- CSS3
- JavaScript
- Bootstrap 5.3.3

## Estructura del proyecto
### AresTotoless/
index.html
css/
- styles.css
js/
- app.js
README.md

## Instalacion y ejecucion

Para ejecutar el proyecto localmente, copia el repositorio y abre el archivo "index.html" en un navegador.

<!-- [IA] inicio · ia/2026-11-12_yisuscrist67_readme.md -->
## Credenciales de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | `admin@arestotoless.cl` | `admin123` |
| Usuario | `camila.rojas@arestotoless.cl` | `camila123` |

Los usuarios están en `mocks/usuarios.json`. También se puede crear una cuenta nueva con el botón **Registrarse**. Las cuentas nuevas se guardan en el navegador (localStorage) y se mantienen al recargar.

## Sesión y rutas privadas

- Al iniciar sesión, el usuario se guarda en localStorage (clave `aresTotoless:sesion`), así que la sesión se mantiene al recargar la página.
- Las vistas **Playlists** y **Mi perfil** son privadas: sin sesión, la app vuelve al inicio y abre el formulario de inicio de sesión. Después de ingresar, lleva a la vista que se había pedido.
- **Cerrar sesión** borra la sesión guardada y sale de las vistas privadas.

## Endpoints simulados: sesión y perfil

| Función | Método | Ruta equivalente | Descripción |
|---|---|---|---|
| `api.login(credenciales)` | POST | `/api/auth/login` | Inicia sesión con `{ correo, password }`. 200 · 400 (campos vacíos) · 401 (credenciales incorrectas) |
| `api.registrar(datos)` | POST | `/api/auth/registro` | Crea una cuenta con `{ nombre, correo, password }`. 201 · 400 (datos inválidos) · 409 (correo ya registrado) |
| `api.actualizarPerfil(id, cambios)` | PATCH | `/api/usuarios/:id` | Cambia el nombre del usuario. 200 · 400 · 404 |

Todas las funciones son asíncronas, esperan entre 300 y 800 ms y responden con el formato `{ ok, status, data, error }`. La contraseña nunca se devuelve en la respuesta.

## Vistas de cuenta

| Vista | Ruta | Cómo llegar | Acceso |
|---|---|---|---|
| Iniciar sesión | (modal) | Botón **Iniciar sesión** del encabezado | Pública |
| Registro | (modal) | Botón **Registrarse** del encabezado | Pública |
| Mi perfil | `#perfil` | Menú lateral → **Mi perfil** | Privada |

En **Mi perfil → Configuración → Simulador de API** se puede subir la probabilidad de falla o forzar un error (por ejemplo 500), para ver cómo la interfaz muestra los errores. En **Datos de prueba** se restablecen los datos originales de los mocks.

## Uso de IA

El registro de todas las consultas a IA está en [`ia/README.md`](ia/README.md).
<!-- [IA] fin -->

## Uso 

Al ingresar en la pagina se muestra la seccion principal de musica, donde se pueden ver las canciones y playlists disponibles.

La pagina cuenta con buscador tanto para canciones como para artistas, opciones de inicio de sesion o registro de usuario y un reproductor ubicado en la parte inferior

## Estado del proyecto

Actualmente el proyecto se encuentra en desarrollo. La estructura de la interfaz esta implementada, mientras que algunas funcionalidades estan aun en desarrollo.
