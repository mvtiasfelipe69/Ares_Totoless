# Formularios de login/registro con Alpine + toasts globales
**Fecha:** 2026-11-12
**Integrante:** Jesús Briceño (@yisuscrist67)
**Herramienta y modelo:** Claude (Claude Opus 5.5)
**Archivos afectados:** js/formularios.js (nuevo), js/toasts.js (nuevo), index.html (modales de login y registro, contenedor de toasts, scripts), js/app.js (se quitó el login/registro antiguo y se cerró agregarCancionAPlaylist), ia/README.md (fila nueva)

## Objetivo
Conectar los modales de login y registro de Bootstrap a `api.login` y `api.registrar` usando Alpine: validación por campo con el mensaje de error bajo cada input, botón deshabilitado con spinner mientras envía y mensaje de éxito. Agregar `Alpine.store('toasts')` con toasts de Bootstrap para avisar éxito o error en toda la app.

## Conversación (texto completo, sin editar)

### Prompt 1
Lee el doc plan-entrega-2 del proyecto y revisa el repo actual en GitHub. Soy Yisus (@yisuscrist67). Paso 3 (pasos 1 y 2 ya subidos): conecta los modales de login y registro de Bootstrap a api.login y api.registrar usando Alpine: validación por campo con el mensaje de error bajo cada input, botón deshabilitado con spinner mientras envía, y mensaje de éxito. Agrega Alpine.store('toasts') con toasts de Bootstrap para avisar éxito o error en toda la app. Marca el código con [IA] apuntando a ia/2026-11-12_yisuscrist67_formularios-toasts.md. Explícamelo por partes y dame la plantilla del registro, la fila del índice y los comandos de commit.

### Respuesta 1
<!-- PEGA AQUÍ la respuesta completa de Claude, tal cual, sin resumir ni editar -->

<!-- Si hubo más mensajes, repite "### Prompt N" / "### Respuesta N" por cada uno -->

## Qué se incorporó al proyecto
- js/toasts.js: `Alpine.store('toasts')` con `mostrar`, `exito`, `error`, `quitar` y `activar` (enciende el toast de Bootstrap y lo saca de la lista al ocultarse).
- js/formularios.js: `Alpine.data('formLogin')` y `Alpine.data('formRegistro')`, que comparten `crearFormulario()`: reglas de validación por campo, estado `enviando`, mensaje de éxito, error general y error 409 (correo repetido) bajo el input del correo.
- index.html: modales de login y registro con `x-data`, `x-model`, `:class` (is-invalid/is-valid), mensajes bajo cada input, botón con spinner; contenedor de toasts con `x-for`; carga de js/toasts.js y js/formularios.js.
- js/app.js: se eliminó el código anterior de login/registro (llamaba a `api.login` con argumentos sueltos).
- js/app.js (al integrar el commit de Carlos): se quitó el login/registro falso que volvió a aparecer (entraba sin revisar contraseña y duplicaba los listeners de los formularios) y se agregaron las 3 llaves de cierre que le faltaban a `agregarCancionAPlaylist` (error de sintaxis que impedía cargar app.js). Se mantuvo el resto del código de playlists de Carlos.

## Qué se modificó respecto a la respuesta de la IA
<!-- Escribe aquí lo que cambiaste a mano (o "Nada, se usó tal cual") -->

## Verificación
<!-- Escribe lo que probaste TÚ en Live Server. Sugerencia:
1. Login vacío → "Ingresa tu correo." y "Ingresa tu contraseña." bajo cada input.
2. admin@arestotoless.cl / malamala → botón con spinner, luego "Correo o contraseña incorrectos" y toast rojo.
3. admin@arestotoless.cl / admin123 → mensaje verde, toast verde, se cierra el modal y aparece "Hola, Admin Ares".
4. Registro con correo inválido y contraseñas distintas → error bajo cada campo al salir del input.
5. Registro con admin@arestotoless.cl → "Ya existe una cuenta con ese correo" bajo el correo.
6. Registro con un correo nuevo → cuenta creada, toast y sesión iniciada. -->
