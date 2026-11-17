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

## Decisiones

- **Vite + React 19 + TypeScript.** Es una SPA sin SEO ni SSR, así que Next.js no aportaba nada. TypeScript en `strict` y con `noUncheckedIndexedAccess`, para que acceder a un array o a un objeto por índice obligue a contemplar el `undefined`.
- **Tailwind CSS v4.** Me permite una UI limpia y responsive en poco tiempo sin escribir CSS a medida, y con Vite basta el plugin y un `@import`. El color de marca está en `@theme` (`src/index.css`). Sin librería de componentes: para dos pantallas no compensa.
- **ESLint + Prettier.** Mantengo el ESLint que trae la plantilla de Vite y añado Prettier con `prettier-plugin-tailwindcss` para que el orden de las clases no dependa de quien escribe.
- **Saltos de línea LF.** Desarrollo en Windows; `.gitattributes` fuerza LF en el repositorio para que el formato no cambie según el sistema.
- **Alias `@/` → `src/`.** Lo fijo antes del primer import para no tener rutas `../../` entre carpetas.
- **pnpm** como gestor de paquetes, con un único lockfile.
- **`CLAUDE.md` antes del código.** Fija el stack, la estructura, las reglas de la API, de accesibilidad, de tests y de commits, para que la IA siga las decisiones en vez de improvisarlas.
- **Cliente de API con `fetch` nativo.** Un `fetchJson` de unas pocas líneas basta; axios no aportaba nada aquí. Comprueba `res.ok` porque `fetch` no lanza con un 4xx o 5xx, y sin eso un 500 se trataría como éxito. Solo expongo `getUsers`, `getUserPosts` y `createPost`: el detalle saca el usuario de la lista ya cargada, así que no hace falta pedirlo aparte.

## Cómo usé la IA

Uso Claude Code en el editor durante todo el desarrollo. Antes de escribir código dejé un [`CLAUDE.md`](CLAUDE.md) en la raíz con el stack, la estructura, las trampas de la API y las reglas de tests y commits; así no tengo que repetirle en cada paso que no meta axios o que no use `getByTestId`.

**Qué le pedí**

- Limpiar la plantilla de Vite (demo, assets, favicon) y crear un icono propio con el color de la app, para que no se viera nada de la plantilla.
- Que me consultara antes de cada commit, en vez de encadenarlos: quiero revisar qué entra en cada uno.
