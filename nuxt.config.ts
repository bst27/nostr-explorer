// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  ssr: false,

  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@pinia/nuxt'
  ],

  css: ['~/assets/css/main.css'],

  compatibilityDate: '2025-07-16'
})