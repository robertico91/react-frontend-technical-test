# Usuarios y publicaciones

Aplicación de página única en React + TypeScript que consume la API pública [JSONPlaceholder](https://jsonplaceholder.typicode.com): lista de usuarios con búsqueda y, para cada usuario, sus publicaciones y un formulario para crear una nueva.

## Cómo ejecutarlo

Necesita Node 20.19+ o 22.12+ (lo que pide Vite 8) y [pnpm](https://pnpm.io).

```sh
pnpm install
pnpm dev            # http://localhost:5173
pnpm build          # comprobación de tipos + build de producción
pnpm typecheck
pnpm lint
pnpm format:check   # pnpm format para aplicar el formato
```

La API responde muy rápido, así que en local apenas se ven los estados de carga. Para verlos: DevTools → Network → "Slow 3G" (carga) u "Offline" (error con "Reintentar").

## Decisiones

- **Vite + React 19 + TypeScript.** Es una SPA sin SEO ni SSR, así que Next.js no aportaba nada. TypeScript en `strict` y con `noUncheckedIndexedAccess`, para que acceder a un array o a un objeto por índice obligue a contemplar el `undefined`.
- **Tailwind CSS v4.** Me permite una UI limpia y responsive en poco tiempo sin escribir CSS a medida, y con Vite basta el plugin y un `@import`. El color de marca está en `@theme` (`src/index.css`). Sin librería de componentes: para dos pantallas no compensa.
- **ESLint + Prettier.** Mantengo el ESLint que trae la plantilla de Vite y añado Prettier con `prettier-plugin-tailwindcss` para que el orden de las clases no dependa de quien escribe.
- **Saltos de línea LF.** Desarrollo en Windows; `.gitattributes` fuerza LF en el repositorio para que el formato no cambie según el sistema.
- **Alias `@/` → `src/`.** Lo fijo antes del primer import para no tener rutas `../../` entre carpetas.
- **pnpm** como gestor de paquetes, con un único lockfile.
- **`CLAUDE.md` antes del código.** Fija el stack, la estructura, las reglas de la API, de accesibilidad, de tests y de commits, para que la IA siga las decisiones en vez de improvisarlas.
- **Cliente de API con `fetch` nativo.** Un `fetchJson` de unas pocas líneas basta; axios no aportaba nada aquí. Comprueba `res.ok` porque `fetch` no lanza con un 4xx o 5xx, y sin eso un 500 se trataría como éxito. Solo expongo `getUsers`, `getUserPosts` y `createPost`: el detalle saca el usuario de la lista ya cargada, así que no hace falta pedirlo aparte.
- **TanStack Query para los datos remotos.** Me da carga, error, caché, cancelación y reintento sin reinventarlos. La alternativa era un `useFetch` propio con `AbortController`: viable, pero más código que mantener y probar.
- **Un solo reintento.** Con los 3 por defecto y su espera creciente, el error tardaba unos 7 s en aparecer; con uno se cubre un fallo puntual sin dejar al usuario esperando.
- **Estados que solo sustituyen los resultados.** La carga y el error ocupan el sitio de la lista, nunca la columna entera, y si falla un refetch en segundo plano se siguen mostrando los datos que ya había.
- **Skeleton para cargar listas, spinner solo para acciones.** El skeleton tiene la misma forma y alto de fila que la lista real, así que no salta nada al llegar los datos. Es decorativo (`aria-hidden`) y los lectores de pantalla oyen "Cargando usuarios…".
- **Usuarios ordenados por nombre.** Con `Intl.Collator("es")` en el `select` de la query: se ordena una vez al llegar los datos.
- **Avatar con iniciales en varios colores, fijos por id.** El color ayuda a distinguir filas con iniciales iguales (Chelsey Dietrich y Clementina DuBuque son "CD") y no cambia al filtrar ni al ordenar. Uso tonos suaves para que no se lean como categorías ni compitan con la fila seleccionada, y el avatar es decorativo: el nombre está siempre al lado.
- **Layout maestro-detalle.** En escritorio la app ocupa la altura de la ventana (`h-dvh`) y la lista tiene su propio scroll, con título y contador fijos encima. En móvil solo se desplaza el listado, sin scrolls anidados.
- **Búsqueda en el cliente, sin pedir a la API.** JSONPlaceholder admite `name_like`, pero con 10 usuarios ya cargados filtrar en memoria es instantáneo y no genera peticiones ni estados de carga nuevos. `filterUsers` es una función pura que no distingue mayúsculas ni tildes (`normalize("NFD")`), así que "LEÁN" encuentra a Leanne.
- **Sin debounce.** Con 10 elementos filtrar no cuesta nada; uso `useDeferredValue` para que escribir tenga siempre prioridad sobre volver a pintar la lista.
- **Todo estado vacío ofrece una salida.** Si la búsqueda no encuentra nada, "Ver todos los usuarios" la limpia y devuelve el foco al buscador. El buscador está siempre visible, también mientras cargan los datos o si fallan, y el contador pasa a "2 de 10" al filtrar.

## Qué haría con más tiempo

- **Búsqueda en el servidor si hubiera muchos usuarios.** Con miles de registros o una lista paginada no los tendría todos en memoria: pasaría a buscar en el servidor con debounce, cancelando las peticiones que ya no sirven, y paginando los resultados.

## Cómo usé la IA

Uso Claude Code en el editor durante todo el desarrollo. Antes de escribir código dejé un [`CLAUDE.md`](CLAUDE.md) en la raíz con el stack, la estructura, las trampas de la API y las reglas de tests y commits; así no tengo que repetirle en cada paso que no meta axios o que no use `getByTestId`.

**Qué le pedí**

- Limpiar la plantilla de Vite (demo, assets, favicon) y crear un icono propio con el color de la app, para que no se viera nada de la plantilla.
- Que me consultara antes de cada commit, en vez de encadenarlos: quiero revisar qué entra en cada uno.
- El cliente de la API y la lista de usuarios con sus estados de carga, error y vacío.
- La búsqueda por nombre en el cliente, sin distinguir mayúsculas ni tildes, con un estado vacío que permita volver a ver todos.

**Qué acepté**

- El `fetchJson` tal como lo propuso: comprueba `res.ok`, lanza un error con el status y está tipado sin `any` ni `as`.
- La estructura del diseño del sitio. Le pedí que me propusiera una y la vi correcta: cabecera fija con el icono y el nombre de la app; maestro-detalle con la lista de usuarios a la izquierda y el detalle a la derecha en escritorio; la lista con su propio scroll y el título y el contador fijos encima; y en móvil una parte cada vez, sin scrolls anidados.

**Qué corregí**

- Le pedí mover el contador de usuarios a la izquierda del título "Usuarios" (lo hizo con `order-first`, sin cambiar el orden del HTML, para que el lector de pantalla siga leyendo primero el título). Al verlo me convenció menos: lo devolví a la derecha y terminé dejándolo al final de la línea (`ml-auto`), separado del título y alineado con el borde de la lista.
- Su primera versión de la lista cambiaba los datos ya cargados por el mensaje de error si fallaba un refetch en segundo plano. Lo detectó él mismo al probar el estado de error, y ahora el error solo aparece cuando no hay datos que enseñar.

**Qué le consulté**

- Si tenía sentido que cada avatar fuera de un color. Me dio argumentos a favor (distinguir iniciales repetidas, color estable por id, sin impacto en accesibilidad) y el riesgo (que se lean como categorías), con la alternativa de un solo color neutro. Lo mantuve en varios colores suaves.

**Revisiones y comprobaciones**

- Le pedí revisar un commit ya hecho sin tocar nada. Comprobó punto por punto la configuración y, como el alias `@/` aún no lo usaba ningún import, lo verificó con un archivo temporal fuera del proyecto, en TypeScript y en Vite.
- Al copiar las reglas a `CLAUDE.md` detectó que la estructura y la sección de tests nombraban distinto el helper de render de los tests, y lo unificó.
- En la búsqueda probó en el navegador "LEÁN" (mayúsculas y tilde), una búsqueda sin resultados y el botón "Ver todos los usuarios", comprobando que el foco volvía al buscador.
- Comprueba cada pantalla en el navegador, no solo con el compilador. Para ver la carga y el error rompió la URL de la API un momento y la restauró editando el archivo.
