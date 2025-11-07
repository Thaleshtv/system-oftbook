# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server (port defaults to Vite's default, typically 5173)
npm run dev
# or
npm start

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Project Architecture

### Tech Stack
- **Framework**: React 19 + TypeScript + Vite
- **Routing**: TanStack Router (file-based routing with context)
- **State Management**: Zustand (global stores)
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod validation
- **Styling**: Tailwind CSS v4 + SASS
- **HTTP Client**: Axios with interceptors

### Core Architecture Patterns

#### 1. Model-View-Controller Pattern for Pages
Each page follows a strict MVC structure with three files:

- **index.tsx**: Controller that connects model and view
- **model.tsx**: Business logic hook (prefix: `use[PageName]`)
- **view.tsx**: Presentational component

Example structure:
```typescript
// index.tsx
import { usePageName } from './model'
import { PageNameView } from './view'

export const PageName = () => {
  const model = usePageName()
  return <PageNameView {...model} />
}

// model.tsx - contains all business logic, state, and side effects
export const usePageName = () => {
  // React Query mutations, form handling, navigation logic
  return { /* props for view */ }
}

// view.tsx - pure presentation, receives all props from model
export const PageNameView = (props) => {
  // Only UI rendering, no business logic
}
```

#### 2. Global State Management (Zustand)
Located in `src/store/`:

- **userStore.ts**: Authentication state (user, token)
  - Syncs with cookies (`js-cookie`)
  - Token stored in cookies and sent via Axios interceptors
  - Fetches user data from external API on token set

- **loadingStore.ts**: Global loading state
- **toastStore.ts**: Toast notifications state

Stores follow pattern:
```typescript
interface Store {
  state: { /* data */ }
  dispatch: { /* actions */ }
}
```

#### 3. Routing Architecture
- **TanStack Router** with context injection (auth, toast)
- Routes split into:
  - **publicRoutes.tsx**: Login, Register, Password Reset
  - **protectedRoutes.tsx**: Authenticated routes with ACL checks
- Router context typed globally via module declaration

#### 4. Access Control (ACL)
File: `src/routes/acl/index.ts`

- Role-based access control with two roles: `ADMINISTRADOR`, `USUARIO`
- `withProtection()` HOC wraps protected routes
- Checks authentication + role permissions
- Redirects to `/not-found` if unauthorized

#### 5. API Layer
File: `src/services/api.ts`

- Axios instance with base URL from `VITE_BACKEND_URL` env var
- Request interceptor adds token from userStore to headers (except excluded routes: `/register`, `/login`, `/refresh-token`)
- Token format: Direct token string (not `Bearer` prefix)
- Response interceptor for token refresh is commented out (not currently in use)

Service files in `src/services/` follow naming pattern for API resources:
- Each service exports functions for CRUD operations
- Uses the configured Axios instance

### Directory Structure

```
src/
├── assets/          # Static assets (images, etc.)
├── components/
│   ├── ui/          # Reusable UI components (table, modal, chart, etc.)
│   ├── sidebar/     # Navigation sidebar
│   ├── page-component/      # Page wrapper component
│   └── chat-page-component/ # Chat-specific page wrapper
├── pages/           # Page components (MVC structure)
│   ├── Login/
│   ├── Register/
│   ├── Arquivos/
│   └── [PageName]/  # Each with index.tsx, model.tsx, view.tsx
├── routes/          # Routing configuration
│   ├── acl/         # Access control logic
│   ├── router.tsx   # Main router setup
│   ├── publicRoutes.tsx
│   └── protectedRoutes.tsx
├── services/        # API service functions
├── store/           # Zustand global stores
├── types/           # TypeScript type definitions
├── utils/           # Utility functions (accessControl, etc.)
└── styles/          # Global styles (SASS)
```

## Key Implementation Details

### Authentication Flow
1. User logs in via `Auth.loginUser()` service
2. Token stored in cookie and userStore
3. `fetchUserData()` called automatically to fetch user details from external API
4. User role determines ACL permissions
5. Token automatically injected into API requests via Axios interceptor

### Form Validation
- React Hook Form with Zod schemas
- Validation schemas defined in model files
- Type inference: `type Schema = z.infer<typeof schema>`

### Environment Variables
- `VITE_BACKEND_URL`: Backend API base URL (currently: https://ailton-api.altona.com.br/)
- Accessed via `import.meta.env.VITE_[NAME]`

## TypeScript Configuration
- Strict mode enabled
- Bundler module resolution
- React JSX transform
- No emit (Vite handles bundling)
