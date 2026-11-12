# Vista Mi perfil con configuración del simulador de API
**Fecha:** 2026-11-12
**Integrante:** Jesús Briceño (@yisuscrist67)
**Herramienta y modelo:** Claude (Claude Opus 5.5)
**Archivos afectados:** js/perfil.js (nuevo), js/api.js, js/sesion.js, js/app.js, index.html, mocks/usuarios.json, js/api-copia.js (eliminado), mocks/usuarios1.json (eliminado), ia/README.md

## Objetivo
Crear la vista privada #perfil con los datos del usuario y un formulario para editar el nombre (nueva función api.actualizarPerfil), una sección Configuración en acordeón de Bootstrap con el simulador de API (probabilidad de falla y forzar error, clave aresTotoless:config) y un botón para restablecer los datos de prueba, y agregar "Mi perfil" al menú.

## Conversación (texto completo, sin editar)
### Prompt 1
<!-- PEGA AQUÍ tu mensaje completo, tal cual lo escribiste -->

### Respuesta 1
<!-- PEGA AQUÍ la respuesta completa de Claude, sin resumir ni editar -->

<!-- Si hubo más mensajes, repite "### Prompt N" / "### Respuesta N" por cada uno -->

## Qué se incorporó al proyecto
- js/perfil.js (nuevo): componente Alpine.data('perfil') con validación del nombre por campo, botón deshabilitado mientras envía, mensajes de error y de éxito, configuración del simulador, botón "Probar API" y restablecer con confirmación.
- js/api.js: endpoint `actualizarPerfil(id, { nombre })` (PATCH /api/usuarios/:id), cambios de nombre guardados en `aresTotoless:perfiles` y aplicados al leer usuarios, y `api.simulador` (leer / guardar / restablecer) sobre `aresTotoless:config`.
- js/sesion.js: método `actualizar(usuario)` en el store de sesión, para refrescar "Hola, <nombre>" tras editar.
- index.html: vista #vista_perfil (tarjeta de datos + acordeón Configuración), enlace "Mi perfil" en el menú lateral, '#perfil' agregado a las rutas conocidas del 404 y carga de js/perfil.js.
- Corrección del commit de auth: login y registrar estaban en js/api-copia.js (que index.html no carga) y los usuarios en mocks/usuarios1.json (mocks/usuarios.json estaba vacío). Se movió el código a js/api.js, los datos a mocks/usuarios.json y se borraron las copias.
- js/app.js: las llamadas se ajustaron a la firma de la API: `api.login({ correo, password })` y `password` en el registro (antes no coincidían).
- ia/README.md: se restauró la fila de auth-usuarios (se había perdido) y se agregó la de este registro.

## Qué se modificó respecto a la respuesta de la IA
Nada, se usó tal cual.
