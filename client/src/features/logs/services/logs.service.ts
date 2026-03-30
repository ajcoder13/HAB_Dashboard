import { apiFetch } from "@/lib/api";
import { GetLogsParams, type GetLogsResponse } from "@/types/logs.types";

export const LogsService = {
  getLogs: (params?: GetLogsParams): Promise<GetLogsResponse> => apiFetch("/logs", {}, params),

  getLogsById: (id: string) => apiFetch(`/logs/id/${id}`),

  deleteAll: () => apiFetch("/logs/all", { method: "DELETE" }),

  deleteByFilter: (filters: GetLogsParams) =>
    apiFetch("/logs", {
      method: "DELETE",
      body: JSON.stringify(filters),
    }),
};
