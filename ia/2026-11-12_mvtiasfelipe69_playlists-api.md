# Capa de datos de playlists (CRUD simulado en api.js)

- **Fecha:** 2026-11-12
- **Integrante:** Matías Herrera (@mvtiasfelipe69)
- **Herramienta y modelo:** Claude (Claude Sonnet 5.5)
- **Enlace a la conversación:** <opcional, pegar si lo compartes>
- **Archivos afectados:** js/api.js (bloque nuevo marcado con [IA], antes de `window.api.simulador`), mocks/playlists.json (nuevo), ia/README.md (fila nueva)

## Objetivo
Mover las playlists a la capa de servicios (api.js) para cumplir los criterios A2, A5 y B2 de la rúbrica: funciones asíncronas con latencia simulada, formato `{ ok, status, data, error }`, escrituras guardadas en localStorage y códigos 401, 400, 404 y 409. Antes, las playlists vivían en un objeto hardcodeado en js/app.js y no persistían.

## Conversación (texto completo, sin editar)

### Prompt 1
Pasemos a fase 1

### Respuesta 1
````markdown
## Fase 1: capa de datos de playlists

Solo se toca `js/api.js` (un bloque nuevo) y se agrega `mocks/playlists.json`. Copia **playlists.json** a `mocks/`. Tiene 5 playlists: 2 del admin y 3 de Camila, para probar con ambas credenciales. Un usuario nuevo parte sin playlists, lo que sirve para probar el estado vacío.

### Bloque para `js/api.js`

Pégalo dentro del IIFE, justo después del `};` que cierra `window.api = { ... }` y antes del bloque `window.api.simulador`:

