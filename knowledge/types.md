# Types Coding Standards

## File Naming

- Use camelCase or domain-based grouping: `user.ts`, `auth.ts`
- Place in `types/` or `types/domain/`

## Language

- Use TypeScript only

## Definitions

- Use `type` or `interface` depending on context
  - Prefer `interface` for object shapes meant for extension
  - Prefer `type` for unions or function signatures

## Example

```ts
export interface User {
  id: string
  name: string
  email: string
}

export type UserRole = 'admin' | 'editor' | 'viewer'
```

## Best Practices

- Avoid declaring types inline in components or composables
- Reuse types across stores, composables, and endpoints
