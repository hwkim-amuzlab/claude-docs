Build unit test setup and domain skeleton tests.
Run `/apply-design` first — this command requires finalized types, mapper, service, store, and mock data.

## Usage

```
/build-tests <domain-name>
```

---

## Step 0 — 사전 확인

다음 파일이 존재하는지 확인한다. 없으면 먼저 `/apply-design <domain-name>`을 실행하도록 안내한다.

- `src/types/<domain>.types.ts`
- `src/mappers/<domain>.mapper.ts`
- `src/services/<domain>.service.ts`
- `src/stores/<domain>.store.ts`
- `src/mocks/handlers/<domain>.handler.ts`

---

## Phase 1 — Test Setup

없으면 `.claude/templates/`에서 복사한다.

- `src/mocks/server.ts`
- `tests/setup.ts`
- `tests/utils/msw.ts`

---

## Phase 2 — Skeleton Tests

기존 테스트 파일을 참고하여 컴파일·실행은 되지만 assertion은 stub 상태인 테스트를 생성한다.

- `tests/unit/mappers/<domain>.mapper.test.ts` — 정상 매핑 + nullable 필드 fallback
- `tests/unit/services/<domain>.service.test.ts` — `server.use(...)`로 성공 응답 + 에러 응답 등록
- `tests/unit/stores/<domain>.store.test.ts` — service mock 기반 초기 상태 + action 성공 + `isLoading` 에러 시 reset

Service test는 `tests/utils/msw.ts` helper를 사용하고, 개발용 handler에 의존하지 않는다.

---

## Phase 3 — Verify

```bash
npm run test
```

오류가 있으면 수정 후 완료한다.
