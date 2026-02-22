import { collectMetrics } from "./metrics.service.js";
import { addMetrics } from "./metrics.store.js";

const INTERVAL_MS = 30_000;

let running = false;

async function collectOnce(initial = false) {
  if (running) return; // prevent overlap
  running = true;

  try {
    const metrics = await collectMetrics();
    addMetrics(metrics, initial);
    console.log("Metrics collected");
  } catch (err) {
    console.error("Metrics collection failed:", err);
  } finally {
    running = false;
  }
}

export function startMetricsScheduler() {
  // collect immediately on startup
  collectOnce(true);

  /// TODO: Maybe use a cron job instead?
  setInterval(collectOnce, INTERVAL_MS);
}
