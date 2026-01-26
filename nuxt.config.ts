// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    remoteApiBase: process.env.REMOTE_API_BASE || 'https://lazypeople.zeabur.app/api'
  },
  modules: ['@pinia/nuxt'],
  css: ['~/assets/style/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})
