# Architecture Overview

Vue 3 + TypeScript SPA.

**Stack:** Vue 3 (Composition API), Pinia, Vue Router, PrimeVue 4 (Aura theme), Tailwind CSS v4, Axios, MSW

**Setup files:** `vite.config.ts`, `main.ts`, `eslint.config.js`, `.prettierrc` — `.claude/templates/`에서 복사한다.

---

## Layer Structure

```
src/types/          - TypeScript interfaces/types only — no functions, pure declarations
src/mappers/        - Backend shape → frontend view model conversion functions
src/services/       - Axios API calls (named exports, no class instances)
src/stores/         - Pinia stores (options API style) that wrap service calls
src/layouts/        - AppLayout.vue and other layout wrappers (route-level shell components)
src/components/     - Feature components grouped by domain
src/views/          - Page-level components (thin, delegate to stores/components)
src/composables/    - Vue 3 composition hooks
src/utils/          - Pure utility functions
src/constants/      - API message code → Korean text mappings (apiMessage.ts)
src/mocks/          - MSW handlers (handlers/<domain>.handler.ts) + browser/server setup
src/declarations/   - TypeScript ambient declarations — window.__APP_CONFIG__는 optional + Readonly로 선언
src/config.ts       - Runtime config: reads from Vite env vars or window.__APP_CONFIG__
```

---

## Naming Conventions

- Types: `src/types/<domain>.types.ts`
- Mappers: `src/mappers/<domain>.mapper.ts`
- Services: `src/services/<domain>.service.ts`
- Stores: `src/stores/<domain>.store.ts`
- Backend shapes: `Api<Domain>` (snake_case fields)
- Frontend view models: `<Domain>` (camelCase fields)

---

## Routing & Auth

- Routes wrapped in `AppLayout` except `/login`, `/access-denied`, `/404`
- User roles: _(프로젝트에 따라 작성)_
- `meta.roles` array on routes restricts access by role
- Route guard in `src/router/index.ts` checks token + role, redirects accordingly

---

## Environment Variables

- `VITE_API_BASE_URL` — main API base URL
- _(추가 변수는 프로젝트에 따라 작성)_

---

## Recommended Dependencies

`package.json` 초기 세팅 시 기준 버전 목록. 실제 프로젝트에서는 최신 버전을 확인하고 조정한다.

```json
{
  "dependencies": {
    "axios": "^1.x",
    "pinia": "^2.x",
    "primevue": "^4.x",
    "primeicons": "^7.x",
    "@primeuix/themes": "^1.x",
    "vue": "^3.5",
    "vue-router": "^4.x"
  },
  "devDependencies": {
    "@csstools/postcss-color-function": "^4.x",
    "@csstools/postcss-oklab-function": "^4.x",
    "@primevue/auto-import-resolver": "^4.x",
    "@tailwindcss/vite": "^4.x",
    "@vitejs/plugin-vue": "^5.x",
    "@vitest/coverage-v8": "^3.x",
    "@vue/test-utils": "^2.x",
    "msw": "^2.x",
    "playwright": "^1.x",
    "tailwindcss": "^4.x",
    "typescript": "^5.x",
    "unplugin-vue-components": "^28.x",
    "vite": "^6.x",
    "vitest": "^3.x",
    "vue-tsc": "^2.x"
  }
}
```

> **참고:** `@primeuix/themes`는 PrimeVue 4의 Aura 테마 패키지명이다 (`@primevue/themes`가 아님).
