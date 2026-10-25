---
name: frontend-architecture-standards
description: Enforces professional, scalable React frontend architecture with feature-based modularity, reusable components, Redux Toolkit, centralized Axios, Tailwind CSS, custom hooks, performance optimization, and maintainable code. Use when creating, reviewing, refactoring, or extending React frontend projects.
---

# Frontend Architecture Standards

## 1. Mission

Build production-quality React applications with strong architecture, clear separation of concerns, reusable components, predictable state management, consistent styling, and maintainable code.

These standards apply to new projects, existing projects, feature development, code reviews, and refactoring.

The primary goals are:

- Maintainability and scalability.
- Strict separation of responsibilities.
- Independent, clearly organized feature modules.
- Reusable UI and business logic.
- Centralized API communication.
- Predictable global state management.
- Consistent styling and design tokens.
- Accessible, responsive user interfaces.
- Reliable loading, error, empty, and success states.
- Minimal unnecessary complexity.

Do not sacrifice readability or project stability to follow a pattern mechanically.

## 2. Mandatory Workflow Before Coding

Before making changes:

1. Inspect the existing project structure.
2. Read `package.json` and the available lockfile.
3. Identify the framework, React version, TypeScript configuration, router, state-management library, API client, styling system, testing tools, and existing conventions.
4. Inspect relevant existing features, components, hooks, API modules, Redux slices, and tests.
5. Identify the project's Tailwind CSS version and use configuration compatible with that version.
6. Check existing dependencies before installing anything.
7. Determine the smallest architectural changes needed for the requested task.
8. Present or document a concise implementation plan for substantial changes.

Never replace the existing architecture blindly.

Never migrate the framework, replace a working library, or rewrite unrelated modules without a clear requirement.

For existing projects, preserve working conventions when they are reasonable and consistent with these standards.

## 3. Architecture Principles

Use feature-based modular architecture with clear ownership.

Every module should have a defined responsibility and an explicit public interface where practical.

Rules:

- Keep UI rendering separate from API communication and business logic.
- Keep shared components independent of specific business features.
- Keep feature-specific components inside their owning feature.
- Avoid circular imports and hidden dependencies.
- Avoid importing another feature's internal files directly when a public interface can be used.
- Keep global state limited to data that genuinely needs global access.
- Avoid giant components, giant utility files, and giant Redux slices.
- Avoid unnecessary abstraction, excessive folders, and one-file-per-function rules.
- Prefer composition over complicated inheritance or deeply nested conditional rendering.
- Keep business rules testable and independent of presentation when practical.

## 4. Recommended Project Structure

Adapt the structure to the actual framework and project size. Do not create empty directories without a purpose.

For a medium-to-large React + TypeScript application:

src/
  app/
    providers/
    router/
    store/
    config/
    styles/
    App.tsx
    main.tsx

  components/
    ui/
    layout/
    feedback/
    forms/

  features/
    auth/
      api/
      components/
      hooks/
      pages/
      schemas/
      store/
      types/
      utils/
      index.ts

    products/
      api/
      components/
      hooks/
      pages/
      schemas/
      store/
      types/
      utils/
      index.ts

    orders/
      api/
      components/
      hooks/
      pages/
      schemas/
      store/
      types/
      utils/
      index.ts

  hooks/
  lib/
    api/
      axiosInstance.ts
      interceptors.ts
    utils/
  services/
  types/
  test/

Important:

- `features/` contains business modules.
- `components/ui/` contains generic, reusable interface primitives.
- `components/layout/` contains application layouts and navigation structures.
- `components/feedback/` contains shared loaders, alerts, empty states, and error displays.
- `hooks/` contains genuinely shared hooks.
- Feature-specific hooks belong inside their feature.
- `app/store/` contains Redux store configuration and root-level state setup.
- `lib/api/` contains the shared HTTP client.
- `types/` contains genuinely shared types, not every feature's private types.

Use framework-specific conventions when required. Next.js projects must respect their App Router or Pages Router conventions, including Server and Client Component boundaries.

## 5. Module Boundaries

Each feature should own its implementation details.

For example, the products feature owns its product pages, product-specific hooks, product API functions, product state, and product types.

A feature may expose a public interface through `index.ts`:

export { ProductCard } from "./components/ProductCard";
export { useProducts } from "./hooks/useProducts";
export type { Product } from "./types/product";

Rules:

