# CHANGELOG

커맨드 파일과 규칙 파일의 변경 이력을 추적한다.
여러 프로젝트에서 이 저장소를 공유할 때 변경 내용을 쉽게 파악할 수 있도록 유지한다.

형식:
- `[추가]` 새로운 파일 또는 기능
- `[개선]` 기존 내용 보완·수정
- `[수정]` 버그·오류 정정
- `[삭제]` 제거된 파일 또는 규칙

---

## [1.15.0] — 2026-05-29

### [추가] `commands/request-api.md`
`/request-api <domain-name>` 커맨드 추가.
- `/apply-design` 이후 확정된 mock 데이터, 타입, UI 사용처를 분석
- 백엔드 Claude Code에 그대로 전달할 데이터 요구사항 프롬프트만 출력
- API URL, Method, 엔드포인트 수, DB 구조 추측, 프론트 내부 파일 경로 포함 금지

### [개선] `CLAUDE.md`
도메인 개발 워크플로우에 `/request-api` 단계를 `/apply-design`과 `/integrate-domain` 사이에 추가.

---

## [1.14.0] — 2026-05-28

### [추가] `architecture/docker.md`
Docker 빌드 및 nginx 설정 문서 신규 추가.
- Dockerfile: multi-stage 빌드 (Node → nginx:alpine)
- nginx.conf: SPA 라우팅(`try_files`) + `index.html` 캐시 방지(`no-cache, no-store, must-revalidate`)
- `docker-build.sh`: `package.json` version 자동 태깅, `--platform linux/amd64` 빌드, 대화형 push 확인

### [개선] `CLAUDE.md`
`architecture/docker.md` 참조 항목 추가.

### [개선] `architecture/overview.md`
- Templates 항목 수정: view 파일 목록 제거, setup 파일만 명시 (`vite.config.ts`, `main.ts`, `eslint.config.js`, `.prettierrc`)
- devDependencies에 `jsdom ^26.x` 추가 — Vitest `environment: 'jsdom'` 사용 시 필수

### [삭제] `templates/*.vue` 기본 view 파일 4개
`HomeView`, `LoginView`, `AccessDeniedView`, `NotFoundView` 삭제.

---

## [1.13.0] — 2026-05-28

### [개선] `commands/apply-design.md`
AppLayout 공유 셸 컴포넌트 확인 단계를 Step 0에서 Phase 7로 이동, Global Setup 순서 조정.
- AppLayout 확인을 도메인 구현(Phase 1~6) 완료 후로 이동 — 구현 여부 결정 시 `src/layout/` 하위에 작성
- Global Setup(라이브러리 등록, 디자인 토큰)을 Phase 5 → Phase 2로 이동 — 컴포넌트보다 먼저 전역 설정이 적용되도록 순서 조정
- Phase 번호 전체 재정렬 (1~8)

### [개선] `architecture/overview.md`
Templates 항목 추가 및 기존 Setup files 항목 통합.
- setup 파일 4개와 기본 view 4개(`HomeView`, `LoginView`, `AccessDeniedView`, `NotFoundView`)를 한 줄로 정리
- 경로 오기 수정: `.claude/templates/` → `templates/`

---

## [1.12.0] — 2026-05-28

### [개선] `commands/apply-design.md`
Step 0에 AppLayout 공유 셸 컴포넌트 확인 단계(항목 5) 추가.
- 번들에 TopBar, Sidebar 등 AppLayout 소속 컴포넌트가 포함된 경우 현재 도메인 범위에 포함할지 별도 작업으로 분리할지 사용자 확인 의무화
- 확인 없이 도메인 컴포넌트와 함께 구현하거나 무시하는 행동 금지

---

## [1.11.0] — 2026-05-28

### [개선] `commands/done.md`
품질 게이트(Step 3)에 `npm run lint` 추가.
- `typecheck`, `test` 앞에 `lint` 먼저 실행하도록 순서 지정

---

## [1.10.0] — 2026-05-28

