# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Skills & Rules

### 도메인 개발 커맨드

| 파일 | 설명 |
|------|------|
| `.claude/commands/build-domain.md` | `/build-domain <name>` — 디자인 기반으로 도메인 전 레이어 생성 (types→mapper→service→store→MSW mock→뼈대 테스트→타입 명세표). 백엔드 API 없이 선행 개발할 때 사용 |
| `.claude/commands/integrate-domain.md` | `/integrate-domain <name>` — 백엔드 API 완성 후 실제 스펙과 타입 동기화, mock 비활성화 (Swagger URL은 실행 시 대화형으로 입력) |
| `.claude/commands/update-domain.md` | `/update-domain <name>` — 기존 도메인 부분 수정 시 변경 유형 분류 → 영향 레이어만 선택적으로 수정 |
| `.claude/commands/add-domain.md` | `/add-domain <name>` — 빈 파일 스캐폴딩만 필요할 때 단독 사용 (통상 build-domain이 대체) |
| `.claude/commands/generate-types.md` | `/generate-types` — OpenAPI 스펙에서 타입 생성 후 도메인별 분리 |

### 레이어 작성 규칙

| 파일 | 설명 |
|------|------|
| `.claude/rules/type-declarations.md` | 타입 선언 규칙 (nullable, 순수 선언) |
| `.claude/rules/mapper-patterns.md` | 매퍼 작성 규칙 (null 방어, 네이밍) |
| `.claude/rules/service-patterns.md` | 서비스 작성 규칙 (mock 분기 금지, envelope 언래핑) |
| `.claude/rules/store-patterns.md` | 스토어 작성 규칙 (markRaw, loading 패턴) |
| `.claude/rules/update-patterns.md` | 부분 수정 시나리오별 레이어 수정 순서 (Case 1~6) |

## 도메인 개발 워크플로우

새 도메인을 추가할 때는 아래 순서를 따른다.

```
1. [사람] Claude Design으로 디자인 완료

2. [Claude] /build-domain <name>  (Claude Design handoff 번들 첨부)
            → types / mapper / service / store / MSW 핸들러 자동 생성
            → 현실적인 한국어 목 데이터 포함

3. [사람] API 구현

4. [Claude] /integrate-domain <name>  (Swagger URL은 실행 시 대화형으로 입력)
            → assumed types vs 실제 스펙 diff 리포트 출력
            → 사람 확인 후 types / mapper 수정
            → MSW 핸들러 주석 처리 (bypass로 실제 API 통과)

5. [사람] 테스트 확인 (npm run test, npm run test:e2e)

**이후 부분 수정이 필요한 경우:** `/update-domain <name>` 실행
            → 변경 유형 분류 (필드 추가 / 새 엔드포인트 / UI 수정 등)
            → 영향 레이어만 선택적으로 수정 (.claude/rules/update-patterns.md 기준)
```

**백엔드보다 프론트엔드가 먼저 개발된다.** `/build-domain`이 생성한 assumed types는 임시이며, `/integrate-domain` 실행 시 실제 스펙과 대조해 수정한다.

## Commands

```bash
npm run dev          # Start dev server (Vite)
npm run build        # TypeScript check + Vite build
npm run lint         # ESLint with auto-fix
npm run typecheck    # vue-tsc type check only
npm run test         # Vitest unit tests
npm run test:e2e     # Playwright e2e tests
```

## Architecture

Vue 3 + TypeScript SPA for [프로젝트 설명].

**Stack:** Vue 3 (Composition API), Pinia, Vue Router, PrimeVue 4 (Aura theme), Tailwind CSS v4, Axios, MSW

### Layer structure

Each domain follows a consistent layered pattern:

```
src/types/      - TypeScript interfaces/types only — no functions, pure declarations
src/mappers/    - Backend shape → frontend view model conversion functions
src/services/   - Axios API calls (named exports, no class instances)
src/stores/     - Pinia stores (options API style) that wrap service calls
src/components/ - Feature components grouped by domain
src/views/      - Page-level components (thin, delegate to stores/components)
```

Additional:
```
src/composables/    - Vue 3 composition hooks
src/utils/          - Pure utility functions
src/constants/      - API message code → Korean text mappings (apiMessage.ts)
src/mocks/          - MSW handlers (handlers/<domain>.ts) + browser/server setup
src/declarations/   - TypeScript ambient declarations (axios.d.ts, app-config.d.ts) — window.__APP_CONFIG__는 optional + Readonly로 선언
src/config.ts       - Runtime config: reads from Vite env vars or window.__APP_CONFIG__
```

### Naming conventions

- Types: `src/types/<domain>.types.ts`
- Mappers: `src/mappers/<domain>.mapper.ts`
- Services: `src/services/<domain>.service.ts`
- Stores: `src/stores/<domain>.store.ts`
- Backend shapes and frontend view models은 구분 가능한 네이밍을 사용한다 — prefix/suffix 컨벤션은 프로젝트 시작 시 결정

### HTTP clients

Axios instances are exported from `src/services/http/index.ts`:
- `mainHttp` — main backend (`VITE_API_BASE_URL`)
- _(추가 인스턴스는 프로젝트에 따라 작성)_

HTTP module structure:
```
src/services/http/
├── index.ts          - Axios instance creation and export
├── interceptors.ts   - Request/response interceptor attachment
└── errorHandler.ts   - Error classification logic (ApiError, ServerError, NetworkError)
```

