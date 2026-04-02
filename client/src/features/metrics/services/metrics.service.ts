import { apiFetch } from "@/lib/api";
import { SystemMetricsResponse, TimeRange } from "@/types/metrics.types";

export const MetricsService = {
  getMetrics: async (range: TimeRange = "1h"): Promise<SystemMetricsResponse> => {
    const data = await apiFetch("/metrics", {}, { range });

    if (!data) {
      throw new Error("No data received from backend");
    }

    return data;
  },

  restartProcess: async (name: string) => {
    return apiFetch(`/metrics/processes/${name}/restart`, {
      method: "POST",
    });
  },

  stopProcess: async (name: string) => {
    return apiFetch(`/metrics/processes/${name}/stop`, {
      method: "POST",
    });
  },

  restartAll: async () => {
    return apiFetch("/metrics/processes/restart-all", {
      method: "POST",
    });
  }
};