# HAB_Dashboard

## Server setup

1. Create `.env` in `/server`

```env
PORT=3004
```

2. Run server

```bash
cd server
npm install
npm run dev
```

## DB setup

Ensure you have PostgreSQL installed. Then run these 3 commands in PSQL console.

1. Realtime Updates setup

```sql
CREATE OR REPLACE FUNCTION public.notify_realtime_update()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Broadcasts a message to the 'realtime_channel'
  -- The payload is a JSON object with the table name, operation type, and the new row data
  PERFORM pg_notify(
    'realtime_channel',
    json_build_object(
      'table', TG_TABLE_NAME,
      'action', TG_OP,
      'record', row_to_json(NEW)
    )::text
  );

  -- Trigger functions must return NEW for INSERT/UPDATE triggers
  RETURN NEW;
END;
$$;
```

2. Table creation

```sql
-- 1. Create the table
CREATE TABLE public.server_logs (
    id SERIAL PRIMARY KEY,
    "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    level CHARACTER VARYING(10),
    message TEXT,
    method CHARACTER VARYING(10),
    url TEXT,
    status_code INTEGER,
    response_time INTEGER,
    correlation_id UUID,
    ip_address INET,
    user_agent TEXT,
    meta JSONB
);

-- 2. Create the indexes (for faster querying)
CREATE INDEX idx_logs_correlation_id ON public.server_logs USING btree (correlation_id);
CREATE INDEX idx_logs_level ON public.server_logs USING btree (level);
CREATE INDEX idx_logs_timestamp ON public.server_logs USING btree ("timestamp");

-- 3. Create the notification function (matches your Node.js channel)
CREATE OR REPLACE FUNCTION notify_db_updates()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM pg_notify(
    'db_updates',
    json_build_object(
      'table', TG_TABLE_NAME,
      'action', TG_OP,
      'data', row_to_json(NEW)
    )::text
  );

  RETURN NEW;
END;
$$;

-- 4. Attach the trigger to the new table
CREATE TRIGGER trigger_notify_db_updates
AFTER INSERT OR UPDATE ON public.server_logs
FOR EACH ROW
EXECUTE FUNCTION notify_db_updates();
```

3. Fill with dummy data

```sql
INSERT INTO public.server_logs (
  "timestamp",
  level, message, method, url, status_code,
  response_time, correlation_id, ip_address, user_agent, meta
)
SELECT
  NOW() - (random() * INTERVAL '30 days'),

  (ARRAY['INFO','WARN','ERROR'])[floor(random()*3 + 1)],

  (ARRAY[
    'Request completed',
    'User authenticated',
    'Database timeout',
    'Invalid input received',
    'Cache miss',
    'External API failed'
  ])[floor(random()*6 + 1)],

  (ARRAY['GET','POST','PUT','DELETE'])[floor(random()*4 + 1)],

  (ARRAY[
    '/api/users',
    '/api/login',
    '/api/products',
    '/api/orders',
    '/api/profile'
  ])[floor(random()*5 + 1)],

  (ARRAY[200,201,400,401,404,500])[floor(random()*6 + 1)],

  floor(random()*1000 + 50)::int,

  gen_random_uuid(),

  ('192.168.1.' || floor(random()*255))::inet,

  'Mozilla/5.0',

  jsonb_build_object(
    'env', 'dev',
    'version', '1.0.' || floor(random()*10)
  )

FROM generate_series(1, 100);
```

## Client Setup

```bash
cd client
pnpm install
pnpm dev
```

## API Endpoints:

### Metrics

#### Get Metrics

- **GET /api/metrics/:scale**
  - `:scale` can be `1h`, `6h`, `24h`, `7d`, or `30d`.
  - Retrieves system metrics for the specified time scale.

### Logs

#### Get Logs

- **GET /api/logs**
  - Retrieves logs with optional filters.
  - **Query Parameters:**
    - `level`: Filter by log level (e.g., `ERROR`, `INFO`).
    - `method`: Filter by HTTP method (e.g., `GET`, `POST`).
    - `status_code`: Filter by HTTP status code.
    - `endpoint`: Filter by endpoint URL.
    - `id`: Filter by a specific log ID.
    - `startDate` and `endDate`: Filter by date range (Unix ms timestamps).
    - `response_time_min` and `response_time_max`: Filter by response time range (ms).
    - `limit` and `offset`: Pagination parameters.
    - `sort` and `order`: Sorting parameters (e.g., `timestamp`, `response_time`).

