// server/src/modules/metrics/metrics.init.ts
import pool from "../../lib/db.js";

export async function initMetricsTable() {
  const query = `
    -- DROP TABLE IF EXISTS system_metrics;

    CREATE TABLE IF NOT EXISTS system_metrics (
      id BIGSERIAL PRIMARY KEY,
      timestamp_ms BIGINT NOT NULL,
      measured_at TIMESTAMPTZ NOT NULL,
      uptime DOUBLE PRECISION NOT NULL,

      cpu_usage DOUBLE PRECISION NOT NULL,
      cpu_cores DOUBLE PRECISION[] NOT NULL,
      cpu_top_processes JSONB,

      memory_total DOUBLE PRECISION NOT NULL,
      memory_used DOUBLE PRECISION NOT NULL,
      memory_top_processes JSONB,

      disk_reads_per_sec DOUBLE PRECISION,
      disk_writes_per_sec DOUBLE PRECISION,
      disk_read_wait_time DOUBLE PRECISION,
      disk_write_wait_time DOUBLE PRECISION,
      disk_partitions JSONB,

      network_active_connections INTEGER,
      network_interfaces JSONB,

      pm2_processes JSONB
    );

    CREATE INDEX IF NOT EXISTS idx_system_metrics_measured_at 
    ON system_metrics (measured_at DESC);
  `;

  try {
    await pool.query(query);
    console.log("Metrics table initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize metrics table:", err);
  }
}