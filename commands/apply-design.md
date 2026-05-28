Implement UI components and complete the data layer from a Claude Design handoff bundle.
Run `/build-domain` first — this command requires types and store to already exist.

## Usage

```
/apply-design <domain-name>
```

---

## Step 0 — 사전 확인 및 번들 수신

### 1. 데이터 레이어 존재 확인

다음 파일이 존재하는지 확인한다. 없으면 먼저 `/build-domain <domain-name>`을 실행하도록 안내한다.

- `src/types/<domain>.types.ts`
- `src/stores/<domain>.store.ts`

### 2. 핸드오프 번들 수신

Claude Design 핸드오프 URL을 요청한다. URL을 받기 전에 다음 단계로 넘어가지 않는다.

URL을 fetch하고 README.md를 읽는다.

### 3. 스타일 구현 규칙

PrimeVue 컴포넌트, Tailwind CSS를 기본으로 사용한다.
디자인의 px값은 아래 우선순위로 변환한다.
1. Tailwind 표준 스케일에 해당하는 값이면 표준 클래스를 사용한다.
2. 표준 스케일에 없는 값은 arbitrary value로 1:1 변환한다.
3. inline style은 Tailwind로 표현 불가한 경우에만 허용
- pt (passthrough) props로 내부 스타일 직접 오버라이드
- 또는 :deep() CSS selector로 컴포넌트 내부 스타일

### 4. 모호한 부분 확인

번들을 파싱한 후 불명확한 인터랙션이나 데이터 바인딩이 있으면 구현 전에 질문한다.

### 5. AppLayout 공유 셸 컴포넌트 확인

번들에 TopBar, Sidebar 등 `AppLayout`에 속하는 공유 셸 컴포넌트가 포함된 경우, 해당 컴포넌트를 현재 도메인 작업 범위에 포함할지 별도 작업으로 분리할지 사용자에게 확인한다. 확인 없이 도메인 컴포넌트와 함께 구현하거나 무시하지 않는다.

---

## Phase 1 — 데이터 레이어 완성

번들의 mock 데이터를 기반으로 진행한다.

- mock 데이터 구조를 파악하여 `<Domain>` 타입 필드를 확정한다
- `src/mappers/<domain>.mapper.ts`의 TODO 구현을 완성한다
- `src/mocks/handlers/<domain>.handler.ts`를 생성하고 번들의 mock 데이터를 그대로 사용한다
- `src/mocks/browser.ts`(dev)와 `src/mocks/server.ts`(tests) 양쪽에 등록한다

---

## Phase 2 — Components (`src/components/<domain>/`)

비주얼 섹션당 하나의 SFC를 생성한다.

- 번들의 시각적 명세를 기준으로 레이아웃과 스타일을 구현한다
- props는 `src/types/<domain>.types.ts`의 타입을 사용한다
- 데이터 fetch는 컴포넌트에서 직접 하지 않는다 — 부모 view에서 store를 통해 전달한다
- `package.json` 기준으로 설치된 PrimeVue 컴포넌트를 활용한다

---

## Phase 3 — View (`src/views/<Domain>View.vue`)

- `onMounted`에서 store action을 호출하여 데이터를 fetch한다
- 컴포넌트를 조합하는 thin layer — 비즈니스 로직은 store에 위임한다
- loading 상태와 에러 상태를 처리한다

---

## Phase 4 — Router

`src/router/index.ts`에 route를 추가한다.

- `AppLayout`으로 감싼다 (`/login`, `/access-denied`, `/404` 제외)
- 필요한 경우 `meta.roles`로 접근 권한을 설정한다

---

## Phase 5 — Global Setup

번들의 README에서 요구하는 전역 설정이 있으면 적용한다.

- 새 라이브러리 → `src/main.ts`에 등록
- 디자인 토큰 (CSS 변수) → `src/assets/tailwind.css`에 추가

이미 프로젝트에 설정된 항목은 건드리지 않는다.

---

## Phase 6 — Skeleton Tests

기존 테스트 파일을 참고하여 컴파일·실행은 되지만 assertion은 stub 상태인 테스트를 생성한다.

- `tests/unit/mappers/<domain>.mapper.test.ts` — 정상 매핑 + nullable 필드 fallback
- `tests/unit/services/<domain>.service.test.ts` — 성공 응답 + 에러 응답 (MSW server)
- `tests/unit/stores/<domain>.store.test.ts` — 초기 상태 + action 성공 + `isLoading` 에러 시 reset

---

## Phase 7 — Type Check

```bash
npm run typecheck
```

오류가 있으면 수정 후 완료한다.
