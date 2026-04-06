# System metrics API

## Database Schema

The `system_metrics` table is automatically created on server startup and stores the following columns:

| Column | Type | Description |
|--------|------|-------------|
| id | BIGSERIAL | Primary key |
| timestamp_ms | BIGINT | Millisecond timestamp when metrics were collected |
| measured_at | TIMESTAMPTZ | Timestamp with timezone for time-range queries |
| uptime | DOUBLE PRECISION | System uptime in seconds (supports decimal values) |
| cpu_usage | DOUBLE PRECISION | Average CPU usage percentage across all cores |
| cpu_cores | DOUBLE PRECISION[] | CPU usage percentage for each core |
| cpu_top_processes | JSONB | Top processes by CPU usage |
| memory_total | DOUBLE PRECISION | Total system memory in GB |
| memory_used | DOUBLE PRECISION | Used system memory in GB |
| memory_top_processes | JSONB | Top processes by memory usage |
| disk_reads_per_sec | DOUBLE PRECISION | Disk read operations per second |
| disk_writes_per_sec | DOUBLE PRECISION | Disk write operations per second |
| disk_read_wait_time | DOUBLE PRECISION | Average disk read wait time in ms |
| disk_write_wait_time | DOUBLE PRECISION | Average disk write wait time in ms |
| disk_partitions | JSONB | Disk partition information |
| network_active_connections | INTEGER | Count of active network connections |
| network_interfaces | JSONB | Network interface statistics |
| pm2_processes | JSONB | PM2 process information |

**Index:** `idx_system_metrics_measured_at` on `measured_at DESC` for efficient time-range queries.

## GET /api/metrics/:scale

`:scale` can be `1h`, `6h`, `24h`, `7d` or `30d`.
Get system metrics for the last `:scale` time scale.

```js
[
  {
    cpu: {
      usage: 12.737127371273713, // average of all cpu cores
      cores: [
        31.53153153153153, 27.027027027027028, 18.91891891891892,
        11.711711711711711,
      ],
      topProcesses: [
        { pid: 49004, name: "Code Helper (Renderer)", cpu: 69 },
        { pid: 406, name: "WindowServer", cpu: 19.1 },
      ],
    },
    memory: {
      total: 16,
      used: 3.2922821044921875,
      topProcesses: [
        { pid: 49004, name: "Code Helper (Renderer)", memory: 412.1875 },
        { pid: 25449, name: "Vivaldi", memory: 407.59375 },
      ],
    },
    disk: {
      disks: [
        { mount: "/", usage: 31.17, capacity: 494384795648 },
        { mount: "/System/Volumes/Data", usage: 94.21, capacity: 494384795648 },
      ],
      readsPerSec: 7.326007326007326,
      writesPerSec: 19.23076923076923,
      readWaitTime: 0,
      writeWaitTime: 0,
    },
    network: {
      interfaces: [
        {
          interface: "en0",
          rxBytesPerSec: 7700.364298724954,
          txBytesPerSec: 2925.3187613843347,
          rxDropped: 152,
          txDropped: 152,
          rxErrors: 0,
          txErrors: 0,
        },
      ],
      activeConnections: 93,
    },
    uptime: 2981015,
    timestamp: 1771749012860,
    pm2Processes: [
      {
        name: "gateway",
        pid: 89827,
        status: "online",
        uptime: 4,
        restartCount: 2,
        memoryMB: 76,
        cpuPercent: 3.2,
      },
      {
        name: "api-v1",
        pid: 89840,
        status: "online",
        uptime: 4,
        restartCount: 30,
        memoryMB: 174,
        cpuPercent: 15.2,
      },
      {
        name: "api-v2",
        pid: 89853,
        status: "online",
        uptime: 4,
        restartCount: 30,
        memoryMB: 166,
        cpuPercent: 13.8,
      },
    ],
  },
];
```
