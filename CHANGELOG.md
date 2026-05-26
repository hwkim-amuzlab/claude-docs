# CHANGELOG

커맨드 파일과 규칙 파일의 변경 이력을 추적한다.
여러 프로젝트에서 이 저장소를 공유할 때 변경 내용을 쉽게 파악할 수 있도록 유지한다.

형식:
- `[추가]` 새로운 파일 또는 기능
- `[개선]` 기존 내용 보완·수정
- `[수정]` 버그·오류 정정
- `[삭제]` 제거된 파일 또는 규칙

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
