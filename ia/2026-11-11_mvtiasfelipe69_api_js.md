# Capa de servicios simulada (Mock API)
**Fecha:** 2026-11-11
**Integrante:** Matías Herrera (@mvtiasfelipe69)
**Herramienta y modelo:** Claude
**Archivos afectados:** js/api.js (completo), js/vistas.js (completo)

## Objetivo
Construir una capa de acceso a datos (api.js) basada en promesas y fetch local que simule la latencia de red y errores de servidor, junto con un archivo controlador de Alpine (vistas.js) que maneje el estado global y la lógica de filtrado y paginación en el cliente.


## Conversación (texto completo, sin editar)

### Prompt 1
Necesito crear el archivo js/api.js que simule latencia (300-800ms) usando setTimeout y devuelva promesas leyendo de la carpeta mocks/. También requiero la lógica de Alpine para consumir esto desde las vistas.


### Respuesta 1
Se implementó js/api.js usando un IIFE para no contaminar el scope global, exportando métodos como getCanciones(), getCancion(id), y getArtista(id) en window.api. Esta capa lee la configuración de localStorage para simular fallos aleatorios si se requiere.
Por su parte, en js/vistas.js se definió el estado global con Alpine.store('catalogo') y los componentes de datos explorar, detalleCancion y detalleArtista usando Alpine.data.


## Qué se incorporó al proyecto
api.js: Un objeto global window.api que centraliza todas las llamadas asíncronas a los archivos JSON. Se implementó un manejador ejecutar() que simula latencia de red (300ms a 800ms) y posibles caídas del servidor.  

vistas.js: Se utilizó Alpine.store() para cachear el catálogo completo de canciones, artistas y géneros. Se usó Alpine.data() para modularizar la lógica de filtrado de arreglos, ordenamiento y paginación de la vista Explorar, así como la consulta por ID en las vistas de detalle. 


## Verificación
Se testeó la carga inicial observando el retraso artificial antes de mostrar la tabla. Se comprobó que el bloque catch y el chequeo !res.ok capturan errores devolviéndolos en un formato estandarizado { ok, status, error } que la vista renderiza en un alert-danger.
