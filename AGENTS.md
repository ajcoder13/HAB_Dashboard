# AGENTS.md - HAB Dashboard Development Guide

## Project Overview

This is a monorepo with two main packages:
- **client/**: Next.js 16 + React 19 dashboard (TypeScript, Tailwind CSS v4)
- **server/**: Express.js backend (TypeScript, PostgreSQL)

---

## Build/Lint/Test Commands

### Client (Next.js)

```bash
cd client
pnpm install          # Install dependencies
pnpm dev              # Start dev server at http://localhost:3005
pnpm build            # Production build
pnpm start            # Start production server
```

### Server (Express)

```bash
cd server
npm install           # Install dependencies
npm run dev           # Start dev server with tsx watch (port 3004)
npm run build         # Compile TypeScript to dist/
npm start             # Start compiled server from dist/
```

### Running a Single Test

No test framework is currently configured. When adding tests, use:
- **Vitest** for both client and server (recommended for TypeScript projects)
- Run single test: `vitest run src/specific.test.ts` or `vitest run --reporter=verbose src/path`

### Type Checking

```bash
# Client
cd client && npx tsc --noEmit

# Server
cd server && npx tsc --noEmit
```

### Linting

No ESLint/Prettier config is currently set up. When adding:
- Use ESLint with TypeScript support
- Use Prettier with default settings (2-space indent, single quotes)

---

## Code Style Guidelines

### TypeScript Configuration

**Client (client/tsconfig.json)**
- Strict mode enabled
- Path aliases: `@/*` maps to `./src/*`
- React JSX: `react-jsx`

**Server (server/tsconfig.json)**
- Strict mode enabled
- `verbatimModuleSyntax: true` (use `import type` for type-only imports)
- `noUncheckedIndexedAccess: true`
- `exactOptionalPropertyTypes: true`

### Imports

**Client conventions:**
```typescript
import { useState } from "react";
import { Log } from "@/types/logs.types";
import { ChevronRight, Plus } from "lucide-react";
import { LogsService } from "../services/logs.service";
```

**Server conventions:**
```typescript
import { type Request, type Response } from "express";
import pool from "../../lib/db.js";  // Note: .js extension required for ESM
import { buildPostgresQuery } from "./logs.utils.js";
```

### Naming Conventions

| Pattern | Convention | Example |
|---------|------------|---------|
| Files | kebab-case | `logs-table.tsx`, `metrics-store.ts` |
| Components | PascalCase | `LogsTable`, `MetricsCard` |
| Hooks | camelCase with `use` prefix | `useLogs`, `useMetrics` |
| Services | PascalCase suffix | `LogsService`, `MetricsService` |
| Types/Interfaces | PascalCase | `GetLogsParams`, `Log`, `TimeScale` |
| Functions | camelCase | `getLogs`, `buildPostgresQuery` |
| Constants | SCREAMING_SNAKE_CASE | `DEFAULT_LIMIT`, `DEFAULT_SELECTED` |
| CSS classes | kebab-case | `.table-cell`, `.btn-icon` |
| CSS variables | kebab-case | `--color-primary`, `--shadow-ambient` |

### Type Definitions

**Use TypeScript types over inline types:**
```typescript
// Good
export type GetLogsParams = {
  startDate?: number;
  endDate?: number;
  level?: string;
};

// Avoid inline types in component props when reused
interface LogsTableProps {
  logs: Log[];
  loading: boolean;
}
```

**Use `type` for simple type aliases, `interface` for complex shapes:**
```typescript
type TimeScale = "1h" | "6h" | "24h" | "7d" | "30d";

interface LogVolumeDataPoint {
  timestamp: number;
  counts: Record<string, number>;
}
```

### Error Handling

**Client (API calls in services/hooks):**
```typescript
const fetchLogs = async (f: GetLogsParams) => {
  setLoading(true);
  setError(null);
  try {
    const res = await LogsService.getLogs(f);
    setData(res.data);
  } catch (err) {
    console.error(err);
    setError("Failed to fetch logs");
  } finally {
    setLoading(false);
  }
};
```

**Server (Express routes):**
```typescript
try {
  const result = await pool.query(query, values);
  res.json({ message: "Logs fetched successfully", data: result.rows });
} catch (error) {
  console.error("Error fetching logs:", error);
  res.status(500).json({ error: "Internal Server Error" });
}
```

### Component Structure

**Prefer sub-components over inline helpers:**
```typescript
// ─────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────
function LevelBadge({ level }: { level: string }) {
  // Component implementation
}

function StatusBadge({ code }: { code: number }) {
  // Component implementation
}

// ─────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────
export function LogsTable(props: LogsTableProps) {
  // Main implementation
}
```

### CSS/Styling

**Use CSS variables from globals.css:**
```typescript
style={{
  background: "var(--color-surface-container)",
  color: "var(--color-primary)",
  fontSize: "0.875rem",
}}
```

**Available utility classes:**
- Surfaces: `.surface-base`, `.surface-card`, `.card`
- Buttons: `.btn-primary`, `.btn-secondary`, `.btn-icon`
- Tables: `.table-header-cell`, `.table-cell`, `.table-row`
- Typography: `.page-title`, `.label`, `.label-sm`, `.metric`
- Input: `.input-search`
- Chips: `.chip`, `.chip-default`, `.chip-active`

### File Organization

**Client feature structure:**
```
features/
├── feature-name/
│   ├── components/
│   │   └── ComponentName.tsx
│   ├── hooks/
│   │   └── useFeature.ts
│   └── services/
│       └── feature.service.ts
```

**Server module structure:**
```
modules/
├── module-name/
│   ├── module.controller.ts
│   ├── module.routes.ts
│   ├── module.service.ts   (optional)
│   ├── module.store.ts     (optional)
│   ├── module.utils.ts     (optional)
│   └── module.types.ts     (optional)
```

### React Patterns

**Client components:**
- Use `"use client"` directive for interactive components
- Use Next.js App Router conventions for pages
- Route groups: `(dashboard)/` for shared layout
- Path aliases: `@/features/...`, `@/components/...`, `@/lib/...`, `@/types/...`

**Hooks pattern:**
```typescript
export function useLogs(initialFilters: GetLogsParams = {}) {
  const [filters, setFiltersState] = useState<GetLogsParams>({...});
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ... implementation

  return {
    data, loading, error,
    filters, setFilters: updateFilters,
    hasMore, nextPage, prevPage,
  };
}
```

### API Patterns

**Server response format:**
```typescript
res.json({ message: "Success message", data: result });
```

**Client API wrapper (lib/api.ts):**
```typescript
export async function apiFetch(path, options = {}, params) {
  const res = await fetch(`${BASE_URL}${path}${buildQuery(params)}`, {...});
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}
```

---

## Environment Variables

**Server (.env in server/):**
```
PORT=3004
DB_USER=...
DB_HOST=...
DB_NAME=...
DB_PASSWORD=...
DB_PORT=5432
```

**Client (.env.local in client/):**
```
NEXT_PUBLIC_API_URL=http://localhost:3004/api
```

---

## Common Tasks

### Adding a new feature module (server)

1. Create `modules/new-feature/new-feature.types.ts`
2. Create `modules/new-feature/new-feature.controller.ts`
3. Create `modules/new-feature/new-feature.routes.ts`
4. Add route to `modules/moduleRouter.ts`

### Adding a new page (client)

1. Create `app/(dashboard)/new-page/page.tsx`
2. Create `features/new-feature/hooks/useNewFeature.ts`
3. Create `features/new-feature/services/new-feature.service.ts`
4. Create `features/new-feature/components/NewFeature*.tsx`

### Adding types

- Shared types: `client/src/types/` or `server/src/modules/feature/feature.types.ts`
- API request/response types belong near the service/controller that uses them
