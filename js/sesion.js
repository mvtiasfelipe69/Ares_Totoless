// [IA] inicio · ia/2026-11-12_yisuscrist67_sesion.md
// Sesión del usuario: store global de Alpine, persistido en localStorage,
// más el "guardia" que protege las vistas privadas.
(() => {
  const CLAVE_SESION = 'aresTotoless:sesion';
  const RUTAS_PRIVADAS = ['#vista_playlists', '#playlist', '#perfil'];
  const RUTA_PUBLICA = '#vista_musica';

  // '#playlist/3' -> '#playlist' (misma regla que usa el router del <body>)
  const rutaDe = (hash) => (hash || RUTA_PUBLICA).split('/')[0];
  const esPrivada = (hash) => RUTAS_PRIVADAS.includes(rutaDe(hash));

  function leerGuardado() {
    try {
      return JSON.parse(localStorage.getItem(CLAVE_SESION));
    } catch {
      return null; // JSON corrupto: se trata como "sin sesión"
    }
  }

  document.addEventListener('alpine:init', () => {
    Alpine.store('sesion', {
      usuario: null, // { id, nombre, correo } o null
      destino: null, // vista privada que se pidió sin sesión; se retoma tras el login

      // Alpine llama a init() una sola vez al registrar el store.
      init() {
        const guardado = leerGuardado();
        if (guardado && guardado.nombre) this.usuario = guardado;
      },

      get activa() {
        return this.usuario !== null;
      },

      get nombre() {
        return this.usuario ? this.usuario.nombre : '';
      },

      // Recibe el usuario que devolvió la API y lo deja como sesión activa.
      iniciar(usuario) {
        const { contrasena, password, ...publico } = usuario; // nunca se guarda la contraseña
        this.usuario = publico;
        localStorage.setItem(CLAVE_SESION, JSON.stringify(publico));
        if (this.destino) {
          location.hash = this.destino;
          this.destino = null;
        }
      },

      // Cierra la sesión: borra memoria, localStorage y saca al usuario de vistas privadas.
      cerrar() {
        this.usuario = null;
        this.destino = null;
        localStorage.removeItem(CLAVE_SESION);
        if (esPrivada(location.hash)) location.hash = RUTA_PUBLICA;
      },

      // Guardia de rutas: si la vista es privada y no hay sesión, vuelve al inicio y abre el login.
      proteger() {
        if (this.activa || !esPrivada(location.hash)) return;
        this.destino = location.hash;
        location.replace(RUTA_PUBLICA);
        const modal = document.getElementById('modalLogin');
        if (modal && window.bootstrap) bootstrap.Modal.getOrCreateInstance(modal).show();
      },
    });
  });

  // El guardia corre al abrir la página y cada vez que cambia el hash.
  document.addEventListener('alpine:initialized', () => Alpine.store('sesion').proteger());
  window.addEventListener('hashchange', () => Alpine.store('sesion').proteger());
})();
// [IA] fin