### [개선] `commands/setup-layout.md`
`primeicons` 패키지 누락으로 아이콘이 표시되지 않는 문제를 사전 차단.
- Phase 1 추가: `package.json`에서 `primeicons` 설치 여부 확인 → 없으면 설치 후 `main.ts`에 CSS 임포트
- 기존 Phase 1~5를 Phase 2~6으로 번호 재정렬

### [개선] `architecture/overview.md`
권장 의존성 목록에 `primeicons` 추가.

---

## [1.9.0] — 2026-05-28

### [추가] `commands/setup-layout.md`
프로젝트 최초 1회 실행하는 레이아웃 설정 커맨드 `/setup-layout` 추가.
- Step 0: AppLayout 현재 상태 확인 → Claude Design 핸드오프 번들 수신
- Phase 1: 전역 CSS 변수를 `tailwind.css`에 추가 (기존 변수 보호)
- Phase 2: AppLayout에 배경색·padding·max-width 적용
- Phase 3: TopBar 컴포넌트 생성 — 번들 명세가 있을 때만 (조건부)
- Phase 4: 적용 결과 보고 (적용된 값 + 생략된 항목)
- Phase 5: `npm run typecheck` 실행 후 오류 수정

### [개선] `CLAUDE.md`
`/setup-layout` 커맨드 추가 및 워크플로우에 신규 프로젝트 단계 명시.
- 커맨드 테이블에 `/setup-layout` 항목 추가
- 도메인 개발 워크플로우에 "신규 프로젝트 — 최초 1회" 섹션 추가

---

## [1.8.0] — 2026-05-28

### [개선] `commands/build-domain.md`
`/build-domain`의 역할을 도메인 뼈대 생성으로 축소.
- `<Domain>` 뷰모델 타입은 빈 인터페이스로만 선언 — 필드 예측 금지
- mapper는 함수 시그니처만 작성하고 내부는 TODO로 유지
- MSW mock 핸들러, skeleton tests, type spec table 생성을 `/apply-design`으로 이동

### [개선] `commands/apply-design.md`
디자인 번들의 mock 데이터를 기반으로 데이터 레이어까지 완성하도록 역할 확장.
- Phase 1 추가: mock 데이터 구조로 `<Domain>` 타입 필드 확정 → mapper 구현 완성 → MSW mock 핸들러 생성
- skeleton tests를 타입 확정 이후 단계로 이동
- 기존 UI 구현 phases (components, view, router, global setup, type check) 번호 재정렬

### [개선] `CLAUDE.md`
커맨드 설명 및 도메인 개발 워크플로우 다이어그램 업데이트.

---

## [1.7.0] — 2026-05-28

### [추가] `rules/core-constraints.md`
모든 작업의 기준이 되는 불변 제약 5개와 사고 모델 문서 추가.
- 불변 제약: 읽기 우선 / 패턴 준수 / 정책 보존 / 최소 변경 / 스코프 준수
- 사고 흐름: `GROUND → APPLY → VERIFY`, 실패 시 `ADAPT`
- 작업 규모 S/M/L 판단 기준 및 레이어별 수정 원칙 포함

### [추가] `commands/start.md`
코드 수정 전 맥락 파악 커맨드 `/start` 추가.
- Step 1 GROUND: 관련 파일 탐색 (수정 없이 읽기만)
- Step 2: S/M/L 복잡도 판단 → L이면 서브태스크 분해 제안
- Step 3: 작업 계획(수정 레이어·순서·주의사항) 보고 후 사람 확인 대기

### [추가] `commands/done.md`
작업 완료 후 품질 검증 커맨드 `/done` 추가.
- Step 1: 변경 파일 전체 Diff 재검토
- Step 2: `core-constraints.md` 불변 제약 5개 체크리스트 점검
- Step 3: `npm run typecheck` + `npm run test` 실행 및 오류 수정
- Step 4: 커밋 메시지 초안 출력

### [추가] `commands/apply-design.md`
UI 구현 전용 커맨드 `/apply-design` 추가. `/build-domain` 이후 실행.
- Step 0: 데이터 레이어 존재 확인 → Claude Design 핸드오프 번들 수신
- Phase 1: Components (`src/components/<domain>/`) — SFC 단위 분리
- Phase 2: View (`src/views/<Domain>View.vue`) — store 연결, thin view
- Phase 3: Router 등록 (`src/router/index.ts`)
- Phase 4: `npm run typecheck` 실행 후 오류 수정

