# Testing Strategy

## 레이어별 테스트

| Layer | Tool | Target |
|-------|------|--------|
| utils / pure functions | Vitest | mapper functions, date, validation |
| Services | Vitest + MSW server | API call / response mapping |
| Stores | Vitest + `@pinia/testing` | Actions, state transitions |
| E2E | Playwright | Key user flows |

---

## 디렉토리 구조

```
tests/
├── setup.ts
├── utils/
│   └── msw.ts
├── unit/
│   ├── mappers/
│   ├── services/
│   └── stores/
└── e2e/
    └── <domain>/
        └── <domain>.spec.ts
playwright.config.ts
```

---

## Test Setup

- Unit test는 실제 네트워크에 의존하지 않는다.
- `tests/setup.ts`: `server.listen({ onUnhandledRequest: 'error' })`, `server.resetHandlers()`, `server.close()` 설정
- `tests/utils/msw.ts`: `apiSuccess(data)`, `apiError(code, message, status)` helper 제공
- `vite.config.ts`: `test.setupFiles = ['tests/setup.ts']`

---

## 레이어별 책임

- Mapper test: 순수 함수 테스트. 네트워크, Vue, Pinia, MSW를 사용하지 않는다.
- Service test: Axios 호출, interceptor 처리, mapper 연결을 검증한다. handler는 테스트 내부에서 `server.use(...)`로 등록한다.
- Store test: Pinia action의 state/loading/error 전이를 검증한다. service는 mock 처리한다.
- E2E test: 주요 사용자 흐름을 Playwright로 검증한다.

---

## 스켈레톤 테스트 기준

`/build-tests`가 타입 확정 이후 생성하는 스켈레톤 테스트는 컴파일·실행은 되지만 assertion은 stub 상태다.  
실제 구현 완료 후 채운다.

- `mappers/<domain>.mapper.test.ts` — 정상 매핑 + nullable 필드 fallback
- `services/<domain>.service.test.ts` — `server.use(...)`로 성공 응답 + 에러 응답 등록
- `stores/<domain>.store.test.ts` — service mock 기반 초기 상태 + action 성공 + `isLoading` 에러 시 reset

Service unit test는 개발용 `src/mocks/handlers/<domain>.handler.ts`에 의존하지 않는다.

---

## E2E 전략

### 환경 모드

E2E는 두 가지 모드로 실행한다. `playwright.config.ts` 템플릿은 `templates/playwright.config.ts` 참고.

| 모드 | 실행 방법 | MSW | 용도 |
|------|-----------|-----|------|
| **mock** (기본) | `npm run dev` | 활성 | CI, 개발 중 빠른 검증 |
| **real** | `npm run build && npm run preview` | 비활성 | 백엔드 연동 후 통합 검증 |

```bash
# mock 모드 (기본)
npx playwright test

# real API 모드
PLAYWRIGHT_API=real npx playwright test
```

mock 모드는 `main.ts`의 `import.meta.env.DEV` 조건에 의해 MSW browser worker가 자동으로 활성화된다.  
real 모드는 production 빌드이므로 MSW가 로드되지 않고 실제 API 서버에 요청한다.

---

### 에러 케이스 테스트

mock 모드에서 특정 API를 실패시킬 때는 `page.route()`로 해당 요청을 가로챈다.  
MSW handler보다 `page.route()`가 우선 적용된다.

```typescript
test('API 오류 시 에러 메시지 표시', async ({ page }) => {
  await page.route('**/api/<domain>**', (route) =>
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ code: 'SERVER_ERROR', data: null, message: '서버 오류' }),
    }),
  )
  await page.goto('/<domain>')
  await expect(page.getByText('서버 오류')).toBeVisible()
})
```

---

### E2E 스켈레톤 패턴

```typescript
// tests/e2e/<domain>/<domain>.spec.ts
import { test, expect } from '@playwright/test'

test.describe('<Domain>', () => {
  test('목록 정상 렌더링', async ({ page }) => {
    await page.goto('/<route>')
    // TODO: 핵심 UI 요소 노출 확인
  })

  test('API 오류 시 에러 상태 표시', async ({ page }) => {
    await page.route('**/api/<endpoint>**', (route) =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ code: 'SERVER_ERROR', data: null, message: '서버 오류' }),
      }),
    )
    await page.goto('/<route>')
    // TODO: 에러 메시지 또는 에러 UI 확인
  })
})
```
