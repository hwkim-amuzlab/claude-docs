# CHANGELOG

커맨드 파일과 규칙 파일의 변경 이력을 추적한다.
여러 프로젝트에서 이 저장소를 공유할 때 변경 내용을 쉽게 파악할 수 있도록 유지한다.

형식:
- `[추가]` 새로운 파일 또는 기능
- `[개선]` 기존 내용 보완·수정
- `[수정]` 버그·오류 정정
- `[삭제]` 제거된 파일 또는 규칙

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