### [개선] `commands/build-domain.md`
UI 구현 부분을 `/apply-design`으로 분리하여 책임을 명확히 재정의.
- Step 0을 "핸드오프 번들 수신"에서 "프로젝트 파악"으로 전환 — 중복 도메인 존재 여부 확인 포함
- Phase 1 각 레이어를 별도 섹션으로 분리하고 규칙 파일 참조 명시
- Phase 2에서 컴포넌트·뷰 생성 제거 → MSW handler 생성만 담당
- 하단에 "다음 단계: `/apply-design`" 안내 추가

### [추가] `architecture/` 디렉토리 — 아키텍처 상세 문서 분리
`CLAUDE.md`에서 아키텍처 설명을 4개 파일로 분리.
- `overview.md` — 레이어 구조, 네이밍 규칙, 스택, 의존성 목록
- `http-client.md` — Axios 인스턴스, 인터셉터, ApiResponse 패턴
- `mock-strategy.md` — MSW handler 등록 원칙, mock→실제 전환 절차
- `testing.md` — 레이어별 테스트 전략 (mapper/service/store)

### [개선] `CLAUDE.md`
아키텍처 상세 내용을 `architecture/`로 이관하고 구조 전면 개편.
- "핵심 원칙" 섹션 추가 — `core-constraints.md` 참조 및 GROUND→APPLY→VERIFY 사고 흐름 명시
- 커맨드 표를 `/start`, `/done`, `/apply-design` 포함 6개로 확장
- 도메인 개발 워크플로우를 6단계(디자인→build-domain→apply-design→API→integrate-domain→테스트)로 갱신
- 규칙 파일 표에 `core-constraints.md` 추가

---

## [1.6.0] — 2026-05-27

### [수정] `commands/build-domain.md`
- Phase 2 MSW handler 등록 지시에 `src/mocks/server.ts` (테스트용) 추가 — 기존에는 `browser.ts`만 명시되어 서비스 단위 테스트에서 핸들러를 찾지 못하는 문제 있었음
- Phase 2 Global setup의 CSS 파일 경로를 `src/style.css` → `src/assets/tailwind.css`로 수정 — `templates/main.ts`의 실제 import 경로와 일치

### [수정] `commands/integrate-domain.md`
- Phase 2 수정 대상에 `src/stores/<domain>.store.ts` 추가 — API 응답 구조 변경 시 store state·action 시그니처도 영향받을 수 있으므로 확인 후 수정하도록 명시 (불필요 시 skip)
- Phase 2 사전 참조 규칙 파일에 `store-patterns.md` 추가

---

## [1.5.0] — 2026-05-27

### [수정] `templates/vite.config.ts`
`vue-tsc --noEmit` 기준 타입 에러 3건 수정.
- `configureServer(server)` → `server: ViteDevServer` 타입 명시
- `middlewares.use` 콜백 파라미터 `_req: IncomingMessage`, `res: ServerResponse` 타입 명시
- `generateBundle` 번들 파라미터 타입을 커스텀 Record에서 Rollup 공식 `OutputBundle`로 교체

### [개선] `CLAUDE.md`
- `src/layouts/` 디렉토리 레이어 구조 표에 추가 (AppLayout.vue 위치 명시)
- `src/mocks/` 설명의 handler 파일명 오타 수정 (`<domain>.ts` → `<domain>.handler.ts`)
- `Recommended dependencies` 섹션 추가 — 초기 세팅용 권장 패키지 버전 목록 및 `@primeuix/themes` 패키지명 주의사항

### [개선] `rules/service-patterns.md`
- `Interceptor Unwrapping` 섹션 추가 — `response.data` 교체 방식 코드 예시 (서비스에서 `data === T` 임을 명시)
- `Toast from Interceptor` 섹션 추가 — Pinia 스토어 큐 방식으로 인터셉터에서 토스트 호출하는 패턴 문서화
  - `httpNotice.store.ts` (큐) → `interceptors.ts` (push) → `AppLayout.vue` (watch/shift) 흐름