#### Get Log by ID

- **GET /api/logs/id/:id**
  - Retrieves a specific log by its ID.

#### Delete All Logs

- **DELETE /api/logs/all**
  - Deletes all logs.

#### Delete Logs by Filter

- **DELETE /api/logs**
  - Deletes logs based on filters.
  - **Query Parameters:** Same as `GET /api/logs`.

## Client File Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                 # redirect / dashboard
│   ├── (dashboard)/             # route group
│   │   ├── layout.tsx           # sidebar layout
│   │   ├── metrics/
│   │   │   ├── page.tsx
│   │   ├── logs/
│   │   │   ├── page.tsx
│   │   ├── api-status/
│   │   │   ├── page.tsx
│
├── components/                  # reusable UI (dumb components)
│   ├── ui/
│   │   ├── card.tsx
│   │   ├── button.tsx
│   │   ├── badge.tsx
│   │   ├── chart.tsx
│   │
│   ├── layout/
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│
│   ├── charts/
│   │   ├── line-chart.tsx
│   │   ├── bar-chart.tsx
│
├── features/
│   ├── metrics/
│   │   ├── components/
│   │   │   ├── cpu-card.tsx
│   │   │   ├── memory-card.tsx
│   │   │   ├── uptime-card.tsx
│   │   │   ├── network-card.tsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useMetrics.ts
│   │   │
│   │   ├── services/
│   │   │   ├── metrics.service.ts
│   │
│   ├── logs/
│   │   ├── components/
│   │   │   ├── logs-table.tsx
│   │   │   ├── logs-filters.tsx
│   │   │   ├── logs-row.tsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useLogs.ts
│   │   │
│   │   ├── services/
│   │   │   ├── logs.service.ts
│   │
│   ├── api-status/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│
├── lib/
│   ├── api.ts                   # fetch wrapper
│   ├── socket.ts                # socket.io client
│   ├── utils.ts
│
├── store/                       # global state (optional)
│   ├── useDashboardStore.ts     # Zustand / Redux
│
├── types/
│   ├── logs.ts
│   ├── metrics.ts
│
├── constants/
│   ├── routes.ts
│   ├── config.ts
```

## Project Structure

### `app/`

Contains all pages and routing (Next.js App Router).

- `page.tsx` → redirects to dashboard
- `(dashboard)/` → route group for all dashboard-related pages

**Examples:**

- `metrics/page.tsx` → metrics page
- `logs/page.tsx` → logs page

---

### `components/`

Global reusable UI components. These are dumb/presentational components used across the app.

**Examples:**

- Buttons
- Cards
- Charts
- Layout components (sidebar, header)

---

### `features/`

Core of the application logic. Each feature (metrics, logs, etc.) is self-contained.

#### `features/metrics/`

| Folder        | Purpose                                                                                               |
| ------------- | ----------------------------------------------------------------------------------------------------- |
| `components/` | UI specific to the metrics page (e.g. `CPUUsage`, `MemoryUsage`, `Uptime`) — one component per metric |
| `services/`   | API calls (e.g. `metrics.service.ts`)                                                                 |
| `hooks/`      | React hooks for state and logic (e.g. `useMetrics.ts` — handles fetching, loading, and error state)   |

#### `features/logs/`

Same structure as `metrics/`:

| Folder        | Purpose                             |
| ------------- | ----------------------------------- |
| `components/` | Logs UI (table, filters, rows)      |
| `services/`   | API calls (e.g. `logs.service.ts`)  |
| `hooks/`      | State and logic (e.g. `useLogs.ts`) |

---

### `lib/`

Shared utilities and integrations.

| File        | Purpose                               |
| ----------- | ------------------------------------- |
| `api.ts`    | Wrapper around `fetch`                |
| `socket.ts` | Socket.IO client for realtime updates |
| `utils.ts`  | Helper functions                      |
