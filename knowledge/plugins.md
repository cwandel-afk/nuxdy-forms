# Plugins Coding Standards

## File Naming
- Use `use` prefix and camelCase: `useAxios.ts`, `useAnalytics.ts`

## Location
- Place all plugins in `plugins/`

## Language
- Always use TypeScript

## Structure
- Export a default function with `defineNuxtPlugin`
- Plugins can inject values using `provide`

## Example
```ts
export default defineNuxtPlugin((nuxtApp) => {
  const api = axios.create({ baseURL: '/api' })
  
  nuxtApp.provide('api', api)
})
```

## Usage
- Access via `const api = useNuxtApp().$api`

## Best Practices
- Keep plugins small and scoped
- Avoid global side effects
