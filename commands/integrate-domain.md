Reconcile an existing domain's assumed types with the real backend API spec, then switch from mock to live API.

## Usage

/integrate-domain <domain-name>

---

## Step 0 — Request the Swagger URL

Ask the user for the backend API spec URL before doing anything else. The spec URL is typically the Swagger UI address with `/swagger-ui/index.html` replaced by `/v3/api-docs`.

---

## Phase 1 — Diff Report

Fetch the OpenAPI spec and compare it against `src/types/<domain>.types.ts`.

For each field in `Api<Domain>`, classify it as one of:
- `✅` — matches spec exactly
- `⚠️` — type or nullability differs
- `❌` — exists in assumed types but not in spec
- `🆕` — new field in spec not yet in types

Print the full diff report and stop. Ask the user to confirm changes and how to handle any `❌` fields before proceeding.

---

## Phase 2 — Apply Updates (after user confirms)

Read `.claude/rules/type-declarations.md`, `.claude/rules/mapper-patterns.md`, and `.claude/rules/store-patterns.md` before editing.

Update the following in order:
1. `src/types/<domain>.types.ts` — apply all `⚠️` corrections, add `🆕` fields, remove confirmed `❌` fields, update the view model if needed
2. `src/mappers/<domain>.mapper.ts` — reflect type changes, add/remove field mappings accordingly
3. `src/services/<domain>.service.ts` — correct endpoint paths or request/response shapes if they differ from the spec
4. `src/stores/<domain>.store.ts` — if state shape or action signatures are affected by type changes, update accordingly; otherwise skip

---

## Phase 3 — Disable Mock Handlers

Comment out all handlers in `src/mocks/handlers/<domain>.handler.ts`. Unhandled requests pass through to the real server automatically via `onUnhandledRequest: 'bypass'`.

---

## Phase 4 — Type Check and Test

Run `npm run typecheck` then `npm run test`. Fix all errors before finishing.
