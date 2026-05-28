Scaffold the data layer for a new domain. UI components are handled separately by `/apply-design`.

## Usage

```
/build-domain <domain-name>
```

---

## Step 0 — 작업 파악

작업 전에 프로젝트를 확인한다.

1. `package.json`에서 설치된 라이브러리 버전 확인 — 프로젝트 실제 버전 기준으로 구현한다
2. `src/types/`, `src/services/`, `src/stores/`에 동일 도메인이 이미 있는지 확인
3. 중복이 있으면 사용자에게 알리고 진행 방식을 확인한다

---

## Phase 1 — Data Layer (순차 실행)

### 1. Types (`src/types/<domain>.types.ts`)

`.claude/rules/type-declarations.md`를 읽고 작성한다.

- 백엔드 형태: `Api<Domain>` (snake_case 필드)
- 프론트엔드 뷰모델: `<Domain>` (camelCase 필드)
- 이 시점의 `Api<Domain>`은 **assumed spec** — `/integrate-domain` 실행 시 실제 스펙과 동기화한다
- Nullable 필드는 `T | null`로 선언한다. 함부로 non-null 가정하지 않는다

### 2. Mapper (`src/mappers/<domain>.mapper.ts`)

`.claude/rules/mapper-patterns.md`를 읽고 작성한다.

- `Api<Domain>` → `<Domain>` 변환 함수만 포함한다
- null/undefined 방어 처리를 반드시 포함한다

### 3. Service (`src/services/<domain>.service.ts`)

`.claude/rules/service-patterns.md`를 읽고 작성한다.

- Axios 호출만 포함한다. mock 분기, 환경 조건문 금지
- 응답 후 반드시 mapper를 호출한다

### 4. Store (`src/stores/<domain>.store.ts`)

`.claude/rules/store-patterns.md`를 읽고 작성한다.

- Pinia options API 스타일
- async action은 try/finally로 loading 플래그를 반드시 reset한다

---

## Phase 2 — MSW Mock Handler

`src/mocks/handlers/<domain>.handler.ts`를 생성한다.

- 서비스의 모든 엔드포인트에 대한 handler를 작성한다
- 한국어 현실적인 mock 데이터를 사용한다
- `src/mocks/browser.ts`(dev)와 `src/mocks/server.ts`(tests) 양쪽에 등록한다

---

## Phase 3 — Skeleton Tests

기존 테스트 파일을 참고하여 컴파일·실행은 되지만 assertion은 stub 상태인 테스트를 생성한다.

- `tests/unit/mappers/<domain>.mapper.test.ts` — 정상 매핑 + nullable 필드 fallback
- `tests/unit/services/<domain>.service.test.ts` — 성공 응답 + 에러 응답 (MSW server)
- `tests/unit/stores/<domain>.store.test.ts` — 초기 상태 + action 성공 + `isLoading` 에러 시 reset

---

## Phase 4 — Type Spec Table

`Api<Domain>` 필드 목록을 표로 출력한다.

| 필드명 (snake_case) | 타입 | Nullable | 설명 |
|---------------------|------|----------|------|

assumed 엔드포인트 목록도 함께 출력한다. 백엔드 팀과 협의하기 위한 임시 명세다.

---

## Phase 5 — Type Check

```bash
npm run typecheck
```

오류가 있으면 수정 후 완료한다.

---

> **다음 단계:** UI 구현은 `/apply-design <domain-name>`으로 진행한다.
