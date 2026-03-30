// src/features/logs/hooks/useLogVolume.ts
"use client";

import { useEffect, useState } from "react";
import { LogsVolumeService } from "../services/logsVolume.service";
import {
  TimeScale,
  LogVolumeResponse,
  LogVolumeDataPoint,
} from "@/types/logs.types";

export function useLogVolume(initialScale: TimeScale = "24h") {
  const [scale, setScale] = useState<TimeScale>(initialScale);
  const [data, setData] = useState<LogVolumeDataPoint[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogsVolume = async (selectedScale: TimeScale) => {
    setLoading(true);
    setError(null);

    try {
      const res = await LogsVolumeService.getLogsVolume(selectedScale);
      setData(res.data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch logs volume");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogsVolume(scale);
  }, [scale]);

  return {
    scale,
    setScale,
    data,
    loading,
    error,
    refetch: () => fetchLogsVolume(scale),
  };
}
