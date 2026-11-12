# Vistas dinámicas e integración de API en HTML
**Fecha:** 2026-11-11
**Integrante:** Matías Herrera (@mvtiasfelipe69)
**Herramienta y modelo:** Claude
**Archivos afectados:** index.html

## Objetivo
Reemplazar los datos estáticos del HTML por el consumo de la capa de servicios (api.js), incorporando renderizado reactivo de listas con <template x-for>, indicadores de carga (spinners), manejo de errores y vistas de detalle (#cancion/ID y #artista/ID).

## Conversación (texto completo, sin editar)
### Prompt 1
¿Por cuál de estos 4 puntos me recomiendas empezar y cómo estructuramos el código Alpine.js para ello? (1. Dashboard, 2. Filtros Explorar, 3. Paginación, 4. Vista de Detalle).

### Respuesta 1
Para continuar programando y cerrar tu primera tarea dinámica (feat(inicio): agrega dashboard con datos de la API), vamos a conectar tu vista principal de música con los datos simulados. Sigue estos 3 pasos exactos:

1.Crear el Mock de datos.

2.Crear la capa de Servicios (api.js).

3.Volver dinámica la vista en index.html. Reemplaza tu tabla estática por un <template x-for="cancion in canciones"> y agrega un x-show="cargando" para mostrar un spinner mientras los datos se recuperan.

## Qué se incorporó al proyecto
En la etiqueta <body> se agregó x-init="$store.catalogo.cargar()" para ejecutar la carga de datos al abrir la página.

Se reemplazaron las filas fijas de #vista_musica por un <template x-for="c in $store.catalogo.canciones"> para inyectar dinámicamente la tabla.

Se construyó #vista_explorar con inputs reactivos vinculados por x-model para búsqueda, género y ordenamiento, junto a controles para paginación.

Se crearon las vistas #vista_cancion y #vista_artista que leen el parámetro de la URL, piden el dato por ID a la API y pintan la información específica y la imagen de portada.

Se añadieron alertas condicionales para manejar el estado de carga (x-show="$store.catalogo.cargando") y errores de red.


## Verificación
Se comprobó que al cargar la página se muestran temporalmente los spinners de Bootstrap. Luego, las tablas se llenan correctamente con los datos provenientes de los archivos JSON. Los filtros de búsqueda y los enlaces a detalles de canciones y artistas responden adecuadamente.