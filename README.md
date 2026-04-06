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

Ensure you have PostgreSQL installed and running. The database schema will be automatically initialized when the server starts for the first time.

**Required environment variables in `server/.env`:**
```env
DB_USER=your_postgres_user
DB_HOST=localhost
DB_NAME=hab_dashboard
DB_PASSWORD=your_postgres_password
DB_PORT=5432
PORT=3004
```

**Tables created automatically on server startup:**
- `system_metrics` - Stores system performance metrics (CPU, memory, disk, network, PM2 processes)
- Index on `system_metrics(measured_at DESC)` for efficient time-range queries

The initialization script runs once when the server starts and will recreate the `system_metrics` table with the correct schema.

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

---

## Testing

### 1. Test Database Connection

Verify that PostgreSQL is running and the connection is working:

```bash
cd server
npm run dev
```

Look for this output in the console:
```
Successfully connected to the PostgreSQL database
Metrics table initialized successfully.
PostgreSQL LISTEN client connected
Server running on http://localhost:3004
```

### 2. Test Metrics Collection

Once the server is running, metrics should be collected automatically every 30 seconds:

```bash
# Check for metrics collection logs
npm run dev
```

Look for output like:
```
Metrics collected and saved to DB
```

### 3. Test API Endpoints (using curl or Postman)

#### Test Metrics API

```bash
# Get metrics for the last 1 hour
curl http://localhost:3004/api/metrics/1h

# Get metrics for the last 24 hours
curl http://localhost:3004/api/metrics/24h

# Get metrics for the last 7 days
curl http://localhost:3004/api/metrics/7d

# Get metrics for the last 30 days
curl http://localhost:3004/api/metrics/30d
```

#### Test Logs API

```bash
# Get all logs
curl http://localhost:3004/api/logs

# Get logs with filters
curl "http://localhost:3004/api/logs?level=ERROR&limit=10"

# Get a specific log by ID (replace :id with an actual log ID)
curl http://localhost:3004/api/logs/id/:id
```

### 4. Test Database Schema

Connect to PostgreSQL and verify the table was created:

```bash
# Access PostgreSQL
psql -h localhost -U <DB_USER> -d hab_dashboard

# Check if system_metrics table exists
\dt system_metrics

# View table structure
\d system_metrics

# Count metrics records
SELECT COUNT(*) FROM system_metrics;

# View recent metrics (last 5 records)
SELECT id, measured_at, cpu_usage, memory_used FROM system_metrics ORDER BY measured_at DESC LIMIT 5;
```

### 5. Test Client Application

Ensure both server and client are running:

```bash
# Terminal 1: Start server
cd server
npm run dev

# Terminal 2: Start client
cd client
pnpm dev
```

Open your browser and navigate to:
- Dashboard: http://localhost:3005
- Metrics page: http://localhost:3005/metrics
- Logs page: http://localhost:3005/logs

### 6. Test Real-time Updates

1. Open http://localhost:3005 in your browser
2. Watch the metrics dashboard update in real-time
3. Metrics should refresh automatically as new data is collected

### 7. Test UI Responsiveness

- Resize your browser window
- Verify that the dashboard layout is responsive on different screen sizes
- Check mobile view (use browser DevTools - F12 → toggle device toolbar)

### 8. Type Checking (Without Running)

Verify TypeScript configuration is correct:

```bash
# Check client types
cd client && npx tsc --noEmit

# Check server types
cd server && npx tsc --noEmit
```

### 9. Integration Test Checklist

- [ ] Server starts without errors
- [ ] Database connection is established
- [ ] `system_metrics` table is created
- [ ] Metrics are collected every 30 seconds
- [ ] `/api/metrics/:scale` returns data
- [ ] `/api/logs` endpoint responds
- [ ] Client starts on http://localhost:3005
- [ ] Metrics dashboard displays data
- [ ] Logs page loads and displays logs
- [ ] Real-time updates work (data updates without page refresh)
- [ ] Responsive design works on mobile/tablet/desktop

---

## Troubleshooting

### "relation \"system_metrics\" does not exist"

**Problem:** The server fails to collect metrics with error: `relation "system_metrics" does not exist`

**Solution:** The metrics table is automatically created when the server starts. If this error occurs:
1. Ensure PostgreSQL is running
2. Verify environment variables in `server/.env` are correct (DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, DB_PORT)
3. Restart the server: `npm run dev`

The initialization script will drop and recreate the `system_metrics` table with the correct schema on startup.

### "Metrics collection failed: invalid input syntax for type bigint"

**Problem:** The server fails with a data type error when inserting metrics

**Solution:** This has been fixed in the current version. The schema uses `DOUBLE PRECISION` for numeric metrics fields (uptime, cpu_usage, memory_total, etc.) to handle floating-point values correctly.

---


