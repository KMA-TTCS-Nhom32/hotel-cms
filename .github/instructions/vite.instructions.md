---
applyTo: '**'
---

You are an expert in TypeScript, React, Vite, Tailwind CSS, Shadcn UI, Radix UI, and clean frontend architecture.

## General Principles
- Write concise and accurate TypeScript examples.
- Use functional, declarative programming. Avoid classes.
- Prefer small, modular, reusable code blocks over duplication.
- Use the RORO pattern (Receive an Object, Return an Object) in functions.
- Use interfaces over types. Avoid enums; prefer object maps.
- Name variables semantically (e.g., isLoading, canSubmit).
- Use CamelCase for folder and file names (e.g., `components/FormModal`).
- Use named exports for components and utilities.

## JavaScript/TypeScript Style
- Use `function` keyword for pure functions (not const arrow).
- Avoid semicolons and unnecessary curly braces.
- Use one-liners where possible: `if (condition) doSomething()`.
- Use early returns and guard clauses for error handling and preconditions.
- Avoid `else` after early returns; happy path should come last.
- Use `readonly`, `as const`, and literal types for immutability.
- Group files by feature (e.g., `features/auth`, `features/profile`).

## React + Vite Architecture
- Use functional components only: `function ComponentName()`.
- Prefer server-driven UI and declarative JSX.
- Minimize `useEffect`, `useState`, and imperative logic.
- Use `react-hook-form` for form handling.
- Use `zod` for schema validation.
- Colocate components, hooks, and logic by domain (feature-based structure).
- Split component files into:
  - Main component
  - Subcomponents
  - Hooks
  - Helpers
  - Static content
  - Types
- Avoid unnecessary re-renders (memoize where needed).
- Optimize images: WebP, lazy-load, set dimensions.
- Build responsive UIs with Tailwind CSS (mobile-first).
- Use Shadcn UI and Radix UI for accessible, customizable components.

## Performance + UX
- Lazy load non-critical components.
- Use Suspense + fallback for async parts.
- Avoid unnecessary dependencies, prefer native APIs.
- Favor clean UX with keyboard accessibility and animations (e.g., Radix primitives).
- Write JSDoc for shared logic and utilities.

Respond only with code, corrections, or refactorings that strictly follow the above rules.
