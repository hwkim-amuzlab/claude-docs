Build unit test infrastructure and generate unit tests with real assertions.
Run `/integrate-domain` first — this command requires types and implementations finalized against the real backend spec.

## Usage

```
/build-tests <domain-name>
```

---

## Step 0 — 사전 확인

다음 파일이 존재하는지 확인한다. 없으면 먼저 `/integrate-domain <domain-name>`을 실행하도록 안내한다.

- `src/types/<domain>.types.ts`
- `src/mappers/<domain>.mapper.ts`
- `src/services/<domain>.service.ts`
- `src/stores/<domain>.store.ts`

---

## Phase 1 — Test Infrastructure Setup

없으면 `.claude/templates/`에서 복사한다.

- `src/mocks/server.ts`
- `tests/setup.ts`
- `tests/utils/msw.ts`

---

## Phase 2 — Unit Tests 생성

실제 구현을 읽고, 실행 가능하고 의미 있는 assertion을 포함한 unit test를 생성한다.
테스트 파일이 이미 존재하면 덮어쓰지 않고 누락된 케이스만 추가한다.

### `tests/unit/mappers/<domain>.mapper.test.ts`

`src/mappers/<domain>.mapper.ts`를 읽고:
- 정상 입력 → 출력 매핑 검증 (실제 `Api*` 타입 기준 mock 입력 사용)
- nullable 필드 fallback 검증 (`?? ''`, `?? 0` 등)

### `tests/unit/services/<domain>.service.test.ts`

`src/services/<domain>.service.ts`와 `src/types/<domain>.types.ts`를 읽고:
- `server.use()`에 실제 `Api*` shape의 mock 데이터 등록
- 성공 응답: 반환값이 mapper를 통과한 도메인 타입임을 검증
- 에러 응답: 예외가 throw됨을 검증

Service test는 `tests/utils/msw.ts` helper를 사용하고, 개발용 handler에 의존하지 않는다.

### `tests/unit/stores/<domain>.store.test.ts`

`src/stores/<domain>.store.ts`를 읽고:
- service를 `vi.mock()`으로 처리
- 초기 state 검증
- action 성공 시 state 전이 검증
- action 실패 시 `isLoading` reset 검증

---

## Phase 3 — Verify

```bash
npm run test
```

오류가 있으면 수정 후 완료한다.
