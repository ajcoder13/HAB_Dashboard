// server/src/modules/metrics/metrics.scheduler.ts
import { collectMetrics } from "./metrics.service.js";
import { addMetrics, deleteOldMetrics } from "./metrics.store.js";

const INTERVAL_MS = 30_000;
const CLEANUP_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours
let running = false;

async function collectOnce() {
  if (running) return; 
  running = true;

  try {
    const metrics = await collectMetrics();
    // Await the new database insertion!
    await addMetrics(metrics); 
    console.log("Metrics collected and saved to DB");
  } catch (err) {
    console.error("Metrics collection failed:", err);
  } finally {
    running = false;
  }
}

async function cleanUpOldMetrics() {
  try {
    await deleteOldMetrics(30);
    console.log("Deleted system metrics older than 30 days");
  } catch (err) {
    console.error("Failed to delete old system metrics:", err);
  }
}

export function startMetricsScheduler() {
  collectOnce();
  setInterval(collectOnce, INTERVAL_MS);

  cleanUpOldMetrics();
  setInterval(cleanUpOldMetrics, CLEANUP_INTERVAL_MS);
}