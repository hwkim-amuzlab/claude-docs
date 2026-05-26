# Update Patterns

기존 도메인을 부분 수정할 때 어떤 레이어를 수정해야 하는지 케이스별로 정리한다.
불필요한 레이어는 건드리지 않는다.

> 새 도메인 추가는 `/build-domain`, 백엔드 스펙 전체 동기화는 `/integrate-domain`, 부분 수정은 `/update-domain`을 사용한다.

---

## Case 1 — API 필드 추가·변경

types → mapper → MSW handler 순으로 수정. service는 인터셉터가 언래핑하므로 필드 변경만으로는 수정 불필요. 변경 규모가 크면 `/integrate-domain`으로 전체 diff를 받는 것이 안전.

## Case 2 — 새 엔드포인트 추가

types(필요 시) → mapper(필요 시) → service → store → MSW handler 순으로 추가. MSW 핸들러를 빠뜨리면 개발 중 실제 서버로 요청이 나가므로 반드시 추가.

## Case 3 — UI만 수정

components / view만 수정. types·mapper·service·store는 건드리지 않는다. 표시 형식(날짜, 레이블 등) 변경은 `utils/`에서 처리하며 mapper에 추가하지 않는다.

## Case 4 — 스토어 상태 구조 변경

store → view → components 순으로 수정. 테스트도 함께 업데이트한다.

## Case 5 — Mock → 실제 API 전환

MSW handler의 해당 엔드포인트를 주석 처리하는 것으로 끝. service·store 수정 불필요. `onUnhandledRequest: 'bypass'`가 실제 서버로 자동 통과시킨다. 실제 응답과 assumed 타입이 다를 경우 먼저 `/integrate-domain`으로 동기화.

## Case 6 — 도메인 전체 삭제

router → view → components → MSW handler → browser.ts → store → service → mapper → types → 테스트 파일 순으로 역방향 삭제. 삭제 전 다른 도메인의 참조 여부를 확인하고, 마지막에 `npm run typecheck`로 검증.

---

## 레이어 수정 빠른 참조

| 변경 사항 | Types | Mapper | Service | Store | Component/View | MSW |
|-----------|-------|--------|---------|-------|----------------|-----|
| API 필드 추가·변경 | ✅ | ✅ | ❌ | △ | △ | ✅ |
| 새 엔드포인트 | △ | △ | ✅ | ✅ | ❌ | ✅ |
| UI 변경 | ❌ | ❌ | ❌ | △ | ✅ | ❌ |
| 상태 구조 변경 | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| Mock 비활성화 | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

✅ 수정 필요 / △ 경우에 따라 수정 / ❌ 수정 불필요
