import { apiFetch } from "@/lib/api";
import { GetLogsParams } from "@/types/logs.types";

export const LogsService = {
  getLogs: (params?: GetLogsParams) => apiFetch("/logs", {}, params),

  getLogsById: (id: string) => apiFetch(`/logs/id/${id}`),

  deleteAll: () => apiFetch("/logs/all", { method: "DELETE" }),

  deleteByFilter: (filters: GetLogsParams) =>
    apiFetch("/logs", {
      method: "DELETE",
      body: JSON.stringify(filters),
    }),
};
