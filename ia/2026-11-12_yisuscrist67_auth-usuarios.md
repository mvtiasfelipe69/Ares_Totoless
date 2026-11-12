# Usuarios mock + login y registro en la API simulada
**Fecha:** 2026-11-12
**Integrante:** Jesús Briceño (@yisuscrist67)
**Herramienta y modelo:** Claude (Claude Fable 5.2)
**Archivos afectados:** mocks/usuarios.json (completo), js/api.js (bloques marcados con `[IA]`: helpers de usuarios y funciones `login` y `registrar`), ia/README.md (fila nueva)

## Objetivo
Crear los 10 usuarios de prueba (uno admin) y agregar a `window.api` las funciones `login` y `registrar`, sin modificar los endpoints que hizo Matías, entendiendo el código por partes con comparaciones a C++/Java.

## Conversación (texto completo, sin editar)

### Prompt 1
Lee el doc plan-entrega-2 del proyecto. Soy Yisus (@yisuscrist67). Paso 1: crea
mocks/usuarios.json con 10 usuarios (uno admin) y agrega a window.api en js/api.js
las funciones login y registrar, sin borrar lo que hizo Matías. Márcalo con [IA].
Explícamelo por partes comparando con C++/Java y dame la plantilla del registro y el commit.

### Respuesta 1
<!-- PEGA AQUÍ la respuesta completa de Claude, tal cual, sin resumir ni editar -->

<!-- Si le haces más preguntas en la misma conversación, agrega:
### Prompt 2
...
### Respuesta 2
...
-->

## Qué usé y qué cambié
- Usado tal cual: <!-- ej: mocks/usuarios.json y los bloques [IA] de js/api.js -->
- Cambios hechos por mí: <!-- ej: ninguno / cambié tal mensaje de error -->

## Cómo lo verifiqué
<!-- ej: abrí con Live Server y en la consola probé
await api.login({ correo: 'admin@arestotoless.cl', password: 'admin123' }) -->
