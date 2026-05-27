# Service Pattern Rules

- Service files contain Axios calls only — no mock flags, no mock branches, no environment conditionals
- Mock control is handled entirely by MSW handler registration, never inside service files
- The HTTP interceptor unwraps the `ApiResponse<T>` envelope — services receive `T` directly, not `ApiResponse<T>`
- Always call the corresponding mapper after fetching — never return raw `Api*` types from a service

## Interceptor Unwrapping

인터셉터는 `response.data`를 `ApiResponse<T>.data`로 교체하여 반환한다.  
서비스 함수는 `response.data`(= `T`)를 그대로 받는다.

```typescript
// src/services/http/interceptors.ts — response interceptor
axiosInstance.interceptors.response.use((response) => {
  const envelope = response.data as ApiResponse<unknown>
  // data 필드로 교체하면 서비스에서 response.data === T
  response.data = envelope.data
  return response
})

// src/services/user.service.ts — 서비스에서 response.data가 곧 T
export async function fetchUser(id: number): Promise<User> {
  const { data } = await mainHttp.get<ApiUser>(`/users/${id}`)
  return mapApiUserToUser(data)  // data는 ApiUser (unwrapped)
}
```

## Toast from Interceptor

컴포넌트 외부(인터셉터)에서 PrimeVue 토스트를 호출하는 방법 — Pinia 스토어를 알림 큐로 사용.

```typescript
// src/stores/httpNotice.store.ts
interface Notice {
  message: string
  type: 'success' | 'info' | 'warn' | 'error'
  code: string
  timestamp: number
}

export const useHttpNoticeStore = defineStore('httpNotice', {
  state: () => ({ queue: [] as Notice[] }),
  getters: {
    current: (state) => state.queue[0] ?? null,
  },
  actions: {
    push(notice: Omit<Notice, 'timestamp'>) {
      this.queue.push({ ...notice, timestamp: Date.now() })
    },
    shift() {
      this.queue.shift()
    },
  },
})

// src/services/http/interceptors.ts — 인터셉터에서 스토어에 push
import { useHttpNoticeStore } from '@/stores/httpNotice.store'
const noticeStore = useHttpNoticeStore()
noticeStore.push({ type: 'warn', message, code })

// src/layouts/AppLayout.vue — 큐를 감시하여 토스트 표시 후 제거
import { useToast } from 'primevue/usetoast'
import { useHttpNoticeStore } from '@/stores/httpNotice.store'
const toast = useToast()
const noticeStore = useHttpNoticeStore()

watch(() => noticeStore.current, (notice) => {
  if (!notice) return
  toast.add({ severity: notice.type, detail: notice.message, life: 3000 })
  noticeStore.shift()
})
```
