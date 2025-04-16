# Pages Coding Standards

## File Structure
- Use PascalCase for directory names, but file names should use kebab-case.
  - Example: `/pages/AboutUs.vue`, `/pages/about-us/team.vue`
- Dynamic routes should use square brackets: `/pages/users/[id].vue`

## Script Setup
- Always use `<script setup lang="ts">`.
- Import only what's needed. Keep each import section tidy and grouped by:
  1. Vue/Nuxt imports
  2. Third-party libraries
  3. Composables
  4. Store
  5. Types
  6. Styles

## Template
- Use semantic HTML tags where appropriate (`<main>`, `<section>`, `<header>`, etc.).
- Use TailwindCSS and daisyUI classes for styling. Avoid inline styles.
- Use `v-bind` shorthand `:` and `v-on` shorthand `@`.

## Logic
- Extract reusable logic into composables.
- Use `definePageMeta()` for page metadata.
- Use `useRoute()` and `useRouter()` for navigation logic.

## SEO
- Ensure each page has appropriate `head` metadata set via `definePageMeta()`.
- Use `useSeoMeta` from Nuxt when applicable.
