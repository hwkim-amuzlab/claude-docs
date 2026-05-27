Scaffold and implement all layers for a new domain based on a Claude Design handoff bundle.

## Usage

/build-domain <domain-name>

---

## Step 0 — Read the Handoff Bundle

Ask the user to attach the Claude Design handoff URL. Do not proceed until the URL is received.

Fetch the URL, read its README.md, and follow its instructions. Understand the data structures, design tokens, library dependencies, and any global setup required. Apply anything missing from the project before writing domain-specific code.

Ask the user if anything is ambiguous before proceeding.

---

## Phase 1 — Data Layer (sequential)

Always check `package.json` for installed library versions — implement against the project's actual version, not what the design prototype uses.

1. **Types** (`src/types/<domain>.types.ts`) — assumed backend shape (`Api<Domain>`) + frontend view model (`<Domain>`). Pure declarations only; follow `.claude/rules/type-declarations.md`.
2. **Mapper** (`src/mappers/<domain>.mapper.ts`) — converts `Api<Domain>` to `<Domain>`. Follow `.claude/rules/mapper-patterns.md`.
3. **Service** (`src/services/<domain>.service.ts`) — Axios calls, mapper delegation. Follow `.claude/rules/service-patterns.md`.
4. **Store** (`src/stores/<domain>.store.ts`) — Pinia state + actions wrapping the service. Follow `.claude/rules/store-patterns.md`.

---

## Phase 2 — Mock & UI (parallel after Phase 1)

- **MSW handler** (`src/mocks/handlers/<domain>.handler.ts`) — handlers for all service endpoints with realistic Korean mock data. Register in both `src/mocks/browser.ts` (dev) and `src/mocks/server.ts` (tests).
- **Components** (`src/components/<domain>/`) — one SFC per visual section. Props passed from parent view. Layout components go in `src/components/layout/`.
- **View** (`src/views/<Domain>View.vue`) — fetches via store in `onMounted`, composes components, thin. Add a route in `src/router/index.ts`.
- **Global setup** — register new libraries in `src/main.ts`, design tokens as CSS vars in `src/assets/tailwind.css`.

---

## Phase 3 — Skeleton Tests

Generate skeleton test files that compile and run, with assertions left as stubs. Use existing test files in the project as reference.

- `tests/unit/mappers/<domain>.mapper.test.ts` — normal mapping + nullable field fallback
- `tests/unit/services/<domain>.service.test.ts` — success response + error response via MSW server
- `tests/unit/stores/<domain>.store.test.ts` — initial state + action success + `isLoading` reset on error

---

## Phase 4 — Type Spec Table

Print a table of `Api<Domain>` fields (snake_case name, type, nullable, description) and the assumed endpoints so the backend team can review and agree before implementing the API.

Note that this is an assumed spec — actual sync happens via `/integrate-domain` once the backend is ready.

---

## Phase 5 — Type Check

Run `npm run typecheck`. Fix all errors before finishing.
