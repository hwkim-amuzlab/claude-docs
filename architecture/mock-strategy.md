# Mock Strategy (MSW)

## 원칙

Mock 제어는 **MSW handler 등록 여부**로만 한다.  
`onUnhandledRequest: 'bypass'`로 handler가 없는 요청은 실제 서버로 자동 통과한다.  
서비스 파일에 mock 분기, 환경 조건문을 작성하지 않는다.

---

## 디렉토리 구조

```
src/mocks/
├── browser.ts                  - setupWorker (dev)
├── server.ts                   - setupServer (tests)
└── handlers/<domain>.handler.ts
```

---

## Mock 응답 envelope

MSW handler의 JSON body는 실제 API와 동일하게 `ApiResponse<T>` envelope을 사용한다.  

```typescript
const body: ApiResponse<ApiDashboard> = {
  code: 'OK',
  data: mockDashboard,
  message: 'success',
  timestamp: new Date().toISOString(),
}

return HttpResponse.json(body)
```

---

## Mock → 실제 API 전환

백엔드 완성된 엔드포인트는 handler의 해당 엔드포인트를 **주석 처리**하면 자동으로 실제 API로 전환된다.  
서비스·스토어 수정 불필요.

실제 응답과 assumed 타입이 다를 경우 먼저 `/integrate-domain`으로 타입을 동기화한다.

---

## bootstrap 패턴

`main.ts`의 MSW 초기화 패턴은 `.claude/templates/main.ts` 참고.  
`worker.start()` 완료 후 `app.mount()`를 호출하여 첫 요청 전에 service worker가 준비되도록 한다.
