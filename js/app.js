document.addEventListener('DOMContentLoaded', () => {
  let idCancionActual = null;
  let estaReproduciendo = false;
  let playlistSeleccionada = null;

  const datosPlaylists = {
    'Favoritos': [],
    'Para josear': [],
    'GYM': [],
    'kizazo': []
  };

  const nombreCancion = document.getElementById('reproductor_nombre_cancion');
  const nombreArtista = document.getElementById('reproductor_nombre_artista');
  const botonAlternar = document.getElementById('btn_alternar_reproductor');

  function actualizarInterfazReproductor() {
    if (!idCancionActual) {
      nombreCancion.textContent = 'Sin reproducir';
      nombreArtista.textContent = '—';
      botonAlternar.textContent = '▶';
      return;
    }

    const filaActiva = document.querySelector(`tr[data-song_id="${idCancionActual}"]`);
    if (filaActiva) {
      nombreCancion.textContent = filaActiva.children[1].textContent.trim();
      nombreArtista.textContent = filaActiva.children[2].textContent.trim();
    }
    botonAlternar.textContent = estaReproduciendo ? '⏸' : '▶';

    document.querySelectorAll('tr[data-song_id]').forEach((fila) => {
      const boton = fila.querySelector('.play_btn');
      const esActual = fila.dataset.song_id === idCancionActual;
      if (boton) boton.textContent = esActual && estaReproduciendo ? '⏸' : '▶';
      fila.classList.toggle('table-active', esActual);
    });
  }

document.addEventListener('click', (e) => {
  const botonPlay = e.target.closest('.play_btn');
  if (!botonPlay) return;
  const id = botonPlay.closest('tr')?.dataset.song_id;
  if (!id) return;

  if (idCancionActual === id) {
    estaReproduciendo = !estaReproduciendo;
  } else {
    idCancionActual = id;
    estaReproduciendo = true;
  }
  actualizarInterfazReproductor();
});

  botonAlternar.addEventListener('click', () => {
    if (!idCancionActual) return;
    estaReproduciendo = !estaReproduciendo;
    actualizarInterfazReproductor();
  });

  document.getElementById('form_busqueda').addEventListener('submit', (e) => e.preventDefault());

  const tituloDetalle = document.getElementById('detalle_playlist_titulo');
  const descDetalle = document.getElementById('detalle_playlist_desc');
  const mensajeVacio = document.getElementById('mensaje_playlist_vacia');
  const contenedorTabla = document.getElementById('contenedor_tabla_playlist');
  const cuerpoTablaPlaylist = document.getElementById('lista_canciones_playlist');

  function cargarCancionesPlaylist(nombre) {
    cuerpoTablaPlaylist.innerHTML = '';
    const canciones = datosPlaylists[nombre] || [];

    if (canciones.length === 0) {
      mensajeVacio.classList.remove('d-none');
      contenedorTabla.classList.add('d-none');
    } else {
      mensajeVacio.classList.add('d-none');
      contenedorTabla.classList.remove('d-none');

      canciones.forEach((cancion, index) => {
        const fila = document.createElement('tr');
        fila.dataset.song_id = `pl_${nombre}_${index}`;
        fila.innerHTML = `
          <td><button class="btn btn-sm btn-outline-primary play_btn" type="button">▶</button></td>
          <td class="fw-semibold">${cancion.titulo}</td>
          <td>${cancion.artista}</td>
          <td class="text-end">${cancion.duracion}</td>
        `;
        cuerpoTablaPlaylist.appendChild(fila);
      });
    }
  }

  function registrarEventoTarjeta(tarjeta) {
    tarjeta.addEventListener('click', () => {
      const titulo = tarjeta.querySelector('.card-title').textContent.trim();
      const desc = tarjeta.querySelector('.card-text').textContent.trim();

      playlistSeleccionada = titulo;
      if (!datosPlaylists[titulo]) {
        datosPlaylists[titulo] = [];
      }

      tituloDetalle.textContent = titulo;
      descDetalle.textContent = desc;

      cargarCancionesPlaylist(titulo);
      
      window.location.hash = '#playlist';
    });
  }

  document.querySelectorAll('.tarjeta-playlist').forEach(registrarEventoTarjeta);

  const modalAgregarCancionEl = document.getElementById('modalAgregarCancion');
  const botonesAgregarItem = document.querySelectorAll('.btn-agregar-item');

  botonesAgregarItem.forEach((btn) => {
    btn.addEventListener('click', () => {
      const titulo = btn.dataset.titulo;
      const artista = btn.dataset.artista;
      const duracion = btn.dataset.duracion;

      if (playlistSeleccionada && datosPlaylists[playlistSeleccionada]) {
        datosPlaylists[playlistSeleccionada].push({ titulo, artista, duracion });
        cargarCancionesPlaylist(playlistSeleccionada);
      }

      const modal = bootstrap.Modal.getInstance(modalAgregarCancionEl);
      if (modal) modal.hide();
    });
  });

  function cerrarModalYResetear(formulario) {
    const elementoModal = formulario.closest('.modal');
    const modal = bootstrap.Modal.getOrCreateInstance(elementoModal);
    modal.hide();
    elementoModal.addEventListener('hidden.bs.modal', () => {
      formulario.reset();
      formulario.classList.remove('was-validated');
    }, { once: true });
  }

  const formCrearPlaylist = document.getElementById('form_crear_playlist');
  formCrearPlaylist.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();
    formCrearPlaylist.classList.add('was-validated');

    if (formCrearPlaylist.checkValidity()) {
      const nombre = document.getElementById('inputNombrePlaylist').value.trim();
      const desc = document.getElementById('inputDescPlaylist').value.trim() || 'Lista personalizada';

      datosPlaylists[nombre] = [];

      const col = document.createElement('div');
      col.className = 'col';
      col.innerHTML = `
        <div class="card h-100 shadow-sm tarjeta-playlist" role="button">
          <div class="card-body">
            <h2 class="h6 card-title mb-1">${nombre}</h2>
            <p class="card-text small text-muted mb-0">${desc}</p>
          </div>
        </div>
      `;

      const nuevaTarjeta = col.querySelector('.tarjeta-playlist');
      registrarEventoTarjeta(nuevaTarjeta);

      document.getElementById('contenedor_lista_playlists').appendChild(col);
      cerrarModalYResetear(formCrearPlaylist);
    }
  });

  // [IA] inicio · ia/2026-11-12_yisuscrist67_sesion.md
  // Login y registro: validan el formulario, consultan la API simulada y,
  // si responde ok, entregan el usuario a Alpine.store('sesion').
  const sesion = () => Alpine.store('sesion');

  // Envía un formulario de autenticación. `llamada` devuelve la promesa de la API.
  async function enviarAutenticacion(formulario, cajaError, llamada) {
    const boton = formulario.querySelector('button[type="submit"]');
    cajaError.classList.add('d-none');
    boton.disabled = true;
    let res;
    try {
      res = await llamada();
    } catch {
      res = { ok: false, error: 'No se pudo conectar con el servidor.' };
    }
    boton.disabled = false;

    if (!res.ok) {
      cajaError.textContent = res.error || 'No se pudo iniciar sesión.';
      cajaError.classList.remove('d-none');
      return;
    }
    cerrarModalYResetear(formulario);
    sesion().iniciar(res.data);
  }

  const formularioLogin = document.getElementById('form_login');
  const errorLogin = document.getElementById('login_error');
  formularioLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();
    formularioLogin.classList.add('was-validated');
    if (!formularioLogin.checkValidity()) return;

    const correo = document.getElementById('loginCorreo').value.trim();
    const contrasena = document.getElementById('loginContrasena').value;
    enviarAutenticacion(formularioLogin, errorLogin, () => api.login({ correo, password: contrasena }));
  });

  const formularioRegistro = document.getElementById('form_registro');
  const errorRegistro = document.getElementById('registro_error');
  const regContrasena = document.getElementById('regContrasena');
  const regConfirmarContrasena = document.getElementById('regConfirmarContrasena');

  function validarContrasenas() {
    if (regConfirmarContrasena.value && regConfirmarContrasena.value !== regContrasena.value) {
      regConfirmarContrasena.setCustomValidity('Las contraseñas no coinciden');
    } else {
      regConfirmarContrasena.setCustomValidity('');
    }
  }

  regContrasena.addEventListener('input', validarContrasenas);
  regConfirmarContrasena.addEventListener('input', validarContrasenas);

  formularioRegistro.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();
    validarContrasenas();
    formularioRegistro.classList.add('was-validated');
    if (!formularioRegistro.checkValidity()) return;

    const datos = {
      nombre: document.getElementById('regNombre').value.trim(),
      correo: document.getElementById('regEmail').value.trim(),
      password: regContrasena.value,
    };
    enviarAutenticacion(formularioRegistro, errorRegistro, () => api.registrar(datos));
  });
  // [IA] fin
});
