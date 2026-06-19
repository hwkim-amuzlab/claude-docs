새 프로젝트의 초기 세팅을 수행한다.
`npm create vue@latest`로 프로젝트를 생성한 직후 실행한다.

## Usage

```
/setup-project
```

---

## Step 1 — 템플릿 파일 복사

`.claude/templates/`의 모든 파일을 동일 경로로 복사한다.

---

## Step 2 — 디렉토리 생성

이미 존재하면 건너뛴다.

```
src/types/
src/mappers/
src/services/
src/stores/
src/components/
src/views/
src/composables/
src/utils/
src/constants/
src/declarations/
src/mocks/handlers/
tests/utils/
```

---

## Step 3 — 패키지 설치

`architecture/overview.md`의 Recommended Dependencies 기준으로 의존성을 추가하고 설치한다.

```bash
npm install
```

---

## Step 4 — MSW 초기화 및 타입 체크

```bash
npx msw init public/ --save
npm run typecheck
```

MSW 초기화를 건너뛰면 개발 서버에서 Service Worker 등록이 실패한다.

---

> **다음 단계:** `/build-infra`
