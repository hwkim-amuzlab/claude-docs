# HTTP Client

## Axios Instances

`src/services/http/index.ts`에서 export:

```
src/services/http/
├── index.ts        - Axios instance 생성 및 export
├── interceptors.ts - Request/response interceptor 부착
└── errorHandler.ts - 에러 분류 (ApiError, ServerError, NetworkError)
```

- `mainHttp` — main backend (`VITE_API_BASE_URL`)
- _(추가 인스턴스는 프로젝트에 따라 작성)_

---

## Interceptor 동작

요청 → Bearer 토큰 주입  
응답 → `ApiResponse<T>` 언래핑 → `ERROR_*` 거부 / `WARNING_*` 경고 토스트 → 401 시 `/login` 리다이렉트 → `X-New-Token` silent refresh

`config.silentSuccess` / `config.silentError`로 토스트 억제 가능.

---

## ApiResponse 언래핑

`ApiResponse<T> = { code: string; data: T; message: string; timestamp: string }`. 성공은 `code === 'OK'`.

인터셉터는 `response.data`를 `ApiResponse<T>.data`로 교체하여 반환한다.  
서비스 함수는 `response.data`(= `T`)를 그대로 받는다.

```typescript
// src/services/http/interceptors.ts — response interceptor
axiosInstance.interceptors.response.use((response) => {
  const envelope = response.data as ApiResponse<unknown>
  response.data = envelope.data  // data 필드로 교체
  return response
})

// src/services/user.service.ts — response.data가 곧 T
export async function fetchUser(id: number): Promise<User> {
  const { data } = await mainHttp.get<ApiUser>(`/users/${id}`)
  return mapApiUserToUser(data)  // data는 ApiUser (unwrapped)
}
```

---

## 인터셉터에서 토스트 호출

컴포넌트 외부(인터셉터)에서 PrimeVue 토스트를 호출할 때 Pinia 스토어를 알림 큐로 사용한다.

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

// src/services/http/interceptors.ts — 인터셉터에서 push
import { useHttpNoticeStore } from '@/stores/httpNotice.store'
const noticeStore = useHttpNoticeStore()
noticeStore.push({ type: 'warn', message, code })

// src/layouts/AppLayout.vue — 큐 감시 후 토스트 표시
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
