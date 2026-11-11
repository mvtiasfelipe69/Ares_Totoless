# Router por hash y navegación con Alpine.js
**Fecha:** 2026-11-11
**Integrante:** Matías Herrera (@mvtiasfelipe69)
**Herramienta y modelo:** Gemini
**Archivos afectados:** index.html (líneas 54-247)

## Objetivo
Implementar un sistema de navegación dinámica por hash (`#vista_musica`, `#vista_playlists`, `#vista_explorar`) en la estructura HTML utilizando las directivas reactivas de Alpine.js (`x-data`, `x-show`, `:class`), manteniendo los estilos y componentes de Bootstrap 5.

## Conversación (texto completo, sin editar)
### Prompt 1
¿Cómo puedo implementar un enrutador basado en hash usando Alpine.js dentro de la etiqueta `<main>` de mi documento HTML con Bootstrap 5, de modo que el menú lateral actualice sus clases activas dinámicamente con los hash `#vista_musica`, `#vista_playlists` y `#vista_explorar`, y los paneles de contenido se muestren u oculten con `x-show` según la URL?

### Respuesta 1

Para implementar la navegación por hash con Alpine.js manteniendo tu estructura de Bootstrap 5, sigue estos pasos en tu HTML:
1. Incluye Alpine.js en el `<head>`:
```html
<script defer src="[https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js](https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js)"></script>
2. Configura el estado global de la ruta en el contenedor <main> escuchando el evento @hashchange.window:
<main x-data="{ ruta: window.location.hash || '#vista_musica' }" @hashchange.window="ruta = window.location.hash || '#vista_musica'">
3. Actualiza el menú lateral vinculando la clase active según la ruta seleccionada:
<ul class="nav nav-pills flex-column gap-1" id="menu_lateral">
<li class="nav-item">
<a class="nav-link" :class="{ 'active': ruta === '#vista_musica' }" href="#vista_musica">Tu música</a>
</li>
<li class="nav-item">
<a class="nav-link" :class="{ 'active': ruta === '#vista_playlists' || ruta.startsWith('#playlist') }" href="#vista_playlists">Playlists</a>
</li>
<li class="nav-item">
<a class="nav-link" :class="{ 'active': ruta === '#vista_explorar' }" href="#vista_explorar">Explorar</a>
</li>
</ul>
4. Condiciona la visibilidad de los paneles usando x-show:
<div id="vista_musica" class="panel-contenido" x-show="ruta === '#vista_musica'">...</div>
<div id="vista_playlists" class="panel-contenido" x-show="ruta === '#vista_playlists'" style="display: none;">...</div>
<div id="vista_detalle_playlist" class="panel-contenido" x-show="ruta.startsWith('#playlist')" style="display: none;">...</div>
<div id="vista_explorar" class="panel-contenido" x-show="ruta === '#vista_explorar'" style="display: none;">...</div

## Qué se incorporó al proyecto
Se incorporó la carga del CDN de Alpine.js en la cabecera, la inicialización del router con x-data en la etiqueta <main>, el formateo de enlaces y condicionales :class en la lista de navegación #menu_lateral, y la directiva x-show en cada uno de los paneles de la vista principal.

## Verificación
Se probó cambiando manualmente la URL en el navegador y haciendo clic en los botones del menú lateral para confirmar la transición de vistas.