# Pinia Stores Coding Standards

## File Naming
- Use `use` prefix and camelCase: `useUserStore.ts`, `useSettingsStore.ts`
- Place in `stores/` directory

## Language
- Always use TypeScript

## Definition
- Use `defineStore` with typed state, getters, and actions

## Example
```ts
export const useUserStore = defineStore('user', {
  state: () => ({
    id: null as string | null,
    name: ''
  }),
  getters: {
    isLoggedIn: (state) => !!state.id
  },
  actions: {
    login(user: { id: string; name: string }) {
      this.id = user.id
      this.name = user.name
    }
  }
})
```

## Best Practices
- Avoid directly accessing `$state` in components; use getters or actions.
- Split stores by domain (auth, user, ui, etc.).
- Persist data with `pinia-plugin-persistedstate` when needed.
