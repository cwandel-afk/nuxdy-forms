# Layouts Coding Standards

## File Naming
- Use PascalCase for file names: `Default.vue`, `Dashboard.vue`
- Layouts should reflect the purpose of the section: `Auth.vue`, `Admin.vue`

## Script
- Use `<script setup lang="ts">`
- Use `defineSlots()` if passing slots

## Template
- Layouts should include a `<NuxtPage />` component to render the nested page content.
- Include navigation, header, and footer if applicable.

## Styling
- Use TailwindCSS and daisyUI for styling.
- Avoid page-specific styles in layouts.

## Example
```vue
<template>
  <main class="min-h-screen">
    <Navbar />
    <div class="container mx-auto">
      <NuxtPage />
    </div>
    <Footer />
  </main>
</template>

<script setup lang="ts">
// Optional layout-specific logic here
</script>
```
