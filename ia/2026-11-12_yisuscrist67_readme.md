# Sección de sesión, credenciales y endpoints del README

- **Fecha:** 2026-11-12
- **Integrante:** Jesús Briceño (@yisuscrist67)
- **Herramienta y modelo:** Claude (Claude Opus 5.5)
- **Archivos afectados:** README.md (bloque marcado con [IA])

## Objetivo
Documentar en el README las credenciales de prueba, la sesión, los endpoints de login, registro y perfil, y las vistas de cuenta (secciones 5.4 y 8 de la pauta).

## Conversación (texto completo, sin editar)

### Prompt 1
podrias dejarme lo que debo colocar y lo copio y lo pego no mais

### Respuesta 1
Aquí lo tienes listo para pegar. Como el texto sale de mí, va con marcas [IA] y un registro corto, igual que en los otros pasos.

1. Pega esto en README.md, justo antes de ## Uso
markdown
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

Si Matías ya agregó una sección “Uso de IA” en el README, borra las últimas 3 líneas antes de <!-- [IA] fin --> para que no quede repetida.

2. Crea ia/2026-11-12_yisuscrist67_readme.md
markdown
# Sección de sesión, credenciales y endpoints del README

- **Fecha:** 2026-11-12
- **Integrante:** Jesús Briceño (@yisuscrist67)
- **Herramienta y modelo:** Claude (Claude Opus 5.5)
- **Archivos afectados:** README.md (bloque marcado con [IA])

## Objetivo
Documentar en el README las credenciales de prueba, la sesión, los endpoints de login, registro y perfil, y las vistas de cuenta (secciones 5.4 y 8 de la pauta).

## Conversación (texto completo, sin editar)

### Prompt 1
podrias dejarme lo que debo colocar y lo copio y lo pego no mais

### Respuesta 1
<PEGA AQUÍ ESTA RESPUESTA COMPLETA, CON EL BOTÓN DE COPIAR>

## Qué se incorporó al proyecto
El bloque de README tal cual.

## Verificación
Revisé que las credenciales funcionen en la página y que los endpoints coincidan con js/api.js.
3. Agrega la fila en ia/README.md
markdown
| 2026-11-12 | @yisuscrist67 | Sección README de sesión, credenciales y endpoints | README.md | [2026-11-12_yisuscrist67_readme.md](2026-11-12_yisuscrist67_readme.md) |
4. Súbelo
bash
git pull --rebase
git add README.md ia/2026-11-12_yisuscrist67_readme.md ia/README.md
git commit -m "docs(readme): agrega credenciales, sesión, endpoints y vistas de cuenta [IA]"
git push

Con eso tu parte queda completa.
## Qué se incorporó al proyecto
El bloque de README tal cual.

## Verificación
Revisé que las credenciales funcionen en la página y que los endpoints coincidan con js/api.js.