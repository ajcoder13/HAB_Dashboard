# Logs Module API Documentation

## Overview

The Logs module provides endpoints to manage and retrieve server logs. It supports filtering, sorting, and pagination for efficient log management.

## Endpoints

### Health Check

- **GET /health**
  - Verifies the server's health status.

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

## Data Model

### Log

```typescript
export interface Log {
  id: number;
  timestamp: Date;
  level: string;
  message: string;
  method: string;
  url: string;
  status_code: number;
  response_time: number;
  correlation_id: string;
  user_agent: string;
  meta: Record<string, any>;
  ip_address: string;
}
```

## Utilities

### Query Builder

The `buildPostgresQuery` utility constructs SQL queries dynamically based on filters and sorting options. It supports equality and range conditions.

### Example Queries

#### Get Logs with Defaults

```http
GET /api/logs
```

#### Filter by Log Level

```http
GET /api/logs?level=ERROR
```

#### Pagination

```http
GET /api/logs?limit=20&offset=20
```

#### Combined Filters

```http
GET /api/logs?level=ERROR&method=POST&status_code=500&limit=50&offset=0&sort=timestamp&order=desc
```

## Notes

- Ensure proper indexing on the database for optimal performance.
- Validate query parameters to prevent SQL injection.
