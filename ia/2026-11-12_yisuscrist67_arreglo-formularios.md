# Arreglo: recuperar formularios Alpine y toasts tras el commit de perfil
**Fecha:** 2026-11-12
**Integrante:** Jesús Briceño (@yisuscrist67)
**Herramienta y modelo:** Claude (Claude Opus 5.5)
**Archivos afectados:** index.html, js/app.js, ia/README.md

## Objetivo
El commit 32b40e0 (perfil) se hizo sobre una copia vieja de index.html y js/app.js y borró sin querer lo del commit 1bbc7ef: los modales de login y registro hechos con Alpine (validación por campo, spinner y mensaje de éxito), el contenedor de toasts globales y la carga de js/toasts.js y js/formularios.js. En su lugar volvió un login hecho a mano en js/app.js (`enviarAutenticacion`). El objetivo es volver a los formularios Alpine y a los toasts sin romper el perfil ni la sesión, y sin dejar en app.js un segundo login que haga lo mismo.

## Conversación (texto completo, sin editar)
### Prompt 1
Lee el doc plan-entrega-2 del proyecto y revisa el repo actual en GitHub. Soy Yisus (@yisuscrist67). El commit 32b40e0 (perfil) sacó de index.html js/toasts.js y js/formularios.js y movió el login a js/app.js con enviarAutenticacion. Quiero recuperar los formularios de login y registro con Alpine (validación por campo con mensaje bajo cada input, spinner en el botón y mensaje de éxito) y los toasts globales, sin romper el perfil ni la sesión, y sin dejar código duplicado en app.js. Marca el código con [IA] apuntando a ia/2026-11-12_yisuscrist67_arreglo-formularios.md. Explícame qué se rompió y por qué, y dame el registro y el commit.

### Respuesta 1
<!-- PEGA AQUÍ la respuesta completa de Claude, sin resumir ni editar -->

## Qué se incorporó al proyecto
- index.html: vuelven los modales `#modalLogin` (x-data="formLogin") y `#modalRegistro` (x-data="formRegistro"), con un mensaje de error bajo cada input, spinner en el botón, mensaje de error general y mensaje de éxito. Vuelve el `#contenedor_toasts`, que dibuja `$store.toasts.lista`. Se vuelven a cargar js/toasts.js y js/formularios.js después de js/sesion.js y antes de js/perfil.js y js/app.js. El perfil (menú, vista #perfil, ruta en el 404 y js/perfil.js) no se tocó.
- js/app.js: se quitó el login y registro hecho a mano (`enviarAutenticacion`, los listeners de submit de #form_login y #form_registro y `validarContrasenas`). Queda solo un comentario [IA] que indica dónde vive ahora. Se mantiene `cerrarModalYResetear`, porque la usa el formulario de crear playlist.
- ia/README.md: se agregó otra vez la fila de formularios-toasts (el commit de perfil la había borrado) y se agregó la fila de este registro.
- js/formularios.js, js/toasts.js, js/sesion.js, js/api.js y js/perfil.js no cambian. `api.login({ correo, password })` y `api.registrar({ nombre, correo, password })` (409 si el correo ya existe) siguen como los esperan los formularios.

## Qué se modificó respecto a la respuesta de la IA
<!-- Escribe aquí lo que cambiaste a mano (o "Nada, se usó tal cual") -->

## Verificación
Claude lo probó en Chromium (sin conexión a internet, sirviendo Alpine y Bootstrap desde local) y no hubo errores en la consola:
1. Login vacío: aparecen "Ingresa tu correo." y "Ingresa tu contraseña." bajo cada campo, y no se llama a la API.
2. admin@arestotoless.cl con una contraseña mala: el botón muestra el spinner y "Ingresando…". Después aparece "Correo o contraseña incorrectos" en la alerta y en un toast rojo.
3. admin@arestotoless.cl / admin123: aparece "¡Hola de nuevo, Admin Ares!", el modal se cierra y la sesión queda activa. La API se llamó una sola vez por envío.
4. #perfil muestra los datos del usuario.
5. Sin sesión, al entrar a #perfil se vuelve a #vista_musica y se abre el login. En el registro: si las contraseñas son distintas aparece el error bajo "Confirmar". Con un correo que ya existe, el error 409 aparece bajo el campo del correo.
6. Registro válido: aparece "Cuenta creada. ¡Bienvenido, …!", la sesión queda iniciada y se vuelve a #perfil, el destino que había pedido el guardia.

<!-- Agrega aquí lo que probaste TÚ en Live Server. -->
