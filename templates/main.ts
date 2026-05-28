import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'primeicons/primeicons.css'
import '@/assets/tailwind.css'

/**
 * color-mix()를 지원하지 않는 구형 브라우저(Chrome 102 등)를 위한 토스트 색상 오버라이드
 * Aura 테마의 토스트는 color-mix()를 사용하므로 정적 색상값으로 대체
 */
const AppPreset = definePreset(Aura, {
  components: {
    toast: {
      colorScheme: {
        light: {
          info: {
            background: '{blue.50}',
            shadow: '0px 4px 8px 0px rgba(59, 130, 246, 0.04)',
          },
          success: {
            background: '{green.50}',
            shadow: '0px 4px 8px 0px rgba(34, 197, 94, 0.04)',
          },
          warn: {
            background: '{yellow.50}',
            shadow: '0px 4px 8px 0px rgba(234, 179, 8, 0.04)',
          },
          error: {
            background: '{red.50}',
            shadow: '0px 4px 8px 0px rgba(239, 68, 68, 0.04)',
          },
          secondary: { shadow: '0px 4px 8px 0px rgba(0, 0, 0, 0.04)' },
          contrast: { shadow: '0px 4px 8px 0px rgba(0, 0, 0, 0.04)' },
        },
        dark: {
          info: {
            background: 'rgba(59, 130, 246, 0.16)',
            borderColor: 'rgba(29, 78, 216, 0.36)',
            shadow: '0px 4px 8px 0px rgba(59, 130, 246, 0.04)',
          },
          success: {
            background: 'rgba(34, 197, 94, 0.16)',
            borderColor: 'rgba(21, 128, 61, 0.36)',
            shadow: '0px 4px 8px 0px rgba(34, 197, 94, 0.04)',
          },
          warn: {
            background: 'rgba(234, 179, 8, 0.16)',
            borderColor: 'rgba(161, 98, 7, 0.36)',
            shadow: '0px 4px 8px 0px rgba(234, 179, 8, 0.04)',
          },
          error: {
            background: 'rgba(239, 68, 68, 0.16)',
            borderColor: 'rgba(185, 28, 28, 0.36)',
            shadow: '0px 4px 8px 0px rgba(239, 68, 68, 0.04)',
          },
          secondary: { shadow: '0px 4px 8px 0px rgba(0, 0, 0, 0.04)' },
          contrast: { shadow: '0px 4px 8px 0px rgba(0, 0, 0, 0.04)' },
        },
      },
    },
  },
})

localStorage.setItem('appVersion', __APP_VERSION__)

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: AppPreset,
    options: {
      darkModeSelector: '.app-dark',
    },
  },
  locale: {
    dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
    dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
    dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
    monthNames: [
      '1월', '2월', '3월', '4월', '5월', '6월',
      '7월', '8월', '9월', '10월', '11월', '12월',
    ],
    monthNamesShort: [
      '1월', '2월', '3월', '4월', '5월', '6월',
      '7월', '8월', '9월', '10월', '11월', '12월',
    ],
    dateFormat: 'yy-mm-dd',
  },
})
app.use(ToastService)
app.use(ConfirmationService)
app.use(VueApexCharts)

/**
 * MSW worker가 준비된 이후에 app.mount()를 호출해야 첫 API 요청이 mock을 건너뛰지 않는다.
 * 프로덕션 빌드에서는 MSW를 로드하지 않는다.
 */
async function bootstrap() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser')
    await worker.start({ onUnhandledRequest: 'bypass' })
  }
  app.mount('#app')
}

bootstrap()
