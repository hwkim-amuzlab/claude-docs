# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 핵심 원칙

모든 작업은 `.claude/rules/core-constraints.md`를 따른다.  
**코드베이스가 스승이다.** 구현 전에 읽고, 관찰한 패턴을 따른다.  
사고 흐름: **GROUND → APPLY → VERIFY**, 실패 시 ADAPT.

---

## 커맨드

| 커맨드                        | 설명                                                                                        |
| -------------------------- | ----------------------------------------------------------------------------------------- |
| `/start <작업 설명>`           | 맥락 파악 → 복잡도 판단(S/M/L) → 작업 계획 보고. 코드 수정 전에 실행                                             |
| `/done`                    | Diff 재검토 → 불변 제약 점검 → typecheck/test → 커밋 준비 완료                                           |
| `/build-domain <name>`     | 도메인 뼈대 생성 (빈 types→mapper 시그니처→service→store)                                             |
| `/apply-design <name>`     | 디자인 번들 → 타입 확정 + mapper 완성 + MSW dev mock + components→view→router. `/build-domain` 이후 실행 |
| `/build-tests <name>`      | 백엔드 연동 완료 후 test infrastructure setup + 실제 assertion unit tests 생성. `/integrate-domain` 이후 실행 |
| `/request-api <name>`      | 구현된 프론트 mock/UI 분석 → 백엔드 전달용 데이터 요구사항 프롬프트 생성                                             |
| `/integrate-domain <name>` | 백엔드 API 완성 후 실제 스펙과 타입 동기화, mock 비활성화                                                     |
| `/update-domain <name>`    | 기존 도메인 부분 수정 — 변경 유형 분류 → 영향 레이어만 선택적 수정                                                  |

---

## 도메인 개발 워크플로우

**백엔드보다 프론트엔드가 먼저 개발된다.** 타입은 디자인 번들의 mock 데이터로 확정하고, `/integrate-domain` 실행 시 실제 백엔드 스펙과 동기화한다.

```

[도메인 개발 — 반복]
1. [사람]  Claude Design으로 디자인 완료
2. [Claude] /build-domain <name>   → 도메인 뼈대 (빈 타입 + 시그니처)
3. [Claude] /apply-design <name>   → 디자인 번들 → 타입 확정 + mock 데이터 + components + view
4. [Claude] /request-api <name>    → 백엔드 전달용 데이터 요구사항 프롬프트 생성
5. [사람]  API 구현 (백엔드가 기존 백엔드 코드베이스 기준으로 API 설계)
6. [Claude] /integrate-domain <name>  → Swagger diff → types/mapper 수정 → MSW 비활성화
7. [Claude] /build-tests <name>    → test infrastructure + 실제 assertion unit tests 생성
이후 부분 수정: /start → /update-domain <name> → /done
디자인만 변경:  /start → /apply-design <name> → /done
```

---

## 규칙 파일

| 파일 | 설명 |
|------|------|
| `.claude/rules/core-constraints.md` | **불변 제약 5개 + GROUND→APPLY→VERIFY + S/M/L 분기** — 모든 작업의 기준 |
| `.claude/rules/type-declarations.md` | 타입 선언 규칙 |
| `.claude/rules/mapper-patterns.md` | 매퍼 작성 규칙 |
| `.claude/rules/service-patterns.md` | 서비스 작성 규칙 |
| `.claude/rules/store-patterns.md` | 스토어 작성 규칙 |
| `.claude/rules/update-patterns.md` | 부분 수정 시나리오별 레이어 수정 순서 |

---

## Commands

```bash
npm run dev          # Start dev server (Vite)
npm run build        # TypeScript check + Vite build
npm run lint         # ESLint with auto-fix
npm run format       # Prettier format
npm run typecheck    # vue-tsc type check only
npm run test         # Vitest unit tests
```

---

## 아키텍처 상세

레이어 구조, HTTP 클라이언트, MSW 전략, 테스트 전략, 의존성 목록은 `.claude/architecture/`를 참조한다.

- [`overview.md`](.claude/architecture/overview.md) — 레이어 구조, 네이밍, 스택, 의존성
- [`http-client.md`](.claude/architecture/http-client.md) — Axios 인스턴스, 인터셉터, ApiResponse 패턴
- [`mock-strategy.md`](.claude/architecture/mock-strategy.md) — MSW 패턴, mock→실제 전환
- [`testing.md`](.claude/architecture/testing.md) — 레이어별 테스트 전략
- [`docker.md`](.claude/architecture/docker.md) — Dockerfile, nginx.conf(SPA 라우팅 + index.html 캐시 방지)