- Export only what other modules actually need.
- Avoid importing another feature's private components or internal state.
- Move shared functionality into a common layer only when it is genuinely reusable.
- Do not create dependency cycles between features.
- Keep API response types and business entities explicit.
- Avoid generic shared abstractions that couple unrelated features.

Do not create a public barrel export for every directory automatically. Avoid barrel patterns that cause circular imports or problematic bundling.

## 6. Reusable Component Standards

Build small, focused components with clear responsibilities.

Before creating a component, check whether an equivalent shared component already exists.

Create reusable components for repeated patterns such as:

- Buttons, inputs, selects, checkboxes, and dialogs.
- Cards, badges, dropdowns, and tooltips.
- Tables, pagination, and filtering controls.
- Page headers, breadcrumbs, and section headings.
- Loading skeletons, empty states, and error messages.
- Form fields and validation messages.

Component rules:

1. One component should have one clear primary responsibility.
2. Keep presentation components separate from feature orchestration where practical.
3. Use props for configurable behavior and content.
4. Prefer composition and `children` over huge components with many unrelated flags.
5. Avoid components with excessive conditional branches.
6. Extract repeated JSX into reusable components when it improves consistency or readability.
7. Keep business-specific components inside their feature unless other features genuinely need them.
8. Avoid prop drilling across many levels; consider composition, context, or Redux when justified.
9. Use controlled form inputs when their behavior requires controlled state.
10. Provide accessible labels, keyboard behavior, and semantic HTML.

Do not create abstractions for one-off markup unless complexity, testing, or future reuse justifies them.

## 7. Axios Instance and API Layer

Create and reuse one configured Axios instance.

Recommended location:

src/lib/api/axiosInstance.ts

Example:

import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
  },
});

Adapt environment variable syntax to the framework. Never expose private server secrets in frontend environment variables.

API rules:

- All HTTP requests should use the shared Axios instance unless a documented exception is necessary.
- Never repeat the base URL, default headers, or common request configuration across features.
- Keep endpoint functions inside their owning feature's `api/` directory.
- Keep API functions responsible for HTTP communication, not rendering.
- Use explicit request and response types where practical.
- Normalize errors consistently without hiding useful backend error information.
- Use request and response interceptors only for genuine cross-cutting behavior.
- Handle authentication expiration, unauthorized responses, and network failures centrally where appropriate.
- Avoid duplicating refresh-token logic across components or interceptors.
- Prevent infinite refresh loops and handle concurrent refresh requests safely.
- Never log passwords, access tokens, refresh tokens, or sensitive personal data.
- Do not hardcode credentials or secret keys.
- Avoid direct Axios calls inside UI components.
- Avoid calling endpoints directly from JSX.
- Do not create multiple Axios instances without a clear reason.

Example feature API:

import { axiosInstance } from "@/lib/api/axiosInstance";
import type { Product } from "../types/product";

export async function getProducts(): Promise<Product[]> {
  const response = await axiosInstance.get<Product[]>("/products");
  return response.data;
}

Keep endpoint paths in feature API functions or a feature-specific endpoint definition when that improves maintainability. Avoid a giant global API file containing every endpoint.

## 8. Redux Toolkit and State Management

Use Redux Toolkit for global client state and application state that needs predictable sharing.

Recommended organization:

src/app/store/
  store.ts
  hooks.ts
  rootReducer.ts

Feature state:

src/features/auth/store/
src/features/products/store/
src/features/cart/store/

Use:

- `configureStore` for store creation.
- `createSlice` for synchronous state transitions.
- `createAsyncThunk` when it fits the project's asynchronous workflow.
- Typed `RootState`, `AppDispatch`, `useAppDispatch`, and `useAppSelector`.
- Selectors for derived state and reusable state access.
- Normalized state for complex collections when beneficial.

State ownership rules:

- Global authentication state belongs to the authentication feature.
- Shared cart state belongs to the cart feature.
- Shared product state belongs to the products feature when Redux is the chosen owner.
- Local UI state belongs in React state unless there is a real need to share it.
- Form input state should not be copied into Redux without a clear reason.
- Do not duplicate server data across Redux and a separate server-state cache unnecessarily.
- If Redux Toolkit Query or another server-state library is already adopted, use it consistently instead of building a competing caching system.
- Do not store derived values when they can be calculated from existing state.
- Avoid mutating Redux state outside supported Redux Toolkit reducers.
- Keep reducers deterministic and free of network requests.
- Handle loading, success, empty, and failure states explicitly.
- Avoid giant slices that combine unrelated business modules.
- Avoid dispatching redundant actions that cause unnecessary updates.

