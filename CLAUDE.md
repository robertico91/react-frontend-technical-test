# CLAUDE.md

Reglas y decisiones del proyecto. Léelo antes de proponer o escribir código.

## Contexto

Aplicación de página única (SPA) en React + TypeScript que consume la API pública https://jsonplaceholder.typicode.com:

1. Lista de usuarios con búsqueda por nombre.
2. Al elegir un usuario, ver sus publicaciones y crear una nueva con un formulario validado (título y texto obligatorios). La API no guarda nada: basta con que la nueva publicación aparezca en la lista.
3. Estados de carga y de error visibles.
4. Al menos 3 tests con Vitest y Testing Library.
5. README con cómo ejecutarlo, decisiones, qué haría con más tiempo y cómo se usó la IA.

Prioridad: criterio proporcional y detalles de producto, no cantidad de código. Nada de sobreingeniería.

## Comandos

```sh
pnpm dev              # Vite en http://localhost:5173
pnpm build            # tsc -b + vite build
pnpm typecheck        # tsc -b
pnpm lint             # eslint .
pnpm format           # prettier --write .
pnpm format:check
pnpm test             # vitest run
pnpm test:watch       # vitest en modo watch
```

Antes de cada commit: `typecheck`, `lint`, `format:check` y `test` deben pasar.

`format` y `format:check` pasan `--ignore-path` con `.gitignore`, `.prettierignore` y `.git/info/exclude`: al indicar uno, Prettier deja de leer los demás por defecto, y `.git/info/exclude` guarda lo que se ignora solo en local.

## Stack y decisiones (no cambiar sin hablarlo)

| Tema          | Decisión                                                                                       |
| ------------- | ---------------------------------------------------------------------------------------------- |
| Base          | Vite 8, React 19, TypeScript 6 (la de la plantilla) en `strict` con `noUncheckedIndexedAccess` |
| Datos remotos | TanStack Query. Nada de `useEffect` + `fetch` en componentes                                   |
| Routing       | React Router; el usuario elegido vive en la URL: `/users/:userId`                              |
| Formulario    | Controlado a mano + función pura `validatePost()`. Sin react-hook-form ni zod                  |
| Estilos       | Tailwind CSS v4 (`@theme` en `src/index.css`). Sin librerías de componentes ni shadcn/ui       |
| Lint/formato  | ESLint (el de la plantilla de Vite) + Prettier con `prettier-plugin-tailwindcss`               |
| Tests         | Vitest + Testing Library + user-event + MSW                                                    |

Gestor de paquetes: **pnpm** (`pnpm-lock.yaml`). No uses npm ni yarn ni generes otros lockfiles.

No añadas dependencias sin justificarlo (axios, zod, clsx, librerías de UI, etc.). Lo que solo se usa al compilar o en desarrollo (Tailwind, Prettier, Vitest…) va en `devDependencies` (`pnpm add -D`).

## Estructura (objetivo)

Estructura decidida antes de escribir código. Se completa a medida que llega cada feature: lo que aún no existe en `src/` está previsto, no falta.

```
src/
  api/          client.ts (fetchJson), users.ts, posts.ts, types.ts
  features/
    users/      componentes, hooks y utilidades de usuarios
    posts/      componentes, hooks, validatePost.ts
  components/   piezas reutilizables (AppHeader, Button, NotFound, Skeleton, StatusMessage)
  test/         solo infraestructura: setup, servidor MSW, handlers, renderApp
  App.tsx       layout y rutas (sin router: el BrowserRouter está en main.tsx)
  main.tsx      providers: QueryClientProvider y BrowserRouter
  queryClient.ts  createQueryClient(); los tests crean el suyo con retry: false
```

- Organización por feature, no por tipo de archivo.
- Las carpetas se crean cuando llega su primer archivo; nada de carpetas vacías ni `.gitkeep`.
- Alias `@/` → `src/` (en `tsconfig.app.json` y `vite.config.ts`). Imports entre carpetas con `@/` (`@/api/client`); dentro de la misma carpeta, relativos (`./filterUsers`).
- Los tests van junto a lo que prueban: `filterUsers.test.ts` al lado de `filterUsers.ts`, `UserList.test.tsx` al lado de `UserList.tsx`.

## Reglas de la API (JSONPlaceholder)

- `fetch` no lanza con 4xx/5xx: el cliente comprueba `res.ok` y lanza un error.
- `POST /posts` siempre devuelve `id: 101`. Las publicaciones creadas usan un id local único, negativo y decreciente (-1, -2…: sigue siendo número y nunca coincide con los de la API); nunca el id de la respuesta como `key`.
- La API no persiste. Las publicaciones creadas se añaden a la caché con `setQueryData`, y la query de publicaciones usa `staleTime: Infinity` y `refetchOnWindowFocus: false` para que un refetch no las borre.
- La nueva publicación va arriba de la lista.
- Un usuario inexistente (`/users/999`, `/users/abc`) muestra "Usuario no encontrado", no una pantalla rota. Se resuelve con la lista en caché, sin pedir el usuario aparte.

