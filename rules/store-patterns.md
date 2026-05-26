# Store Pattern Rules

- Use Pinia options API style (not setup style)
- Always wrap async actions with try/finally to reset loading flags
- Use `markRaw()` for any non-reactive objects in state (Axios instances, class instances, etc.) — omitting it causes Vue to apply deep reactive proxies, leading to performance issues and unexpected bugs
- Use `lastQuery` references to skip redundant API calls — compare with current params before fetching