```js
  // [IA] inicio · ia/2026-11-12_mvtiasfelipe69_playlists-api.md
  const CLAVE_PLAYLISTS = 'aresTotoless:playlists';
  const CLAVE_SESION = 'aresTotoless:sesion';

  const copiar = (x) => JSON.parse(JSON.stringify(x));

  // Usuario con sesión activa (lo guarda Alpine.store('sesion')), o null.
  function usuarioActual() {
    try {
      const u = JSON.parse(localStorage.getItem(CLAVE_SESION));
      return u && u.id ? { ...u, id: String(u.id) } : null;
    } catch {
      return null;
    }
  }

  // Si ya hay cambios en localStorage se usan esos; si no, se parte de la semilla del mock.
  async function leerPlaylists() {
    try {
      const guardadas = JSON.parse(localStorage.getItem(CLAVE_PLAYLISTS));
      if (Array.isArray(guardadas)) return guardadas;
    } catch {
      /* JSON corrupto: se parte de la semilla */
    }
    return copiar(await leerMock('playlists'));
  }

  const guardarPlaylists = (lista) => localStorage.setItem(CLAVE_PLAYLISTS, JSON.stringify(lista));

  // Devuelve { nombre, descripcion } limpios, o { error }.
  function validarPlaylist(datos) {
    const nombre = String(datos.nombre || '').trim().replace(/\s+/g, ' ');
    const descripcion = String(datos.descripcion || '').trim();
    if (nombre.length < 2 || nombre.length > 40) {
      return { error: 'El nombre debe tener entre 2 y 40 caracteres' };
    }
    if (descripcion.length > 100) {
      return { error: 'La descripción puede tener como máximo 100 caracteres' };
    }
    return { nombre, descripcion };
  }

  const nombreRepetido = (lista, usuarioId, nombre, ignorarId = null) =>
    lista.some(
      (p) =>
        p.usuarioId === usuarioId &&
        p.id !== String(ignorarId) &&
        p.nombre.toLowerCase() === nombre.toLowerCase()
    );

  // Endpoints que exigen sesión (401 si no hay).
  function conSesion(opts, fn) {
    return ejecutar(opts, async () => {
      const usuario = usuarioActual();
      if (!usuario) return fallo(401, 'Inicia sesión para usar tus playlists');
      return fn(usuario);
    });
  }

  // Endpoints sobre una playlist propia (404 si no existe o es de otra persona).
  function sobrePlaylist(id, opts, fn) {
    return conSesion(opts, async (usuario) => {
      const lista = await leerPlaylists();
      const playlist = lista.find((p) => p.id === String(id) && p.usuarioId === usuario.id);
      if (!playlist) return fallo(404, 'Playlist no encontrada');
      return fn({ usuario, lista, playlist });
    });
  }

  Object.assign(window.api, {
    // GET /api/playlists
    getPlaylists(opts = {}) {
      return conSesion(opts, async (usuario) => {
        const propias = (await leerPlaylists()).filter((p) => p.usuarioId === usuario.id);
        return ok(200, propias.map((p) => ({ ...p, totalCanciones: p.cancionIds.length })));
      });
    },

    // GET /api/playlists/:id  (incluye las canciones completas)
    getPlaylist(id, opts = {}) {
      return sobrePlaylist(id, opts, async ({ playlist }) => {
        const catalogo = await leerMock('canciones');
        const canciones = playlist.cancionIds
          .map((cid) => catalogo.find((c) => c.id === cid))
          .filter(Boolean);
        return ok(200, { ...playlist, canciones });
      });
    },

    // POST /api/playlists   cuerpo: { nombre, descripcion }
    crearPlaylist(datos = {}, opts = {}) {
      return conSesion(opts, async (usuario) => {
        const v = validarPlaylist(datos);
        if (v.error) return fallo(400, v.error);
        const lista = await leerPlaylists();
        if (nombreRepetido(lista, usuario.id, v.nombre)) {
          return fallo(409, 'Ya tienes una playlist con ese nombre');
        }
        const nueva = {
          id: String(Math.max(0, ...lista.map((p) => Number(p.id) || 0)) + 1),
          nombre: v.nombre,
          descripcion: v.descripcion,
          usuarioId: usuario.id,
          cancionIds: [],
        };
        guardarPlaylists([...lista, nueva]);
        return ok(201, nueva);
      });
    },

    // PATCH /api/playlists/:id   cuerpo: { nombre?, descripcion? }
    editarPlaylist(id, cambios = {}, opts = {}) {
      return sobrePlaylist(id, opts, async ({ usuario, lista, playlist }) => {
        const v = validarPlaylist({ ...playlist, ...cambios });
        if (v.error) return fallo(400, v.error);
        if (nombreRepetido(lista, usuario.id, v.nombre, playlist.id)) {
          return fallo(409, 'Ya tienes una playlist con ese nombre');
        }
        playlist.nombre = v.nombre;
        playlist.descripcion = v.descripcion;
        guardarPlaylists(lista);
        return ok(200, playlist);
      });
    },

    // DELETE /api/playlists/:id
    eliminarPlaylist(id, opts = {}) {
      return sobrePlaylist(id, opts, async ({ lista, playlist }) => {
        guardarPlaylists(lista.filter((p) => p !== playlist));
        return ok(200, { id: playlist.id });
      });
    },

    // POST /api/playlists/:id/canciones   cuerpo: { cancionId }
    agregarCancionAPlaylist(id, cancionId, opts = {}) {
      return sobrePlaylist(id, opts, async ({ lista, playlist }) => {
        const existe = (await leerMock('canciones')).some((c) => c.id === String(cancionId));
        if (!existe) return fallo(404, 'Canción no encontrada');
        if (playlist.cancionIds.includes(String(cancionId))) {
          return fallo(409, 'La canción ya está en la playlist');
        }
        playlist.cancionIds.push(String(cancionId));
        guardarPlaylists(lista);
        return ok(201, playlist);
      });
    },

    // DELETE /api/playlists/:id/canciones/:cancionId
    quitarCancionDePlaylist(id, cancionId, opts = {}) {
      return sobrePlaylist(id, opts, async ({ lista, playlist }) => {
        if (!playlist.cancionIds.includes(String(cancionId))) {
          return fallo(404, 'La canción no está en la playlist');
        }
        playlist.cancionIds = playlist.cancionIds.filter((c) => c !== String(cancionId));
        guardarPlaylists(lista);
        return ok(200, playlist);
      });
    },
  });
  // [IA] fin
```

