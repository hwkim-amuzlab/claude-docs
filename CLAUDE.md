# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Skills & Rules

### 도메인 개발 커맨드

| 파일 | 설명 |
|------|------|
| `.claude/commands/build-domain.md` | `/build-domain <name>` — 디자인 기반으로 도메인 전 레이어 생성 (types→mapper→service→store→MSW mock→뼈대 테스트→타입 명세표). 백엔드 API 없이 선행 개발할 때 사용 |
| `.claude/commands/integrate-domain.md` | `/integrate-domain <name>` — 백엔드 API 완성 후 실제 스펙과 타입 동기화, mock 비활성화 (Swagger URL은 실행 시 대화형으로 입력) |
| `.claude/commands/update-domain.md` | `/update-domain <name>` — 기존 도메인 부분 수정 시 변경 유형 분류 → 영향 레이어만 선택적으로 수정 |

### 레이어 작성 규칙

| 파일 | 설명 |
|------|------|
| `.claude/rules/type-declarations.md` | 타입 선언 규칙 (nullable, 순수 선언) |
| `.claude/rules/mapper-patterns.md` | 매퍼 작성 규칙 (null 방어, 네이밍) |
| `.claude/rules/service-patterns.md` | 서비스 작성 규칙 (mock 분기 금지, envelope 언래핑) |
| `.claude/rules/store-patterns.md` | 스토어 작성 규칙 (markRaw, loading 패턴) |
| `.claude/rules/update-patterns.md` | 부분 수정 시나리오별 레이어 수정 순서 (Case 1~6) |

## 도메인 개발 워크플로우

**백엔드보다 프론트엔드가 먼저 개발된다.** `/build-domain`이 생성한 assumed types는 임시이며, `/integrate-domain` 실행 시 실제 스펙과 대조해 수정한다.

```
1. [사람]  Claude Design으로 디자인 완료
2. [Claude] /build-domain <name>  → 전 레이어 자동 생성 + 타입 명세표 출력
3. [사람]  API 구현 (타입 명세표 기반으로 백엔드와 협의)
4. [Claude] /integrate-domain <name>  → Swagger diff → types/mapper 수정 → MSW 비활성화
5. [사람]  npm run test && npm run test:e2e

이후 부분 수정: /update-domain <name>
```

## Commands

```bash
npm run dev          # Start dev server (Vite)
npm run build        # TypeScript check + Vite build
npm run lint         # ESLint with auto-fix
npm run format       # Prettier format
npm run typecheck    # vue-tsc type check only
npm run test         # Vitest unit tests
npm run test:e2e     # Playwright e2e tests
```

## Architecture

Vue 3 + TypeScript SPA for [프로젝트 설명].

**Stack:** Vue 3 (Composition API), Pinia, Vue Router, PrimeVue 4 (Aura theme), Tailwind CSS v4, Axios, MSW

**Setup files:** `vite.config.ts`, `main.ts`, `eslint.config.js`, `.prettierrc` — `claude-docs/templates/`에서 복사한다.

### Layer structure

```
src/types/      - TypeScript interfaces/types only — no functions, pure declarations
src/mappers/    - Backend shape → frontend view model conversion functions
src/services/   - Axios API calls (named exports, no class instances)
src/stores/     - Pinia stores (options API style) that wrap service calls
src/components/ - Feature components grouped by domain
src/views/      - Page-level components (thin, delegate to stores/components)
src/composables/    - Vue 3 composition hooks
src/utils/          - Pure utility functions
src/constants/      - API message code → Korean text mappings (apiMessage.ts)
src/mocks/          - MSW handlers (handlers/<domain>.ts) + browser/server setup
src/declarations/   - TypeScript ambient declarations — window.__APP_CONFIG__는 optional + Readonly로 선언
src/config.ts       - Runtime config: reads from Vite env vars or window.__APP_CONFIG__
```

### Naming conventions

- Types: `src/types/<domain>.types.ts`
- Mappers: `src/mappers/<domain>.mapper.ts`
- Services: `src/services/<domain>.service.ts`
- Stores: `src/stores/<domain>.store.ts`
- Backend shapes (`Api<Domain>`, snake_case) / frontend view models (`<Domain>`, camelCase)

### HTTP clients

Axios instances are exported from `src/services/http/index.ts`:
- `mainHttp` — main backend (`VITE_API_BASE_URL`)
- _(추가 인스턴스는 프로젝트에 따라 작성)_

```
src/services/http/
├── index.ts        - Axios instance creation and export
├── interceptors.ts - Request/response interceptor attachment
└── errorHandler.ts - Error classification (ApiError, ServerError, NetworkError)
```

인터셉터 동작: Bearer 토큰 주입 → `ApiResponse<T>` 언래핑 → `ERROR_*` 거부 / `WARNING_*` 경고 토스트 → 401 시 `/login` 리다이렉트 → `X-New-Token` silent refresh. `config.silentSuccess` / `config.silentError`로 토스트 억제 가능.

`ApiResponse<T> = { code: string; data: T; message: string; timestamp: string }`. 성공은 `code === 'OK'`.

### Mock API pattern (MSW)

mock 제어는 MSW handler 등록 여부로만 한다. `onUnhandledRequest: 'bypass'`로 handler가 없는 요청은 실제 서버로 자동 통과한다.

```
src/mocks/
├── browser.ts              - setupWorker (dev)
├── server.ts               - setupServer (tests)
└── handlers/<domain>.handler.ts
```

백엔드 완성된 엔드포인트는 handler를 주석 처리하면 자동으로 실제 API로 전환된다. `main.ts`의 bootstrap 패턴(`worker.start()` → `app.mount()`)은 `claude-docs/templates/main.ts` 참고.

### Routing & auth

- Routes wrapped in `AppLayout` except `/login`, `/access-denied`, `/404`
- User roles: _(프로젝트에 따라 작성)_
- `meta.roles` array on routes restricts access by role
- Route guard in `src/router/index.ts` checks token + role, redirects accordingly

### Testing

| Layer | Tool | Target |
|-------|------|--------|
| utils / pure functions | Vitest | mapper functions, date, validation |
| Services | Vitest + MSW server | API call / response mapping |
| Stores | Vitest + `@pinia/testing` | Actions, state transitions |
| E2E | Playwright | Key user flows |

```
tests/
├── unit/ (mappers/, services/, stores/)
└── e2e/
```

### Environment variables

- `VITE_API_BASE_URL` — main API base URL
- _(추가 변수는 프로젝트에 따라 작성)_
