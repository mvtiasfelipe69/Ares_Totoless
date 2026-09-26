document.addEventListener('DOMContentLoaded', () => {
  let idCancionActual = null;
  let estaReproduciendo = false;
  let seccionPrevia = 'vista_musica';
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

  function vincularBotonesReproduccion(contenedor) {
    contenedor.querySelectorAll('.play_btn').forEach((botonPlay) => {
      botonPlay.onclick = () => {
        const fila = botonPlay.closest('tr');
        const id = fila.dataset.song_id;
        if (idCancionActual === id) {
          estaReproduciendo = !estaReproduciendo;
        } else {
          idCancionActual = id;
          estaReproduciendo = true;
        }
        actualizarInterfazReproductor();
      };
    });
  }

  vincularBotonesReproduccion(document.getElementById('tabla_canciones'));

  botonAlternar.addEventListener('click', () => {
    if (!idCancionActual) return;
    estaReproduciendo = !estaReproduciendo;
    actualizarInterfazReproductor();
  });

  const formularioBusqueda = document.getElementById('form_busqueda');
  const entradaBusqueda = document.getElementById('input_busqueda');
  const filasCanciones = document.querySelectorAll('#lista_canciones tr');

  function filtrarCanciones() {
    const termino = entradaBusqueda.value.trim().toLowerCase();
    filasCanciones.forEach((fila) => {
      const titulo = fila.children[1].textContent.toLowerCase();
      const artista = fila.children[2].textContent.toLowerCase();
      const coincide = titulo.includes(termino) || artista.includes(termino);
      fila.classList.toggle('d-none', termino !== '' && !coincide);
    });
  }

  entradaBusqueda.addEventListener('input', filtrarCanciones);
  formularioBusqueda.addEventListener('submit', (e) => {
    e.preventDefault();
    filtrarCanciones();
  });

  const enlacesMenu = document.querySelectorAll('#menu_lateral .nav-link');
  const paneles = document.querySelectorAll('.panel-contenido');

  function cambiarSeccion(targetId) {
    if (targetId !== 'vista_detalle_playlist') {
      seccionPrevia = targetId;
    }

    paneles.forEach((panel) => {
      panel.classList.toggle('d-none', panel.id !== targetId);
    });

    enlacesMenu.forEach((enlace) => {
      enlace.classList.toggle('active', enlace.dataset.seccion === targetId);
    });
  }

  enlacesMenu.forEach((enlace) => {
    enlace.addEventListener('click', (e) => {
      e.preventDefault();
      cambiarSeccion(enlace.dataset.seccion);
    });
  });

  const tituloDetalle = document.getElementById('detalle_playlist_titulo');
  const descDetalle = document.getElementById('detalle_playlist_desc');
  const btnVolver = document.getElementById('btn_volver_playlists');
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
      vincularBotonesReproduccion(cuerpoTablaPlaylist);
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
      cambiarSeccion('vista_detalle_playlist');
      
      enlacesMenu.forEach((enlace) => {
        enlace.classList.toggle('active', enlace.dataset.seccion === 'vista_playlists');
      });
    });
  }

  document.querySelectorAll('.tarjeta-playlist').forEach(registrarEventoTarjeta);

  btnVolver.addEventListener('click', () => {
    cambiarSeccion(seccionPrevia);
  });

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

  const bloqueInvitado = document.getElementById('bloque_invitado');
  const bloqueUsuario = document.getElementById('bloque_usuario');
  const nombreUsuarioActivo = document.getElementById('nombre_usuario_activo');
  const btnCerrarSesion = document.getElementById('btn_cerrar_sesion');

  function iniciarSesionUsuario(nombre) {
    nombreUsuarioActivo.textContent = nombre;
    bloqueInvitado.classList.add('d-none');
    bloqueInvitado.classList.remove('d-flex');
    bloqueUsuario.classList.remove('d-none');
    bloqueUsuario.classList.add('d-flex');
  }

  btnCerrarSesion.addEventListener('click', () => {
    bloqueUsuario.classList.add('d-none');
    bloqueUsuario.classList.remove('d-flex');
    bloqueInvitado.classList.remove('d-none');
    bloqueInvitado.classList.add('d-flex');
  });

  const formularioLogin = document.getElementById('form_login');
  formularioLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();
    formularioLogin.classList.add('was-validated');
    if (formularioLogin.checkValidity()) {
      const email = document.getElementById('loginCorreo').value;
      const nombreVisible = email.split('@')[0];
      iniciarSesionUsuario(nombreVisible);
      cerrarModalYResetear(formularioLogin);
    }
  });

  const formularioRegistro = document.getElementById('form_registro');
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
    if (formularioRegistro.checkValidity()) {
      const nombre = document.getElementById('regNombre').value;
      iniciarSesionUsuario(nombre);
      cerrarModalYResetear(formularioRegistro);
    }
  });
});