---

## [1.4.0] — 2026-05-26

### [추가] `templates/main.ts`
PrimeVue + MSW 호환성 처리가 포함된 앱 엔트리 템플릿 추가.
- `AppPreset` — Toast의 `color-mix()` 의존성을 정적 색상값으로 오버라이드 (Chrome 102 이하 호환)
- MSW bootstrap 순서 보장 (`worker.start()` → `app.mount()`)
- PrimeVue 한국어 로케일 기본 설정

### [개선] `CLAUDE.md`
App Entry 섹션 추가 — `AppPreset` 오버라이드 이유 및 MSW bootstrap 순서 설명.

---

## [1.3.0] — 2026-05-26

### [추가] `templates/vite.config.ts`
Tailwind v4 + PrimeVue Aura 조합의 CSS 호환성 문제를 처음부터 해결한 Vite 설정 템플릿 추가.
- `legacyMediaQueryPlugin` — CSS Range 문법 → 구형 브라우저 호환 변환 (빌드 시)
- `runtimeConfigPlugin` — `public/config.js` 개발 서버 제공
- PostCSS: oklch/oklab 색상 함수 호환 처리

### [개선] `CLAUDE.md`
Vite Config 섹션 추가 — 커스텀 플러그인 설명 및 필요 패키지 기술.

---

## [1.2.0] — 2026-05-26

### [추가] `templates/eslint.config.js`
ESLint v9+ flat config 템플릿 추가.
- Vue 3 + TypeScript 기본 규칙 포함
- `consistent-type-imports` 강제로 타입 import 일관성 확보

### [추가] `templates/.prettierrc`, `templates/.prettierignore`
Prettier 설정 템플릿 추가. `semi: false`, `singleQuote: true`, `printWidth: 100`.

### [개선] `CLAUDE.md`
- `npm run format` 커맨드 추가
- Linting & Formatting 섹션 추가 (규칙 설명 + 필요 패키지)

---

## [1.1.0] — 2026-05-26

### [추가] `rules/update-patterns.md`
기존 도메인 부분 수정 시나리오별 가이드라인 추가.
- Case 1~6 케이스별 수정 레이어 순서 명시
- 레이어 수정 빠른 참조표 포함
- 에이전트와 사람 모두 참고 가능한 형태로 작성

### [추가] `commands/update-domain.md`
`/update-domain <name>` 커맨드 추가.
- 변경 유형 분류 → 영향 레이어 확인 → 사람 확인 후 수정 흐름
- `update-patterns.md`의 케이스 분류 체계와 연동
- 수정 후 변경 요약 출력

### [개선] `commands/build-domain.md`
- **Phase 3 추가**: mapper / service / store 뼈대 테스트 파일 자동 생성
  - `tests/unit/mappers/<domain>.mapper.test.ts`
  - `tests/unit/services/<domain>.service.test.ts`
  - `tests/unit/stores/<domain>.store.test.ts`
- **Phase 4 추가**: 백엔드 협의용 타입 명세표 자동 출력
  - `Api<Domain>` 필드, 타입, nullable 여부, 설명 포함
  - 가정된 엔드포인트 목록 포함
- 기존 typecheck 단계를 Phase 5로 변경

### [추가] `CHANGELOG.md`
규칙 파일 버전 관리 이력 추적 파일 추가.

### [개선] `CLAUDE.md`
새로 추가된 파일(`update-patterns.md`, `update-domain.md`) 참조 반영.

---

## [1.0.0] — 2026-05-01

### [추가] 초기 시스템 구성
- `commands/build-domain.md` — 디자인 핸드오프 기반 전 레이어 자동 생성
- `commands/integrate-domain.md` — Swagger 스펙 동기화 + Mock 비활성화
- `rules/type-declarations.md` — 타입 선언 규칙
- `rules/mapper-patterns.md` — 매퍼 작성 규칙
- `rules/service-patterns.md` — 서비스 작성 규칙
- `rules/store-patterns.md` — 스토어 작성 규칙
- `CLAUDE.md` — 아키텍처 전체 기준 문서
