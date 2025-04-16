# Composables Coding Standards

## File Naming
- Use `use` prefix and camelCase: `useUserProfile.ts`, `useFetchData.ts`
- Organize by feature/domain if necessary (e.g., `composables/user/useUserProfile.ts`)

## Script
- Always use TypeScript.
- Use `export function` or `export const` (no default exports).
- Use VueUse and Nuxt composables where available before writing custom ones.

## Structure
```ts
export function useExample() {
  const state = ref<string>('')

  function update(value: string) {
    state.value = value
  }

  return { state, update }
}
```

## Usage
- Only handle logic inside composables, avoid any template-related concerns.
- Do not import components inside composables.
