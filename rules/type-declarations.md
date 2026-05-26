# Type Declaration Rules

- `src/types/` contains pure TypeScript declarations only — no functions, no logic
- Backend shapes과 frontend view models은 구분 가능한 네이밍을 사용한다 — prefix/suffix 컨벤션은 프로젝트 시작 시 결정
- Nullable fields must be declared as `T | null`, never as `T` alone — check the OpenAPI spec, do not assume non-null
- `src/types/schema.ts` is a temporary generated file — always split into domain files and delete it
