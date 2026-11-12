// [IA] inicio · ia/2026-11-12_yisuscrist67_formularios-toasts.md
// Avisos globales: cualquier parte de la app puede hacer
//   Alpine.store('toasts').exito('Guardado')   o   .error('Algo falló')
// y en index.html un <template x-for> dibuja cada aviso como un toast de Bootstrap.
document.addEventListener('alpine:init', () => {
  let siguienteId = 1;

  Alpine.store('toasts', {
    lista: [], // [{ id, mensaje, tipo }]  tipo: 'success' | 'danger' | 'info'

    mostrar(mensaje, tipo = 'info') {
      this.lista.push({ id: siguienteId++, mensaje, tipo });
    },
    exito(mensaje) {
      this.mostrar(mensaje, 'success');
    },
    error(mensaje) {
      this.mostrar(mensaje, 'danger');
    },

    // Lo llama el propio toast cuando Bootstrap termina de ocultarlo.
    quitar(id) {
      this.lista = this.lista.filter((t) => t.id !== id);
    },

    // Bootstrap necesita que se "encienda" cada toast con JS; esto lo hace
    // al aparecer en pantalla y lo saca de la lista cuando se cierra.
    activar(el, id) {
      el.addEventListener('hidden.bs.toast', () => this.quitar(id));
      bootstrap.Toast.getOrCreateInstance(el, { delay: 4000 }).show();
    },
  });
});
// [IA] fin
