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
- E2E test: 주요 사용자 흐름을 Playwright로 검증한다. 환경별로 mock 또는 실제 API 사용 여부를 명시한다.

---

## 스켈레톤 테스트 기준

`/apply-design`이 타입 확정 이후 생성하는 스켈레톤 테스트는 컴파일·실행은 되지만 assertion은 stub 상태다.  
실제 구현 완료 후 채운다.

- `mappers/<domain>.mapper.test.ts` — 정상 매핑 + nullable 필드 fallback
- `services/<domain>.service.test.ts` — `server.use(...)`로 성공 응답 + 에러 응답 등록
- `stores/<domain>.store.test.ts` — service mock 기반 초기 상태 + action 성공 + `isLoading` 에러 시 reset

Service unit test는 개발용 `src/mocks/handlers/<domain>.handler.ts`에 의존하지 않는다.
