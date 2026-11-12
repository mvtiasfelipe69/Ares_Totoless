// [IA] inicio · ia/2026-11-12_yisuscrist67_formularios-toasts.md
// Formularios de login y registro con Alpine.
// Cada formulario es un componente (Alpine.data) con:
//   campos  -> lo que escribe el usuario (enlazado con x-model)
//   errores -> un mensaje por campo; vacío = sin error
//   enviando, exito, errorGeneral -> estado del envío
(() => {
  const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Reglas por campo. Cada una recibe el valor (y todos los campos) y
  // devuelve el mensaje de error, o '' si está bien.
  const reglas = {
    nombre: (v) => (v.trim().length < 2 ? 'Ingresa tu nombre (mínimo 2 caracteres).' : ''),
    correo: (v) =>
      !v.trim() ? 'Ingresa tu correo.' : !REGEX_CORREO.test(v.trim()) ? 'El correo no tiene un formato válido.' : '',
    password: (v) => (v.length < 6 ? 'La contraseña debe tener al menos 6 caracteres.' : ''),
    passwordLogin: (v) => (!v ? 'Ingresa tu contraseña.' : ''),
    confirmar: (v, campos) =>
      !v ? 'Repite la contraseña.' : v !== campos.password ? 'Las contraseñas no coinciden.' : '',
  };

  // Lógica común a los dos formularios. `config` dice qué reglas usa cada campo,
  // a qué endpoint llamar y qué hacer con un error del servidor.
  function crearFormulario(config) {
    const vacio = () => Object.fromEntries(Object.keys(config.reglas).map((k) => [k, '']));

    return {
      campos: vacio(),
      errores: vacio(),
      tocados: {}, // campos que el usuario ya dejó (blur): solo esos muestran error
      enviando: false,
      exito: '',
      errorGeneral: '',

      init() {
        // Al cerrar el modal se limpia todo para la próxima vez.
        this.$root.addEventListener('hidden.bs.modal', () => this.reiniciar());
      },

      validarCampo(nombre) {
        const regla = reglas[config.reglas[nombre]];
        this.errores[nombre] = regla(this.campos[nombre], this.campos);
        return this.errores[nombre] === '';
      },

      // Se usa en @blur: marca el campo y lo valida.
      tocar(nombre) {
        this.tocados[nombre] = true;
        this.validarCampo(nombre);
      },

      // Se usa en @input: revalida solo si el usuario ya pasó por el campo.
      revisar(nombre) {
        if (this.tocados[nombre]) this.validarCampo(nombre);
        if (nombre === 'password' && this.tocados.confirmar) this.validarCampo('confirmar');
      },

      // Clases de Bootstrap para pintar el input en rojo/verde.
      clase(nombre) {
        if (!this.tocados[nombre]) return '';
        return this.errores[nombre] ? 'is-invalid' : 'is-valid';
      },

      validarTodo() {
        let todoOk = true;
        for (const nombre of Object.keys(this.campos)) {
          this.tocados[nombre] = true;
          if (!this.validarCampo(nombre)) todoOk = false;
        }
        return todoOk;
      },

      async enviar() {
        if (this.enviando) return; // evita doble envío
        this.errorGeneral = '';
        this.exito = '';
        if (!this.validarTodo()) return;

        this.enviando = true;
        let res;
        try {
          res = await config.llamar(this.campos);
        } catch {
          res = { ok: false, status: 0, error: 'No se pudo conectar con el servidor.' };
        }
        this.enviando = false;

        if (!res.ok) {
          // Si el error corresponde a un campo, se muestra bajo ese input;
          // si no, va arriba del botón y en un toast.
          const campo = config.campoDelError(res);
          if (campo) {
            this.errores[campo] = res.error;
          } else {
            this.errorGeneral = res.error || 'Ocurrió un error inesperado.';
            Alpine.store('toasts').error(this.errorGeneral);
          }
          return;
        }

        this.exito = config.mensajeExito(res.data);
        Alpine.store('toasts').exito(this.exito);
        // Se deja ver el mensaje un momento y luego se cierra el modal.
        setTimeout(() => {
          // $root = el elemento con x-data (el modal); $el sería el <form>.
          bootstrap.Modal.getOrCreateInstance(this.$root).hide();
          Alpine.store('sesion').iniciar(res.data);
        }, 900);
      },

      reiniciar() {
        this.campos = vacio();
        this.errores = vacio();
        this.tocados = {};
        this.enviando = false;
        this.exito = '';
        this.errorGeneral = '';
      },
    };
  }

  document.addEventListener('alpine:init', () => {
    Alpine.data('formLogin', () =>
      crearFormulario({
        reglas: { correo: 'correo', password: 'passwordLogin' },
        llamar: (c) => api.login({ correo: c.correo, password: c.password }),
        // 401 = credenciales malas: no se dice cuál campo falló (por seguridad).
        campoDelError: () => null,
        mensajeExito: (usuario) => `¡Hola de nuevo, ${usuario.nombre}!`,
      })
    );

    Alpine.data('formRegistro', () =>
      crearFormulario({
        reglas: { nombre: 'nombre', correo: 'correo', password: 'password', confirmar: 'confirmar' },
        llamar: (c) => api.registrar({ nombre: c.nombre, correo: c.correo, password: c.password }),
        // 409 = el correo ya existe: el error va bajo el input del correo.
        campoDelError: (res) => (res.status === 409 ? 'correo' : null),
        mensajeExito: (usuario) => `Cuenta creada. ¡Bienvenido, ${usuario.nombre}!`,
      })
    );
  });
})();
// [IA] fin
