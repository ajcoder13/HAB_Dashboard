import { apiFetch } from "@/lib/api";
import { MetricsScale } from "@/types/metrics.types";

export const MetricsService = {
  getMetrics: (scale?: MetricsScale) => {
    if (!scale) return apiFetch("/metrics");
    return apiFetch(`/metrics/${scale}`);
  },
};
