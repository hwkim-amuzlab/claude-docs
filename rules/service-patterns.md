# Service Pattern Rules

- Service files contain Axios calls only — no mock flags, no mock branches, no environment conditionals
- Mock control is handled entirely by MSW handler registration, never inside service files
- The HTTP interceptor unwraps the `ApiResponse<T>` envelope — services receive `T` directly, not `ApiResponse<T>`
- Always call the corresponding mapper after fetching — never return raw `Api*` types from a service
