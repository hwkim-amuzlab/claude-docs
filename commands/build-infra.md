공통 인프라를 구현한다. `/setup-project` 완료 후, 첫 도메인 개발 전에 1회 실행한다.

## Usage

```
/build-infra
```

---

## Step 0 — 사전 확인

1. `package.json`에서 axios, primevue, vue-router, pinia 버전 확인
2. `src/services/http/`가 이미 존재하면 사용자에게 알리고 진행 여부를 확인한다

---

## Phase 1 — 공통 타입·설정

| 파일 | 내용 |
|------|------|
| `src/declarations/app.d.ts` | `Window.__APP_CONFIG__?: { VITE_API_BASE_URL?: string }` ambient type |
| `src/config.ts` | `window.__APP_CONFIG__?.VITE_API_BASE_URL ?? import.meta.env.VITE_API_BASE_URL ?? ''` |
| `src/types/http.types.ts` | `ApiResponse<T>`, `AxiosRequestConfigExtended` — `architecture/http-client.md` 참고 |
| `src/constants/apiMessage.ts` | `Record<string, string>` 빈 객체. 실제 API code 확인 후 추가 |
| `public/config.js` | `window.__APP_CONFIG__ = {}` |

---

## Phase 2 — HTTP 클라이언트

`architecture/http-client.md`를 읽고 구현한다.

| 파일 | 내용 |
|------|------|
| `src/services/http/errorHandler.ts` | Axios 에러 → `ApiError` / `ServerError` / `NetworkError` 분류 |
| `src/stores/httpNotice.store.ts` | Notice 큐 스토어 (Pinia options API) |
| `src/services/http/interceptors.ts` | `attachInterceptors(instance)` export |
| `src/services/http/index.ts` | `mainHttp` 인스턴스 생성 + `attachInterceptors` 호출 |

---

## Phase 3 — 레이아웃·라우터

| 파일 | 내용 |
|------|------|
| `src/layouts/AppLayout.vue` | `httpNotice.store` watch → PrimeVue Toast. `architecture/http-client.md` 참고 |
| `src/router/index.ts` | 토큰 유무 기반 `beforeEach` 가드 추가. `meta.roles` 체크는 TODO |
| `src/App.vue` | `<RouterView />`만 렌더링하도록 교체 |

---

## Phase 4 — 정리 및 타입 체크

- `src/stores/counter.ts` 삭제
- `src/__tests__/App.spec.ts` 삭제 또는 비우기
- `npm run typecheck` — 오류 있으면 수정 후 완료

---

> **다음 단계:** `/build-domain <name>`
