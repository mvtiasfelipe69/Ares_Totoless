# Usuarios mock + login y registro en la API simulada
**Fecha:** 2026-11-12
**Integrante:** Jesús Briceño (@yisuscrist67)
**Herramienta y modelo:** Claude (Claude Fable 5.2)
**Archivos afectados:** mocks/usuarios.json (completo), js/api.js (bloques marcados con `[IA]`: helpers de usuarios y funciones `login` y `registrar`), ia/README.md (fila nueva)

## Objetivo
Crear los 10 usuarios de prueba (uno admin) y agregar a `window.api` las funciones `login` y `registrar`, sin modificar los endpoints que hizo Matías, entendiendo el código por partes con comparaciones a C++/Java.

## Conversación (texto completo, sin editar)

### Prompt 1
Lee el doc plan-entrega-2 del proyecto. Soy Yisus (@yisuscrist67). Paso 1: crea
mocks/usuarios.json con 10 usuarios (uno admin) y agrega a window.api en js/api.js
las funciones login y registrar, sin borrar lo que hizo Matías. Márcalo con [IA].
Explícamelo por partes comparando con C++/Java y dame la plantilla del registro y el commit.

### Respuesta 1
Voy a leer el plan de la Entrega 2 y luego armo los usuarios mock y las funciones login y registrar.

El Paso 1 está listo y probado: mocks/usuarios.json tiene 10 usuarios (uno admin) y window.api ya tiene login y registrar, sin tocar ningún endpoint de Matías. No hice el commit ni el push: la pauta exige que salga de tu cuenta, así que te dejo los archivos y los comandos.

Lo probé simulando el navegador con Node: login correcto devuelve 200, contraseña mala 401, campos vacíos 400, registro nuevo 201, correo repetido 409, y los endpoints de Matías siguen respondiendo igual. Falta que lo pruebes tú con Live Server.

Archivos
Archivo	Qué es
mocks/usuarios.json	Reemplaza el vacío.
js/api.js	El de Matías más dos bloques [IA] míos.
ia/2026-11-12_yisuscrist67_auth-usuarios.md	Plantilla del registro, con tu prompt ya puesto.
ia/README.md	Índice de registros; no existía en el repo, lo creé con las 3 filas de Matías y la tuya.

Credenciales de prueba: admin@arestotoless.cl / admin123 (admin) y camila.rojas@arestotoless.cl / camila123 (usuario normal). Las otras siguen el mismo patrón, nombre + 123.

Explicación por partes

1. usuarios.json es un arreglo de objetos.
En Java sería un List<Usuario> ya cargado, donde cada { ... } es una instancia con sus atributos (id, nombre, correo, password, rol, plan, creadoEn). No hay clase declarada: en JS el objeto se define al escribirlo. El id es string porque Matías usa strings en todos sus mocks.

2. Los helpers quedan “privados” dentro del IIFE.
El (() => { ... })(); que envuelve el archivo funciona como una clase con miembros private: lo de adentro no se ve desde afuera. Lo único public es lo que se cuelga de window.api. Agregué tres helpers privados:

leerRegistrados() lee las cuentas nuevas desde localStorage, que es como un Map<String, String> que el navegador guarda en disco. Como solo guarda texto, se usa JSON.parse para leer y JSON.stringify para escribir (deserializar y serializar).
leerUsuarios() junta los 10 del mock con los registrados. El [...a, ...b] equivale a un addAll de dos listas en una nueva.
sinPassword(usuario) devuelve una copia sin la contraseña. La línea const { password, ...publico } = usuario; saca password a una variable y mete el resto en publico.

3. async / await es esperar sin congelar la página.
Leer un archivo toma tiempo. Una función async devuelve una Promise, parecida a un Future<T> de Java o std::future de C++. await es como llamar a .get(), pero sin bloquear la interfaz.

4. login busca y compara.
ejecutar(opts, fn) es la función de Matías que agrega la latencia y los errores simulados; yo solo le paso la lógica como lambda. Adentro:

.find((u) => ...) es un for que retorna el primer elemento que cumple, como std::find_if o stream().filter().findFirst().
Si no existe el usuario o la contraseña no coincide, devuelve fallo(401, ...) con el mismo mensaje en ambos casos, para no revelar qué correos existen.
En vez de lanzar excepciones, siempre retorna un objeto { ok, status, data, error }. Quien llama hace if (res.ok) en lugar de try/catch.

5. registrar valida, revisa duplicados y guarda.

Tres validaciones con retorno temprano (400): nombre, formato de correo con una expresión regular (como std::regex) y largo de la contraseña.
.some(...) es el anyMatch de Java: si el correo ya existe, devuelve 409.
El id nuevo es el máximo actual + 1; .map transforma la lista (como std::transform).
Guarda en localStorage porque una página no puede escribir archivos del repo. Por eso las cuentas nuevas viven solo en ese navegador.

6. Las contraseñas van en texto plano.
Es aceptable solo porque es un mock; conviene decirlo en el README. En un sistema real van hasheadas en el servidor.

Cómo probarlo

Abre el sitio con Live Server, aprieta F12 y en la consola escribe:

js
await api.login({ correo: 'admin@arestotoless.cl', password: 'admin123' })
await api.registrar({ nombre: 'Yisus', correo: 'yisus@test.cl', password: 'secreto1' })
await api.login({ correo: 'yisus@test.cl', password: 'secreto1' })

Los formularios de la página todavía usan el login falso de la Entrega 1; conectarlos es el paso siguiente.

Registro y commit
Abre ia/2026-11-12_yisuscrist67_auth-usuarios.md y pega esta respuesta completa donde dice PEGA AQUÍ. Completa las dos secciones finales (qué usaste y cómo lo verificaste).
En tu repo hay un ia/2026-11-12_Yisuscrist67.md vacío de tu último commit, con un nombre que no cumple el formato. El git rm de abajo lo borra.
bash
git pull --rebase
# copia los 4 archivos a sus carpetas y completa el registro
git rm ia/2026-11-12_Yisuscrist67.md
git add mocks/usuarios.json js/api.js ia/2026-11-12_yisuscrist67_auth-usuarios.md ia/README.md
git status
git commit -m "feat(api): agrego usuarios mock y funciones login y registrar [IA]"
git push

git status antes del commit debe mostrar solo esos archivos en verde. Avísale a Matías que ya existe ia/README.md, para que no cree otro y choquen.

## Qué se modificó respecto a la respuesta de la IA
Nada, se usó tal cual.
