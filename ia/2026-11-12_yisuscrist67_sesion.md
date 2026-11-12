# Sesión con Alpine.store y rutas privadas
**Fecha:** 2026-11-12
**Integrante:** Jesús Briceño (@yisuscrist67)
**Herramienta y modelo:** Claude (Claude Fable 5.2)
**Archivos afectados:** js/sesion.js (nuevo), js/app.js, index.html

## Objetivo
Crear Alpine.store('sesion') persistido en localStorage, proteger las vistas privadas (playlists y perfil) redirigiendo al login, mostrar "Hola, <nombre>" en el menú, que cerrar sesión limpie el estado y reemplazar el login falso de js/app.js.

## Conversación (texto completo, sin editar)
### Prompt 1
Lee el doc plan-entrega-2 del proyecto y revisa el repo actual en GitHub. Soy Yisus (@yisuscrist67). Paso 2 (el paso 1 ya está subido): crea Alpine.store('sesion') que guarde el usuario en localStorage para que sobreviva al recargar, que las vistas privadas (playlists y perfil) redirijan al login si no hay sesión, que el menú muestre "Hola, <nombre>" y que cerrar sesión limpie todo. Reemplaza el login falso de js/app.js. Marca el código con [IA] apuntando a ia/2026-11-12_yisuscrist67_sesion.md. Explícamelo por partes y dame la plantilla del registro, la fila del índice y los comandos de commit.

### Respuesta 1
Voy a leer el plan, revisar el repo y luego escribir el store de sesión con su explicación.

El paso 2 está listo y probado, pero el paso 1 no está en GitHub, así que el login no funcionará hasta que lo subas.

Lo que encontré en el repo
Paso 1 ausente: en main, mocks/usuarios.json pesa 0 bytes y js/api.js no tiene login ni registrar.
Tu commit de las 11:13 (docs(ia): agrego indice…) solo subió un archivo vacío, ia/2026-11-12_Yisuscrist67.md. No existe ia/README.md.
Qué revisar: corre git status y git log origin/main..main en tu PC para ver si el paso 1 quedó sin commit o sin push.

Mi código asume este contrato, ajústalo si en tu paso 1 los nombres son otros (son dos líneas en js/app.js):

api.login(correo, contrasena)
api.registrar({ nombre, correo, contrasena })
Ambos devuelven { ok, status, data: usuario, error }, igual que el resto de la API.

Lo probé en Chrome con un api.login de prueba que no va en los archivos: redirección, error de credenciales, login, recarga y cierre de sesión funcionan sin errores de consola.

Explicación por partes

1. El store (js/sesion.js, archivo nuevo). Un Alpine.store es como un objeto static global en Java: una sola instancia que cualquier parte del HTML lee con $store.sesion. Tiene:

usuario: el objeto { id, nombre, correo } o null.
activa y nombre: getters, como métodos getX() que se usan sin paréntesis.
iniciar(usuario), cerrar() y proteger().

2. Persistencia. localStorage es un Map<String, String> que el navegador guarda en disco. Como solo acepta texto, se serializa:

iniciar() guarda con JSON.stringify bajo la clave aresTotoless:sesion, quitando antes la contraseña.
init() (Alpine lo llama solo, como un constructor) lee con JSON.parse al cargar la página. Por eso la sesión sobrevive al F5.

3. Rutas privadas. proteger() corre al abrir la página y en cada hashchange. Si el hash es #vista_playlists, #playlist/... o #perfil y no hay sesión:

Guarda a dónde ibas en destino.
Te devuelve a #vista_musica y abre el modal de login (el login de ustedes es un modal, no una vista).
Al iniciar sesión, te lleva al destino guardado.

4. Menú (index.html). Los dos bloques del navbar ahora van dentro de <template x-if>: uno se dibuja si $store.sesion.activa, el otro si no. El nombre sale con x-text="$store.sesion.nombre" y el botón usa @click="$store.sesion.cerrar()". Usé x-if y no x-show porque d-flex de Bootstrap lleva !important y le gana a x-show.

5. Cerrar sesión. cerrar() pone usuario = null, borra la clave de localStorage, limpia destino y, si estabas en una vista privada, te saca al inicio. No toca aresTotoless:config porque es del simulador de errores, no del usuario.

6. Login falso reemplazado (js/app.js). Borré iniciarSesionUsuario y los classList que mostraban u ocultaban bloques a mano. Ahora login y registro comparten enviarAutenticacion, que:

Deshabilita el botón mientras espera.
Llama a la API.
Si falla, muestra el error en una caja nueva del modal (#login_error, #registro_error).
Si funciona, cierra el modal y llama a sesion().iniciar(res.data).

#perfil ya está protegida, pero la vista aún no existe: con sesión mostrará el 404 hasta que la construyas.

Registro e índice
Plantilla: ia/2026-11-12_yisuscrist67_sesion.md viene con todo salvo lo que debes pegar tú: tu prompt y esta respuesta completos, qué modificaste y tu verificación en Live Server.
Índice: como ia/README.md no existe, te lo dejo creado con el encabezado y tu fila. Faltan las tres filas de Matías. Si ya lo tienes en tu PC, agrega solo esta:
markdown
| 2026-11-12 | @yisuscrist67 | Sesión con Alpine.store y rutas privadas | js/sesion.js, js/app.js, index.html | [2026-11-12_yisuscrist67_sesion.md](2026-11-12_yisuscrist67_sesion.md) |
Comandos

Copia los archivos a tu repo, prueba en Live Server, completa el registro y luego:

bash
git pull --rebase
git rm ia/2026-11-12_Yisuscrist67.md
git add js/sesion.js js/app.js index.html ia/2026-11-12_yisuscrist67_sesion.md ia/README.md
git status
git commit -m "feat(sesion): agrega store de sesion persistente y rutas privadas [IA]"
git push

El git rm borra el archivo vacío de las 11:13, que no cumple el formato de nombre; sáltalo si prefieres conservarlo.
## Qué se incorporó al proyecto
- js/sesion.js: Alpine.store('sesion') (usuario, activa, nombre, iniciar, cerrar, proteger) y el guardia de rutas privadas.
- index.html: el menú usa $store.sesion para mostrar "Hola, <nombre>" o los botones de invitado; cajas de error en los modales de login y registro; carga de js/sesion.js.
- js/app.js: se eliminó el login/registro falso; ahora los formularios llaman a api.login / api.registrar y entregan el usuario al store.

## Qué se modificó respecto a la respuesta de la IA
Nada, se usó tal cual.
