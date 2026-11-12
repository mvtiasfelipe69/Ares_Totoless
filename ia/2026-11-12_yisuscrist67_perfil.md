# Vista Mi perfil con configuración del simulador de API
**Fecha:** 2026-11-12
**Integrante:** Jesús Briceño (@yisuscrist67)
**Herramienta y modelo:** Claude (Claude Opus 5.5)
**Archivos afectados:** js/perfil.js (nuevo), js/api.js, js/sesion.js, js/app.js, index.html, mocks/usuarios.json, js/api-copia.js (eliminado), mocks/usuarios1.json (eliminado), ia/README.md

## Objetivo
Crear la vista privada #perfil con los datos del usuario y un formulario para editar el nombre (nueva función api.actualizarPerfil), una sección Configuración en acordeón de Bootstrap con el simulador de API (probabilidad de falla y forzar error, clave aresTotoless:config) y un botón para restablecer los datos de prueba, y agregar "Mi perfil" al menú.

## Conversación (texto completo, sin editar)
### Prompt 1
Lee el doc plan-entrega-2 del proyecto y revisa el repo actual en GitHub. Soy Yisus (@yisuscrist67). Paso 4 (pasos 1 a 3 ya subidos): crea la vista #perfil (privada) con los datos del usuario y un formulario para editar el nombre usando una nueva función api.actualizarPerfil, y una sección Configuración en acordeón de Bootstrap con el simulador de API (probabilidad de falla y forzar error, usando la clave aresTotoless:config) y un botón para restablecer los datos de prueba. Agrega el enlace "Mi perfil" al menú. Marca el código con [IA] apuntando a ia/2026-11-12_yisuscrist67_perfil.md. Explícamelo por partes y dame la plantilla del registro, la fila del índice y los comandos de commit.

### Respuesta 1
Voy a leer el plan de la Entrega 2 y revisar el repo para construir el paso 4 encima de lo que ya subieron.

El paso 4 está listo. Lo probé en Chrome sin interfaz con 20 verificaciones y todas pasaron, sin errores en consola. Pero antes tengo que avisarte de algo importante.

⚠️ El login que está en GitHub no funcionaba

Al revisar el repo encontré tres fallas del paso 2:

El código de login y registrar quedó en js/api-copia.js, y index.html no carga ese archivo. Por eso api.login no existía y el login siempre fallaba.
Los usuarios quedaron en mocks/usuarios1.json. El archivo mocks/usuarios.json, que es el que lee la API, estaba vacío.
app.js llamaba a las funciones con otros parámetros. Usaba api.login(correo, contrasena), pero la función espera api.login({ correo, password }).

Como el perfil necesita una sesión que funcione, lo arreglé en este mismo commit. Moví el código a api.js, los datos a usuarios.json, borré las dos copias y corregí las llamadas. También volví a poner la fila de auth-usuarios en ia/README.md, que se había borrado en el commit del paso 3.

La explicación por partes

1. api.actualizarPerfil (en js/api.js)

Funciona como un método más de la “clase” api. Usa ejecutar(), así que tiene la misma latencia y los mismos errores simulados que los demás.
Primero valida el nombre: entre 2 y 40 caracteres, y solo letras (incluye tildes y ñ), espacios, apóstrofes o guiones.
Desde el navegador no se puede escribir en usuarios.json. Por eso los cambios se guardan aparte en aresTotoless:perfiles y se aplican encima cada vez que se leen los usuarios. Se parece a un HashMap<id, cambios> que pisa los datos originales.
Gracias a eso, el login también devuelve el nombre nuevo.

2. api.simulador (en js/api.js)

Tiene tres funciones: leer(), guardar() y restablecer(), todas sobre la clave aresTotoless:config.
No son endpoints, así que no pasan por ejecutar() y nunca fallan.
restablecer() borra todas las claves que empiezan con aresTotoless:.

3. js/perfil.js (archivo nuevo)

Es Alpine.data('perfil'). Piénsalo como una clase con atributos (nombre, errorNombre, enviando…) y métodos. El HTML se actualiza solo cuando cambian los atributos.
guardarNombre() hace esto en orden:
Valida el campo y, si hay error, lo muestra debajo del input.
Pone enviando = true, lo que deshabilita el botón y muestra “Guardando…”.
Llama a la API.
Si falla, muestra el error en rojo. Si sale bien, muestra un mensaje verde y llama a $store.sesion.actualizar(), que agregué en sesion.js. Así el “Hola, …” del menú cambia solo.

4. La vista en index.html

A la izquierda va una tarjeta con iniciales, correo, plan, rol, fecha de registro y el formulario.
A la derecha va un acordeón de Bootstrap con dos secciones:
Simulador de API: un slider de probabilidad de falla de 0 a 100 %, un selector para forzar 400/401/404/500 y un botón Probar API que hace una llamada real para que veas el efecto. Esto sirve para mostrárselo al profe.
Datos de prueba: el botón para restablecer pide confirmación y después cierra la sesión.
Agregué “Mi perfil” al menú lateral y '#perfil' a la lista de rutas del 404. Sin eso, la página 404 aparecía debajo del perfil.
Registro IA

El archivo ia/2026-11-12_yisuscrist67_perfil.md viene en el zip, casi completo. Antes del commit tienes que llenar tres cosas:

Pegar tu prompt y mi respuesta completos.
La sección “Qué se modificó”.
La sección “Verificación”, con lo que pruebes tú en Live Server. Te dejé los pasos sugeridos dentro del archivo.
Fila del índice (ya incluida en ia/README.md)
| 2026-11-12 | @yisuscrist67 | Vista Mi perfil y configuración del simulador de API | js/perfil.js, js/api.js, js/sesion.js, js/app.js, index.html, mocks/usuarios.json | [2026-11-12_yisuscrist67_perfil.md](2026-11-12_yisuscrist67_perfil.md) |
Comandos
bash
git pull --rebase
# descomprime paso4_perfil.zip en la carpeta del repo (reemplaza los archivos)
# llena el registro ia/2026-11-12_yisuscrist67_perfil.md y pruébalo en Live Server
git rm js/api-copia.js mocks/usuarios1.json
git add index.html js/api.js js/app.js js/sesion.js js/perfil.js mocks/usuarios.json ia/README.md ia/2026-11-12_yisuscrist67_perfil.md
git commit -m "feat(perfil): agrega vista perfil con configuracion del simulador y corrige login [IA]"
git push

Para probar puedes entrar con camila.rojas@arestotoless.cl / camila123.

Un detalle para Matías: algunas marcas [IA] suyas apuntan a ia/2026-11-11_mvtiasfelipe69_api_js y ..._html_2 sin el .md, así que esas rutas no existen. Eso le toca corregirlo a él según el reparto.
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
