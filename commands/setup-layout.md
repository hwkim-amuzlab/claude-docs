Set up AppLayout and global visual foundation from a Claude Design handoff bundle.
Run once per project, before `/build-domain` and `/apply-design`.

## Usage

```
/setup-layout <bundle-url>
```

---

## Step 0 — 사전 확인 및 번들 수신

### 1. 실행 조건 확인

`src/layouts/AppLayout.vue`를 읽는다.

- 파일이 없거나 스타일이 거의 없는 상태(예: `min-h-screen`만 있음)여야 한다
- 이미 배경색·padding·TopBar가 완성된 상태라면 사용자에게 알리고 중단한다

### 2. 핸드오프 번들 수신

Claude Design 핸드오프 URL을 요청한다. URL을 받기 전에 다음 단계로 넘어가지 않는다.

URL을 fetch하고 README.md를 읽는다.

### 3. 번들에서 추출할 항목

번들에서 다음 정보를 파악한다. 누락된 항목은 구현에서 생략한다.

| 항목 | 번들 내 위치 예시 |
|------|-----------------|
| 페이지 배경색 | CSS 변수 또는 색상 토큰 |
| 본문 padding | 레이아웃 spacing 명세 |
| 본문 max-width | 레이아웃 spacing 명세 |
| TopBar 높이·구조 | TopBar 컴포넌트 명세 |
| 전역 CSS 변수 | 디자인 토큰 목록 |

### 4. 모호한 부분 확인

번들을 파싱한 후 불명확한 항목이 있으면 구현 전에 질문한다.

---

## Phase 1 — 전역 CSS 변수 (`src/assets/tailwind.css`)

번들의 디자인 토큰을 `@layer base { :root { … } }` 블록에 추가한다.

- 이미 선언된 변수는 덮어쓰지 않는다
- PrimeVue Aura 테마 변수(`--p-*`)와 충돌하지 않도록 확인한다

---

## Phase 2 — AppLayout (`src/layouts/AppLayout.vue`)

번들 명세를 기준으로 구현한다.

- 배경색: 디자인 토큰 CSS 변수를 Tailwind arbitrary value로 적용 (`bg-[--surface-ground]` 등)
- 본문 wrapper: `max-w-*`, `mx-auto`, `px-*`, `pt-*`, `pb-*`
- TopBar가 고정(fixed/sticky)이라면 본문 상단 padding에 TopBar 높이를 반영한다
- TopBar가 없으면 이 단계는 생략한다

---

## Phase 3 — TopBar (`src/components/layout/TopBar.vue`)

번들에 TopBar 명세가 있을 때만 생성한다.

- 높이 고정: `h-16` 또는 arbitrary value
- `fixed top-0 left-0 right-0`로 뷰포트 상단 고정
- `z-50` 이상으로 콘텐츠 위에 위치
- 슬롯 구조(로고 영역, 네비게이션, 우측 액션)를 번들 명세에 맞게 구성한다
- 데이터 fetch는 하지 않는다 — 부모(AppLayout)에서 props로 전달한다

TopBar를 생성했다면 `AppLayout.vue`에 import하고 배치한다.

---

## Phase 4 — 시각 확인 항목 보고

구현 완료 후 다음을 사용자에게 보고한다.

```
✓ 적용된 CSS 변수 목록
✓ AppLayout: 배경색, padding, max-width 값
✓ TopBar: 높이, position (생성한 경우)
△ 번들에서 확인하지 못해 생략한 항목 (있을 경우)
```

---

## Phase 5 — Type Check

```bash
npm run typecheck
```

오류가 있으면 수정 후 완료한다.

---

> **다음 단계:** `/build-domain <name>`으로 첫 번째 도메인 개발을 시작한다.
