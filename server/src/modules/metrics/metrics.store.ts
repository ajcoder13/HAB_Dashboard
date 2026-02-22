import type { Metrics } from "./metrics.service.js";

export type TimeScale = "1h" | "6h" | "24h" | "7d" | "30d";

const store = {
  "1h": [] as Metrics[], // 30s resolution
  "6h": [] as Metrics[], // 3m resolution
  "24h": [] as Metrics[], // 12m resolution
  "7d": [] as Metrics[], // 1h resolution
  "30d": [] as Metrics[], // 6h resolution
};

// Max lengths
const limits = {
  "1h": 120, // 30s * 120 = 1h
  "6h": 120, // 3m * 120 = 6h
  "24h": 120, // 12m * 120 = 24h
  "7d": 168, // 1h * 168 = 7d
  "30d": 120, // 6h * 120 = 30d
};

// Downsampling counters
let counter30s = 0;
let counter3m = 0;
let counter12m = 0;
let counter1h = 0;

export function addMetrics(metrics: Metrics, initial = false) {
  // Always store 30s resolution (1h window)
  pushWithLimit(store["1h"], metrics, limits["1h"]);
  counter30s++;

  // Every 3 minutes (6 * 30s)
  if (counter30s >= 6 || initial) {
    counter30s = 0;
    pushWithLimit(store["6h"], metrics, limits["6h"]);
    counter3m++;
  }

  // Every 12 minutes (4 * 3m)
  if (counter3m >= 4 || initial) {
    counter3m = 0;
    pushWithLimit(store["24h"], metrics, limits["24h"]);
    counter12m++;
  }

  // Every 1 hour (5 * 12m)
  if (counter12m >= 5 || initial) {
    counter12m = 0;
    pushWithLimit(store["7d"], metrics, limits["7d"]);
    counter1h++;
  }

  // Every 6 hours (6 * 1h)
  if (counter1h >= 6 || initial) {
    counter1h = 0;
    pushWithLimit(store["30d"], metrics, limits["30d"]);
  }
}

function pushWithLimit(arr: Metrics[], value: Metrics, limit: number) {
  arr.push(value);
  if (arr.length > limit) arr.shift();
}

export function getMetricsTimeScale(scale: TimeScale): Metrics[] {
  return store[scale];
}

export function getLatestMetrics(): Metrics | null {
  return store["1h"].at(-1) ?? null;
}
