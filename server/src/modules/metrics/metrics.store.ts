// server/src/modules/metrics/metrics.store.ts
import pool from "../../lib/db.js";
import type { Metrics } from "./metrics.service.js";

export type TimeScale = "1h" | "6h" | "24h" | "7d" | "30d";

export async function addMetrics(metrics: Metrics) {
  const query = `
    INSERT INTO system_metrics (
      timestamp_ms, measured_at, uptime, 
      cpu_usage, cpu_cores, cpu_top_processes, 
      memory_total, memory_used, memory_top_processes, 
      disk_reads_per_sec, disk_writes_per_sec, disk_read_wait_time, disk_write_wait_time, disk_partitions, 
      network_active_connections, network_interfaces, 
      pm2_processes
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
    )
  `;

  const values = [
    metrics.timestamp,
    new Date(metrics.timestamp),
    metrics.uptime,
    metrics.cpu.usage,
    metrics.cpu.cores,
    JSON.stringify(metrics.cpu.topProcesses),
    metrics.memory.total,
    metrics.memory.used,
    JSON.stringify(metrics.memory.topProcesses),
    metrics.disk.readsPerSec,
    metrics.disk.writesPerSec,
    metrics.disk.readWaitTime,
    metrics.disk.writeWaitTime,
    JSON.stringify(metrics.disk.disks),
    metrics.network.activeConnections,
    JSON.stringify(metrics.network.interfaces),
    JSON.stringify(metrics.pm2Processes)
  ];

  await pool.query(query, values);
}

export async function getMetricsTimeScale(scale: TimeScale): Promise<Metrics[]> {
  // Map scale to a Postgres interval and a grouping interval (for downsampling)
  // We group data points by time blocks so the frontend always gets ~120 points
  const timeParams: Record<TimeScale, { interval: string, groupSeconds: number }> = {
    "1h": { interval: "1 hour", groupSeconds: 30 },       // 120 points
    "6h": { interval: "6 hours", groupSeconds: 180 },     // 3 mins -> 120 points
    "24h": { interval: "24 hours", groupSeconds: 720 },   // 12 mins -> 120 points
    "7d": { interval: "7 days", groupSeconds: 3600 },     // 1 hr -> 168 points
    "30d": { interval: "30 days", groupSeconds: 21600 },  // 6 hrs -> 120 points
  };

  const params = timeParams[scale];

  // We use Postgres DISTINCT ON combined with mathematical grouping to sample points evenly
  const query = `
    SELECT DISTINCT ON (grouped_time) *
    FROM (
      SELECT 
        *, 
        (EXTRACT(EPOCH FROM measured_at)::INTEGER / $1) * $1 AS grouped_time
      FROM system_metrics
      WHERE measured_at >= NOW() - INTERVAL '${params.interval}'
    ) subquery
    ORDER BY grouped_time ASC, measured_at DESC;
  `;

  const { rows } = await pool.query(query, [params.groupSeconds]);
  return rows.map(mapRowToMetrics);
}

export async function getLatestMetrics(): Promise<Metrics | null> {
  const query = `SELECT * FROM system_metrics ORDER BY measured_at DESC LIMIT 1`;
  const { rows } = await pool.query(query);
  
  if (rows.length === 0) return null;
  return mapRowToMetrics(rows[0]);
}

// Utility to convert Postgres row back to nested TypeScript object
function mapRowToMetrics(row: any): Metrics {
  return {
    timestamp: parseInt(row.timestamp_ms, 10),
    uptime: parseInt(row.uptime, 10),
    cpu: {
      usage: row.cpu_usage,
      cores: row.cpu_cores,
      topProcesses: row.cpu_top_processes,
    },
    memory: {
      total: row.memory_total,
      used: row.memory_used,
      topProcesses: row.memory_top_processes,
    },
    disk: {
      readsPerSec: row.disk_reads_per_sec,
      writesPerSec: row.disk_writes_per_sec,
      readWaitTime: row.disk_read_wait_time,
      writeWaitTime: row.disk_write_wait_time,
      disks: row.disk_partitions,
    },
    network: {
      activeConnections: row.network_active_connections,
      interfaces: row.network_interfaces,
    },
    pm2Processes: row.pm2_processes,
  };
}