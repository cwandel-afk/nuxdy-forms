# API Endpoints Coding Standards

## File Naming
- Use lowercase and kebab-case for filenames.
- Use RESTful conventions.
- Dynamic params should use brackets: `id.ts`

Example:
```
/server/api/users/index.get.ts
/server/api/users/[id].get.ts
/server/api/users/index.post.ts
```

## Language
- Always use TypeScript.

## Structure
- Export default a defined handler.
- Validate input using `zod` or similar.
- Return JSON responses using `$fetch` pattern.

## Example
```ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing ID' })
  }

  const user = await getUserById(id)
  return { user }
})
```

## Error Handling
- Use `createError` for consistent error responses.
- Include `statusCode` and `statusMessage`.

## Separation of Concerns
- Keep business logic in composables or services.
- Handlers should only handle parsing and routing logic.