## UI y accesibilidad

- Cada petición tiene estado de carga, error con botón "Reintentar" y estado vacío.
- Búsqueda en cliente, sin distinguir mayúsculas ni tildes; sin debounce (son 10 usuarios).
- Inputs con `<label>` (puede ser `sr-only`). Errores de campo con `aria-invalid` y `aria-describedby`, y al enviar el foco va al primer campo inválido (sin `role="alert"` por campo: se anunciarían todos a la vez). `role="alert"` para errores de carga o de envío; avisos de estado con `aria-live`.
- Formulario: validar al enviar y revalidar al escribir después del primer intento; `trim()`; durante el envío, campos `readOnly` y botones `aria-disabled` (no `disabled`, que pierde el foco); si falla, conservar lo escrito.
- Foco visible (`focus-visible:`), navegable con teclado y responsive desde 375 px.
- Texto gris sobre fondos claros: `text-slate-600` como mínimo para texto pequeño (`slate-500` no llega a 4,5:1 sobre `slate-100` ni sobre la fila seleccionada).
- Si una navegación oculta o desmonta el elemento con foco, el foco va al título de la pantalla nueva (`useRecoverFocusOnNavigation` en `App.tsx`; títulos con `tabIndex={-1}`).
- Cada pantalla pone su título de pestaña con `usePageTitle`.
- `src/a11y.test.tsx` pasa axe en las pantallas principales: una pantalla nueva debería añadirse ahí.
- Textos de la interfaz en español.
- Patrones de clases repetidos se extraen a componentes; `@apply` solo en casos puntuales.

## Tests

- Testear comportamiento, no implementación: `getByRole` / `getByLabelText`, nunca `getByTestId`.
- `userEvent.setup()` en vez de `fireEvent`; `findBy*` para lo asíncrono.
- Red mockeada con MSW, no con mocks de módulos propios. En MSW 3 la opción es `onUnhandledFrame: "error"` (antes `onUnhandledRequest`): una petición sin handler hace fallar el test.
- Montar la app con `renderApp(ruta)` de `src/test/renderApp.tsx`. Para provocar errores, `server.use(...)` en el propio test.
- jsdom no implementa `<dialog>.showModal()`, `scrollTo` ni `scrollIntoView`: están en `src/test/jsdomPolyfills.ts`.
- `QueryClient` nuevo por test con `retry: false`.

## Código

- Prettier: `printWidth` 100, comillas dobles, punto y coma, `endOfLine: "lf"`. `.gitattributes` fuerza LF en el repo (se desarrolla en Windows y la CI corre en Linux).
- Sin `any` ni `as` forzados; tipar las respuestas de la API en `api/types.ts`.
- Componentes pequeños y funciones puras para la lógica testeable (`filterUsers`, `validatePost`).

## Commits

- Commits pequeños y progresivos, uno por paso; cada commit compila y pasa las comprobaciones.
- Conventional Commits: asunto en inglés (`feat(posts): ...`), cuerpo en español explicando el porqué.
- Sin líneas de atribución en los mensajes.
- Push a `origin/main` solo cuando se confirme. El historial publicado no se reescribe; si hay que hacerlo, con acuerdo explícito y `git push --force-with-lease`.
- Para deshacer un cambio temporal (una prueba), se revierte editando el archivo, nunca con `git checkout -- archivo`: restaura la versión del último commit y descarta también lo que no estaba commiteado (por ejemplo, el formato de Prettier).

## Documentación de decisiones

- Cada decisión nueva se explica en la sección "Decisiones" del `README.md` en el mismo commit que la introduce (una o dos líneas, en primera persona, con el porqué).
- Las ideas que se descartan por tiempo van a "Qué haría con más tiempo" en cuanto aparecen.
- Si una decisión cambia una regla de este archivo, se actualiza aquí en el mismo commit.

## Uso de la IA

- La sección "Cómo usé la IA" del `README.md` se va completando sobre la marcha, no al final: cada ejemplo se anota cuando ocurre, con detalle concreto (qué se pidió, con qué resultado), no de forma genérica.
- Solo pedidos concretos del desarrollo y lo que salió de ellos.
- Tres apartados, con ejemplos reales del propio desarrollo, no hipotéticos:
  - **Qué le pedí**: instrucciones y cambios concretos que se le dieron.
  - **Qué acepté**: lo que propuso y se quedó tal cual, sin cambios.
  - **Qué corregí**: lo que se cambió, se rechazó o se le pidió rehacer, con el motivo. Aquí entran también los errores que la IA cometió y que se detectaron al revisar o probar la aplicación.
