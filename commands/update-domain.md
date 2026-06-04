Apply targeted changes to an existing domain's layers without regenerating the whole domain.

## Usage

/update-domain <domain-name>

---

## Step 0 — Understand What Changed

Ask the user what needs to change before touching any file.

---

## Step 1 — Classify and Confirm

Read `.claude/rules/update-patterns.md` and identify which case applies. If the change spans multiple cases, combine the affected layers.

Report to the user: the change type, layers that will be modified, and layers that will not be touched. Wait for confirmation before editing.

---

## Step 2 — Read Before Editing

Read every file that will be modified before making any changes. This prevents accidental overwrites of existing logic.

---

## Step 3 — Apply Changes

Follow the layer order defined in `update-patterns.md` for the identified case. Read the relevant rule file before editing each layer. Only touch layers listed in Step 1.

---

## Step 4 — Update Tests

수정된 레이어에 해당하는 테스트 파일을 업데이트한다.
테스트 파일이 없으면 `commands/build-tests.md`의 Phase 2 기준으로 생성한다.

- **타입 변경** (필드 추가/제거): mapper test 입력 mock + service test `server.use()` body를 새 `Api*` shape에 맞게 수정
- **mapper 로직 변경**: mapper test의 출력 assertions 수정
- **service 엔드포인트/응답 변경**: service test의 `server.use()` URL 또는 response body 수정
- **store action 변경**: store test의 service mock 반환값 또는 state assertions 수정
- **새 기능 추가**: 해당 레이어 테스트에 새 케이스 추가

기존 assertion 중 변경과 무관한 것은 건드리지 않는다.

---

## Step 5 — Verify

Run `npm run typecheck` and `npm run test`. Fix all errors before finishing.

Print a brief summary: change type, files modified with a one-line description each, and layers left untouched.
