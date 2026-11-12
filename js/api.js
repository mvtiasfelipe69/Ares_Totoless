// [IA] inicio · ia/2026-11-11_mvtiasfelipe69_api_js
(() => {
  const CLAVE_CONFIG = 'aresTotoless:config'; // { forzarError: 500, probFalla: 0.3 }
  const cache = {};

  const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const latencia = () => esperar(300 + Math.random() * 500);
  const ok = (status, data) => ({ ok: true, status, data, error: null });
  const fallo = (status, error) => ({ ok: false, status, data: null, error });

  function leerConfig() {
    try {
      return JSON.parse(localStorage.getItem(CLAVE_CONFIG)) || {};
    } catch {
      return {};
    }
  }

  async function leerMock(nombre) {
    if (cache[nombre]) return cache[nombre];
    const res = await fetch(`mocks/${nombre}.json`);
    if (!res.ok) throw new Error(`No se pudo cargar mocks/${nombre}.json`);
    cache[nombre] = await res.json();
    return cache[nombre];
  }

  // Envuelve cada endpoint: latencia, errores forzados/aleatorios y manejo de fallos.
  async function ejecutar(opts, fn) {
    await latencia();
    const cfg = leerConfig();
    const forzar = opts.forzarError ?? cfg.forzarError;
    if (forzar) {
      return fallo(forzar === true ? 500 : Number(forzar) || 500, 'Error simulado del servidor');
    }
    if (Math.random() < (cfg.probFalla || 0)) {
      return fallo(500, 'Error simulado del servidor');
    }
    try {
      return await fn();
    } catch {
      return fallo(500, 'No se pudieron cargar los datos');
    }
  }

  window.api = { 
    // GET /api/canciones?busqueda=&genero=
    getCanciones(opts = {}) {
      return ejecutar(opts, async () => {
        const termino = (opts.busqueda || '').trim().toLowerCase();
        let data = await leerMock('canciones');
        if (opts.genero) data = data.filter((c) => c.genero === opts.genero);
        if (termino) {
          data = data.filter(
            (c) => c.titulo.toLowerCase().includes(termino) || c.artista.toLowerCase().includes(termino)
          );
        }
        return ok(200, data);
      });
    },

    // GET /api/canciones/:id
    getCancion(id, opts = {}) {
      return ejecutar(opts, async () => {
        const cancion = (await leerMock('canciones')).find((c) => c.id === String(id));
        return cancion ? ok(200, cancion) : fallo(404, 'Canción no encontrada');
      });
    },

    // GET /api/artistas
    getArtistas(opts = {}) {
      return ejecutar(opts, async () => ok(200, await leerMock('artistas')));
    },

    // GET /api/artistas/:id
    getArtista(id, opts = {}) {
      return ejecutar(opts, async () => {
        const artista = (await leerMock('artistas')).find((a) => a.id === String(id));
        return artista ? ok(200, artista) : fallo(404, 'Artista no encontrado');
      });
    },

    // GET /api/artistas/:id/canciones
    getCancionesDeArtista(id, opts = {}) {
      return ejecutar(opts, async () => {
        const artista = (await leerMock('artistas')).find((a) => a.id === String(id));
        if (!artista) return fallo(404, 'Artista no encontrado');
        const canciones = (await leerMock('canciones')).filter((c) => c.artistaId === String(id));
        return ok(200, canciones);
      });
    },

    // GET /api/generos
    getGeneros(opts = {}) {
      return ejecutar(opts, async () => ok(200, await leerMock('generos')));
    },
  };
})();
// [IA] fin