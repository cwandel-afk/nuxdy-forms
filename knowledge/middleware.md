# Middleware Coding Standards

## File Naming
- Use camelCase: `authRedirect.ts`, `requireAdmin.ts`
- Global middleware should be named clearly: `auth.ts`

## Location
- Place middleware in `middleware/` directory

## Language
- Always use TypeScript

## Types
- Use `defineNuxtRouteMiddleware` for route middleware
- Use `defineEventHandler` for server middleware

## Example (Route Middleware)
```ts
export default defineNuxtRouteMiddleware((to, from) => {
  const user = useAuthStore()
  if (!user.loggedIn) {
    return navigateTo('/login')
  }
})
```

## Best Practices
- Keep middleware focused and minimal
- Chain logic via composables or store access
- Avoid logic that belongs in `pages` or `components`
