import type { Request, Response } from "express";
import {
  getLatestMetrics,
  getMetricsTimeScale,
  type TimeScale,
} from "./metrics.store.js";

function isValidScale(scale: string): scale is TimeScale {
  return ["1h", "6h", "24h", "7d", "30d"].includes(scale);
}

export function getMetrics(req: Request, res: Response) {
  const scale = req.params.scale as TimeScale;

  if (!scale) {
    return res.json(getMetricsTimeScale("1h")); // default to 1h if no scale provided
  }

  if (!isValidScale(scale)) {
    return res.status(400).json({
      error:
        "Invalid timescale. Use 1h, 6h, 24h, 7d or 30d. Example: /api/metrics/1h",
    });
  }

  res.json(getMetricsTimeScale(scale));
}

export function getLatest(_: Request, res: Response) {
  res.json(getLatestMetrics());
}