Choose one primary owner for each piece of state. Do not automatically add Redux, Context, and a query cache to manage the same data.

## 9. Tailwind CSS and Design System

Use Tailwind CSS consistently and maintain a centralized design system.

Before changing styling configuration, identify the installed Tailwind version.

For Tailwind CSS v3:

- Maintain the appropriate `tailwind.config.js` or `tailwind.config.ts`.
- Configure the correct content paths.
- Extend the theme with reusable colors, spacing, typography, breakpoints, and other required tokens.
- Keep global CSS minimal.

For Tailwind CSS v4:

- Follow the installed version's CSS-first configuration conventions.
- Use `@theme` and the supported configuration approach where appropriate.
- Do not blindly introduce a v3 configuration into a v4 project.

Styling rules:

- Use consistent design tokens instead of arbitrary values repeated everywhere.
- Reuse typography, color, spacing, radius, and shadow conventions.
- Build mobile-first responsive layouts.
- Use semantic HTML and accessible focus states.
- Support clear hover, active, disabled, loading, error, and success states.
- Use consistent form controls, buttons, tables, and cards.
- Keep component-specific styles close to the component where practical.
- Avoid oversized global CSS files.
- Avoid unnecessary inline styles.
- Avoid excessive arbitrary Tailwind values and repeated long class strings.
- Use a shared class utility such as `cn()` only when it provides real value.
- Use variants or a consistent component API for repeated style differences.
- Never dynamically construct Tailwind class names in ways the build scanner cannot detect; use complete class strings or explicit mappings.

Do not add another styling framework unless the project requires it.

## 10. Custom Hooks

Extract reusable stateful logic into custom hooks.

Examples:

- `useAuth`
- `useDebounce`
- `usePagination`
- `useOutsideClick`
- `useMediaQuery`
- `useProducts`
- `usePermissions`

Rules:

- Custom hook names must start with `use`.
- Follow the Rules of Hooks.
- Keep feature-specific hooks within their feature.
- Put genuinely shared hooks in `src/hooks/`.
- Keep hooks focused on one coherent responsibility.
- Do not put unrelated business logic into a generic hook.
- Avoid hooks that merely wrap a single line without improving abstraction or consistency.
- Keep rendering logic in components and reusable behavior in hooks where appropriate.
- Handle effect cleanup and stale asynchronous results where necessary.
- Avoid infinite effect loops and unnecessary dependencies.
- Do not use effects for values that can be calculated during rendering.
- Avoid using effects to synchronize duplicate copies of the same state.

## 11. React Performance and Memoization

Use `React.memo`, `useMemo`, and `useCallback` intentionally.

### React.memo

Use it when a component renders frequently and skipping a render is beneficial when its props have not changed.

Do not wrap every component automatically.

### useMemo

Use it for expensive calculations or stable derived values when there is a measurable or meaningful benefit.

Do not memoize simple calculations unnecessarily.

### useCallback

Use it when stable function identity matters, such as when passing callbacks to memoized children or satisfying a genuine dependency requirement.

Do not wrap every event handler automatically.

### General rules

- Prefer correct state ownership and component boundaries before memoization.
- Avoid unnecessary state updates and broad subscriptions.
- Use stable and unique React keys.
- Avoid recreating large derived data structures unnecessarily.
- Use selectors carefully to prevent unrelated Redux updates.
- Avoid premature optimization.
- Measure or identify a concrete rendering problem before adding complex optimization.
- Never use memoization to hide incorrect state logic or effect dependencies.

## 12. TypeScript and Code Quality

For TypeScript projects:

- Avoid `any` unless there is a documented and justified exception.
- Prefer explicit domain types and interfaces.
- Type component props, API responses, Redux state, and custom hooks.
- Use discriminated unions for complex states when appropriate.
- Avoid unsafe type assertions that hide real errors.
- Reuse shared types only when the underlying concept is truly shared.
- Keep nullable and optional values explicit.
- Use strict compiler settings when practical and compatible with the project.

General code quality:

- Use consistent naming conventions.
- Keep functions small enough to understand.
- Avoid deeply nested conditionals.
- Extract complex conditions into clearly named variables or functions.
- Remove dead code and unused imports.
- Avoid magic strings and numbers when meaningful constants improve clarity.
- Keep comments focused on why something is necessary, not on restating obvious code.
- Never suppress lint or TypeScript errors just to make the build pass.

