Scaffold and implement all layers for a new domain based on a Claude Design handoff bundle.

## Usage

/build-domain <domain-name>

Example: `/build-domain channel`

---

## Step 0 — Read the Handoff Bundle

**Before doing anything else**, ask the user to attach the Claude Design handoff URL now. Do not proceed until the URL is received.

Once the URL is provided: fetch it, read its README.md, and follow its instructions.

Understand everything needed to implement the design — data structures, visual design tokens, library dependencies, and any global project setup required. Apply anything missing from the project before writing domain-specific code.

If anything is ambiguous after reading, ask the user before proceeding.

---

## Phase 1 — Data Layer (run sequentially, each step depends on the previous)

**Library versions**: The design prototype may use older library versions. Always implement against the project's installed version — check `package.json`. Specifically for PrimeVue: use v4 component names and severity values (e.g. `severity="warn"` not `"warning"`, `Select` not `Dropdown`).

### Step 1 — Types (`src/types/<domain>.types.ts`)

Based on the handoff:
- Define `Api<Domain>` as the assumed backend shape (snake_case fields, all nullable fields as `T | null`)
- Define `<Domain>` as the frontend view model (camelCase, display-ready)
- No functions, no logic — pure type declarations only

### Step 2 — Mapper (`src/mappers/<domain>.mapper.ts`)

After Step 1 file exists:
- Implement `mapTo<Domain>(raw: Api<Domain>): <Domain>`
- Implement `mapTo<Domain>List(raw: Api<Domain>[]): <Domain>[]`
- Handle all nullable fields defensively (`?? ''`, `?? 0`, date formatting, etc.)
- Never return `"null"` strings or `Invalid Date`

### Step 3 — Service (`src/services/<domain>.service.ts`)

After Step 2 file exists:
- Import `mainHttp` from `@/services/http`
- Implement CRUD functions as named exports (no class instances)
- Call the corresponding mapper — never return raw `Api*` types
- Assume REST endpoints: `GET /api/<domain>s`, `POST /api/<domain>s`, `PUT /api/<domain>s/:id`, `DELETE /api/<domain>s/:id`
- No mock flags, no environment conditionals

### Step 4 — Store (`src/stores/<domain>.store.ts`)

After Step 3 file exists:
- Pinia options API style (`defineStore('...', { state, getters, actions }`)
- Wrap all async actions with `try/finally` to reset loading flags
- Use `markRaw()` for any non-reactive objects in state

---

## Phase 2 — Mock Data (run in parallel after Phase 1 completes)

### MSW Handler (`src/mocks/handlers/<domain>.handler.ts`)

- Implement handlers for all endpoints defined in the service
- Use `HttpResponse.json(...)` with realistic Korean mock data (names, dates, etc.)
- Export as `<domain>Handlers`
- All handlers active (no comments) — backend doesn't exist yet

### Register handler in `src/mocks/browser.ts`

```ts
import { <domain>Handlers } from './handlers/<domain>.handler';

export const worker = setupWorker(
    ...<domain>Handlers,
    // ...existing handlers
);
```

---

## Phase 2.5 — UI Layer (run in parallel with Phase 2)

### Components (`src/components/<domain>/`)

Implement each visual section from the design as a separate `<script setup lang="ts">` SFC.
- Props come from the parent view (store data passed down), not fetched inside components
- **Layout components** (TopBar, Sidebar, etc.) go in `src/components/layout/`, not the domain folder — update `AppLayout.vue` if the design introduces new layout elements

### View (`src/views/<Domain>View.vue`)

- Fetch all data via the store in `onMounted`
- Compose domain components — keep the view thin
- Add a route in `src/router/index.ts`

### Global setup

Check whether the design requires anything not yet in the project:
- New library (e.g. ApexCharts): register in `src/main.ts`
- Design tokens (CSS vars): add to `src/style.css` — define a `--variable`, never paste raw hex values inline

---

## Phase 3 — Type Check

Run `npm run typecheck` after all files are written. Fix any type errors before finishing.
