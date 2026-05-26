import { fileURLToPath, URL } from 'node:url'
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'

import colorFunction from '@csstools/postcss-color-function'
import oklabFunction from '@csstools/postcss-oklab-function'
import { PrimeVueResolver } from '@primevue/auto-import-resolver'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8'))
const require = createRequire(import.meta.url)

/**
 * public/config.js를 개발 서버에서 제공하는 플러그인
 * window.__APP_CONFIG__를 통한 런타임 설정에 사용 (src/config.ts 참고)
 */
function runtimeConfigPlugin() {
  return {
    name: 'runtime-config',
    configureServer(server) {
      const fs = require('node:fs')
      const path = require('node:path')
      server.middlewares.use('/config.js', (_req, res) => {
        const configPath = path.resolve('public/config.js')
        const content = fs.readFileSync(configPath, 'utf-8')
        res.setHeader('Content-Type', 'application/javascript')
        res.end(content)
      })
    },
  }
}

/**
 * Tailwind v4 + LightningCSS가 생성하는 CSS Range 문법을 구형 브라우저 호환 문법으로 변환
 * - @media (width >= 992px)  →  @media (min-width: 992px)
 * - @media (width <= 991px)  →  @media (max-width: 991px)
 */
function legacyMediaQueryPlugin() {
  return {
    name: 'legacy-media-query',
    apply: 'build' as const,
    generateBundle(_: unknown, bundle: Record<string, { type: string; fileName: string; source: string | Uint8Array }>) {
      for (const file of Object.values(bundle)) {
        if (file.type === 'asset' && String(file.fileName).endsWith('.css')) {
          file.source = String(file.source)
            .replace(/\(\s*width\s*>=\s*(\d+(?:\.\d+)?(?:px|em|rem))\s*\)/g, '(min-width: $1)')
            .replace(/\(\s*width\s*<=\s*(\d+(?:\.\d+)?(?:px|em|rem))\s*\)/g, '(max-width: $1)')
        }
      }
    },
  }
}

export default defineConfig({
  server: {
    proxy: {
      // 프로젝트에 맞게 작성
      // '/api': {
      //   target: 'http://localhost:8080',
      //   changeOrigin: true,
      // },
    },
  },
  css: {
    postcss: {
      plugins: [
        // PrimeVue Aura 테마의 oklch/oklab 색상 함수를 구형 브라우저 호환 형식으로 변환
        colorFunction({ preserve: false }),
        oklabFunction({ preserve: false }),
      ],
    },
  },
  plugins: [
    vue(),
    tailwindcss(),
    Components({
      resolvers: [PrimeVueResolver()],
    }),
    runtimeConfigPlugin(),
    legacyMediaQueryPlugin(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  build: {
    cssMinify: 'lightningcss',
  },
})
