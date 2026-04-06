// server/src/modules/metrics/metrics.scheduler.ts
import { collectMetrics } from "./metrics.service.js";
import { addMetrics } from "./metrics.store.js";

const INTERVAL_MS = 30_000;
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

export function startMetricsScheduler() {
  collectOnce();
  setInterval(collectOnce, INTERVAL_MS);
}