## 13. Forms and Validation

- Reuse consistent form components.
- Validate user input before submission.
- Reuse the project's existing validation library.
- If the project already uses React Hook Form and Zod, follow those conventions.
- Keep schemas close to their owning feature.
- Display understandable validation errors.
- Prevent duplicate submissions where appropriate.
- Show loading and server-error states.
- Never rely only on frontend validation for security.

Do not add a new form library without first checking the existing project.

## 14. Routing and Page Composition

- Keep route definitions organized and easy to understand.
- Separate route configuration from complex page implementation where practical.
- Use layouts for repeated page structure.
- Apply authentication and authorization guards consistently.
- Avoid placing all route logic inside a single giant component.
- Use lazy loading for substantial route-level features when beneficial.
- Keep route-specific components in the owning feature.
- Use a consistent strategy for not-found pages, access-denied pages, and error boundaries.
- Do not confuse hiding a UI element with enforcing authorization.

A typical page should compose smaller components rather than implement every visual section and business operation inline.

## 15. Security and Permissions

- Never treat frontend permissions as the security boundary.
- Enforce authorization on the backend.
- Keep tokens and sensitive data out of logs and URLs.
- Use the project's established secure authentication approach.
- Do not introduce insecure token persistence patterns without evaluating the application's threat model.
- Validate API responses and handle unauthorized access safely.
- Avoid rendering untrusted HTML.
- Do not expose environment secrets in client-side bundles.

## 16. Testing and Reliability

For meaningful features, add tests using the project's existing testing tools.

Prioritize:

- API function behavior and error handling.
- Reducers, selectors, and important state transitions.
- Custom hooks containing nontrivial logic.
- Form validation.
- Critical user journeys.
- Permission-dependent behavior.
- Important loading, empty, and failure states.

After implementation:

1. Run the relevant tests.
2. Run linting when available.
3. Run TypeScript checks when available.
4. Run the production build when practical.
5. Review the changed files for duplicated logic, circular dependencies, incorrect imports, and unnecessary complexity.
6. Fix issues caused by the changes.
7. Report any checks that could not be run.

Never claim tests or builds passed unless they actually ran successfully.

## 17. Implementation Process for Every Feature

Follow this sequence:

1. Understand the requirement and existing feature boundaries.
2. Identify the data flow and state ownership.
3. Define types and validation schemas where needed.
4. Implement or reuse the feature API functions.
5. Integrate with Redux Toolkit or the project's existing server-state solution when justified.
6. Create or reuse custom hooks.
7. Build small reusable UI components.
8. Compose the page from those components.
9. Apply Tailwind design tokens and responsive states.
10. Handle loading, empty, success, validation, and error states.
11. Add appropriate tests.
12. Run available checks and review the implementation.

Do not create unnecessary files just to satisfy this sequence. Combine closely related responsibilities when the result remains clear and maintainable.

## 18. Existing Project Refactoring

When improving existing code:

- Understand the current behavior before editing.
- Preserve public interfaces and existing user journeys unless a change is requested.
- Refactor incrementally.
- Avoid changing unrelated files.
- Do not duplicate an existing shared component or API utility.
- Do not migrate state management or styling libraries without a strong reason.
- Add or update tests for behavior that could regress.
- Keep changes small enough to review and debug.
- Explain significant structural changes.

## 19. Definition of Done

A feature is complete when:

- Its code lives in the correct module.
- Components have clear responsibilities.
- Shared UI is reused where appropriate.
- API calls follow the project's centralized API conventions.
- State has a clear owner.
- Redux is used appropriately when global client state is needed.
- Styling follows the established Tailwind design system.
- Custom hooks are used where they meaningfully improve separation.
- Memoization is justified rather than automatic.
- Responsive and accessible behavior is considered.
- Loading, empty, error, and success states are handled where applicable.
- Types and validation are appropriate.
- Relevant checks have been run, with limitations disclosed.
- No unnecessary dependencies, duplicated logic, or unrelated changes remain.

## 20. Final Agent Response

After completing work, provide a concise implementation summary containing:

- Features and files changed.
- Architectural decisions and module boundaries.
- Shared components and hooks created or reused.
- API and Redux integration details.
- Performance decisions when relevant.
- Tests, linting, type checks, and build results.
- Any remaining issues, assumptions, or required environment variables.

Always prioritize correctness, clarity, maintainability, and consistency over unnecessary abstraction or excessive code generation.