All instances share the same interceptor logic that:
1. Adds Bearer token from `userStore.userInfo.token` or localStorage
2. Parses `ApiResponse<T>` envelope (`{ code, data, message, timestamp }`)
3. Rejects on `ERROR_*` codes, shows warning toast on `WARNING_*` codes
4. Always shows a success toast on `OK` — suppress with `config.silentSuccess = true`
5. Handles `X-New-Token` header for silent token refresh
6. Handles 401 by redirecting to `/login`
7. Supports `config.silentError = true` to suppress error notifications
8. Reports all errors to `httpNotice.store.ts` (global toast notification)

API responses use a standard envelope: `ApiResponse<T> = { code: string; data: T; message: string; timestamp: string }`. Success is `code === 'OK'`.

Error types defined in `errorHandler.ts`:
- `ApiError` — server returned `ERROR_*` code
- `ServerError` — HTTP 5xx
- `NetworkError` — no response / timeout

Use `instanceof` in catch blocks to branch by error type.

### Type and mapper pattern

**백엔드 선행 개발 시 (통상 흐름):** `/build-domain` 실행 시 Claude가 디자인 정보를 바탕으로 `Api*` 타입을 추측해 생성한다. 이 타입은 임시(assumed)이며, 백엔드 API 완성 후 `/integrate-domain`으로 실제 스펙과 동기화한다.

**백엔드 완성 후 타입 동기화:** `/integrate-domain <name>` 실행 시 Swagger URL을 대화형으로 입력받아 OpenAPI 스펙을 직접 fetch한다. assumed types와 실제 스펙을 필드 단위로 diff한 리포트를 출력하고, 사람이 확인한 뒤 types / mapper를 수정한다. 백엔드 Swagger UI 주소(`/swagger-ui/index.html`)에서 경로를 `/v3/api-docs`로 바꾼 URL이 스펙 주소다.

스펙 변경 시 `/integrate-domain`을 재실행해 동기화한다.

각 레이어의 역할:
- `src/types/<domain>.types.ts` — 순수 타입 선언만 (`Api*` + 뷰모델). `/build-domain` 시점에는 assumed, `/integrate-domain` 후 실제 스펙 반영
- `src/mappers/<domain>.mapper.ts` — `Api*` → 뷰모델 변환 함수
- `src/services/<domain>.service.ts` — Axios 호출 후 mapper 위임

### Mock API pattern (MSW)

mock 제어는 MSW handler 등록 여부로만 한다. `onUnhandledRequest: 'bypass'`로 handler가 없는 요청은 실제 서버로 자동 통과한다.

```
src/mocks/
├── browser.ts              - setupWorker (dev)
├── server.ts               - setupServer (tests)
└── handlers/
    ├── user.handler.ts
    └── <domain>.handler.ts
```

**`src/main.ts`** — `worker.start()`가 완료된 이후에 `app.mount()`를 호출해야 한다. 순서가 바뀌면 첫 API 요청이 mock을 건너뛴다:
```ts
async function bootstrap() {
    if (import.meta.env.DEV) {
        const { worker } = await import('./mocks/browser');
        await worker.start({ onUnhandledRequest: 'bypass' });  // 반드시 먼저
    }
    app.mount('#app');  // worker 준비 완료 후 마운트
}
bootstrap();
```

**`src/mocks/browser.ts`** — 등록된 handler만 mock, 나머지는 실제 서버로 bypass:
```ts
import { setupWorker } from 'msw/browser';
import { userHandlers } from './handlers/user.handler';
// import { channelHandlers } from './handlers/channel.handler'; // 백엔드 완성 시 제거

export const worker = setupWorker(
    ...userHandlers,
    // ...channelHandlers,
);
```

**`src/mocks/handlers/<domain>.handler.ts`** — 백엔드 완성된 엔드포인트는 주석 처리:
```ts
export const userHandlers = [
    // http.get('/api/users', () => { ... }),   // 완성 → 주석 처리 → 실제로 bypass
    http.post('/api/users', () => { ... }),      // 미완성 → mock 유지
    http.put('/api/users/:id', () => { ... }),   // 미완성 → mock 유지
];
```

**`tests/setup.ts`** — 테스트는 MSW server를 직접 사용:
```ts
import { server } from '@/mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

특정 테스트에서 에러 응답 시뮬레이션:
```ts
server.use(
    http.get('/api/users', () =>
        HttpResponse.json({ code: 'ERROR_UNAUTHORIZED', data: null }, { status: 403 })
    )
);
// afterEach의 resetHandlers()로 자동 복구
```

### Routing & auth

- Routes wrapped in `AppLayout` except `/login`, `/access-denied`, `/404`
- User roles: _(프로젝트에 따라 작성)_
- `meta.roles` array on routes restricts access by role
- Route guard in `src/router/index.ts` checks token + role, redirects accordingly

### State management pattern

Stores (Pinia, options API style). 세부 규칙은 `.claude/rules/store-patterns.md` 참조.

### Testing

| Layer | Tool | Target |
|-------|------|--------|
| utils / pure functions | Vitest | `date.ts`, `validation.ts`, mapper functions |
| Services | Vitest + MSW server | API call / response mapping |
| Stores | Vitest + `@pinia/testing` | Actions, state transitions |
| E2E | Playwright | Key user flows |

Test files:
```
tests/
├── unit/
│   ├── utils/
│   ├── mappers/
│   └── stores/
└── e2e/
```

### Path alias

`@` maps to `src/` (configured in `vite.config.ts` and `tsconfig.json`).

### PrimeVue auto-import

PrimeVue components are auto-imported via `unplugin-vue-components` with `PrimeVueResolver`. No explicit imports needed for PrimeVue components in templates.

### Environment variables

- `VITE_API_BASE_URL` — main API base URL
- _(추가 변수는 프로젝트에 따라 작성)_

