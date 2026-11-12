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

  // [IA] inicio · ia/2026-11-12_yisuscrist67_auth-usuarios.md
  const CLAVE_USUARIOS = 'aresTotoless:usuarios'; // cuentas creadas desde el formulario de registro
  const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const normalizarCorreo = (correo) => String(correo || '').trim().toLowerCase();

  // Cuentas guardadas en el navegador (un JSON del repo no se puede escribir desde el frontend).
  function leerRegistrados() {
    try {
      return JSON.parse(localStorage.getItem(CLAVE_USUARIOS)) || [];
    } catch {
      return [];
    }
  }

  // Todos los usuarios: los 10 de mocks/usuarios.json + los registrados en este navegador,
  // con los nombres editados desde el perfil ya aplicados.
  async function leerUsuarios() {
    return aplicarCambiosDePerfil([...(await leerMock('usuarios')), ...leerRegistrados()]);
  }

  // Copia del usuario sin la contraseña: la API nunca la devuelve.
  function sinPassword(usuario) {
    const { password, ...publico } = usuario;
    return publico;
  }
  // [IA] fin

  // [IA] inicio · ia/2026-11-12_yisuscrist67_perfil.md
  // Cambios hechos desde "Mi perfil", guardados como { "<id>": { nombre } }.
  // Los mocks son de solo lectura, así que los cambios viven aparte y se aplican al leer.
  const CLAVE_PERFILES = 'aresTotoless:perfiles';
  const PREFIJO = 'aresTotoless:'; // todas las claves de la app empiezan así
  const REGEX_NOMBRE = /^\p{L}[\p{L} '.-]*$/u; // letras (con tildes y ñ), espacios, ' . -

  function leerCambiosDePerfil() {
    try {
      return JSON.parse(localStorage.getItem(CLAVE_PERFILES)) || {};
    } catch {
      return {};
    }
  }

  function aplicarCambiosDePerfil(usuarios) {
    const cambios = leerCambiosDePerfil();
    return usuarios.map((u) => (cambios[u.id] ? { ...u, ...cambios[u.id] } : u));
  }
  // [IA] fin

  window.api = {
    // [IA] inicio · ia/2026-11-12_yisuscrist67_auth-usuarios.md
    // POST /api/auth/login   cuerpo: { correo, password }
    login(credenciales = {}, opts = {}) {
      return ejecutar(opts, async () => {
        const correo = normalizarCorreo(credenciales.correo);
        const password = String(credenciales.password || '');
        if (!correo || !password) return fallo(400, 'Ingresa tu correo y tu contraseña');

        const usuario = (await leerUsuarios()).find((u) => u.correo.toLowerCase() === correo);
        if (!usuario || usuario.password !== password) {
          return fallo(401, 'Correo o contraseña incorrectos');
        }
        return ok(200, sinPassword(usuario));
      });
    },

    // POST /api/auth/registro   cuerpo: { nombre, correo, password }
    registrar(datos = {}, opts = {}) {
      return ejecutar(opts, async () => {
        const nombre = String(datos.nombre || '').trim();
        const correo = normalizarCorreo(datos.correo);
        const password = String(datos.password || '');

        if (nombre.length < 2) return fallo(400, 'El nombre debe tener al menos 2 caracteres');
        if (!REGEX_CORREO.test(correo)) return fallo(400, 'El correo no es válido');
        if (password.length < 6) return fallo(400, 'La contraseña debe tener al menos 6 caracteres');

        const usuarios = await leerUsuarios();
        if (usuarios.some((u) => u.correo.toLowerCase() === correo)) {
          return fallo(409, 'Ya existe una cuenta con ese correo');
        }

        const ultimoId = Math.max(0, ...usuarios.map((u) => Number(u.id) || 0));
        const nuevo = {
          id: String(ultimoId + 1),
          nombre,
          correo,
          password,
          rol: 'usuario',
          plan: 'gratis',
          creadoEn: new Date().toISOString().slice(0, 10),
        };
        localStorage.setItem(CLAVE_USUARIOS, JSON.stringify([...leerRegistrados(), nuevo]));
        return ok(201, sinPassword(nuevo));
      });
    },
    // [IA] fin

    // [IA] inicio · ia/2026-11-12_yisuscrist67_perfil.md
    // PATCH /api/usuarios/:id   cuerpo: { nombre }
    actualizarPerfil(id, cambios = {}, opts = {}) {
      return ejecutar(opts, async () => {
        const nombre = String(cambios.nombre || '').trim().replace(/\s+/g, ' ');
        if (nombre.length < 2 || nombre.length > 40) {
          return fallo(400, 'El nombre debe tener entre 2 y 40 caracteres');
        }
        if (!REGEX_NOMBRE.test(nombre)) {
          return fallo(400, 'El nombre solo puede tener letras, espacios, apóstrofes o guiones');
        }

        const usuario = (await leerUsuarios()).find((u) => u.id === String(id));
        if (!usuario) return fallo(404, 'Usuario no encontrado');

        const guardados = leerCambiosDePerfil();
        guardados[usuario.id] = { ...guardados[usuario.id], nombre };
        localStorage.setItem(CLAVE_PERFILES, JSON.stringify(guardados));
        return ok(200, sinPassword({ ...usuario, nombre }));
      });
    },
    // [IA] fin

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

  // [IA] inicio · ia/2026-11-12_yisuscrist67_perfil.md
  // Herramientas del simulador (no son endpoints: no pasan por ejecutar(), así nunca fallan).
  window.api.simulador = {
    // { forzarError: 0 | código HTTP, probFalla: 0..1 }
    leer() {
      const cfg = leerConfig();
      return {
        forzarError: Number(cfg.forzarError) || (cfg.forzarError === true ? 500 : 0),
        probFalla: Math.min(1, Math.max(0, Number(cfg.probFalla) || 0)),
      };
    },

    guardar({ forzarError = 0, probFalla = 0 } = {}) {
      const cfg = {
        forzarError: Number(forzarError) || 0,
        probFalla: Math.min(1, Math.max(0, Number(probFalla) || 0)),
      };
      localStorage.setItem(CLAVE_CONFIG, JSON.stringify(cfg));
      return cfg;
    },

    // Borra todo lo que la app guardó en este navegador (claves "aresTotoless:...").
    restablecer() {
      Object.keys(localStorage)
        .filter((clave) => clave.startsWith(PREFIJO))
        .forEach((clave) => localStorage.removeItem(clave));
      Object.keys(cache).forEach((nombre) => delete cache[nombre]);
    },
  };
  // [IA] fin
})();
// [IA] fin