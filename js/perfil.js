// [IA] inicio · ia/2026-11-12_yisuscrist67_perfil.md
// Vista #perfil (privada): datos del usuario, edición del nombre y configuración
// del simulador de API. Se usa en index.html con x-data="perfil()".
document.addEventListener('alpine:init', () => {
  const REGEX_NOMBRE = /^\p{L}[\p{L} '.-]*$/u; // misma regla que api.actualizarPerfil

  Alpine.data('perfil', () => ({
    // Formulario "Editar nombre"
    nombre: '',
    errorNombre: '', // error de validación del campo (se muestra bajo el input)
    errorServidor: '', // error que devolvió la API
    exito: '',
    enviando: false,

    // Configuración del simulador (probFalla en %, para el slider)
    config: { probFalla: 0, forzarError: 0 },
    prueba: { cargando: false, ok: false, texto: '' },
    confirmando: false, // paso de confirmación antes de restablecer

    init() {
      this.reiniciar();
    },

    // Atajo al usuario de la sesión ({} si no hay, para que el HTML no falle).
    get usuario() {
      return this.$store.sesion.usuario || {};
    },

    get iniciales() {
      return (this.usuario.nombre || '?')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((palabra) => palabra[0].toUpperCase())
        .join('');
    },

    get simuladorActivo() {
      return this.config.probFalla > 0 || this.config.forzarError > 0;
    },

    // Deja la vista como recién abierta: nombre actual, sin mensajes, config desde localStorage.
    reiniciar() {
      this.nombre = this.usuario.nombre || '';
      this.errorNombre = '';
      this.errorServidor = '';
      this.exito = '';
      this.confirmando = false;
      this.prueba = { cargando: false, ok: false, texto: '' };
      const cfg = api.simulador.leer();
      this.config = { probFalla: Math.round(cfg.probFalla * 100), forzarError: cfg.forzarError };
    },

    fecha(iso) {
      if (!iso) return '—';
      return new Date(`${iso}T00:00:00`).toLocaleDateString('es-CL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    },

    // Devuelve el mensaje de error del campo, o '' si está bien.
    validarNombre() {
      const limpio = this.nombre.trim().replace(/\s+/g, ' ');
      if (!limpio) return 'Ingresa tu nombre.';
      if (limpio.length < 2) return 'El nombre debe tener al menos 2 caracteres.';
      if (limpio.length > 40) return 'El nombre puede tener como máximo 40 caracteres.';
      if (!REGEX_NOMBRE.test(limpio)) return 'Usa solo letras, espacios, apóstrofes o guiones.';
      if (limpio === this.usuario.nombre) return 'Ese ya es tu nombre actual.';
      return '';
    },

    async guardarNombre() {
      this.errorServidor = '';
      this.exito = '';
      this.errorNombre = this.validarNombre();
      if (this.errorNombre) return;

      this.enviando = true; // deshabilita input y botón mientras "viaja" la petición
      const res = await api.actualizarPerfil(this.usuario.id, { nombre: this.nombre });
      this.enviando = false;

      if (!res.ok) {
        this.errorServidor = `${res.error} (código ${res.status}). Intenta de nuevo.`;
        return;
      }
      this.$store.sesion.actualizar(res.data); // el menú ("Hola, …") se actualiza solo
      this.nombre = res.data.nombre;
      this.exito = 'Tu nombre se actualizó correctamente.';
    },

    guardarConfig() {
      api.simulador.guardar({
        probFalla: this.config.probFalla / 100,
        forzarError: this.config.forzarError,
      });
      this.prueba.texto = '';
    },

    // Hace una llamada real a la API simulada para ver el efecto de la configuración.
    async probar() {
      this.prueba = { cargando: true, ok: false, texto: 'Probando…' };
      const res = await api.getGeneros();
      this.prueba = {
        cargando: false,
        ok: res.ok,
        texto: res.ok ? `${res.status} OK · ${res.data.length} géneros recibidos` : `${res.status} · ${res.error}`,
      };
    },

    restablecer() {
      api.simulador.restablecer(); // borra cuentas registradas, nombres editados, config y sesión
      location.hash = '#vista_musica';
      location.reload(); // recarga para que todos los stores partan desde cero
    },
  }));
});
// [IA] fin