### Cómo probarlo (consola de Live Server)

1. Sin sesión: `await api.getPlaylists()` debe dar `status: 401`.
2. Inicia sesión como `camila.rojas@arestotoless.cl` / `camila123` y ejecuta:
```js
await api.getPlaylists()                      // 200, 3 playlists
await api.getPlaylist('4')                    // 200, con "canciones"
await api.getPlaylist('1')                    // 404 (es del admin)
await api.crearPlaylist({ nombre: 'Gym' })    // 409 (repetido)
await api.crearPlaylist({ nombre: 'A' })      // 400
await api.crearPlaylist({ nombre: 'Road trip' })        // 201
await api.agregarCancionAPlaylist('4', '14')  // 201
await api.agregarCancionAPlaylist('4', '14')  // 409
await api.agregarCancionAPlaylist('4', '99')  // 404
await api.quitarCancionDePlaylist('4', '14')  // 200
await api.editarPlaylist('4', { nombre: 'Entreno' })    // 200
await api.eliminarPlaylist('4')               // 200
```
3. Recarga la página y vuelve a llamar `api.getPlaylists()`: los cambios deben seguir ahí (clave `aresTotoless:playlists`).
4. En Mi perfil, "Restablecer datos de prueba" debe devolver la semilla original.

### Registro de IA y commit

Crea `ia/2026-11-12_mvtiasfelipe69_playlists-api.md` con la plantilla de la pauta (sección 10.5). Pega tu prompt y esta respuesta completos, sin editar. Si no registras la consulta, el código queda como uso de IA no documentado.

Fila para `ia/README.md` (formato de la pauta):
```markdown
| 2026-11-12 | @mvtiasfelipe69 | Claude | Capa de datos de playlists | [ver](2026-11-12_mvtiasfelipe69_playlists-api.md) |
```

```powershell
git add js/api.js mocks/playlists.json ia/2026-11-12_mvtiasfelipe69_playlists-api.md ia/README.md
git commit -m "feat(api): agrega CRUD de playlists con persistencia en localStorage [IA]"
git push
```

Dime qué devolvieron las pruebas (sobre todo el paso 3) y paso a la Fase 2.
````

## Qué se incorporó al proyecto
- `mocks/playlists.json`: semilla de 5 playlists, tal cual.
- `js/api.js`: el bloque completo marcado con `[IA]` (helpers `usuarioActual`, `leerPlaylists`, `guardarPlaylists`, `validarPlaylist`, `nombreRepetido`, `conSesion`, `sobrePlaylist` y las siete funciones de playlists), pegado antes de `window.api.simulador`, tal cual.
- `ia/README.md`: fila nueva del índice.

<!-- Si modificas algo a mano, anótalo aquí. Si no, deja "Nada, se usó tal cual." -->

## Verificación
<!-- Completar con lo que realmente pruebes en Live Server. Resultado esperado de cada prueba: -->
- Sin sesión, `api.getPlaylists()` devuelve 401: <resultado>
- Con sesión de Camila: `getPlaylists` 200 con 3 playlists, `getPlaylist('1')` 404, `crearPlaylist({ nombre: 'Gym' })` 409, `crearPlaylist({ nombre: 'A' })` 400, `agregarCancionAPlaylist` 201 / 409 / 404, `quitarCancionDePlaylist` 200, `editarPlaylist` 200, `eliminarPlaylist` 200: <resultado>
- Tras recargar la página, los cambios persisten (clave `aresTotoless:playlists`): <resultado>
- "Restablecer datos de prueba" devuelve la semilla original: <resultado>
- Entiendo el código: `conSesion` y `sobrePlaylist` envuelven `ejecutar` para reutilizar latencia y errores simulados; los cambios se guardan completos en localStorage y se leen primero de ahí; la semilla del mock nunca se modifica porque se copia con `copiar`.
