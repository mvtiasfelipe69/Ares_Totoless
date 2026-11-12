// [IA] inicio · ia/2026-11-11_matias_api-y-vistas.md
// Estado Alpine de las vistas de música: catálogo compartido, Explorar y detalles.
document.addEventListener('alpine:init', () => {
  Alpine.store('catalogo', {
    canciones: [],
    artistas: [],
    generos: [],
    busqueda: '',
    cargando: false,
    cargado: false,
    error: null,

    async cargar(forzar = false) {
      if (this.cargando || (this.cargado && !forzar)) return;
      this.cargando = true;
      this.error = null;
      const respuestas = await Promise.all([api.getCanciones(), api.getArtistas(), api.getGeneros()]);
      const fallida = respuestas.find((r) => !r.ok);
      if (fallida) {
        this.error = fallida.error;
      } else {
        [this.canciones, this.artistas, this.generos] = respuestas.map((r) => r.data);
        this.cargado = true;
      }
      this.cargando = false;
    },

    fmt(segundos) {
      return `${Math.floor(segundos / 60)}:${String(segundos % 60).padStart(2, '0')}`;
    },
  });

  Alpine.data('explorar', () => ({
    genero: '',
    orden: 'titulo_asc',
    pagina: 1,
    porPagina: 6,

    init() {
      this.$watch('genero', () => (this.pagina = 1));
      this.$watch('orden', () => (this.pagina = 1));
      this.$watch('$store.catalogo.busqueda', () => (this.pagina = 1));
    },

    get filtradas() {
      const cat = Alpine.store('catalogo');
      const termino = cat.busqueda.trim().toLowerCase();
      const lista = cat.canciones.filter(
        (c) =>
          (!this.genero || c.genero === this.genero) &&
          (!termino || c.titulo.toLowerCase().includes(termino) || c.artista.toLowerCase().includes(termino))
      );
      const [campo, dir] = this.orden.split('_');
      lista.sort((a, b) =>
        campo === 'titulo' ? a.titulo.localeCompare(b.titulo, 'es') : a.duracion - b.duracion
      );
      return dir === 'desc' ? lista.reverse() : lista;
    },

    get totalPaginas() {
      return Math.max(1, Math.ceil(this.filtradas.length / this.porPagina));
    },

    get paginadas() {
      const inicio = (this.pagina - 1) * this.porPagina;
      return this.filtradas.slice(inicio, inicio + this.porPagina);
    },

    anterior() {
      if (this.pagina > 1) this.pagina--;
    },
    siguiente() {
      if (this.pagina < this.totalPaginas) this.pagina++;
    },
  }));

  Alpine.data('detalleCancion', () => {
    let token = 0; // descarta respuestas de cargas anteriores
    return {
      cancion: null,
      cargando: false,
      error: null,
      status: null,

      async cargar(id) {
        const mio = ++token;
        this.cargando = true;
        this.error = null;
        this.cancion = null;
        const res = await api.getCancion(id);
        if (mio !== token) return;
        this.status = res.status;
        if (res.ok) this.cancion = res.data;
        else this.error = res.error;
        this.cargando = false;
      },
    };
  });

  Alpine.data('detalleArtista', () => {
    let token = 0;
    return {
      artista: null,
      canciones: [],
      cargando: false,
      error: null,
      status: null,

      async cargar(id) {
        const mio = ++token;
        this.cargando = true;
        this.error = null;
        this.artista = null;
        const [a, c] = await Promise.all([api.getArtista(id), api.getCancionesDeArtista(id)]);
        if (mio !== token) return;
        const fallida = [a, c].find((r) => !r.ok);
        if (fallida) {
          this.status = fallida.status;
          this.error = fallida.error;
        } else {
          this.artista = a.data;
          this.canciones = c.data;
        }
        this.cargando = false;
      },
    };
  });
});
// [IA] fin