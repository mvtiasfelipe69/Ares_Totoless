document.addEventListener('alpine:init', () => {
  // [IA] inicio · ia/2026-11-13_mvtiasfelipe69_reproductor-alpine.md
  Alpine.store('reproductor', {
    actual: null,
    reproduciendo: false,
    progreso: 0,
    _timer: null,

    tocar(cancion) {
      if (!cancion) return;
      if (this.actual && this.actual.id === String(cancion.id)) {
        this.alternar();
        return;
      }
      this.actual = cancion;
      this.reproduciendo = true;
      this.progreso = 0;
      this._iniciarTimer();
    },

    alternar() {
      if (!this.actual) return;
      this.reproduciendo = !this.reproduciendo;
      if (this.reproduciendo) {
        this._iniciarTimer();
      } else {
        this._detenerTimer();
      }
    },

    buscarTiempo(segundos) {
      if (!this.actual) return;
      this.progreso = Math.min(this.actual.duracion, Math.max(0, Number(segundos) || 0));
    },

    esActual(id) {
      return this.actual?.id === String(id);
    },

    estaSonando(id) {
      return this.esActual(id) && this.reproduciendo;
    },

    _iniciarTimer() {
      this._detenerTimer();
      this._timer = setInterval(() => {
        if (!this.reproduciendo || !this.actual) return;
        if (this.progreso + 1 >= this.actual.duracion) {
          this.progreso = 0;
          this.reproduciendo = false;
          this._detenerTimer();
        } else {
          this.progreso += 1;
        }
      }, 1000);
    },

    _detenerTimer() {
      if (this._timer) {
        clearInterval(this._timer);
        this._timer = null;
      }
    },
  });
  // [IA] fin

  // [IA] inicio · ia/2026-11-13_mvtiasfelipe69_playlists-vistas.md
  Alpine.store('playlists', {
    lista: [],
    cargando: false,
    error: null,

    // Vista de detalle (#playlist/ID)
    actual: null,
    cargandoDetalle: false,
    errorDetalle: null,
    statusDetalle: null,

    // Modal Crear / Editar
    form: {
      modo: 'crear', // 'crear' | 'editar'
      id: null,
      nombre: '',
      descripcion: '',
      errorNombre: '',
      errorServidor: '',
      enviando: false,
    },

    // Modal Eliminar
    aEliminar: null,
    eliminando: false,

    // Modal Añadir canción
    busquedaCancion: '',
    procesandoCancionId: null,

    async cargar() {
      if (!Alpine.store('sesion')?.activa) {
        this.lista = [];
        this.error = null;
        return;
      }
      this.cargando = true;
      this.error = null;
      const res = await window.api.getPlaylists();
      this.cargando = false;
      if (!res.ok) {
        this.error = res.error;
        return;
      }
      this.lista = res.data;
    },

    async cargarDetalle(id) {
      if (!id) return;
      this.cargandoDetalle = true;
      this.errorDetalle = null;
      this.statusDetalle = null;
      this.actual = null;

      const res = await window.api.getPlaylist(id);
      this.cargandoDetalle = false;
      if (!res.ok) {
        this.errorDetalle = res.error;
        this.statusDetalle = res.status;
        return;
      }
      this.actual = res.data;
    },

    abrirCrear() {
      this.form = {
        modo: 'crear',
        id: null,
        nombre: '',
        descripcion: '',
        errorNombre: '',
        errorServidor: '',
        enviando: false,
      };
      bootstrap.Modal.getOrCreateInstance(document.getElementById('modalFormPlaylist')).show();
    },

    abrirEditar(pl) {
      this.form = {
        modo: 'editar',
        id: pl.id,
        nombre: pl.nombre,
        descripcion: pl.descripcion || '',
        errorNombre: '',
        errorServidor: '',
        enviando: false,
      };
      bootstrap.Modal.getOrCreateInstance(document.getElementById('modalFormPlaylist')).show();
    },

    async guardar() {
      const nombre = this.form.nombre.trim();
      if (nombre.length < 2 || nombre.length > 40) {
        this.form.errorNombre = 'El nombre debe tener entre 2 y 40 caracteres.';
        return;
      }
      this.form.errorNombre = '';
      this.form.errorServidor = '';
      this.form.enviando = true;

      const payload = { nombre, descripcion: this.form.descripcion };
      const res =
        this.form.modo === 'crear'
          ? await window.api.crearPlaylist(payload)
          : await window.api.editarPlaylist(this.form.id, payload);

      this.form.enviando = false;
      if (!res.ok) {
        this.form.errorServidor = res.error;
        return;
      }

      bootstrap.Modal.getInstance(document.getElementById('modalFormPlaylist'))?.hide();
      Alpine.store('toasts')?.mostrar(
        this.form.modo === 'crear' ? 'Playlist creada' : 'Playlist actualizada',
        'success'
      );

      await this.cargar();
      if (this.actual && this.actual.id === res.data.id) {
        this.actual.nombre = res.data.nombre;
        this.actual.descripcion = res.data.descripcion;
      }
    },

    pedirEliminar(pl) {
      this.aEliminar = pl;
      bootstrap.Modal.getOrCreateInstance(document.getElementById('modalEliminarPlaylist')).show();
    },

    async confirmarEliminar() {
      if (!this.aEliminar) return;
      this.eliminando = true;
      const res = await window.api.eliminarPlaylist(this.aEliminar.id);
      this.eliminando = false;

      if (!res.ok) {
        Alpine.store('toasts')?.mostrar(res.error, 'danger');
        return;
      }

      bootstrap.Modal.getInstance(document.getElementById('modalEliminarPlaylist'))?.hide();
      Alpine.store('toasts')?.mostrar('Playlist eliminada', 'success');
      this.aEliminar = null;
      await this.cargar();

      if (location.hash.startsWith('#playlist/')) {
        location.hash = '#vista_playlists';
      }
    },

    get cancionesFiltradasModal() {
      const todas = Alpine.store('catalogo')?.canciones || [];
      const enPlaylist = new Set(this.actual?.cancionIds || []);
      const q = this.busquedaCancion.trim().toLowerCase();

      return todas.filter((c) => {
        if (enPlaylist.has(c.id)) return false;
        if (!q) return true;
        return c.titulo.toLowerCase().includes(q) || c.artista.toLowerCase().includes(q);
      });
    },

    async agregarCancion(cancionId) {
      if (!this.actual) return;
      this.procesandoCancionId = cancionId;
      const res = await window.api.agregarCancionAPlaylist(this.actual.id, cancionId);
      this.procesandoCancionId = null;

      if (!res.ok) {
        Alpine.store('toasts')?.mostrar(res.error, 'danger');
        return;
      }
      Alpine.store('toasts')?.mostrar('Canción añadida', 'success');
      await this.cargarDetalle(this.actual.id);
      await this.cargar();
    },

    async quitarCancion(cancionId) {
      if (!this.actual) return;
      this.procesandoCancionId = cancionId;
      const res = await window.api.quitarCancionDePlaylist(this.actual.id, cancionId);
      this.procesandoCancionId = null;

      if (!res.ok) {
        Alpine.store('toasts')?.mostrar(res.error, 'danger');
        return;
      }
      Alpine.store('toasts')?.mostrar('Canción quitada', 'secondary');
      await this.cargarDetalle(this.actual.id);
      await this.cargar();
    },
  });
  // [IA] fin

  // [IA] inicio · ia/2026-11-13_mvtiasfelipe69_admin-responsive.md
  Alpine.data('adminUsuarios', () => ({
    usuarios: [],
    cargando: false,
    error: null,

    async cargar() {
      const sesion = Alpine.store('sesion');
      if (!sesion?.activa || sesion.usuario?.rol !== 'admin') {
        this.usuarios = [];
        return;
      }
      this.cargando = true;
      this.error = null;
      const res = await window.api.getUsuarios();
      this.cargando = false;
      if (!res.ok) {
        this.error = res.error;
        return;
      }
      this.usuarios = res.data;
    },
  }));
  // [IA] fin
});