# Development Rules

## General Rules

- TypeScript strict mode enabled
- Avoid any type
- Prefer composition over inheritance
- Keep components small

---

## Component Rules

Maximum file size:

300 lines

If larger:

Split component

---

## Naming

Components:

PascalCase

Example:

FlashcardList.tsx

Hooks:

useSomething.ts

Example:

useDecks.ts

Utilities:

camelCase

---

## Next.js Rules

- Next.js 16 App Router only
- Server Components by default
- Add `"use client"` only when interactivity or browser APIs are required
- Functional components only
- No class components
- Prefer Server Actions and route handlers for mutations when appropriate
- Keep data fetching on the server when possible
- Memoize expensive calculations in Client Components only when needed

---

## State Rules

Global state only when necessary.

Prefer:

Local State

Then:

Zustand (Client Components)

Then:

Server State (TanStack Query / server data)

---

## API Rules

Never call API directly in Client Components.

Use:

services/

or

TanStack Query hooks

or

Server Actions / Route Handlers

---

## Styling Rules

Use Tailwind only.

Avoid custom CSS when possible.

---

## Accessibility

All buttons:

aria-label

All forms:

label element

All dialogs:

keyboard accessible

---

## Error Handling

Every API request:

- Loading state
- Error state
- Retry support

---

## Testing

Critical business logic must be tested.

Minimum:

70% coverage

---

## Git Rules

Branch Naming:

feature/

bugfix/

refactor/

---

## Commit Convention

feat:

fix:

refactor:

docs:

test:

chore:

---

## Security

Never store sensitive data in localStorage.

Use secure HTTP-only cookies if backend supports them.
