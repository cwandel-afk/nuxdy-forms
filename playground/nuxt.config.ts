import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: ["nuxt-icon", "../src/module.ts"],
  vite: {
    plugins: [tailwindcss()]
  },
  compatibilityDate: "2025-03-10",
});
