# Contributing

Thanks for your interest! Issues and pull requests are welcome.

## Setup

```bash
pnpm install
pnpm dev        # demo mode, no configuration needed
```

## Before opening a pull request

```bash
pnpm typecheck
pnpm lint
pnpm format
pnpm build
```

CI runs the same checks.

## Guidelines

- Feature code lives in `src/features/<feature>/`; route files in `src/app/` stay thin.
- Talk to the backend only through `useApi()` and the `ApiClient` interface. If you
  add an endpoint, add it to the interface, both implementations (`http-client.ts`
  and `mock/mock-client.ts`) and `docs/API.md`.
- Use `queryKeys` from `src/lib/query-keys.ts` for every React Query key.
- Don't import Clerk outside `src/lib/auth/`; use `useSession()`.
- User-facing product names, emails and links come from `src/config/brand.ts` and
  `src/config/env.ts` so the app stays white-label.
- Keep pull requests focused, and describe what changed and how you tested it.
