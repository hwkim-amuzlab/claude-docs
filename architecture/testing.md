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
├── unit/
│   ├── mappers/
│   ├── services/
│   └── stores/
└── e2e/
```

---

## 스켈레톤 테스트 기준

`/build-domain`이 생성하는 스켈레톤 테스트는 컴파일·실행은 되지만 assertion은 stub 상태다.  
실제 구현 완료 후 채운다.

- `mappers/<domain>.mapper.test.ts` — 정상 매핑 + nullable 필드 fallback
- `services/<domain>.service.test.ts` — 성공 응답 + 에러 응답 (MSW server)
- `stores/<domain>.store.test.ts` — 초기 상태 + action 성공 + `isLoading` 에러 시 reset
