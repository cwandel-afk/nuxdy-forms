// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: [
    "nuxt-icon",
    // During development, you'll use the local module
    // '../'
  ],
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  // Module configuration
  runtimeConfig: {
    public: {
      dynamicForm: {
        defaultClasses: {
          // You can override default classes here
        },
      },
    },
  },
});
