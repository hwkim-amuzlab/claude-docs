Analyze the implemented frontend domain and generate a backend API request prompt.
Run `/apply-design` first — this command requires finalized mock data, types, and UI usage.

## Usage

```
/request-api <domain-name>
```

---

## Purpose

프론트엔드가 화면 구현을 통해 확정한 **데이터 요구사항**을 백엔드 개발자(Claude Code)에게 전달할 마크다운 프롬프트로 작성한다.

이 커맨드는 API 설계 문서가 아니다.  
API URL, Method, 엔드포인트 수, 요청/응답 분리 방식은 백엔드가 기존 백엔드 코드베이스를 보고 결정한다.

---

## Step 0 — 사전 확인

1. `/apply-design <domain-name>`이 완료되어 다음 파일들이 존재하는지 확인한다.
   - `src/types/<domain>.types.ts`
   - `src/mocks/handlers/<domain>.handler.ts`
   - `src/stores/<domain>.store.ts`
   - `src/views/<Domain>View.vue` 또는 해당 도메인을 사용하는 route-level view
2. 누락된 파일이 있으면 `/apply-design <domain-name>`을 먼저 실행하도록 안내하고 중단한다.

---

## Phase 1 — 프론트 데이터 요구사항 분석

다음 순서로 읽고 추적한다.

1. `src/mocks/handlers/<domain>.handler.ts`
   - mock 데이터 원문 JSON 구조를 파악한다
   - MSW envelope(`ApiResponse<T>`)이 있으면 `data` 내부를 실제 예시 데이터로 본다
2. `src/types/<domain>.types.ts`
   - 프론트가 최종적으로 사용하는 TypeScript 타입을 확인한다
   - `Api<Domain>`과 `<Domain>`이 모두 있으면 화면 요구사항은 `<Domain>` 기준으로 정리한다
3. `src/stores/<domain>.store.ts`
   - 어떤 action/state가 화면 데이터로 사용되는지 확인한다
4. `src/views/`와 `src/components/<domain>/`
   - 어떤 화면에서 쓰이는지 확인한다
   - 각 데이터가 UI에서 어떤 역할인지 분류한다: 목록, 상세, 차트, 집계 수치, 필터 옵션, 상태 표시 등

필요하면 composable, constants, utility 사용처까지 추적한다.

---

## Phase 2 — 출력 프롬프트 작성

백엔드 Claude Code 채팅창에 그대로 붙여넣을 수 있는 마크다운 프롬프트만 출력한다.

출력 프롬프트에는 반드시 다음을 포함한다.

1. 백엔드에게 전달할 작업 맥락
   - 프론트는 필요한 데이터가 무엇인지만 알고 있음
   - API 설계(엔드포인트 수, URL, 구조)는 백엔드가 기존 백엔드 코드베이스를 보고 전적으로 결정
   - 백엔드는 작업 전에 기존 코드 분석 결과와 구현 계획을 먼저 출력할 것
2. 화면 설명
   - 화면의 목적
   - 주요 UI 섹션
3. 데이터별 UI 역할
   - 각 데이터가 어떤 화면 요소에서 어떻게 쓰이는지 설명
   - 목록, 차트, 집계 수치, 상태 표시, 필터 옵션 등 용도를 명시
4. 프론트가 최종적으로 필요한 데이터 명세
   - TypeScript 타입 기준으로 작성
   - nullable 여부를 임의로 바꾸지 않는다
5. mock 데이터 원문 JSON
   - 실제 값의 예시로만 제공한다고 명시
   - 가능한 한 handler의 mock 데이터를 그대로 포함한다

---

## 절대 금지

출력 프롬프트에 다음 내용을 포함하지 않는다.

- API URL
- HTTP Method
- 엔드포인트 수
- REST/GraphQL/RPC 등 API 설계 방식 제안
- request/response DTO 분리 방식 제안
- 데이터 집계 기준 추측
- DB 테이블/컬럼 추측
- 백엔드 구현 방식 추측
- 프론트엔드 파일 경로
- 서비스 코드 위치, store 위치, component 위치 등 내부 구현 정보

---

## 출력 형식

분석 과정이나 설명을 출력하지 않는다.  
최종 결과는 아래 형태의 마크다운 프롬프트만 출력한다.

````markdown
# 백엔드 API 구현 요청: <도메인명>

## 작업 맥락

...

## 화면 설명

...

## 데이터 요구사항

...

## TypeScript 기준 데이터 명세

```typescript
...
```

## Mock 데이터 예시

아래 JSON은 실제 값의 예시이며, API 설계나 DB 구조를 의미하지 않습니다.

```json
...
```

## 백엔드 작업 요청

...
````
