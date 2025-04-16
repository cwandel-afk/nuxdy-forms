# Components Coding Standards

## File Structure
- Use PascalCase file and directory names.
- Organize components by domain or function.
- Base or shared components should live in `components/base/`.

## Script Setup
- Always use `<script setup lang="ts">`
- Use `defineProps` and `defineEmits` with types

## Style
- Use TailwindCSS and daisyUI utilities for styling.
- Scoped styles are discouraged in favor of utility classes.

## Props and Emits
- All props must be typed.
- Emits should be explicitly defined and typed.

## Examples
```vue
<script setup lang="ts">
const props = defineProps<{ label: string; disabled?: boolean }>()
const emit = defineEmits<{'click': []}>()
</script>

<template>
  <button class="btn" :disabled="props.disabled" @click="emit('click')">
    {{ props.label }}
  </button>
</template>
```

## Reusability
- Components should be small and reusable.
- Abstract repetitive UI patterns.
