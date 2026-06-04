# Testing Strategy

## 레이어별 테스트

| Layer | Tool | Target |
|-------|------|--------|
| utils / pure functions | Vitest | mapper functions, date, validation |
| Services | Vitest + MSW server | API call / response mapping |
| Stores | Vitest + `@pinia/testing` | Actions, state transitions |

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

---

## Unit Test 생성 기준

`/build-tests`는 `/integrate-domain` 이후 실행한다. 실제 백엔드 스펙 기준으로 확정된 구현을 읽고, 의미 있는 assertion을 포함한 unit test를 생성한다.

- `mappers/<domain>.mapper.test.ts` — 실제 `Api*` 타입 기준 정상 매핑 + nullable 필드 fallback
- `services/<domain>.service.test.ts` — `server.use(...)`로 실제 `Api*` shape mock 등록, 성공/에러 응답 검증
- `stores/<domain>.store.test.ts` — service `vi.mock()` 기반 초기 state + action 성공/실패 state 전이 검증

Service unit test는 개발용 `src/mocks/handlers/<domain>.handler.ts`에 의존하지 않는다.  
테스트 파일이 이미 존재하면 덮어쓰지 않고 누락된 케이스만 추가한다.
