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
  const sessionStore = {
    usuario: JSON.parse(localStorage.getItem('usuario')) || null,

    iniciarSesion: function(datos) 
    {
      this.usuario = datos;
      localStorage.setItem('usuario', JSON.stringify(datos));
      window.dispatchEvent(new Event('cambioSesion'));
    },

    cerrarSesion: function()
    {
      this.usuario = null;
      localStorage.removeItem('usuario');
      window.dispatchEvent(new Event('cambioSesion'));
      window.location.hash = '#/'; 
    }
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

  // [IA] inicio · ia/2026-11-12_yisuscrist67_formularios-toasts.md
  // El login y el registro ahora viven en js/formularios.js (componentes Alpine).
  // [IA] fin

  function inicializarAuth() {
    let form = document.getElementById('form-login');
    if (form) 
    {
      form.addEventListener('submit', function(e)
      {
        e.preventDefault(); 
        let mail = document.getElementById('email').value;
        let pass = document.getElementById('password').value;
        if (mail === "" || pass === "") 
        {
          alert("Faltan datos por llenar");
          return;
        }
        let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(mail))
        {
          alert("Ingresa un correo válido");
          return;
        }
        let userLogin = 
        { email: mail, token: '12345' };
        sessionStore.iniciarSesion(userLogin);
        window.location.hash = '#/inicio'; 
      });
    }
  }
  let estadoPlaylists = [];
  function renderizarListadoPlaylists() 
  {
    let contenedor = document.getElementById('contenedor-playlists');
    if (!contenedor) return;
    let dataLocal = localStorage.getItem('playlistsDB');
    if (dataLocal) 
    {
      estadoPlaylists = JSON.parse(dataLocal);
    } 
    else 
    {
      estadoPlaylists = [];
    }
    if (estadoPlaylists.length === 0)
    {
      contenedor.innerHTML = '<p>No hay playlists creadas.</p>';
      return;
    }
    let html = "";
    for (let i = 0; i < estadoPlaylists.length; i++) 
    {
      let p = estadoPlaylists[i];
      html += `
        <div class="playlist-card" data-id="${p.id}">
          <h3>${p.nombre}</h3>
          <button class="btn-editar">Editar</button>
          <button class="btn-eliminar">Eliminar</button>
        </div>
      `;
    }
    contenedor.innerHTML = html;
  }
  function guardarPlaylist(nombreIngresado, idEditar = null) 
  {
    let db = JSON.parse(localStorage.getItem('playlistsDB')) || [];
    if (idEditar !== null) {
      for (let i = 0; i < db.length; i++) 
      {
        if (db[i].id == idEditar) 
        {
          db[i].nombre = nombreIngresado;
          break; 
        }
      }
    } 
    else 
    {
      let nueva = 
      {
        id: Date.now().toString(), 
        nombre: nombreIngresado,
        canciones: []
      };
      db.push(nueva);
    }
    localStorage.setItem('playlistsDB', JSON.stringify(db));
    renderizarListadoPlaylists(); 
  }
  function inicializarEventosPlaylists()
  {
    let contenedor = document.getElementById('contenedor-playlists');
    if (contenedor)
    {
      contenedor.addEventListener('click', function(e) {
        let btn = e.target;
        if (btn.classList.contains('btn-eliminar')) {
          let card = btn.parentElement; 
          let playlistId = card.getAttribute('data-id');

          let confirmar = confirm('¿Seguro que quieres borrar esta playlist?');
          if (confirmar) {
            let db = JSON.parse(localStorage.getItem('playlistsDB')) || [];
            let nuevaDb = db.filter(p => p.id != playlistId);
            localStorage.setItem('playlistsDB', JSON.stringify(nuevaDb));
            renderizarListadoPlaylists(); 
          }
        }
      });
    }
  }
  function agregarCancionAPlaylist(idPlaylist, cancion) 
  {
    let db = JSON.parse(localStorage.getItem('playlistsDB')) || [];
    for (let i = 0; i < db.length; i++) 
    {
      if (db[i].id == idPlaylist) 
      {
        let existe = false;
        for (let j = 0; j < db[i].canciones.length; j++) 
        {
          if (db[i].canciones[j].id == cancion.id) 
          {
            existe = true;
          }
        }
        if (existe) 
        {
          alert('La canción ya está en la playlist');
        } 
        else 
        {
          db[i].canciones.push(cancion);
          localStorage.setItem('playlistsDB', JSON.stringify(db));
        }
      // [IA] inicio · ia/2026-11-12_yisuscrist67_formularios-toasts.md
      // Faltaban estas 3 llaves de cierre (if, for y función): sin ellas app.js no corría.
      }
    }
  }
  // [IA] fin
});
