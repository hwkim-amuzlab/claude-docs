# Mapper Pattern Rules

- Mapper files contain conversion functions only — no API calls, no store access
- Null/undefined fields must be handled defensively — use `?? ''`, `?? 0`, `.trim()` etc. as appropriate. Never return `"null"` strings or `Invalid Date`
- Naming convention: `mapTo<Domain>()` for single item, `mapTo<Domain>List()` for arrays
- One mapper file per domain: `src/mappers/<domain>.mapper.ts`
