# TIDO — Agent guidance

## Project

TextAPI viewer (React 19, TypeScript, Vite 5, TailwindCSS 4, Zustand, Radix UI, OpenSeadragon 5, Cypress).

Two build outputs from one source tree:
- **React library** (`src/index.ts`) → `dist/index.es.js` + `dist/index.cjs.js` + `dist/types.d.ts`
- **Embedded bundle** (`src/index.embed.tsx`) → `dist/tido.min.js` + `dist/tido.min.css`

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server on `localhost:5173`. Supports `npm run dev [project-name]` to load a config from `examples/config/`. Uses custom `vite-start.js` wrapper. |
| `npm run build` | Runs `build:lib` then `build:embed`. |
| `npm run lint` | ESLint flat config (`eslint.config.js`), src only. |
| `npm run typecheck` | `tsc --noEmit` (separate from lint). |
| `npm run test` | Full E2E suite: builds lib & embed, starts examples server on `:2222`, runs Cypress headless. |
| `npm run api` | Mock API on `:8181` from `tests/mocks/`. Required for tests. |
| `npm run preview:examples` | Build + copy to `examples/dist/` + serve examples on `:2222`. |

## Testing (Cypress E2E only)

No unit tests. All tests run against production builds only.

- Specs at `tests/cypress/e2e/`
- Helpers in `tests/cypress/support/` (globals.js, tree-helpers.js, panel-helpers.js)
- `data-cy` attributes used for selectors — stripped from production builds by a custom Vite plugin
- Mock API needed: start `npm run api` (port 8181) before tests
- Default command timeout: 4000ms

**Quick run**: `npm run api & npm run test`  
**Interactive**: `npm run api && npm run preview:examples`, then `npm run cypress`

## Architecture

- Zustand stores in `src/store/`: UIStore, PanelStore, ConfigStore, DataStore
- Config via: constructor arg, `<script id="tido-config">`, or URL params (e2e.html)
- Tailwind scoped under `.tido` (`important: '.tido'` in tailwind.config.js)
- i18n via react-i18next with translations in `public/translations/`
- Custom Vite build plugins: `inject-config`, `remove-attrs` (strips `data-cy` in production), `fix-tailwind-scoping`, `postcss-remove-layer`

## Conventions

- Single quotes, no semis, 2-space indent (enforced by ESLint)
- React components: arrow functions (`react/function-component-definition`)
- Path aliases: `@/` → `src/`
- Paths in `tsconfig.json`: `@/*` → `src/*`

## Known quirks

- `.nvmrc` says v18, CI runs v20 + v22
- `npm run lint` currently produces ~84 lines of warnings (mostly `exhaustive-deps`) — not blocking
- `typecheck` passed cleanly
- Branching: git flow, feature branches off `develop`, PRs to `develop`/`main`/`next`
