import { apiFetch } from "@/lib/api";
import { TimeScale, LogVolumeResponse } from "@/types/logs.types";

export const LogsVolumeService = {
  getLogsVolume: (
    scale: TimeScale,
  ): Promise<{ message: string; data: LogVolumeResponse }> =>
    apiFetch(`/logs/volume/${scale}`),
};
