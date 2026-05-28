Scaffold the domain skeleton. Data layer is completed by `/apply-design` using the design bundle's mock data.

## Usage

```
/build-domain <domain-name>
```

---

## Step 0 — 작업 파악

1. `package.json`에서 설치된 라이브러리 버전 확인 — 프로젝트 실제 버전 기준으로 구현한다
2. `src/types/`, `src/services/`, `src/stores/`에 동일 도메인이 이미 있는지 확인
3. 중복이 있으면 사용자에게 알리고 진행 방식을 확인한다

---

## Phase 1 — Skeleton (순차 실행)

### 1. Types (`src/types/<domain>.types.ts`)

`.claude/rules/type-declarations.md`를 읽고 작성한다.

- `Api<Domain>` (snake_case) — assumed spec, `/integrate-domain` 시 실제 스펙과 동기화
- `<Domain>` — **필드를 예측하지 않는다. 빈 인터페이스로만 선언한다**

### 2. Mapper (`src/mappers/<domain>.mapper.ts`)

`.claude/rules/mapper-patterns.md`를 읽고 작성한다.

- **함수 시그니처만 작성하고 내부는 TODO로 둔다** — `/apply-design`에서 완성한다

### 3. Service (`src/services/<domain>.service.ts`)

`.claude/rules/service-patterns.md`를 읽고 작성한다.

- Axios 호출만 포함한다. mock 분기, 환경 조건문 금지
- 응답 후 반드시 mapper를 호출한다

### 4. Store (`src/stores/<domain>.store.ts`)

`.claude/rules/store-patterns.md`를 읽고 작성한다.

- Pinia options API 스타일
- async action은 try/finally로 loading 플래그를 반드시 reset한다

---

## Phase 2 — Type Check

```bash
npm run typecheck
```

오류가 있으면 수정 후 완료한다.

---

> **다음 단계:** `/apply-design <domain-name>`으로 디자인 적용 및 데이터 레이어 완성을 진행한다.
