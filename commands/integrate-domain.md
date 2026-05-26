Reconcile an existing domain's assumed types with the real backend API spec, then switch from mock to live API.

## Usage

/integrate-domain <domain-name>

Example: `/integrate-domain channel`

---

## Step 0 — Request the Swagger URL

Before doing anything else, ask the user:

> "백엔드 API 스펙 URL을 알려주세요. (예: https://api.example.com/v3/api-docs)"

Wait for the user's response, then proceed.

---

## Phase 1 — Diff Report

Fetch the OpenAPI spec from the URL provided by the user and compare it against the existing `src/types/<domain>.types.ts`.

For each field in `Api<Domain>`, report one of:
- `✅ <field>` — matches spec exactly
- `⚠️  <field>: <assumed-type> → <actual-type>` — type or nullability differs, mapper update needed
- `❌ <field>` — field exists in assumed types but not in spec (confirm with user before removing)
- `🆕 <field>: <actual-type>` — new field in spec not yet in types

Print the full diff report and **stop here**. Ask the user: "위 변경사항을 적용할까요? 제거할 필드(❌)가 있다면 처리 방법을 알려주세요."

---

## Phase 2 — Apply Updates (after user confirms)

Read `.claude/rules/type-declarations.md` and `.claude/rules/mapper-patterns.md` before editing.

### Update Types (`src/types/<domain>.types.ts`)

- Apply all `⚠️` type corrections to `Api<Domain>` fields
- Add all `🆕` fields to `Api<Domain>`
- Remove `❌` fields only if user confirmed removal
- Update view model (`<Domain>`) fields to match if needed

### Update Mapper (`src/mappers/<domain>.mapper.ts`)

- Update field mappings that correspond to `⚠️` changes (e.g., date string parsing, type coercion)
- Add mappings for `🆕` fields
- Remove mappings for confirmed `❌` fields
- Ensure no `"null"` strings or `Invalid Date` values

### Update Service (`src/services/<domain>.service.ts`)

- Correct endpoint paths if the actual spec differs from assumed REST paths
- Adjust request/response shapes if needed

---

## Phase 3 — Disable Mock Handlers

In `src/mocks/handlers/<domain>.handler.ts`, comment out all handlers:

```ts
export const <domain>Handlers = [
    // http.get('/api/<domain>s', ...) — backend ready, bypassing to real API
    // http.post('/api/<domain>s', ...)
    // ...
];
```

The `onUnhandledRequest: 'bypass'` setting in `browser.ts` ensures requests pass through to the real server automatically.

---

## Phase 4 — Type Check

Run `npm run typecheck` after all edits. Fix any errors before finishing.

