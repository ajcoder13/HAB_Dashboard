import type { Request, Response } from "express";
import {
  getLatestMetrics,
  getMetricsTimeScale,
  type TimeScale,
} from "./metrics.store.js";

function isValidScale(scale: string): scale is TimeScale {
  return ["1h", "6h", "24h", "7d", "30d"].includes(scale);
}

// Inside server/src/modules/metrics/metrics.controller.ts
export async function getMetrics(req: Request, res: Response) {
  try {
    const scale = req.params.scale as TimeScale;
    const data = await getMetricsTimeScale(scale); // ADD AWAIT HERE
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch metrics" });
  }
}

export function getLatest(_: Request, res: Response) {
  res.json(getLatestMetrics());
}
